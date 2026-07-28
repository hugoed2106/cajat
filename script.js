const logo = document.getElementById('logo')

if (logo) {
    logo.style.visibility = 'hidden';
    if (document.fonts && document.fonts.load) {
        document.fonts.load('1em "Logo"').then(() => {
            logo.style.visibility = 'visible';
        }).catch(() => {
            logo.style.visibility = 'visible';
        });
    } else {
        window.addEventListener('load', () => {
            logo.style.visibility = 'visible';
        });
    }
}

//Bloque y Desbloqueo de la página
(function () {
    const pass = "130425";
    const PASSWORD = pass;
    const STORAGE_KEY = "YA130425-unlocked-v1";

    const lockedScreen = document.getElementById("locked");
    const unlockedScreen = document.getElementById('unlocked');
    const form = document.getElementById("passForm");
    const input = document.getElementById("passInput");
    const err = document.getElementById("passError");
    const remember = document.getElementById("remember");
    const rememberDiv = document.getElementById("remember-div");
    const clearBtn = document.getElementById("clearBtn");
    const not = document.getElementById("notificaciones")

    if (localStorage.getItem(STORAGE_KEY) === "1") {
        lockedScreen.classList.add("hidden");
        unlockedScreen.classList.remove("hidden")
    } else {
        rememberDiv.classList.add('hidden');
    }
    
    function unlockPage() {
        if (remember.checked) localStorage.setItem(STORAGE_KEY, "1");
        lockedScreen.classList.add("hidden");
        err.style.display = "none";
        unlockedScreen.classList.remove('hidden');
        not.classList.remove('hidden');
    }

    function lockPage() {
        lockedScreen.classList.remove("hidden");
        err.style.display = "none";
        unlockedScreen.classList.add('hidden');
        not.classList.add('hidden');
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
        if (e.ctrlKey && (e.key === "y" || e.key === "Y") || e.shiftKey && (e.key === "y" || e.key === "Y")) {
            if(!unlockPage()) {
                unlockPage();
            } else {
                lockPage();
            }
        }
    });
})();

// Notis
(function () {
    const not = document.getElementById('notificaciones');
    const notifies = document.getElementById('not-div');
    const close = document.getElementById('close')
    const empty = document.getElementById('no-hay');

    function closeNotis() {
        if (!notifies.classList.contains('hidden')) {
            notifies.classList.add('hidden');
        } 
    }

    function abrirCerrarNotis() {
        if (notifies.classList.contains('hidden')) {
            notifies.classList.remove('hidden');
        } else {
            notifies.classList.add('hidden')
        }
    }

    not.addEventListener('click', () => {
        abrirCerrarNotis();
    })

    close.addEventListener('click', () => {
        closeNotis();
    })

    document.addEventListener('keydown', function (e) {
        if (e.shiftKey && (e.key === "n" || e.key === "N")) {
            abrirCerrarNotis();
        }
    })
})();

//Alternar tema de la página
(function () {
    const themeBtn = document.getElementById('themeToggle');

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            themeBtn.innerHTML = '<div class="icono-sol"> <div class="centro"></div> <div class="rayo r1"></div> <div class="rayo r2"></div> <div class="rayo r3"></div> <div class="rayo r4"></div></div>';
        } else {
            themeBtn.innerHTML = '<div class="luna-creciente"></div>';
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.shiftKey && (e.key === "t" || e.key === "T")) {
            document.body.classList.toggle('dark-mode');

            if (document.body.classList.contains('dark-mode')) {
                themeBtn.innerHTML = '<div class="icono-sol"> <div class="centro"></div> <div class="rayo r1"></div> <div class="rayo r2"></div> <div class="rayo r3"></div> <div class="rayo r4"></div></div>';
            } else {
                themeBtn.innerHTML = '<div class="luna-creciente"></div>';
            }
        }
    })
})();


