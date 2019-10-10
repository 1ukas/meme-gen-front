import { auth } from './index';

auth.signInAnonymously().catch((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  console.log(`${errorCode + " " + errorMessage}`);
});

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User signed in');
    const isAnonymous = user.isAnonymous;
    const uid = user.id;
  }
  else {
    console.log('User is signed out');
  }
});