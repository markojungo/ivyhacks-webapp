const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.getAllQuestions = functions.https.onRequest( async (req, res) => {
  let texts = new Set();
  var  db = firebase.firestore();
  
  db.collection("questions").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          texts.add(doc.data);
      });
  });

  res.json({ setOfTexts: texts });
});