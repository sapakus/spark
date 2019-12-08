<template>
<v-card  color="#B2DFDB">
  <v-card-text>
    
  <v-container fluid grid-list-md>
    <v-layout row wrap justify-center align-center>
      <v-flex xs10 md10 lg10 pa-2>
        <v-card hover xs10 lg10 md10 v-if="gotData">
          <v-responsive :aspect-ratio="16/9">
            <v-toolbar>
              <v-spacer></v-spacer>
              <v-toolbar-title>
                {{lndInfo.alias.substring(0,32)}}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-container fluid grid-list-md>
                <v-layout row wrap v-for="k in getKeys" :key="k">
                  <v-flex xs3 md3 lg3>
                    {{k}}
                  </v-flex>
                  <v-flex xs8 md8 lg8 pa-1>
                    {{ lndInfo[k] }}
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-responsive>
        </v-card>
        <v-card hover xs10 lg10 md10 v-else>
          <v-responsive :aspect-ratio="16/9">
            <v-toolbar>
              <v-spacer></v-spacer>
              <v-toolbar-title>
                Getting LND Info...
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              ...
            </v-card-text>
          </v-responsive>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>

  </v-card-text>
</v-card>
</template>

<script>
/* eslint-disable */

export default {
  data() {
    return {
      name: "About",
      lndInfo: { alias: "" },
      gotData: false
    };
  },
  created() {
    this.$socket.emit("yo_sofpear", {
      from: "frontend",
      subject: "GetLightningInfo"
    });
  },
  sockets: {
    yo_frontend(msg) {
      if (msg.error) {
        console.log("damn, error?");
        console.log(msg.error);
        this.lndInfo = msg.error;
        this.lndInfo.alias = "Error getting Lightning.";
        this.gotData = true;
        return;
      }
      switch (msg.subject) {
        case "GotLightningInfo":
          this.lndInfo = msg.payload;
          this.gotData = true;
          break;
        default:
          break;
      }
    }
  },
  computed: {
    getKeys() {
      return Object.keys(this.lndInfo);
    }
  }
};
</script>
