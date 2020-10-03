const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.getQuestions = functions.https.onRequest( async (req, res) => {
  let texts = [];

  const db = admin.firestore();
  
  var questions = await db.collection("questions").get();

  questions.forEach(doc => {
      // doc.data() is never undefined for query doc snapshots
      texts.push(doc.data().text);
  });

  res.json({ questions: texts });
});

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

exports.getQuestionsRandomOrder = functions.https.onRequest( async (req, res) => {
  // Get questions list
  let texts = [];

  const db = admin.firestore();
  var questions = await db.collection("questions").get();
  questions.forEach(doc => {
    // doc.data() is never undefined for query doc snapshots
    texts.push(doc.data().text);
  });

  shuffle(texts);

  res.json({ questions: texts });
}); 