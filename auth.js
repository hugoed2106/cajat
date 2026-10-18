import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJzSoPEMdaN1YPObBzRyONZrjunqRPw2Q",
  authDomain: "cajat-130425.firebaseapp.com",
  projectId: "cajat-130425",
  storageBucket: "cajat-130425.firebasestorage.app",
  messagingSenderId: "903216727900",
  appId: "1:903216727900:web:ccdd5eec3681df9c21a399",
};

// ["ari@gmail.com", "tucorreo@gmail.com"]
const ALLOWED_EMAILS = [];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "es";

const lockedScreen = document.getElementById("locked");
const unlockedScreen = document.getElementById("unlocked");
const notifBell = document.getElementById("notificaciones");
const googleBtn = document.getElementById("googleLoginBtn");
const authError = document.getElementById("authError");
const logoutBtn = document.getElementById("logoutBtn");

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

function showError(msg) {
  if (!authError) return;
  authError.textContent = msg;
  authError.style.display = msg ? "block" : "none";
}

function setLoading(isLoading) {
  if (googleBtn) googleBtn.disabled = isLoading;
}

function unlockPage() {
  lockedScreen?.classList.add("hidden");
  unlockedScreen?.classList.remove("hidden");
  notifBell?.classList.remove("hidden");
  logoutBtn?.classList.remove("hidden");
  showError("");
}

function lockPage() {
  lockedScreen?.classList.remove("hidden");
  unlockedScreen?.classList.add("hidden");
  notifBell?.classList.add("hidden");
  logoutBtn?.classList.add("hidden");
}

function isAllowed(user) {
  if (ALLOWED_EMAILS.length === 0) return true;
  const email = (user?.email || "").toLowerCase();
  return ALLOWED_EMAILS.map((e) => e.toLowerCase()).includes(email);
}

function friendlyError(err) {
  switch (err.code) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/popup-blocked":
      return "El navegador bloqueó la ventana. Permite los pop-ups e inténtalo de nuevo.";
    case "auth/unauthorized-domain":
      return "Este dominio no está autorizado en Firebase (Authentication > Settings > Authorized domains).";
    case "auth/operation-not-allowed":
      return "Este método de acceso no está activado en Firebase.";
    case "auth/account-exists-with-different-credential":
      return "Ya existe una cuenta con ese correo usando otro método de acceso.";
    case "auth/network-request-failed":
      return "Error de red. Revisa tu conexión.";
    default:
      return "No se pudo iniciar sesión. Inténtalo de nuevo.";
  }
}

async function login(provider) {
  showError("");
  setLoading(true);
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    if (err.code === "auth/popup-blocked") {
      try {
        await signInWithRedirect(auth, provider);
        return;
      } catch (e) {
        err = e;
      }
    }
    console.error("Auth error:", err);
    showError(friendlyError(err));
  } finally {
    setLoading(false);
  }
}

googleBtn?.addEventListener("click", () => login(googleProvider));
logoutBtn?.addEventListener("click", () => signOut(auth));

getRedirectResult(auth).catch((err) => {
  console.error("Redirect error:", err);
  showError(friendlyError(err));
});

onAuthStateChanged(auth, async (user) => {
  if (user && isAllowed(user)) {
    unlockPage();
  } else {
    if (user && !isAllowed(user)) {
      showError("Esta cuenta no tiene acceso a la página.");
      await signOut(auth);
    }
    if (localStorage.getItem("YA130425-unlocked-v1") !== "1") {
      lockPage();
    }
  }
});