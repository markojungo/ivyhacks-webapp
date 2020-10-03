<template>
  <v-app>
    <v-app-bar app> 
      <v-img
        class="ma-3"
        max-height=30
        max-width=30
        src=./assets/logo.png
        contain
      ></v-img>
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
    background-size: 100% 100%;
  }
</style>