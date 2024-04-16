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
  // Google Logout
  const logout = document.getElementById("logout-btn");

googleLogin.addEventListener("click", function(){
  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    window.location.href = "https://service-city-panama.github.io/APP/home.html";
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
})

logout.addEventListener("click", function(){
  signOut(auth).then(() => {
    // Cierre de sesión exitoso.
    window.location.href = "https://service-city-panama.github.io/APP/index.html"; // Redirigir a la página de inicio de sesión después del cierre de sesión
  }).catch((error) => {
    // Se produjo un error al cerrar sesión.
    console.error("Error al cerrar sesión:", error);
  });
});
