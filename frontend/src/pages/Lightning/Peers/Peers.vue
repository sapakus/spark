<template>
  <div>
    <v-card color="#C5CAE9">
      <v-card-title>
        Active Peersxxxx
        <v-spacer></v-spacer>
        <new-Peer-dialog />
      </v-card-title>
      <v-card-text>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex xs12 md6 lg6 pa-2 v-for="(peer,i) in allPeers " :key="i ">
              <peer-card :peer-obj="peer" :channel-obj=getChannelForPeer(peer) />
              <!-- {{employee.name}} -->
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable */
import PeerCard from "./PeerCard";
import NewPeerDialog from "./NewPeerDialog";
import VAutocomplete from "vuetify/es5/components/VAutocomplete";

export default {
  data() {
    return {
      peers: [],
      channels: []
      // peer_add:
      //   "03a9d79bcfab7feb0f24c3cd61a57f0f00de2225b6d31bce0bc4564efa3b1b5aaf",
      // peer_amount: 1000
      // local_amount: 20000
    };
  },
  created() {
    this.requestLightningPeers();

    this.$socket.emit("yo_sofpear", {
      from: "frontend",
      subject: "GetAllLightningChannels"
    });
  },
  components: {
    PeerCard,
    VAutocomplete,
    NewPeerDialog
  },
  sockets: {
    yo_frontend(msg) {
      if (msg.subject === "GotLightningPeers") {
        this.peers = msg.payload;
      } else if (msg.subject === "GotLightningChannels") {
        this.channels = msg.payload.channels;
      } else if (msg.subject === "ConnectedToLightningPeer") {
        this.requestLightningPeers();
      }
    }
  },
  computed: {
    allPeers() {
      return this.Peers;
    },
    allPeers() {
      return this.peers;
    }
  },
  methods: {
    requestLightningPeers() {
      this.$socket.emit("yo_sofpear", {
        from: "frontend",
        subject: "GetLightningPeers"
      });
    },
    getChannelForPeer(peer) {
      // let channel = this.channels.filter(c => c.
    },
    openPeer() {
      const payload = {
        peer_add: this.peer_add,
        peer_amount: this.peer_amount,
        local_amount: this.local_amount
      };
      this.$socket.emit("yo_sofpear", {
        subject: "OpenPeer",
        payload: payload
      });
    }
  }
};
</script>
