      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      var firebaseConfig = {
        apiKey: "AIzaSyBav5IWC6RO0VLA8Sh8XUxJOUVIQcdjwoQ",
        authDomain: "istyleproject-23b21.firebaseapp.com",
        projectId: "istyleproject-23b21",
        storageBucket: "istyleproject-23b21.appspot.com",
        messagingSenderId: "471642693794",
        appId: "1:471642693794:web:f5e3552e9b65bec17737fb",
        measurementId: "G-T5EGRZPWGJ",
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();

      const db = firebase.firestore();
      db.settings({
        timestampsInSnapshots: true,
      });
