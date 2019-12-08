<template>
  <v-dialog offset-x :close-on-content-click="false" :nudge-width="200" v-model="dialog">
    <v-btn flat class="primary" slot="activator">
      Create Channel
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">
          Connecting to: {{ peerPubKey }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-text-field name="local_amount" label="local_amount" v-model="new_channel.local_funding_amount"></v-text-field>
        <v-text-field name="peer_amount" label="peer_amount" v-model="new_channel.push_sat"></v-text-field>
        <v-text-field name="sat_per_byte" label="sat_per_byte" v-model="new_channel.sat_per_byte"></v-text-field>
        <v-switch label="Private Channel" v-model="new_channel.private"></v-switch>x
        <br />
      </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="primary" flat @click.native="dialog = false">Close</v-btn>
          <v-btn class="accent" @click.native="save">Save</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable */

export default {
  data() {
    return {
      dialog: false,
      new_channel: {
        node_pubkey: "",
        push_sat: "",
        local_funding_amount: "",
        sat_per_byte: "",
        private: true
      }
    };
  },
  props: {
    peerPubKey: {
      type: String,
      required: true
    }
  },
  methods: {
    peerSelected(peer) {
      this.selected_peer = peer;
    },
    toogleDialog() {
      // eslint-disable-next-line
      console.warn("open add channel dialog");
      this.dialog = true;
    },
    save() {
      //  alert(this.customer.name);

      // eslint-disable-next-line
      //lncli openchannel --node_key=03a9d79bcfab7feb0f24c3cd61a57f0f00de2225b6d31bce0bc4564efa3b1b5aaf --local_amt=50000 --push_amt=100 --sat_per_byte=1
      // {
      // "funding_txid": "5dfc4e79307094c0ce821d2c67bc89f0bb9e12d47546fa69218196bc6beb3f21"
      // }
      this.new_channel.node_pubkey = this.peerPubKey;

      var msg = {
        subject: "OpenLightningChannel",
        payload: this.new_channel,
        from: "frontend"
      };
      this.$socket.emit("yo_sofpear", msg);
      // this.$store.dispatch("addCustomer", this.customer);
      this.payload = {
        node_pubkey: "",
        push_sat: "",
        local_funding_amount: "",
        sat_per_byte: ""
      };
      this.dialog = false;
      //  alert('hi');
      //  addcustomer(this.customer)
    }
  }
};
</script>
