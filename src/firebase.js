import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/analytics'
import 'firebase/functions'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBTJKCR8bzOacNUVA8iTEdoFKTbulXS0Uk",
    authDomain: "electoraltech-d9cec.firebaseapp.com",
    databaseURL: "https://electoraltech-d9cec-default-rtdb.firebaseio.com",
    projectId: "electoraltech-d9cec",
    storageBucket: "electoraltech-d9cec.appspot.com",
    messagingSenderId: "90795550943",
    appId: "1:90795550943:web:df0de93b0016908787216a",
    measurementId: "G-08Z509XKRR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const fr = firebase.firestore()
/* if (process.env.NODE_ENV == "development" && location.hostname == 'localhost') {
    fr.useEmulator('localhost', 9090);
} */

const auth = firebase.auth();
const db = firebase.database();
const analytics = firebase.analytics();
const storage = firebase.storage();

export { fr, auth, db, analytics, storage, firebase }