<template>
  <v-card hover>
    <v-toolbar clipped-left>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        {{quizObj.name}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <v-btn small color="primary" dark icon @click.stop="openCategoryPage">
          <v-icon small>
            zoom_out_map
          </v-icon>
        </v-btn>
    </v-toolbar>
    <v-card-text>
      {{quizObj.description}}
    </v-card-text>
  </v-card>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      editItem: {}
    };
  },
  props: {
    quizObj: {
      type: Object
    }
  },
  methods: {
    openCategoryPage() {
      console.log("OPEN!?");
      console.log(this.quizObj._id);
      this.$router.push({
        name: "quiz",
        params: { id: this.quizObj._id }
      });
    }
  }
};
</script>
