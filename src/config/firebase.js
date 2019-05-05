const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://luca-a6691.firebaseio.com'
});

exports.auth = admin.auth();
exports.db = admin.database();
exports.userRef = exports.db.ref("user");