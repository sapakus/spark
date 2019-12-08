<template>
  <v-card>
    <v-card-title primary-title>
      <v-toolbar>
        <v-spacer></v-spacer>
        <v-toolbar-title style="color: #01579B" class="display-1 ">
          {{quizObj.name}}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark icon to="/quizs">
          <v-icon>
            close
          </v-icon>
        </v-btn>
      </v-toolbar>
    </v-card-title>
    <v-card-text>

      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs11 md11 lg11>
            <v-text-field name="searchField" label="Search Question" id="searchField" v-model="searchPhase"></v-text-field>
          </v-flex>
          <v-flex xs1 md1 lg1>
            <new-question-dialog :quiz-id="quiz._id" />
          </v-flex>
          <v-flex xs6 md4 lg4 v-for="(question) in getFilteredQuestions" :key="question._id ">
            <question-card :question-obj="question" />
          </v-flex>
        </v-layout>
      </v-container>

    </v-card-text>
  </v-card>
</template>
<script>
/*eslint no-case-declarations: "off"*/
/* eslint-disable */
import NewQuestionDialog from "./Question/NewQuestionDialog";
import QuestionCard from "./Question/QuestionCard";

export default {
  name: "Quiz",
  data() {
    return {
      quiz: {},
      // parent_category_id: "",
      searchPhase: "",
      questionlist: []
    };
  },
  created() {
    console.log("Created Quiz Page!!");
    this.getQuiz(this.$route.params.id);
  },
  methods: {
    getQuiz(id) {
      var filter = {
        _id: this.$route.params.id
      };
      var msg = {
        from: "frontend",
        subject: "GetQuiz",
        payload: {
          filter: filter
        }
      };
      this.$socket.emit("yo_sofpear", msg);
    }
  },
  sockets: {
    yo_frontend(msg) {
      switch (msg.subject) {
        case "GotQuiz":
          if (msg.filter._id) {
            this.quiz = msg.payload.filter(
              c => c._id === this.$route.params.id
            )[0];

            const filter = {
              quiz_id: this.$route.params.id
            };
            const req = { from: "frontend", subject: "GetQuestion", filter: filter };

            this.$socket.emit("yo_sofpear", req);
          }
          break;
        case "GotQuestion":
          this.questionlist = msg.payload;
          break;
        case "QuestionUpserted":
          if (msg.payload.quiz_id === this.quiz._id) {
            let i = this.questionlist.findIndex(
              itm => itm._id === msg.payload._id
            );
            if (i >= 0) {
              this.questionlist.splice(i, 1);
            }
            this.questionlist.push(msg.payload);
          }
        default:
          break;
      }
    }
  },
  computed: {
    quizObj() {
      return this.quiz;
    },
    getFilteredQuestions() {
      const questions = this.questionlist;
      const searchPhaseLower = this.searchPhase.toLowerCase();

      return questions
        .filter(c => c.prompt.toLowerCase().indexOf(searchPhaseLower) > -1)
        .sort((a, b) => a.prompt.localeCompare(b.prompt));
    }
  },
  components: {
    QuestionCard,
    NewQuestionDialog
  }
};
</script>
