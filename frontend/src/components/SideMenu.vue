<template>
  <div>
    <v-list>
      <v-list-tile ripple value="true" v-for="(page, i) in page_links" @click.native="menuClicked(page.to)" :key="i" :to="page.to">
        <v-list-tile-action>
          <v-icon v-html="page.icon"></v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title v-text="page.title"></v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  props: {
    menuClicked: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      page_links: [
        {
          icon: "dashboard",
          title: "Dashboard",
          to: "/"
        },
        {
          icon: "help",
          title: "Quiz",
          to: "/quizs"
        },
        {
          icon: "offline_bolt",
          title: "Lightning",
          to: "/lightning"
        }
      ]
    };
  }
};
</script>
