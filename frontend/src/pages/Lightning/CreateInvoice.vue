<template>
  <v-card>
    <v-card-text>
      <div>

        <div v-if="payment_request">
          <div v-if="paid">
            <v-icon x-large class="green600" style="font-size: 100px">
              check_circle_outline
            </v-icon>
            <h3>PAID</h3>
          </div>
          <div v-else>
            <v-container fluid grid-list-md>
              <v-layout row wrap>
                <v-flex xs6 md2 lg2>
                  description:
                </v-flex>
                <v-flex xs6 md10 lg10)>
                  {{description}}
                </v-flex>
                <v-flex xs6 md2 lg2>
                  invoice:
                </v-flex>
                <v-flex xs6 md10 lg10 class="its-a-wrap">
                  {{payment_request}}
                </v-flex>
                <v-flex xs6 md2 lg2>
                  amount:
                </v-flex>
                <v-flex xs6 md10 lg10>
                  {{amount}}
                </v-flex>

              </v-layout>
              <v-layout>
                <v-flex xs12 md2 lg2>
                  <vue-qr :text="payment_request" qid="testid"></vue-qr>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex xs12 md2 lg2>
                  <v-progress-linear :indeterminate="true" class="accent"></v-progress-linear>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </div>
        <div v-else>
          <v-text-field name="decription" v-model="description" label="description" id="txtDescription"></v-text-field>
          <v-text-field name="amount" label="amount" v-model="amount" id="txtAmount"></v-text-field>
          <v-btn @click="getInvoice()"> Get Invoice </v-btn>
        </div>

      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import VueQr from "vue-qr";
export default {
  data() {
    return {
      description: "",
      amount: 0,
      payment_request: "",
      paid: false
    };
  },
  sockets: {
    yo_frontend(envelope) {
      switch (envelope.subject) {
        case "InvoiceCreated":
          this.payment_request = envelope.payload.invoice;
          this.paid = false;
          break;
        case "InvoiceUpdated":
          this.paid =
            envelope.payload.payment_request === this.payment_request &&
            envelope.payload.settled;
          break;
        default:
          break;
      }
    }
  },
  components: { VueQr },
  methods: {
    getInvoice() {
      const payload = {
        amount: this.amount,
        description: this.description
      };
      this.$socket.emit("yo_sofpear", {
        subject: "CreateLightningInvoice",
        from: "frontend",
        payload: payload
      });
      this.$socket.emit("yo_sofpear", {
        subject: "SubscribeToLightningInvoices",
        from: "frontend"
      });
    }
  },
  computed: {}
};
</script>
<style scoped>
.its-a-wrap {
  word-wrap: break-word;
}
</style>
