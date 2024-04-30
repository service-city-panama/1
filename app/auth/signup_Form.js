import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from "../Environments/firebase-auth.js";
import { showMessage } from '../utils/showMessage.js';

const signupForm = document.querySelector("#signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupForm["signupEmail"].value;
  const password = signupForm["signupPassword"].value;

  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Close the signup modal
    const signupModal = document.querySelector("#signupModal");
    const modal = bootstrap.Modal.getInstance(signupModal);
    modal.hide();

    showMessage(credential.user.email + " ¡Ha sido creado exitósamente!");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      showMessage(
        "¡Este correo ya está en uso!, intente iniciar sesión o crear otro distinto a este.",
        "error"
      );
    } else if (error.code === "auth/invalid-email") {
      showMessage(
        "¡Correo inválido!, verifique que esté bien escrito e intente nuevamente.",
        "error"
      );
    } else if (error.code === "auth/weak-password") {
      showMessage(
        "¡Esta contraseña es corta y/o insegura!, se recomienda tener 8 caracteres o más, de lo posible combíne letras minúscula con mayúscula y número.",
        "error"
      );
    } else if (error.code) {
      showMessage("¡Algo a salido mal!, no logro detectar el error.", "error");
    }
  }
});
