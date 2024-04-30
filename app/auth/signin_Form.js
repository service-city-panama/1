import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from '../Environments/firebase-auth.js';
import { showMessage } from '../utils/showMessage.js';

const signInForm = document.querySelector('#signInForm');

signInForm.addEventListener('submit', async e => {
  e.preventDefault();

  const email = signInForm['signInEmail'].value;
  const password = signInForm['signInPassword'].value;

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    console.log(credential)
    window.location.href = "app/pages/home/index.html";

    const modal = bootstrap.modal.getInstance(document.querySelector('#loginModal'))
    modal.hide()

    showMessage(credential.user.email + ' ¡Bienvenido!')

  } catch (error) {
    if (error.code === "auth/wrong-password") {
      showMessage("¡Contraseña incorrecta", "error");
    } else if (error.code === "auth/user-not-found") {
      showMessage("¡Usuario no encontrado!", "error");
    } else {
      showMessage(error.message, "error");
    }
  }
});


