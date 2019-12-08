<template>
  <v-tabs fixed-tabs dark>
    <v-tab key="info">
      Info
    </v-tab>
    <v-tab key="getPaid">
      Create Invoice
    </v-tab>
    <v-tab key="peers">
      Peers
    </v-tab>
    <v-tab key="channels">
      Channels
    </v-tab>
    <v-tab key="decoder">
      Decoder
    </v-tab>
    <v-tab key="payInvoice">
      Pay Invoice
    </v-tab>
    <v-tab-item key="info">
      <info />
    </v-tab-item>
    <v-tab-item key="getPaid">
      <create-invoice />
    </v-tab-item>
    <v-tab-item key="peers">
      <peers></peers>
    </v-tab-item>
    <v-tab-item key="channels">
      <channels />
    </v-tab-item>
    <v-tab-item key="decoder">
      <invoice-decoder />
    </v-tab-item>
    <v-tab-item key="payInvoice">
      <pay-invoice />
    </v-tab-item>
  </v-tabs>
</template>

<style>
.material-icons.green600 {
  color: green;
}
</style>

<script>
/* eslint-disable */
import Peers from "./Peers/Peers";
import Channels from "./Channel/Channels";
import Info from "./Info";
import InvoiceDecoder from "./InvoiceDecoder";
import CreateInvoice from "./CreateInvoice";
import PayInvoice from "./PayInvoice";

export default {
  components: {
    Channels,
    CreateInvoice,
    Info,
    InvoiceDecoder,
    Peers,
    PayInvoice
  }
};
</script>
