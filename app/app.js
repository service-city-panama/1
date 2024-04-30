import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { auth } from "./Environments/firebase-auth.js";
import { loginCheck } from "./auth/login_Check.js";

// Login
import "./auth/login_Google.js";
// import './auth/login_Check.js';
// import "./auth/logout.js";
import './auth/signin_Form.js';
import "./auth/signup_Form.js";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        loginCheck(user);
    } else {
    }
});
