<template>
  <v-card>
    <v-card-title primary-title>
      <div class="headline">{{getQuestionObject.prompt}} </div>
      <v-spacer></v-spacer>

    </v-card-title>

    Options:
    <v-chip v-for="t in getQuestionObject.options" :key="t"> {{t}}</v-chip>
    <br/>
    Answers:
    <v-chip v-for="(t,ix) in getQuestionObject.answers" :key="ix"> {{t}}</v-chip>
    <v-card-actions>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      name: "questionCard",
      show: false
    };
  },
  props: {
    questionObj: {
      type: Object,
      required: true
    }
  },
  computed: {
    getQuestionObject() {
      return this.questionObj;
    }
  }
};
</script>
