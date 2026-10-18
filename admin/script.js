import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJzSoPEMdaN1YPObBzRyONZrjunqRPw2Q",
  authDomain: "cajat-130425.firebaseapp.com",
  projectId: "cajat-130425",
  storageBucket: "cajat-130425.firebasestorage.app",
  messagingSenderId: "903216727900",
  appId: "1:903216727900:web:ccdd5eec3681df9c21a399",
};

// Único correo con acceso al panel.
// (La seguridad real está en las reglas de Firestore; esto solo controla la interfaz.)
const ADMIN_EMAIL = "hugo.ed2106@gmail.com";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "es";
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const $ = (id) => document.getElementById(id);
const loginScreen = $("login");
const panel = $("panel");
const googleBtn = $("googleLoginBtn");
const authError = $("authError");
const logoutBtn = $("logoutBtn");
const userEmail = $("userEmail");
const form = $("notifForm");
const tituloInput = $("titulo");
const mensajeInput = $("mensaje");
const count = $("count");
const sendBtn = $("sendBtn");
const formMsg = $("formMsg");
const list = $("list");
const empty = $("empty");

let unsubscribe = null;

function showError(msg) {
  authError.textContent = msg;
  authError.hidden = !msg;
}

function showFormMsg(msg, isError = false) {
  formMsg.textContent = msg;
  formMsg.className = isError ? "error" : "muted";
  formMsg.hidden = !msg;
}

function isAdmin(user) {
  return (user?.email || "").toLowerCase() === ADMIN_EMAIL.toLowerCase();
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
    case "auth/network-request-failed":
      return "Error de red. Revisa tu conexión.";
    default:
      return "No se pudo iniciar sesión. Inténtalo de nuevo.";
  }
}

function formatDate(ts) {
  if (!ts?.toDate) return "Guardando…";
  return ts.toDate().toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

function render(docs) {
  list.replaceChildren();
  empty.hidden = docs.length > 0;

  docs.forEach((d) => {
    const data = d.data();

    const li = document.createElement("li");
    li.className = "item";

    const body = document.createElement("div");
    if (data.titulo) {
      const title = document.createElement("strong");
      title.textContent = data.titulo;
      body.appendChild(title);
    }
    const msg = document.createElement("p");
    msg.textContent = data.mensaje;
    const date = document.createElement("small");
    date.textContent = formatDate(data.creada);
    body.append(msg, date);

    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn danger";
    del.textContent = "Eliminar";
    del.addEventListener("click", async () => {
      if (!confirm("¿Eliminar esta notificación?")) return;
      del.disabled = true;
      try {
        await deleteDoc(doc(db, "notificaciones", d.id));
      } catch (err) {
        console.error(err);
        del.disabled = false;
        alert("No se pudo eliminar. Revisa las reglas de Firestore.");
      }
    });

    li.append(body, del);
    list.appendChild(li);
  });
}

function startListening() {
  stopListening();
  const q = query(collection(db, "notificaciones"), orderBy("creada", "desc"));
  unsubscribe = onSnapshot(
    q,
    (snap) => render(snap.docs),
    (err) => {
      console.error("Firestore error:", err);
      showFormMsg("No se pudieron cargar las notificaciones (revisa las reglas de Firestore).", true);
    }
  );
}

function stopListening() {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
}

googleBtn.addEventListener("click", async () => {
  showError("");
  googleBtn.disabled = true;
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Auth error:", err);
    showError(friendlyError(err));
  } finally {
    googleBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));

mensajeInput.addEventListener("input", () => {
  count.textContent = mensajeInput.value.length;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const mensaje = mensajeInput.value.trim();
  const titulo = tituloInput.value.trim();
  if (!mensaje) return;

  sendBtn.disabled = true;
  showFormMsg("");
  try {
    await addDoc(collection(db, "notificaciones"), {
      titulo,
      mensaje,
      creada: serverTimestamp(),
    });
    form.reset();
    count.textContent = "0";
    showFormMsg("Notificación publicada ✔");
  } catch (err) {
    console.error(err);
    showFormMsg("No se pudo publicar. Revisa las reglas de Firestore.", true);
  } finally {
    sendBtn.disabled = false;
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user && isAdmin(user)) {
    loginScreen.classList.add("hidden");
    panel.classList.remove("hidden");
    userEmail.textContent = user.email;
    startListening();
    return;
  }

  stopListening();
  panel.classList.add("hidden");
  loginScreen.classList.remove("hidden");

  if (user) {
    showError("Esta cuenta no tiene acceso al panel de administración.");
    await signOut(auth);
  }
});
