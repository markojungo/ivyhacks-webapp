<template>
  <div class='room mx-3'>
    <div v-bind:class='{ hide: isLoaded }'
      class="loadingContainer"
    >
      <div class="">
        <h2 class="text-h2">Trying to join room: {{ this.roomKey }}</h2>
        <div class="d-flex justify-center mt-5">
          <v-progress-circular
            :size="150"
            :width="7"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </div>
    </div>
    
    <v-row v-bind:class="{ hide: !isLoaded }">
      <v-col cols="4">
        <v-card class="participants">
            <v-card-title>Participants</v-card-title>
          <v-list
            disabled
          >
            <v-container
              v-for="p in participants" :key="p"
            >
              <v-list-item>
                <p :class="{ active: philosophers[p] == name }">
                  {{ philosophers[p] }}
                </p>
              </v-list-item>            
              <v-divider></v-divider>
            </v-container>
          </v-list>
        </v-card>
        <v-btn
          elevation="2"
          block
          rounded
          color="secondary"
          class="mt-5"
          v-on:click="nextQuestion()"
        >Next Question ({{ nextCounter }}/{{ totalNextNeeded }})</v-btn>
      </v-col>
      <v-col cols="8">
        <v-row class="ma-3">
          <v-card class="pa-4">
            <h6 class="text-h6"></h6>
            <h2 class="text-h2">{{ currentQuestion }}</h2>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import axios from 'axios';

  import { db } from '../firebaseConfig';

  export default {
    name: 'Room',

    data: () => ({
      isLoaded: false,
      questions: [],
      currentQuestion: '',
      currentQuestionIndex: 0,
      roomKey: null,
      participants: [],
      philosophers: [],
      name: '',// Current User's name
      id: null, // Current User's id
    }),

    computed: {
      totalNextNeeded: function () {
        return this.participants.length / 2 + 1;
      }
    },

    methods: {
      nextQuestion: async function () {
        const query = '?key=' + this.roomKey;
        const url = 'https://us-central1-ivyhacks-backend.cloudfunctions.net/requestNext';
        await axios.post(url + query);
      },
      leaveButtonPressed: async function () {
        const query = '?pid=' + this.id + '&roomKey=' + this.roomKey;
        const url = 'https://us-central1-ivyhacks-backend.cloudfunctions.net/participantLeave';
        await axios.post(url + query);

        
      }
    },

    async mounted () {
      const roomInfo = await axios.get('https://us-central1-ivyhacks-backend.cloudfunctions.net/addParticipant');
      console.log(roomInfo.data);
      const { 
        id,
        participants,
        key,
        questions,
        philosophers,
        currentQuestionIndex,
        nextCounter
      } = roomInfo.data;

      // Set Initial Data
      this.isLoaded = true;
      this.roomKey = key;
      this.questions = questions;
      this.participants = participants;
      this.id = id;
      this.name = philosophers[id];
      this.philosophers = philosophers;
      this.currentQuestionIndex = currentQuestionIndex;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.nextCounter = nextCounter;

      const path = this.$route.path.slice(-1) == '/' ? 
        this.$route.path : this.$route.path + '/';
      history.replaceState({}, null, '#' + path + this.roomKey);
      
      const doc = await db.collection('rooms').doc(this.roomKey);
      doc.onSnapshot(docSnapshot => {
        this.participants = docSnapshot.get('participants');
        // Skip question if majority requests
        let newCounter = docSnapshot.get('nextCounter');
        if (newCounter < this.nextCounter) {
          // reset this.nextCounter and doc.nextCounter
          this.nextCounter = 0;
          // set this.currentQuestion
          this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.questions.length;
          this.currentQuestion = this.questions[this.currentQuestionIndex];
        } else if (newCounter > this.nextCounter) {
          this.nextCounter = newCounter;
        }
      }, err => {
        console.log(`Encountered error: ${err}`);
      });
    },
  }
</script>

<style scoped>
  .hide {
    display: none !important;
  }

  .room {
    height: 100%;
  }

  .loadingContainer {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  .active {
    color:brown;
  }
</style>