<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <side-menu :menu-clicked="changePageView" />
    </v-navigation-drawer>
    <v-toolbar app :clipped-left="clipped" color="tulip">
      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon>
          menu
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<style src="./assets/materialicons.css" type="text/css" />

<script>
import SideMenu from "./components/SideMenu";

export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      miniVariant: true,
      rightDrawer: false,
      title: "Sparkle"
    };
  },
  components: {
    SideMenu
  },
  methods: {
    changePageView(page) {
      // eslint-disable-next-line
      console.log(page);
    }
  }
};
</script>
