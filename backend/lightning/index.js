const grpc = require("grpc");
var fs = require("fs");
const { loadSync } = require("@grpc/proto-loader");
const lndSettings = require("../appSettings").LIGHTNING;
process.env.GRPC_SSL_CIPHER_SUITES = "HIGH+ECDSA";


const macarooon = fs.readFileSync(`${lndSettings.LND_MACAROON_LOCATION}admin.macaroon`);
const lndCert = fs.readFileSync(`${lndSettings.LND_CERT_LOCATION}tls.cert`);
const ssl = grpc.credentials.createSsl(lndCert);

let macaroonData = Buffer.from(macarooon).toString("hex");

const macCreds = grpc.credentials.createFromMetadataGenerator((_, cbk) => {
  const metadata = new grpc.Metadata();
  metadata.add("macaroon", macaroonData);
  return cbk(null, metadata);
});

const combined = grpc.credentials.combineChannelCredentials(ssl, macCreds);

const packageDefinition = loadSync("./rpc.proto", {
  defaults: true,
  enums: String,
  keepCase: true,
  longs: String,
  oneofs: true
});

const lndrpcDescriptor = grpc.loadPackageDefinition(packageDefinition);
const lndrpc = lndrpcDescriptor.lnrpc;

var lnd = new lndrpc.Lightning(lndSettings.LND_SERVER, combined);

