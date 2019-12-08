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
          Add Question
        </span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="question.prompt" label="Prompt" required></v-text-field>
        <v-combobox v-model="question.options" label="Options" hint="Tab after typing the TAG." chips clearable solo multiple>
        </v-combobox>
        <v-combobox v-model="question.answers" label="Answers" hint="Tab after typing the TAG. Todo: only allow from options above" chips clearable solo multiple>
        </v-combobox>

        <v-divider></v-divider>

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
  props: {
    quizId: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      dialog: false,
      question: {
        prompt: "",
        quiz_id: "",
        answers: [],
        options: []
      }
    };
  },
  methods: {
    toogleDialog() {
      this.dialog = true;
    },
    save() {
      // eslint-disable-next-line
      console.log(this.questionId);
      this.question.quiz_id = this.quizId;
      var msg = {
        from: "frontend",
        subject: "UpsertQuestion",
        payload: this.question
      };
      this.$socket.emit("yo_sofpear", msg);
      this.question = {
        prompt: "",
        quiz_id: "",
        answers: [],
        options: []
      };
      this.dialog = false;
    }
  }
};
</script>
