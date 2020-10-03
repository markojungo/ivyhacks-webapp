<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Flsfy</v-toolbar-title>
    </v-app-bar>

    <v-main class='main align-center'>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {
    
  },

  data: () => ({
    drawer: null
  }),
};
</script>

<style scoped>
  .main {
    background-image: url('./assets/lowpoly.png');
    background-attachment: scroll;
  }
</style>