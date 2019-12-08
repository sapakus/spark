<template>
  <v-card color="#F8BBD0">
    <v-card-title primary-title>
      <v-toolbar>
        <v-text-field name="searchField" label="Search Quiz" id="searchField" v-model="searchPhrase" clearable></v-text-field>
        <new-quiz-dialog />
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 md6 lg4 pa-2 v-for="(quiz) in filteredQuizs " :key="quiz._id ">
            <quiz-card :quiz-obj="quiz" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
/*eslint no-case-declarations: "off"*/
import QuizCard from "./QuizCard";
import NewQuizDialog from "./NewQuizDialog";
import { sanitize } from "../../../util.js";

export default {
  name: "Quizs",
  data() {
    return {
      quizs: [], // quizS becuase... f english.
      searchPhrase: ""
    };
  },
  created() {
    this.$socket.emit("yo_sofpear", {
      subject: "GetQuiz",
      from: "frontend"
    });
  },
  components: {
    QuizCard,
    NewQuizDialog
  },
  sockets: {
    yo_frontend(msg) {
      switch (msg.subject) {
        case "GotQuiz":
          console.log("Got Quizs?");
            this.quizs = msg.payload;
          break;
        case "QuizUpserted":
            console.log("QuizUpserted");
            let i = this.quizs.findIndex(c => c._id === msg.payload._id);
            if (i >= 0) {
              this.quizs.splice(i, 1);
            }
            this.quizs.push(msg.payload);
          break;
        default:
          break;
      }
    }
  },
  computed: {
    filteredQuizs() {
      const allQuizs = this.quizs;
      const search = sanitize(this.searchPhrase);

      return allQuizs
        .filter(c => c.name.toLowerCase().indexOf(search) > -1)
        .filter(
          c =>
            typeof c.parent_category_id === "undefined" ||
            c.parent_category_id === null
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  }
};
</script>