//Galería de Cartas
(function () {
    const carta1 = document.getElementById('carta1');
    const carta2 = document.getElementById('carta2');

    function mostrarOcultar() {
        if (!carta1.classList.contains('hidden')) {
            carta1.classList.add('hidden');
            carta2.classList.remove('hidden');
        } else {
            carta1.classList.remove('hidden');
            carta2.classList.add('hidden');
        }
    }

    carta1.addEventListener('click', () => {
        mostrarOcultar();
    });

    carta2.addEventListener('click', () => {
        mostrarOcultar();
    });

    document.addEventListener('keydown', function (e) {
        if (e.shiftKey && (e.key === "c" || e.key === "C")){
            mostrarOcultar();
        }
    }
)
})();

//Galería de Regalo
(function () {
    const r1 = document.getElementById('regalo1');
    const r2 = document.getElementById('regalo2');
    const r3 = document.getElementById('regalo3')

    function mostrarOcultar() {
        if (!r1.classList.contains('hidden')) {
            r1.classList.add('hidden');
            r2.classList.remove('hidden');
        } else {
            if (!r2.classList.contains('hidden')) {
                r2.classList.add('hidden');
                r3.classList.remove('hidden');
            } else {
                r1.classList.remove('hidden');
                r2.classList.add('hidden');
                r3.classList.add('hidden');
            }
        }
    }

    r1.addEventListener('click', () => {
        mostrarOcultar();
    });

    r2.addEventListener('click', () => {
        mostrarOcultar();
    });

    r3.addEventListener('click', () => {
        mostrarOcultar();
    });

    document.addEventListener('keydown', function (e) {
        if (e.shiftKey && (e.key === "f" || e.key === "F")){
            mostrarOcultar();
        }
    }
)
})();

//Línea del Tiempo
const optionButtons = document.querySelectorAll('.option-btn');
const dynamicBoxes = document.querySelectorAll('.dynamic-content-box');

optionButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        optionButtons.forEach(btn => btn.classList.remove('active'));
        dynamicBoxes.forEach(box => {
            box.classList.remove('active');
            box.classList.add('inactive');
        });

        if (button.classList.contains('active')) {
            button.classList.remove('active');
            button.classList.add('inactive');
        } else {
            button.classList.add('active');
            button.classList.remove('inactive');
        }
        
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

//BUSCADOR
const searchInput = document.getElementById('search');
const searchResults = document.getElementById('searchResults');
const box0 = document.getElementById('box0');
const bHome = document.getElementById('home-box');

if (searchInput && searchResults) {

    const timelineBoxes = Array.from(
        document.querySelectorAll('#timeline-boxes .dynamic-content-box')
    );

    function openBox(boxId) {
        dynamicBoxes.forEach(box => {
            box.classList.remove('active');
            box.classList.add('inactive');
        });
        
        const targetBox = document.getElementById(boxId);
        if (targetBox) {
            targetBox.classList.add('active');
            targetBox.classList.remove('inactive');
        }
        
        optionButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.classList.add('inactive');

            if (btn.dataset.target === boxId) {
                btn.classList.add('active');
                btn.classList.remove('inactive');
            }
        });

        footer.classList.remove('start-footer');
    }

    function renderResults(matches) {
        searchResults.innerHTML = '';

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="search-empty">Sin resultados</div>';
            searchResults.style.display = 'block';
            return;
        }

        matches.forEach(box => {
            const title = box.querySelector('h1.date')?.textContent?.trim() || box.id;

            const text = box.querySelector('.large-box')?.textContent?.trim()
                || box.textContent.trim();

            const preview = text.length > 110
                ? text.slice(0, 110) + '…'
                : text;

            const item = document.createElement('div');
            item.className = 'search-item';
            item.innerHTML = `
                <div class="search-item-title">${title}</div>
                <div class="search-item-preview">${preview}</div>
            `;

            item.addEventListener('click', () => {
                openBox(box.id);
                searchInput.value = '';
                searchResults.style.display = 'none';
            });

            searchResults.appendChild(item);
        });

        searchResults.style.display = 'block';
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();

        if (!query) {
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
            return;
        }

        const matches = timelineBoxes.filter(box =>
            box.id !== 'box0' && box.textContent.toLowerCase().includes(query)
        );

        renderResults(matches);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            const first = searchResults.querySelector('.search-item');
            if (first) first.click();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrapper')) {
            searchResults.style.display = 'none';
            searchInput.value = '';
        }
    });
}