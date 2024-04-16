import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
  
  const firebaseConfig = {
    apiKey: "AIzaSyAczBzL80MoEe8qm91CCHHxX-_8iAla-S8",
    authDomain: "service-city-app.firebaseapp.com",
    projectId: "service-city-app",
    storageBucket: "service-city-app.appspot.com",
    messagingSenderId: "1068099519430",
    appId: "1:1068099519430:web:a896e65c893c36d833a8c7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  auth.languageCode = 'es'
  const provider = new GoogleAuthProvider();

  // Google Login
  const googleLogin = document.getElementById("google-login-btn");
  googleLogin.addEventListener("click", function(){
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      console.log(user);
      window.location.href = "home.html";
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  })

  // Google SignOut
  const logoutButton = document.getElementById('logout-btn');
  logoutButton.addEventListener('click', function() {
      firebase.auth().signOut().then(function() {
          var auth2 = gapi.auth2.getAuthInstance();
          auth2.signOut().then(function () {
              console.log('Sesión de Google cerrada exitosamente');
              window.location.href = 'index.html';
          });
      }).catch(function(error) {
          console.error('Error al cerrar sesión:', error);
      });
  });

  // Inicialize Google API Client
  function initGoogleAPI() {
      gapi.load('auth2', function() {
          gapi.auth2.init({
              client_id: '1068099519430-jot881noq4m0n327e4olnn9drofp2i4v.apps.googleusercontent.com'
          });
      });
  }

  // Llamar a initGoogleAPI cuando se carga la página
  window.onload = initGoogleAPI;




























