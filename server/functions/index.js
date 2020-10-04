const functions = require('firebase-functions');
const admin = require('firebase-admin');
const randomGenerator = require('random-key-generator');
const cors = require('cors')({origin: true});
const ROOM_SIZE = 10;

admin.initializeApp();

// Shuffles an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Generates a shuffled list of questions for a room
function generateQuestions(questions) {
  let texts = [];
  questions.forEach(doc => {
    texts.push(doc.data().text);
  });
  shuffle(texts);
  return texts;
}

// Generates a shuffled list of philosophers for a room
function generatePhilosophers(philosophers) {
  let texts = [];
  philosophers.forEach(doc => {
    texts.push(doc.get('text'));
  });
  shuffle(texts);
  return texts;
}

// Get next available participant ID
// Starts at largest ID, then linear search for next available
function nextAvailableID(participants, totalPhilos) {
  if (participants.length === 0) return 0;
  maxID = Math.max(...participants);
  for (var i = maxID+1; i < maxID+1+ROOM_SIZE; i++) {
    if (!participants.includes(i%totalPhilos)) {
      return i;
    }
  }
  // Should never get here
  return -1;
}

// Add a participant to the room/database when "join" is clicked
exports.addParticipant = functions.https.onRequest((_, res) => {
  cors(_, res, async () => {
    const db = admin.firestore();
    let rooms = db.collection('rooms');
    let roomsQuery = await rooms.get();
    
    // Assign participant existing room, if available
    let id = 0;
    let participants = null;
    let returnKey = null;
    let questions = generateQuestions(await db.collection("questions").get());
    let philosophers = generatePhilosophers(await db.collection("philosophers").get());
    let nextCounter = 0;
    let currentQuestionIndex = 0;
    
    roomsQuery.forEach(doc => {
      if (!returnKey && doc.get('participants').length !== ROOM_SIZE) { 
        id = nextAvailableID(doc.get('participants'), philosophers.length);
        newParticipants = doc.get('participants');
        newParticipants.push(id);
        participants = newParticipants;
        returnKey = doc.id;
        questions = doc.get('questions');
        philosophers = doc.get('philosophers');
        nextCounter = doc.get('nextCounter');
        currentQuestionIndex = doc.get('currentQuestionIndex');
      }
    });
    
    // Create a new room if no existing room is found
    if (returnKey) {
      await rooms.doc(returnKey).update({
        participants: participants
      });
    } else {
      returnKey = randomGenerator(12);
      participants = [id]
      let newroom = {
        participants: participants,
        questions: questions,
        philosophers: philosophers,
        nextCounter: nextCounter,
        currentQuestionIndex: currentQuestionIndex,
      }
    
      await db.collection('rooms').doc(returnKey).set(newroom);
    }
    
    // Return relevant info
    res.status(200).json({
      id: id,
      participants: participants,
      key: returnKey,
      questions: questions,
      philosophers: philosophers,
      nextCounter: nextCounter,
      currentQuestionIndex: currentQuestionIndex,
    });
  })
});

// Participant leaves
exports.participantLeave = functions.https.onRequest((_, res) => {
  cors(_, res, async () => {

  })
});

// Participant presses next question button
exports.requestNext = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {

    // Get room info
    const roomKey = req.query.key;
    let room = await db.collection('rooms').doc(roomKey);
    let newKey = room.get('nextCounter') + 1;
    let numPeople = room.get('participants').length;
    let numQuestions = room.get('questions').length;
    let newQuestionIndex = (room.get('currentQuestionIndex') + 1) % numQuestions;

    // Adjust next counter
    await room.update({
      nextCounter: (newKey > numPeople / 2) ? 0 : newKey,
      currentQuestionIndex: newQuestionIndex
    });
    
    res.status(200).end();
  })
});
