<template>
  <v-card hover>
    <v-toolbar clipped-left>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        {{PeerObj.pub_key.substring(0,32)}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn color="primary" dark icon @click.stop="openPeerPage">
        <v-icon>
          zoom_out_map
        </v-icon>
      </v-btn> -->
    </v-toolbar>
    <v-card-text>
      <v-container fluid grid-list-md>
        <v-layout row wrap v-for="k in getKeys" :key="k">
          <v-flex xs3 md3 lg3>
            {{k}}
          </v-flex>
          <v-flex xs8 md8 lg8 pa-1>
            {{PeerObj[k]}}
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>

      <v-dialog v-model="disconnectPeerConfirmation" width="500">
        <v-btn slot="activator" color="accent" flat>
          Disconnect from peer
        </v-btn>
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Are you sure you want to close this Peer?
          </v-card-title>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="closePeer">
              Yes, do it.
            </v-btn>
            <v-btn color="accent" flat @click.native="disconnectPeerConfirmation = false">
              Nevermind.
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-spacer></v-spacer>
      <new-channel-dialog :peer-pub-key="getNodePubkey"></new-channel-dialog>
      <v-spacer></v-spacer>

    </v-card-actions>
  </v-card>
</template>

<script>
/* eslint-disable */

import NewChannelDialog from "../Channel/NewChannelDialog";
export default {
  data() {
    return {
      disconnectPeerConfirmation: false,
      editItem: {}
    };
  },
  computed: {
    getKeys() {
      return Object.keys(this.PeerObj);
    },
    getNodePubkey() {
      return this.PeerObj.pub_key;
    }
  },
  props: {
    PeerObj: {
      type: Object
    },
    ChannelObj: {
      type: Object
    }
  },
  methods: {
    closePeer() {
      const msg = {
        from: "frontend",
        subject: "DisconnectLightningPeer",
        payload: { pub_key: this.PeerObj.pub_key }
      };

      this.$socket.emit("yo_sofpear", msg);
      this.disconnectPeerConfirmation = false;
    },
    openPeerPage() {
      console.log(`redirectiong to: ${this.PeerObj._id}`);

      this.$router.push({
        name: "Peer",
        params: { id: this.PeerObj._id }
      }); // -> /user/123
    },
    saveUpdate() {
      var msg = {
        subject: "UpdatePeer",
        payload: this.editItem
      };

      this.$socket.emit("yo_sofpear", msg);
    }
  },
  components: {
    NewChannelDialog
  }
};
</script>
