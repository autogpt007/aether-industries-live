// // This code is for server-side use only and initializes the Firebase Admin SDK.
// // Do NOT include this file or the serviceAccountKey.json in your client-side code.
//
// var admin = require("firebase-admin");
//
// // Require the service account key file from the config folder
// var serviceAccount = require("../config/serviceAccountKey.json");
//
// // Optional: Configure databaseURL and storageBucket if needed
// // const firebaseConfig = {
// //   databaseURL: "https://YOUR_DATABASE_NAME.firebaseio.com", // Replace with your Realtime Database URL
// //   storageBucket: "YOUR_STORAGE_BUCKET_NAME.appspot.com" // Replace with your Cloud Storage bucket
// // };
//
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//     // ...firebaseConfig // Uncomment this line to include optional configuration
//   });
// }
//
//
// // You can now use the 'admin' object to interact with Firebase services
// // Optional: Log a message after successful initialization
// // with administrative privileges on your server.
// // For example: admin.auth().getUser('some-user-user-id')
// //               .then(...)
// //               .catch(...)
//
// // This code is for server-side use only and initializes the Firebase Admin SDK.
// // Do NOT include this file or the serviceAccountKey.json in your client-side code.
// module.exports = admin; // Export the initialized admin object for use in other server-side files
