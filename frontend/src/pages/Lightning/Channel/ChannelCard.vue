<template>
  <v-card hover>
    <v-toolbar clipped-left>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        {{channelObj.remote_pubkey.substring(0,32)}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn color="primary" dark icon @click.stop="openChannelPage">
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
            {{channelObj[k]}}
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    <v-card-actions>

      <v-dialog v-model="closeChannelConfirmation" width="500">
        <v-btn slot="activator" color="red lighten-2" dark>
          Close Channel
        </v-btn>

        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Are you sure you want to close this channel?
          </v-card-title>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="closeChannel">
              Yes, do it.
            </v-btn>
            <v-btn color="accent" flat @click.native="closeChannelConfirmation = false">
              Nevermind.
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-actions>
  </v-card>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      closeChannelConfirmation: false,
      inEditMode: false,
      editItem: {}
    };
  },
  computed: {
    getKeys() {
      return Object.keys(this.channelObj);
    }
  },
  methods: {
    closeChannel() {

      const msg = {
        from: "frontend",
        subject: "CloseLightningChannel",
        payload: { channel_point: this.channelObj.channel_point }
      };

      this.$socket.emit("yo_sofpear", msg);
      this.closeChannelConfirmation = false;
    },
    openChannelPage() {

      this.$router.push({
        name: "channel",
        params: { id: this.channelObj._id }
      }); // -> /user/123
    },
    toggleEditMode() {
      this.inEditMode = true;
      this.editItem = JSON.parse(JSON.stringify(this.channelObj));
    },
    saveUpdate() {
      var msg = {
        subject: "UpdateChannel",
        payload: this.editItem
      };

      this.$socket.emit("yo_sofpear", msg);
      // this.inEditMode = false;
    }
  },
  props: {
    channelObj: {
      type: Object
    }
  }
};
</script>
