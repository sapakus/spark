// TODO: refactor CB should be the last param on functions.

const AppSettings = require("../appSettings");
const MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
const crypto = require("crypto");

const DB_URL =  AppSettings.DB_URL // "mongodb://localhost:27017";
const DB_NAME =  AppSettings.DB_NAME;  // TODO: CHANGED THIS.
const SOFPEAR_DB = AppSettings.SFPR_DB_NAME;

var mongo_client = null;


const handleDbConnect = (err, res) => {
  if (err) {
    console.log("Error connecting");
    console.log(err);
  }
  mongo_client = res;
};

const reportErrorToCB = (err, cb, to, subject) => {
  cb(null, to, {
    subject: subject,
    payload: err
  });
};

const sortObject = o => {
  var sorted = {},
    key,
    a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }
  a.sort();
  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
};

const getSha256 = (str, nonce) => {
  const shasum = crypto
    .createHash("sha256")
    .update(str + nonce)
    .digest("base64");

  return shasum;
};

const checkSha256 = event => {
  const obj = Object.assign({}, event);

  const nonce = event.nonce;
  const hash = event.hash;

  delete obj.nonce;
  delete obj.hash;

  if (obj.payload) {
    obj.payload = sortObject(obj.payload);
  }
  const str = JSON.stringify(sortObject(obj));

  var shasum = getSha256(str, nonce);

  return shasum === hash;
};

const getShaNonce = event => {
  const msg = Object.assign({}, event);
  if (msg.payload) {
    msg.payload = sortObject(msg.payload);
  }

  const str = JSON.stringify(sortObject(msg));

  var nonce = 0;
  var shasum = getSha256(str, nonce);

  // POSW: Proof Of Some Work. arbitary s.
  while (shasum[0] != "s") {
    nonce += 1;
    shasum = getSha256(str, nonce);
  }

  return {
    nonce: nonce,
    hash: shasum
  };
};


// EventChain.
const writeHistory = (writeFunction, msg) => {
  mongo_client
    .db(SOFPEAR_DB)
    .collection("Events")
    .find()
    .sort({ time: -1 }) // sort by time in descending order
    .limit(1) // only get the top one.
    .toArray((err, events) => {
      if (err) {
        console.log("Writing history aint easy.");
        return;
      }
      if (events) {
        if (events.length === 0) {
          // genesis!
          msg.lastHash = "you.dont.need.a.blockchain";
        } else if (events.length === 1) {
          msg.lastHash = events[0].hash;
        }
        msg._id = new ObjectID();
        msg.time = new Date().getTime() / 1000;
        msg.payload = sortObject(msg.payload);
        const shaNonce = getShaNonce(msg);
        msg.hash = shaNonce.hash;
        msg.nonce = shaNonce.nonce;
        // this.insertUniqueDocument("Events", msg);
        writeFunction("Events", msg);
      }
    });
};

//TODO: Add Auth to db.
MongoClient.connect(
  DB_URL,
  handleDbConnect
);

