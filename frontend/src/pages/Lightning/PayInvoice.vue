<template>
  <div>
    <h1>
      Pay Invoice
    </h1>
    <v-divider />
    <v-card>
      <v-card-text>
        <v-layout>
          <v-flex xs10>
            <v-textarea name="lnInvoice" v-model="invoice" label="Invoice" hint="Paste LN invoice here."></v-textarea>
          </v-flex>
          <v-flex xs2>
            <v-btn color="success" @click.native="payInvoice">Pay</v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-divider />
    <v-container fluid grid-list-md>
      <div v-if="isInvoicePaid">
        Paid!!
      </div>
      <div v-else>
          not paid..
      </div>
    </v-container>

  </div>
</template>

<script>
/* eslint-disable */

export default {
  name: "payInvoice",
  data() {
    return {
      invoice: "",
      isInvoicePaid: false
    };
  },
  sockets: {
    yo_frontend(data) {
      console.log("yo_frontend");
      console.log(data);
      switch (data.subject) {
        case "LightningInvoicePaid":
          console.log("invoice paid");
          this.isInvoicePaid=true;
          break;
        default:
          break;
      }
    }
  },
  methods: {
    payInvoice() {
      this.$socket.emit("yo_sofpear", {
        subject: "PayLightningInvoice",
        payload: {payment_request: this.invoice},
        from: "frontend"
      });
    }
  }
};
</script>
