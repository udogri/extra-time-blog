// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('../secrets/firebase-service-account.json'); // Replace with the path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "//extra-time-blog.appspot.com"
});

module.exports = admin;

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { db, bucket };