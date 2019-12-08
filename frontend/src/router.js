import Channel from "./pages/Lightning/Channel/Channel.vue";
import Home from "./pages/Home.vue";
import Quizs from "./pages/Sparkle/Quiz/Quizs.vue";
import Quiz from "./pages/Sparkle/Quiz/Quiz.vue";
import Lightning from "./pages/Lightning/Lightning.vue";
import InvoiceDecoder from "./pages/Lightning/InvoiceDecoder.vue";
import Sparkle from "./pages/Sparkle/Sparkle";
import Router from "vue-router";
import Vue from "vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/decoder",
      name: "Invoice Decoder",
      component: InvoiceDecoder
    },
    {
      path: "/quiz/:id",
      name: "quiz",
      component: Quiz
    },
    {
      path: "/quizs",
      name: "quizs",
      component: Quizs
    },
    {
      path: "/sparkle",
      name: "sparkle",
      component: Sparkle
    },
    {
      path: "/lightning",
      name: "Lightning",
      component: Lightning
    },
    {
      path: "/channel/:id",
      name: "channel",
      component: Channel
    }
  ]
});
