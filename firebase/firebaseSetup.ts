// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage, ref } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
//
import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import type { FirebaseStorage } from "firebase/storage";
import type { Analytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export default class FirebaseController {
  private firebaseConfig: FirebaseOptions;
  private app: FirebaseApp;
  private firebaseStorage: FirebaseStorage;
  //private analytics: Analytics;

  constructor() {
    console.log(14)
    console.log(process.env.FIREBASE_STORAGE_BUCKET)
    this.firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };
    this.initialize();
    this.initializeStorage();
  } 

  private initialize(): void {
    this.app = initializeApp(this.firebaseConfig);
    //this.analytics = getAnalytics(this.app);
  }
  private initializeStorage(): void {
    this.firebaseStorage = getStorage(this.app);
    //const storageRef = ref(this.firebaseStorage);
    //console.log(storageRef);
    console.log(this.app)
  }
};




