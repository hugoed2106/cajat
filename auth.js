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
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJzSoPEMdaN1YPObBzRyONZrjunqRPw2Q",
  authDomain: "cajat-130425.firebaseapp.com",
  projectId: "cajat-130425",
  storageBucket: "cajat-130425.firebasestorage.app",
  messagingSenderId: "903216727900",
  appId: "1:903216727900:web:ccdd5eec3681df9c21a399",
};

// ["ari@gmail.com", "tucorreo@gmail.com"]
const ALLOWED_EMAILS = ["hugo.ed2106@gmail.com", "buclonyeseli@icloud.com"];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "es";
const db = getFirestore(app);

const lockedScreen = document.getElementById("locked");
const unlockedScreen = document.getElementById("unlocked");
const notifBell = document.getElementById("notificaciones");
const googleBtn = document.getElementById("googleLoginBtn");
const authError = document.getElementById("authError");
const logoutBtn = document.getElementById("logoutBtn");
const notifList = document.getElementById("notif-list");
const notifEmpty = document.getElementById("no-hay");

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

// ---- Notificaciones (las publica el panel /admin) ----
let unsubNotifs = null;

function renderNotifs(docs) {
  if (!notifList) return;
  notifList.replaceChildren();
  notifEmpty?.classList.toggle("hidden", docs.length > 0);

  docs.forEach((d) => {
    const data = d.data();
    const item = document.createElement("article");
    item.className = "notif-item";

    if (data.titulo) {
      const title = document.createElement("strong");
      title.textContent = data.titulo;
      item.appendChild(title);
    }

    const msg = document.createElement("p");
    msg.textContent = data.mensaje;
    item.appendChild(msg);

    if (data.creada?.toDate) {
      const date = document.createElement("small");
      date.textContent = data.creada
        .toDate()
        .toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
      item.appendChild(date);
    }

    notifList.appendChild(item);
  });
}

function startNotifications() {
  if (unsubNotifs || !notifList) return;
  const q = query(collection(db, "notificaciones"), orderBy("creada", "desc"));
  unsubNotifs = onSnapshot(
    q,
    (snap) => renderNotifs(snap.docs),
    (err) => console.error("Notificaciones:", err)
  );
}

function stopNotifications() {
  if (unsubNotifs) unsubNotifs();
  unsubNotifs = null;
  renderNotifs([]);
}

function unlockPage() {
  lockedScreen?.classList.add("hidden");
  unlockedScreen?.classList.remove("hidden");
  notifBell?.classList.remove("hidden");
  logoutBtn?.classList.remove("hidden");
  startNotifications();
  showError("");
}

function lockPage() {
  lockedScreen?.classList.remove("hidden");
  unlockedScreen?.classList.add("hidden");
  notifBell?.classList.add("hidden");
  logoutBtn?.classList.add("hidden");
  stopNotifications();
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