import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
  
  const firebaseConfig = {
    apiKey: "AIzaSyDLuhSOPVVJMXfmeA_wYw9vdAOPWouJRfM",
    authDomain: "proyecto-01-d6f6b.firebaseapp.com",
    projectId: "proyecto-01-d6f6b",
    storageBucket: "proyecto-01-d6f6b.appspot.com",
    messagingSenderId: "872409429461",
    appId: "1:872409429461:web:0196e8eed0c1dd8c36b95c"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const user = auth.currentUser;

function updateUserProfile(user) {
    const userName = user.displayName;
    const userEmail = user.email;
    const userProfilePicture = user.photoUrl;
    console.log(userEmail)

    // Update the profile section with user data
    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userProfilePicture").src = userProfilePicture;
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, call the updateUserProfile 
        updateUserProfile(user);
        const uid = user.uid;
        return uid;
    } else {
        // User is not signed in, redirect to the registration page
        alert("Create Account & login");
  
    }
});
