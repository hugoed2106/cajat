const logo = document.getElementById('logo');
// Precargar font-family del logo
if (logo) {
    const computedStyle = window.getComputedStyle(logo);
    const fontFamily = computedStyle.fontFamily;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = fontFamily;
    document.head.appendChild(link);
}

const themeBtn = document.getElementById('themeToggle');

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        themeBtn.innerHTML = '<div class="icono-sol"> <div class="centro"></div> <div class="rayo r1"></div> <div class="rayo r2"></div> <div class="rayo r3"></div> <div class="rayo r4"></div></div>';
    } else {
        themeBtn.innerHTML = '<div class="luna-creciente"></div>';
    }
});

(function () {
    const pass = "2"; // Cambia aquí la contraseña si lo deseas
    const PASSWORD = pass;
    const STORAGE_KEY = "YA130425-unlocked-v1";

    const lockedScreen = document.getElementById("locked");
    const unlockedScreen = document.getElementById('unlocked');
    const footer = document.getElementById('footer');
    const form = document.getElementById("passForm");
    const input = document.getElementById("passInput");
    const err = document.getElementById("passError");
    const remember = document.getElementById("remember");
    const rememberDiv = document.getElementById("remember-div");
    const clearBtn = document.getElementById("clearBtn");

    // Si ya está autorizado, ocultar la pantalla de bloqueo
    if (localStorage.getItem(STORAGE_KEY) === "1") {
        lockedScreen.classList.add("hidden");
    } else {
        unlockedScreen.classList.add('hidden');
        footer.classList.add('hidden');
        rememberDiv.classList.add('hidden');
    }
    
    function unlockPage() {
        if (remember.checked) localStorage.setItem(STORAGE_KEY, "1");
        lockedScreen.classList.add("hidden");
        err.style.display = "none";
        unlockedScreen.classList.remove('hidden');
        footer.classList.remove('hidden');
        footer.classList.add('start-footer')
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const val = (input.value || "").trim();
        const isPasswordCorrect = PASSWORD === "" ? val === "" : val === PASSWORD;

        if (isPasswordCorrect) {
            unlockPage();
        } else {
            err.style.display = "block";
            input.value = "";
            input.focus();
        }
    });

    clearBtn.addEventListener("click", function () {
        input.value = "";
        err.style.display = "none";
        input.focus();
    });

    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            form.requestSubmit();
        }
    });

    document.addEventListener("keydown", function(e) {
        if (e.ctrlKey && (e.key === "y" || e.key === "Y")) {
            if(!unlockPage()) {
                unlockPage();
            } else {
                //recargar la pagina
                location.reload();
            }
        }
    });
})();

function bh () {
    const box0 = document.getElementById('box0');
    const bHome = document.getElementById('home-box');

    if (!box0.style.contains('active')) {
        bHome.style.add('active')
        bHome.style.remove('inactive')
    } else {
        bHome.style.add('inactive')
        bHome.style.remove('active')
    }
}

// --- Lógica de la Lista de Opciones Dinámica (Línea de Tiempo) ---
const optionButtons = document.querySelectorAll('.option-btn');
const dynamicBoxes = document.querySelectorAll('.dynamic-content-box');
const footer = document.getElementById('footer');

optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        // 1. Apagar todos los botones y ocultar todas las cajas
        optionButtons.forEach(btn => btn.classList.remove('active'));
        dynamicBoxes.forEach(box => {
            box.classList.remove('active');
            box.classList.add('inactive');
            footer.classList.remove('start-footer')
        });

        // 2. Encender el botón que el usuario clickeó
        if (button.classList.contains('active')) {
            button.classList.remove('active');
            button.classList.add('inactive');
        } else {
            button.classList.add('active');
            button.classList.remove('inactive');
        }
        

        // 3. Mostrar la caja que corresponde a ese botón
        const targetId = button.getAttribute('data-target');
        const targetBox = document.getElementById(targetId);
        
        if (targetBox.classList.contains('active')) {
            targetBox.classList.remove('active');
            targetBox.classList.add('inactive');
        } else {
            targetBox.classList.add('active');
            targetBox.classList.remove('inactive');
        }
    });
});