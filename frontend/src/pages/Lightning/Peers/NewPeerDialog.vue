<template>
  <v-dialog offset-x :close-on-content-click="false" :nudge-width="200" v-model="dialog">
    <v-btn icon dark slot="activator" class="primary">
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">
          Add New Peer
        </span>
      </v-card-title>
      <v-card-text>
        <v-text-field name="pubkey" label="node pubkey" v-model="new_Peer.pubkey"></v-text-field>
        <v-text-field name="host" label="node host:port" v-model="new_Peer.host"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="secondary" flat @click.native="dialog = false">Close</v-btn>
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
      peers: [],
      new_Peer: {
        pubkey: "",
        host: ""
      }
    };
  },
  methods: {
    peerSelected(peer) {
      console.log(peer);
      this.selected_peer = peer;
    },
    toogleDialog() {
      // eslint-disable-next-line
      console.warn("open add Peer dialog");
      this.dialog = true;
    },
    save() {
      //  alert(this.customer.name);

      // eslint-disable-next-line

      var msg = {
        subject: "ConnectLightningPeer",
        payload: this.new_Peer,
        from: "frontend"
      };
      this.$socket.emit("yo_sofpear", msg);
      this.new_Peer = {
        pubkey: "",
        host: ""
      };

      this.dialog = false;
    }
  }
};
</script>
