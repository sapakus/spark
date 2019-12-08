<template>
  <v-card>
    <v-card-title primary-title>
      <v-toolbar>
        <v-spacer></v-spacer>
        <v-toolbar-title style="color: #01579B " class="display-1 ">
          {{channelObj.name}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark icon to="/channels">
          <v-icon>
            close
          </v-icon>
        </v-btn>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-layout>
        <v-flex xs12 lg6>
          {{channelObj.name}}
        </v-flex>
        <v-flex xs12 lg6 md6>
          {{formatEmployeePhoneNumber}}
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn color="red" dark to="/channels" @click.native="closeChannel">delete channel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "Employee",
  data() {
    return {
      channel: {},
      channelMessage: ""
    };
  },
  created() {
    var msg = {
      subject: "GetEmployee",
      payload: {
        id: this.$route.params.id
      }
    };
    this.$socket.emit("yo_sofpear", msg);
  },
  sockets: {
    EmployeeUpdated(data) {
      this.channel = data;
      console.log(data);
      console.log(this.channelObj.name);
    }
  },
  methods: {
    closeChannel() {
      this.channel.isDeleted = true;

      var msg = {
        subject: "CloseLightningChannel",
        payload: this.channel
      };
      this.$socket.emit("yo_sofpear", msg);
    }
  },
  computed: {
    channelObj() {
      return this.channel;
    }
  }
};
</script>
