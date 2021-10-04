const withTM = require('next-transpile-modules')(['react-markdown',"react-syntax-highlighter"]);

module.exports = withTM({
  reactStrictMode: true,
  env: {
    FIREBASE_API_KEY: "AIzaSyD1I_FwPg7A25m5nf_H6LTCNsXJh8W8mxY",
    FIREBASE_AUTH_DOMAIN: "eezie-tech.firebaseapp.com",
    FIREBASE_PROJECT_ID: "eezie-tech",
    FIREBASE_STORAGE_BUCKET: "eezie-tech.appspot.com",
    FIREBASE_MESSAGING_SENDER_ID: "684598146249",
    FIREBASE_APP_ID: "1:684598146249:web:6ce3fefd1d41ef1cff8918",
    FIREBASE_MEASUREMENT_ID: "G-DEYE4BE588"
  },
  images: {
    domains: [ "picsum.photos", "firebasestorage.googleapis.com", "external-preview.redd.it" ]
  }
});