module.exports = {
  verifyHistory: () => {
    console.log("verifying...");

    const collection = mongo_client.db(SOFPEAR_DB).collection("Events");
    collection.find({}).toArray((err, docs) => {
      if (err) {
        console.log(err);
        return;
      }

      docs.forEach(e => {
        // console.log(e);
        if (!checkSha256(e)) {
          console.log(`${e._id} - Verification Failed`);
        } else {
          console.log(`${e._id} - Verification Passed.`);
        }
      });
    });
    // console.log("done?");
  },
  getDocuments: (documentName, filter, cb, to) => {
    const collection = mongo_client.db(DB_NAME).collection(documentName);
    collection.find(filter).toArray(function(err, docs) {
      if (err) {
        console.log(err);
        return;
      }
      cb(null, to, {
        subject: `Got${documentName}`,
        payload: docs,
        filter: filter
      });
    });
  },
  upsertDocument: (documentName, updatedDocument, cb, to) => {
    console.log("updating...");
    var collection = mongo_client.db(DB_NAME).collection(documentName);

    const filter = { _id: updatedDocument._id };

    // delete updatedDocument

    var subject = `${documentName}Upserted`;

    var handleUpsert = (err, res) => {
      if (err) {
        console.log("Error in upsert");
        console.log(err);
        return;
      } else {
        updatedDocument._id = filter._id;
        cb(null, to, {
          subject: subject,
          payload: updatedDocument
        });
      }
    };

    collection.find(filter).toArray((err, docs) => {
      if (err) {
        console.log("WTF, error when searching in upsert func.");
        console.log(err);
        return;
      }
      if (docs.length === 0) {
        console.log("About  to insert...");
        collection.insert(updatedDocument, handleUpsert);
      } else if (docs.length === 1) {
        delete updatedDocument._id;
        collection.update(filter, { $set: updatedDocument }, handleUpsert);
      } else {
        console.log(
          "Can't upsert more than one document at a time."
        );
      }
    });
  },
  insertUniqueDocument: (documentName, document, cb, to) => {
    var collection = mongo_client.db(SOFPEAR_DB).collection(documentName);
    collection.find(document).toArray((err, docs) => {
      if (err) {
        console.log("ERRRORRRR");
        console.log(err);
        if (cb) {
          reportErrorToCB(err, cb, to, subject);
        }
        return;
      } else {
        const subject = `${documentName}Upserted`;
        const handleInsert = function(err, res) {
          if (res) {
          }
          if (cb) {
            if (err) {
              reportErrorToCB(err, cb, to, subject);
            } else {
              // no error means insert was successful. no need to do anyhing with result.
              cb(null, to, {
                subject: subject,
                payload: document
              });
            }
          }
        };

        // we only add if there is no same document is found.
        if (!!docs && docs.length === 0) {
          collection.insert(document, handleInsert);
        }
      }
    });
  },
  handleRequest(msg, cb) {
    var docName = "";
    if (msg.subject.lastIndexOf("Upsert", 0) === 0) {
      docName = msg.subject.replace("Upsert", "");
      var filter;
      if (msg.payload._id) {
        msg.payload._id = new ObjectID(msg.payload._id);
      } else {
        msg.payload._id = new ObjectID();
      }
      this.upsertDocument(
        docName,
        Object.assign({}, msg.payload),
        cb,
        msg.from
      );

      if (!msg.hash) {
        //new event, save history.
        writeHistory(this.insertUniqueDocument, msg);
      } // else this is just a reload.
    } else if (msg.subject.indexOf("Get") === 0) {
      docName = msg.subject.replace("Get", "");
      var filter = msg.filter ? msg.filter : {};

      filter["$or"] = [{ isDeleted: { $exists: false } }, { isDeleted: false }];

      console.log(filter);
      const payload = msg.payload ? msg.payload : {};
      if (payload.filter) {
        filter = msg.payload.filter;
        if (filter.id) {
          filter["_id"] = new ObjectID(filter.id);
          delete filter["id"];
        }
        if (filter._id) {
          filter._id = new ObjectID(filter._id);
        }
      }
      this.getDocuments(docName, filter, cb, msg.from);
    }
  },
  loadEventByLastHash(hash) {
    const filter = { lastHash: hash };
    const collection = mongo_client.db(SOFPEAR_DB).collection("Events");

    collection.find(filter).toArray((err, docs) => {
      if (err) {
        console.log(`Error loading event: ${hash}`);
        console.log(err);
        return;
      }

      if (docs.length === 0) {
        console.log(`Done loading! lasthash: ${hash}`);
        return;
      } else if (docs.length === 1) {
        const event = docs[0];

        if (checkSha256(event)) {
          this.handleRequest(event, _ => {});
          setTimeout(() => {
            this.loadEventByLastHash(event.hash);
          }, 500);
        } else {
          console.log("VERIFICATION FAILED: Aborting load.");
          console.log(event);
        }
      } else if (docs.length > 1) {
        console.log(
          `There's a fork here. why more than one event for this hash? ${hash}`
        );
        return;
      }
    });
  }
};
