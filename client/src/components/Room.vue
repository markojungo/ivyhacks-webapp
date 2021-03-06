<template>
  <div class='room'>
    <div v-bind:class='{ hide: isLoaded }'
      class="loadingContainer"
    >
      <div class="">
        <!--<h2 class="text-h2">Joining room {{ this.roomKey }}</h2>-->
        <h2 class="text-h2">Joining room...</h2>
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
    
    <v-row v-bind:class="{ hide: !isLoaded }" class="px-5">
      <v-col cols="4">
        <v-card class="participants"
          style="background: none !important"
        >
          <v-card-title>Participants</v-card-title>
          <v-list style="background: none !important">
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
          :disabled="nextButtonDisabled"
        >
          Next Question ({{ nextCounter }}/{{ totalNextNeeded }})
        </v-btn>
        <v-btn 
          @click="leaveRoom()"
          elevation="2"
          rounded
          block
          color="error"
          class="mt-5"
        >
          Leave Room
        </v-btn>
      </v-col>
      <v-col col=8>
        <v-row class="ma-3">
          <v-card class="w100 pa-5" color="rgb(255, 255, 255, 0.7)">
            <h2 class="text-h2">{{ currentQuestion }}</h2>
          </v-card>
        </v-row>
        <v-row class="ma-3">
          <v-card class="w100" id="chat" color="rgb(255, 255, 255, 0.7)">
            <v-list dense color="rgb(255, 255, 255, 0.7)">
              <v-list-item
                class="tile"
                color="rgb(255, 255, 255, 0.7)"
                v-for="t in chatTexts" :key="t"
              >
                {{ t.name }}: {{ t.text }}
              </v-list-item>
            </v-list>  
          </v-card>
          <v-card class="w100 mt-5" color="rgb(255, 255, 255, 0.9)">
            <v-form
              ref="form"
              class="pa-5"
              @submit.prevent="sendChat()"
                label="Chat..."
              >
              <v-text-field
                v-model="chatToSend"
              ></v-text-field>
              <v-btn
                color="success"
                :disabled="!valid"
                @click="sendChat()"
              >Send</v-btn>
            </v-form>
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
      chatTexts: [],
      chatToSend: '',
      nextCounter: 0,
      nextButtonDisabled: false
    }),

    computed: {
      totalNextNeeded: function () {
        return Math.floor(this.participants.length / 2) + 1;
      },
      valid: function () {
        return this.chatToSend != '';
      }
    },

    methods: {
      nextQuestion: async function () {
        let room = db.collection('rooms').doc(this.roomKey);

        const roomData = await room.get();

        let newKey = roomData.get('nextCounter') + 1;
        let numPeople = roomData.get('participants').length;
        // let numQuestions = roomData.get('questions').length;
        // let newQuestionIndex = (roomData.get('currentQuestionIndex') + 1) % numQuestions;
        this.nextButtonDisabled = true;
        // Adjust next counter
        await room.update({
          nextCounter: (newKey > numPeople / 2) ? 0 : newKey,
          // currentQuestionIndex: newQuestionIndex
        });
      },
      
      leaveRoom: async function () {

        // Get room info
        let roomRef = db.collection('rooms').doc(this.roomKey);
        let room = await roomRef.get();

        // Take user off participants list
        const participants = await room.data().participants;
        const index = participants.indexOf(this.id);
        participants.splice(index, 1);
        await roomRef.update({
          participants: participants
        });

        // Update nextCounter
        if (this.nextButtonDisabled && this.nextCounter>0) {
          this.nextCounter--;
          await roomRef.update({
            nextCounter: this.nextCounter
          });
        }

        this.chatToSend = 'has left the room';
        await this.sendChat();

        this.$router.push({name: 'Main'});
      },
      sendChat: async function () {
        const roomRef = db.collection('rooms').doc(this.roomKey);
        const room = await roomRef.get();

        let newChatTexts = room.data().chatTexts;
        newChatTexts.push({
          name: this.name,
          text: this.chatToSend
        });

        this.chatToSend = '';

        await roomRef.update({
          chatTexts: newChatTexts
        });

        this.$nextTick(function () {
          var chat = document.getElementById('chat');
          chat.scrollTop = chat.scrollHeight;
        });
      }
    },

    async mounted () {
      const roomInfo = await axios.get('https://us-central1-ivyhacks-backend.cloudfunctions.net/addParticipant');
      
      const { 
        id,
        participants,
        key,
        questions,
        philosophers,
        currentQuestionIndex,
        nextCounter,
        chatTexts
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
      this.chatTexts = chatTexts;

      const path = this.$route.path.slice(-1) == '/' ? 
        this.$route.path : this.$route.path + '/';
      history.replaceState({}, null, '#' + path + this.roomKey);
      
      const doc = await db.collection('rooms').doc(this.roomKey);
      doc.onSnapshot(docSnapshot => {
        this.participants = docSnapshot.get('participants');
        this.chatTexts = docSnapshot.get('chatTexts');

        this.$nextTick(function () {
          var chat = document.getElementById('chat');
          chat.scrollTop = chat.scrollHeight;
        });
        
        // Skip question if majority requests
        let newCounter = docSnapshot.get('nextCounter');
        if (newCounter < this.nextCounter) {
          // reset this.nextCounter and doc.nextCounter
          this.nextCounter = 0;
          // set this.currentQuestion
          this.currentQuestionIndex = (this.currentQuestionIndex + 1) % this.questions.length;
          this.currentQuestion = this.questions[this.currentQuestionIndex];

          this.nextButtonDisabled = false;
        } else if (newCounter > this.nextCounter) {
          this.nextCounter = newCounter;
        }
      }, err => {
        console.log(`Encountered error: ${err}`);
      });

      this.chatToSend = "HAS ARRIVED."
      this.sendChat();
    },
  }
</script>

<style scoped>
  .hide {
    display: none !important;
  }

  .room {
    height: 100%;
    width: 100%;
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

  .w100 {
    width: 100%;
  }

  .tile {
    background: rgba(255, 255, 255, .5)
  }
  .tile:hover {
    background: rgba(0, 0, 0, .1)
  }

  #chat {
    height: 300px;
    overflow-y: scroll;
  }
</style>