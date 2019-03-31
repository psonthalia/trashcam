import firebase from 'firebase'

var config = {
  apiKey: "AIzaSyAts8T6yp3e1J1hhNO2WiHXqi_meioNY4g",
  authDomain: "smartsort.firebaseapp.com",
  databaseURL: "https://smartsort.firebaseio.com",
  projectId: "smartsort",
  storageBucket: "smartsort.appspot.com",
  messagingSenderId: "606208222810"
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
export default firebase;