<template>
  <div>
    <p v-if="isConnected">We're connected to the server!</p>
    <p>Message from server:
      <b>{{socketMessage}}</b>
    </p>

    <v-btn @click="messageServer()">Ping Server</v-btn>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      isConnected: false,
      socketMessage: ""
    };
  },

  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      console.log("wtf");
      this.socketMessage = data;
    },
    InvoiceCreated(data) {
      console.log("invoice created");
      console.log(data);
      this.invoice = JSON.parse(data);
      console.log(this.invoice);
    }
  },

  methods: {
    getInvoice() {
      const payload = {
        amount: this.amount,
        description: this.description
      };
      this.$socket.emit("yo_sofpear", {
        subject: "CreateAnInvoice",
        payload: payload
      });
    },
    messageServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit("yo_sofpear", {
        subject: "PING!"
      });
    }
  }
};
</script>
