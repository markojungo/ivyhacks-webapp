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
function generateQuestions() {
  let texts = []
  const db = admin.firestore();
  let questions = await db.collection("questions").get();
  questions.forEach(doc => {
    texts.push(doc.data().text);
  });
  shuffle(texts);
  return texts;
}

// Generates a shuffled list of philosophers for a room
function generatePhilosophers() {
  let texts = []
  const db = admin.firestore();
  let philosophers = await db.collection("philosophers").get();
  philosophers.forEach(doc => {
    texts.push(doc.data().text);
  });
  shuffle(texts);
  return texts;
}

// Get next available participant ID
// Starts at largest ID, then linear search for next available
function nextAvailableID(participants) {
  maxID = Math.max(...participants);
  for (var i = maxID+1; i < maxID+1+ROOM_SIZE; i++) {
    if (!participants.includes(i)) {
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

    let rooms = await db.collection('rooms').get();

    // Assign participant existing room, if available
    let id = 0;
    let returnkey = null;
    let questions = generateQuestions();
    let philosophers = generatePhilosophers();
    let nextCounter = 0;
    rooms.forEach(doc => {
      if (doc.data().participants.length !== ROOM_SIZE) { 
        id = nextAvailableID(doc.data().participants);
        doc.data().participants.push(id);
        returnkey = doc.id;
        questions = doc.data().questions;
        philosophers = doc.data().philosophers;
        nextCounter = doc.data().nextCounter;
      }
    });

    // Create a new room if no existing room is found
    if (!returnkey) {
      returnkey = randomGenerator(12);
      let newroom = {
        participants: [id],
        questions: questions,
        philosophers: philosophers,
        nextCounter: nextCounter,
      }
    
      await db.collection('rooms').doc(returnKey).add(newroom);
    }
    
    // Return relevant info
    res.status(200).json({
      id: id,
      participants: participants,
      key: returnkey,
      questions: questions,
      philosophers: philosophers,
      nextCounter: nextCounter,
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
    const roomKey = req.query.key;
    
    let room = await db.collection('rooms').doc(roomkey);
    await room.update({
      nextCounter: room.data().nextCounter + 1
    });
    res.status(200).end();
  })
});

// Emit signal on event of new user joining/leaving and nextCounter++ so that other participants now
// Could be 3 functions or 2
exports.emitNextQuestion = functions.firestore.document('rooms/{roomKey}').onUpdate((change, context) => {
  //
  const current = change.after.data();

  if (current.nextCounter > current.participants.length / 2) {
    // Emit 
  } /*
  else if () {

  } else if () {

  }*/
});