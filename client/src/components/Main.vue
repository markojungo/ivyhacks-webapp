<template>
  <div class='main d-flex align-center'>
    <v-container class='d-flex justify-center'>
      <v-btn
        elevation="4"
        class=""
        x-large
      >
        <router-link to="/room" class='text-bold text-decoration-none'>
          Join Random Room
        </router-link>
      </v-btn>
    </v-container>
    <v-container class='welcome my-2'>
      <h1 class="text-h2 mt-4">Welcome!</h1>


      <p class="text-subtitle-2 mt-4">Discuss philosophical questions with others on the internet!</p>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'Main',

    data: () => ({
      
    }),
  }
</script>

<style scoped>
  .main {
    height: 100%;
  }

  .welcome {
    background-color: rgba(255, 255, 255, 0.25);
  }
</style>