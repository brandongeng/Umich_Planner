import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyB6iXhL7ez30l3DxfSbj1BSNKMqgCZyAGM",
  authDomain: "umich-planner.firebaseapp.com",
  databaseURL: "https://umich-planner-default-rtdb.firebaseio.com",
  projectId: "umich-planner",
  storageBucket: "umich-planner.appspot.com",
  messagingSenderId: "964362145605",
  appId: "1:964362145605:web:a94d455a979dd89066782c",
  measurementId: "G-T72B7W9S4Y"
};

  export const app = initializeApp(firebaseConfig);
  export const db = getDatabase(app)
  export default firebaseConfig;