module.exports = {
  unlockWallet(msg, cb) {
    var pwBytes = [];
    for (var i = 0; i < msg.payload.password.length; i++) {
      pwBytes.push(msg.payload.password.charCodeAt(i));
    }

    const lndWalletrpcDescriptor = grpc.loadPackageDefinition(
      packageDefinition
    );
    
    const lndWalletrpc = lndWalletrpcDescriptor.lnrpc;

    const lndWallet = new lndWalletrpc.WalletUnlocker(
      "localhost:10009",
      combined
    );

    lndWallet.unlockWallet({ wallet_password: pwBytes }, (err, response) => {
      if (err) {
        console.log("error unlocking wallet");
        console.log(err);
      } else {
        cb(null, msg.from, {
          subject: "LightningWalletUnlocked"
        });
      }
    });
  },
  closeChannel(msg, cbk) {
    const channelPoint = {
      funding_txid_str: msg.payload.channel_point.split(":")[0],
      output_index: parseInt(msg.payload.channel_point.split(":")[1])
    };

    const sub = lnd.closeChannel({
      channel_point: channelPoint,
      force: true,
      sat_per_byte: 1
    });
    sub.on("data", closeStatusUpdate => {
      cbk(null, msg.from, {
        from: "sofpear_lightning",
        subject: "ClosedChannel",
        payload: closeStatusUpdate
      });
    });
  },
  getChannels(msg, cb) {
    // console.log("calling listChannels");
    lnd.listChannels({ active_only: false }, (err, response) => {
      if (err) {
        console.log("Error getting channels");
        console.log(err);
      } else {
        cb(null, msg.from, {
          subject: "GotLightningChannels",
          payload: response
        });
      }
    });
  },
  getWalletInfo(msg, cb) {
    console.log("Getting wallet info:");
    try {
      lnd.getInfo({}, function(err, response) {
        if (err) {
          cb(null, msg.from, {
            subject: "GotLightningInfo",
            error: err
          });
          console.log(err);
        } else {
          console.log(response);
          cb(null, msg.from, {
            subject: "GotLightningInfo",
            payload: response
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  },
  subscribeToInvoices(msg, cb) {
    if (!!lnd) {
      console.log("Subscribing To Invoices");
      const sub = lnd.subscribeInvoices({});
      sub.on("data", invoice => {
        console.log(invoice);
        cb(null, msg.from, {
          subject: "InvoiceUpdated",
          payload: invoice
        });
      });
    }
  },
  createInvoice(msg, cb) {
    if (!!lnd) {
      const payload = msg.payload;
      lnd.addInvoice(
        {
          memo: payload.description,
          value: payload.amount,
          expiry: 360,
          private: true
        },
        (err, response) => {
          if (err) {
            cb(err, msg.from, null);
          } else {
            var invoice = { invoice: response.payment_request };
            console.log(invoice);
            cb(null, msg.from, {
              subject: "InvoiceCreated",
              payload: invoice
            });
          }
        }
      );
    } else {
      cb("LND not available", msg.from, null);
    }
  },
  decodeInvoice(msg, cbk) {
    console.log("Made it to decodeInvoice!!");
    var payload = msg.payload;
    lnd.decodePayReq(
      {
        pay_req: msg.payload
      },
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(res);
        cbk(null, msg.from, {
          subject: "InvoiceDecoded",
          payload: res
        });
      }
    );
  },
  payInvoice(msg,cb){
    console.log("tryna pay invoice");
    console.log(msg.payload);

    // Set a listener on the bidirectional stream
    var call = lnd.sendPayment();
    call.on('data', function (payment) {
      console.log("Payment sent:");
      console.log(payment);
      cb(null, msg.from, {
        subject: "LightningInvoicePaid",
        payload: payment,
        from: "sofpear_lightning"
      });
    });
    call.on('end', function () {
      // The server has finished
      console.log("END");
    });

    // You can send single payments like this
    call.write(msg.payload);


    // lnd.sendPayment(msg.payload, (err,res) => {
    //   if (err) {
    //     console.warn("Error Sending payment");
    //     console.warn(err);
    //   } else {
    //     console.log("Invoice PAID!!");
       
    //   }
    // });
  },
  openChannel(msg, cb) {
    const payload = msg.payload;

    console.log("opening channel...");

    msg.payload.node_pubkey_string = msg.payload.node_pubkey;

    lnd.openChannelSync(payload, (err, res) => {
      if (err) {
        console.warn("Error opening channel");
        console.warn(err);
      } else {
        cb(null, msg.from, {
          subject: "OpenedLightningChannel",
          payload: res,
          from: "sofpear_lightning"
        });
      }
    });

    return "";
  },
  getChannelBalance(msg, cb) {
    lnd.channelBalance({}, (err, res) => {
      if (res) {
        cb(null, msg.from, {
          subject: "GotLightningWalletBalance",
          payload: res
        });
      }
    });
  },
  getNewAddress(msg, cb) {
    lnd.newWitnessAddress({}, (err, res) => {
      if (res) {
        cb(null, msg.from, {
          subject: "GotNewAddress",
          payload: res
        });
      }
    });
  },
  getChannelBalance(msg, cb) {
    lnd.channelBalance({}, (err, res) => {
      if (res) {
        cb(null, msg.from, {
          subject: "GotLightningChannelBalance",
          payload: res
        });
      }
    });
  },
  getWalletBalance(msg, cb) {
    lnd.walletBalance({}, (err, res) => {
      if (res) {
        cb(null, msg.from, {
          subject: "GotLightningWalletBalance",
          payload: res
        });
      }
    });
  },
  getPeers(msg, cb) {
    lnd.listPeers({}, (err, res) => {
      if (err) {
        cb(err, msg.from);
        return;
      }
      cb(null, msg.from, {
        subject: "GotLightningPeers",
        payload: res.peers
      });
    });
  },
  disconnectPeer(msg, cb) {
    lnd.disconnectPeer(msg.payload, (err, res) => {
      var reply = {
        subject: "DisconnectedFromLightningPeer",
        payload: msg.payload,
        from: "lighting_pos"
      };
      if (err) {
        reply.error = err;
      }
      cb(null, msg.from, reply);
    });
  },
  connectPeer(msg, cb) {
    var connectPeerRequest = {
      addr: {
        pubkey: msg.payload.pubkey,
        host: msg.payload.host
      },
      perm: true
    };

    console.log(connectPeerRequest);
    lnd.connectPeer(connectPeerRequest, (err, res) => {
      var reply = {
        subject: "ConnectedToLightningPeer",
        payload: msg.payload,
        from: "lighting_pos"
      };
      if (err) {
        reply.error = err;
      }
      cb(null, msg.from, reply);
    });
  },
  handleRequests(msg, cb) {
    console.log("HANDLING LIGHTNING REQUESTS...");

    var requestHandlers = {
      CloseLightningChannel: this.closeChannel,
      CreateLightningInvoice: this.createInvoice,
      DecodeLightningInvoice: this.decodeInvoice,
      GetAllLightningChannels: this.getChannels,
      GetLightningInfo: this.getWalletInfo,
      GetLightningPeers: this.getPeers,
      GetLightningWalletBalance: this.getWalletBalance,
      GetLightningChannelBalance: this.getChannelBalance,
      OpenLightningChannel: this.openChannel,
      SubscribeToLightningInvoices: this.subscribeToInvoices,
      ConnectLightningPeer: this.connectPeer,
      DisconnectLightningPeer: this.disconnectPeer,
      UnlockLightningWallet: this.unlockWallet,
      PayLightningInvoice: this.payInvoice
    };

    const handler = requestHandlers[msg.subject];

    if (handler) {
      handler(msg, cb);
    }
  }
};
