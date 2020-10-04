<template>
  <v-app>
    <v-app-bar app> 
      <v-img
        class="ma-3"
        max-height=75
        max-width=75
        rotate=90
        src=./assets/logo.svg
        contain
      ></v-img>
      <v-toolbar-title>PhilTalk</v-toolbar-title>
    </v-app-bar>

    <v-main class='main'>
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