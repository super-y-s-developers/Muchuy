const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://luca-a6691.firebaseio.com'
});

exports.auth = admin.auth();