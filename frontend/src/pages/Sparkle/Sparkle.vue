<template>
  <v-tabs fixed-tabs dark>
    <v-tab key="payee">
      Sparklee aka kid
    </v-tab>
    <v-tab key="payer">
      Sparkler aka parent
    </v-tab>
    <v-tab-item key="payee">
      show published quizes here?
    </v-tab-item>
    <v-tab-item key="payer">
      <create-invoice />
    </v-tab-item>
  </v-tabs>
</template>

<script>
/* eslint-disable */
import Quizs from "./Quiz/Quizs";

export default {
  components: {
    Quizs
  }
};

</script>

