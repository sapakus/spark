import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";

import socketio from "socket.io-client";
import VueSocketIO from "vue-socket.io";

//TODO: Pull this from env
Vue.use(VueSocketIO, socketio("http://localhost:3000"));

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

// Vue.use(store, VueSocketIO, SocketInstance);
