<template>
  <div>
    <v-card>
      <v-card-title>
        Active Channels
        <v-spacer></v-spacer>

        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-container fluid grid-list-md>
          <v-layout row wrap>
            <v-flex xs12 md12 lg12 pa-2 v-for="(channel,i) in allChannels " :key="i ">
              <channel-card :channel-obj="channel" />
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
import ChannelCard from "./ChannelCard";
import NewChannelDialog from "./NewChannelDialog";
import VAutocomplete from "vuetify/es5/components/VAutocomplete";
export default {
  data() {
    return {
      model: null,
      channels: []
    };
  },
  created() {
    this.$socket.emit("yo_sofpear", {
      from: "frontend",
      subject: "GetAllLightningChannels"
    });
  },
  components: {
    ChannelCard,
    VAutocomplete,
    NewChannelDialog
  },
  sockets: {
    yo_frontend(msg) {
      if (msg.subject === "GotLightningChannels") {
        this.channels = msg.payload.channels;
      } else if (msg.subject === "ClosedChannel") {
        this.$socket.emit("yo_sofpear", {
          from: "frontend",
          subject: "GetAllLightningChannels"
        });
      }
    }
  },
  computed: {
    allChannels() {
      return this.channels;
    }
  }
};
</script>
