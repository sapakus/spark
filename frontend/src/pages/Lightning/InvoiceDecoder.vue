<template>
  <div>
    <h1>
      LN Invoice Decoder
    </h1>
    <v-divider />
    <v-card>
      <v-card-text>
        <v-layout>
          <v-flex xs10>
            <v-textarea name="lnInvoice" v-model="invoice" label="Invoice" hint="Paste LN invoice here."></v-textarea>
          </v-flex>
          <v-flex xs2>
            <v-btn color="success" @click.native="decodeInvoice">Decode</v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-divider />
    <v-container fluid grid-list-md>
      <v-layout row wrap v-for="k in getKeys" :key="k">
        <v-flex xs3 md3 lg3>
          {{k}}
        </v-flex>
        <v-flex xs8 md8 lg8 pa-1>
          {{ decodedInvoice[k] }}
        </v-flex>
      </v-layout>
    </v-container>

  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: "invoiceDecoder",
  data() {
    return {
      invoice: "",
      decodedInvoice: {}
    };
  },
  sockets: {
    yo_frontend(data) {
      console.log("yo_frontend");
      console.log(data);
      switch (data.subject) {
        case "InvoiceDecoded":
          console.log("invoice decoded");
          this.decodedInvoice = data.payload;
          break;
        default:
          break;
      }
    }
  },
  methods: {
    decodeInvoice() {
      this.$socket.emit("yo_sofpear", {
        subject: "DecodeLightningInvoice",
        payload: this.invoice,
        from: "frontend"
      });
    }
  },
  computed: {
    getKeys() {
      return Object.keys(this.decodedInvoice);
    }
  }
};
</script>
