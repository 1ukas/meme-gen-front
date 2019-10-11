import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBsblmGeyk0PsnJGwcAYD6B5Ikfsn8q3g",
  authDomain: "meme-gen-7aecd.firebaseapp.com",
  databaseURL: "https://meme-gen-7aecd.firebaseio.com",
  projectId: "meme-gen-7aecd",
  storageBucket: "meme-gen-7aecd.appspot.com",
  messagingSenderId: "44846162857",
  appId: "1:44846162857:web:f08814f9a44c7538b45ab8",
  measurementId: "G-DJXVBJR0L3"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const auth = firebase.auth();
let db = firebase.firestore();

export {
  storage, auth, db, firebase as default
}
