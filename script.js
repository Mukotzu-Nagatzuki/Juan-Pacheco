// Inicializar partículas
document.addEventListener('DOMContentLoaded', function() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#3b82f6" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#0ea5e9",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true
            }
        },
        retina_detect: true
    });

    // ----------------------
    // Navegación entre páginas
    // ----------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');

            // Ocultar todas las páginas
            pages.forEach(page => {
                page.classList.remove('active');
            });

            // Mostrar la página objetivo
            document.getElementById(targetPage).classList.add('active');

            // Si es la página de actividades, cargar las actividades
            if (targetPage === 'activities') {
                loadActivities();
            }

            // Scroll to top
            window.scrollTo(0, 0);
        });
    });

    // ----------------------
    // Efecto de escritura
    // ----------------------
    const typedTextSpan = document.querySelector('.typed-text');
    const textArray = ['Nakazu', 'Programador', 'Desarrollador', 'Full Stack'];
    let textArrayIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = textArray[textArrayIndex];

        if (isDeleting) {
            typedTextSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type(); // Iniciar el efecto de escritura

    // ----------------------
    // Animar barras de habilidades
    // ----------------------
    function animateSkills() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }

    const skillsPage = document.getElementById('skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, { threshold: 0.1 });

    observer.observe(skillsPage);

    // ----------------------
    // Sistema de actividades
    // ----------------------
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const addActivityForm = document.getElementById('add-activity-form');
    const activitiesList = document.getElementById('activities-list');
    const logoutBtn = document.getElementById('logout-btn');

    const ADMIN_USER = "nakazu";
    const ADMIN_PASS = "nakazu";

    const baseActividades = [
        { title: "Ejemplo PDF", description: "PDF inicial", archivo: "ejemplo.pdf", date: "2025-09-16" }
    ];

    // Traer guardadas de localStorage
    function getActividades() {
        let guardadas = JSON.parse(localStorage.getItem("actividades")) || [];
        return [...baseActividades, ...guardadas];
    }

    // Guardar en localStorage
    function saveActividad(act) {
        let guardadas = JSON.parse(localStorage.getItem("actividades")) || [];
        guardadas.push(act);
        localStorage.setItem("actividades", JSON.stringify(guardadas));
    }

    // Mostrar panel admin si ya está logueado
    if (localStorage.getItem('loggedIn') === 'true') {
        showAdminPanel();
    }

    // Manejar login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            localStorage.setItem('loggedIn', 'true');
            showAdminPanel();
            showMessage('Inicio de sesión exitoso', 'success');
        } else {
            showMessage('Usuario o contraseña incorrectos', 'error');
        }
    });

    function showAdminPanel() {
        loginContainer.style.display = 'none';
        adminPanel.style.display = 'block';
        logoutBtn.style.display = 'inline-block';
    }

    // Cerrar sesión
    window.logout = function() {
        localStorage.removeItem('loggedIn');
        adminPanel.style.display = 'none';
        loginContainer.style.display = 'block';
        logoutBtn.style.display = 'none';
        showMessage('Sesión cerrada correctamente', 'success');
    };

    // Mostrar actividades
    function loadActivities() {
        activitiesList.innerHTML = '';

        let actividades = getActividades();

        if (actividades.length === 0) {
            activitiesList.innerHTML = '<p>No hay actividades aún.</p>';
            return;
        }

        actividades.forEach((activity, index) => {
            const activityCard = document.createElement('div');
            activityCard.className = 'activity-card';

            const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

            activityCard.innerHTML = `
                <h3>${activity.title}</h3>
                <p>${activity.description}</p>
                <div class="activity-date">${activity.date}</div>
                
                <div>
                    <strong>Archivo:</strong> 
                    <a class="btn-ver" href="archivos/${activity.archivo}" target="_blank">Ver</a>
                    <a class="btn-descargar" href="archivos/${activity.archivo}" download>Descargar</a>
                </div>
                
                ${isLoggedIn ? `
                    <div class="activity-actions">
                        <button class="btn btn-small" onclick="deleteActivity(${index - baseActividades.length})">Eliminar</button>
                    </div>
                ` : ''}
            `;

            activitiesList.appendChild(activityCard);
        });
    }

    // Agregar nueva actividad (solo guarda nombre del archivo)
    addActivityForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('activity-title').value;
        const description = document.getElementById('activity-description').value;
        const fileName = document.getElementById('activity-file').value;

        if (!title || !fileName) {
            showMessage('Debes escribir un título y el nombre exacto del archivo en /archivos/', 'error');
            return;
        }

        const newActivity = {
            title,
            description,
            archivo: fileName,
            date: new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        saveActividad(newActivity);
        addActivityForm.reset();
        loadActivities();
        showMessage('Actividad agregada correctamente (recuerda subir el archivo a /archivos/)', 'success');
    });

    // Eliminar actividad
    window.deleteActivity = function(index) {
        let guardadas = JSON.parse(localStorage.getItem("actividades")) || [];
        guardadas.splice(index, 1);
        localStorage.setItem("actividades", JSON.stringify(guardadas));
        loadActivities();
        showMessage('Actividad eliminada', 'success');
    };

    // Mostrar mensajes
    function showMessage(text, type) {
        let messageEl = document.getElementById('activities-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'activities-message';
            document.getElementById('activities').insertBefore(messageEl, activitiesList);
        }

        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';

        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 3000);
    }

    // Inicializar al cargar
    if (document.getElementById('activities').classList.contains('active')) {
        loadActivities();
    }
});
// Botón de cerrar sesión
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('loggedIn');
    location.reload();
});
