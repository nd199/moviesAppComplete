import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDAnSf1jxuIsExwUOi5UbiDgw_-6gBvnnM",
    authDomain: "moviesite-5ed22.firebaseapp.com",
    projectId: "moviesite-5ed22",
    storageBucket: "moviesite-5ed22.appspot.com",
    messagingSenderId: "77499893393",
    appId: "1:77499893393:web:bf4c68ebec47a0f4142130",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export {app, storage};
