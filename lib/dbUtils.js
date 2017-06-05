import firebase from 'firebase';  
import config from '../firebase.config.js';

firebase.initializeApp(config);

// Get a reference to the database service
const database = firebase.database();

function recordSearch(jobtitle, city, results) {
	
}