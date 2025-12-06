import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Replace with actual config from User
const firebaseConfig = {
    apiKey: "AIzaSyCwea5AwvJCSFrGjAFjmD7w5fQqLTFSCss",
    authDomain: "quickprint-campus.firebaseapp.com",
    projectId: "quickprint-campus",
    storageBucket: "quickprint-campus.firebasestorage.app",
    messagingSenderId: "358544727638",
    appId: "1:358544727638:web:605f318e79ba960cb965f7",
    measurementId: "G-ZPG0DSMEFS"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
