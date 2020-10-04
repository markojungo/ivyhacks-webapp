<template>
  <v-app>
    <v-app-bar app
      src=./assets/lowpoly.png
    > 
      <v-img
        class="ma-3"
        max-height=75
        max-width=75
        rotate=90
        src=./assets/logo.svg
        contain
      ></v-img>
      <v-toolbar-title>
        <h3 class="">PhilTalk</h3>
      </v-toolbar-title>
    </v-app-bar>

    <v-main class='room'>
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view />
      </transition>
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
    background-image: url('./assets/background_red.png');
    background-size: 100% 100%;
  }
  .room {
    background-image: url('./assets/background_mixed.png');
    background-size: 100% 100%;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 1.2s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0
  }
</style>