<template>
  <v-dialog offset-x :close-on-content-click="false" :nudge-width="200" v-model="dialog">
    <v-btn small icon dark slot="activator" class="primary">
      <v-icon small>
        add
      </v-icon>
    </v-btn>
    <v-card>
      <v-card-title>
        <span class="headline">
          Add Quiz
        </span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="quiz.name" label="Name" required></v-text-field>

        <v-text-field v-model="quiz.description" label="Description" required></v-text-field>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="secondary" flat @click.native="dialog = false">Close</v-btn>
        <v-btn class="accent" @click.native="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      quiz: {
        name: "",
        description: "",
        published: false
      }
    };
  },
  methods: {
    toogleDialog() {
      // eslint-disable-next-line
      console.warn("open add quiz dialog");
      this.dialog = true;
    },
    save() {
      // eslint-disable-next-line
      var msg = {
        from: "frontend",
        subject: "UpsertQuiz",
        payload: this.quiz
      };

      this.$socket.emit("yo_sofpear", msg);

      this.quiz = { name: "", description:"", published: false };
      this.dialog = false;
    }
  }
};
</script>
