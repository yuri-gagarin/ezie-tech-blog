import * as admin from "firebase-admin";

export default class FirebaseServerController {

  constructor() {
    this.init();
  }
  private init() {
    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PROJECT_PRIVATE_KEY.replace(/\\n/g, '\n') // needed for now ... //
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    })
  }
}
