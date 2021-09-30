// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
//
import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import type { FirebaseStorage, StorageReference, UploadResult } from "firebase/storage";
import type { Analytics } from "firebase/analytics";
import type { Dispatch } from 'hoist-non-react-statics/node_modules/@types/react';
import type { ProjectAction } from '@/redux/_types/projects/actionTypes';

// TODO //
// implement better error handling //
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export default class FirebaseController {
  private firebaseConfig: FirebaseOptions;
  private app: FirebaseApp;
  private firebaseStorage: FirebaseStorage;
  //private analytics: Analytics;

  constructor() {
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

  public async uploadPojectImage(imageFile: File, dispatch: Dispatch<ProjectAction>): Promise<{ imageURL: string; snapshot: UploadResult }> {
    const dateStamp: string = Date.now().toString();
    const imagePath = `/project_images/${dateStamp}_${imageFile.name}`;
    const projectImagesRef = ref(this.firebaseStorage, imagePath);
    
    dispatch({ type: "ProjectsAPIRequest", payload: { loading: true } });
    try {
      const snapshot = await uploadBytes(projectImagesRef, imageFile);
      const imageURL = await getDownloadURL(projectImagesRef);
      return {
        imageURL, snapshot
      }
    }
    catch (error) {
      throw error;
    }
  }
  public async removePojectImage(imageURL: string, dispatch: Dispatch<ProjectAction>): Promise<any> {
      const imgRef = ref(this.firebaseStorage, imageURL);
      try {
        await deleteObject(imgRef)
        return true;
      } catch (error) {
        throw error;
      }
  }

  private initialize(): void {
    this.app = initializeApp(this.firebaseConfig);
    //this.analytics = getAnalytics(this.app);
  }
  private initializeStorage(): void {
    this.firebaseStorage = getStorage(this.app);
    //const storageRef = ref(this.firebaseStorage);
    //console.log(storageRef);
  }
};




