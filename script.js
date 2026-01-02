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

            pages.forEach(page => {
                page.classList.remove('active');
            });

            document.getElementById(targetPage).classList.add('active');

            if (targetPage === 'activities') {
                loadActivities();
            }
            
            if (targetPage === 'admin') {
                checkAdminStatus();
            }

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

    type();

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
    // SISTEMA DE ACTIVIDADES AUTOMÁTICO
    // ----------------------
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const addActivityForm = document.getElementById('add-activity-form');
    const activitiesList = document.getElementById('activities-list');
    const adminActivitiesList = document.getElementById('admin-activities-list');
    const logoutBtn = document.getElementById('logout-btn');

    const ADMIN_USER = "nakazu";
    const ADMIN_PASS = "nakazu";

    // Actividades base
    const baseActividades = [
        { 
            title: "Ejemplo PDF", 
            description: "PDF inicial de ejemplo", 
            archivo: "ejemplo.pdf", 
            date: "2025-09-16" 
        }
    ];

    // Función para obtener la URL del archivo
    function getFileUrl(filename) {
        if (!filename || filename === 'sin-archivo.pdf') return null;
        
        const repoName = window.location.pathname.split('/')[1] || '';
        let baseUrl = window.location.origin;
        if (repoName) baseUrl += '/' + repoName;
        return `${baseUrl}/${filename}`;
    }

    // Cargar actividades desde JSON en GitHub
    async function loadActivitiesFromJSON() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/mukotzu-nagatzuki/Juan-Pacheco/main/actividades.json?nocache=' + new Date().getTime());
            const data = await response.json();
            return data.actividades || [];
        } catch (error) {
            console.log('No se pudo cargar actividades.json desde GitHub, usando localStorage');
            return JSON.parse(localStorage.getItem('actividades')) || [];
        }
    }


    // Guardar actividades en JSON (simulado - se guarda en localStorage)
    async function saveActivities(actividades) {
        // En un sistema real, aquí harías un fetch para guardar en GitHub
        // Por ahora usamos localStorage como simulacro
        localStorage.setItem('actividades', JSON.stringify(actividades));
        
        // Mostrar instrucciones para guardar manualmente en GitHub
        showMessage(
            'Actividad guardada localmente. Para hacerla permanente, copia este JSON y pégalo en actividades.json en GitHub:', 
            'info', 
            'login-message'
        );
        
        // Mostrar el JSON para copiar manualmente
        console.log('JSON para copiar en actividades.json:', JSON.stringify({actividades}, null, 2));
    }

    // Verificar estado de administrador
    function checkAdminStatus() {
        if (localStorage.getItem('loggedIn') === 'true') {
            showAdminPanel();
        } else {
            showLoginForm();
        }
    }

    // Manejar login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === ADMIN_USER && password === ADMIN_PASS) {
                localStorage.setItem('loggedIn', 'true');
                showAdminPanel();
                showMessage('Inicio de sesión exitoso', 'success', 'login-message');
            } else {
                showMessage('Usuario o contraseña incorrectos', 'error', 'login-message');
            }
        });
    }

    function showAdminPanel() {
        if (loginContainer) loginContainer.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        loadAdminActivities();
    }

    function showLoginForm() {
        if (loginContainer) loginContainer.style.display = 'block';
        if (adminPanel) adminPanel.style.display = 'none';
    }

    // Cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedIn');
            showLoginForm();
            showMessage('Sesión cerrada correctamente', 'success', 'login-message');
        });
    }

    // Mostrar actividades
    async function loadActivities() {
        if (!activitiesList) return;
        
        activitiesList.innerHTML = '';

        const actividadesGuardadas = await loadActivitiesFromJSON();
        const todasActividades = [...baseActividades, ...actividadesGuardadas];

        if (todasActividades.length === 0) {
            activitiesList.innerHTML = '<p class="no-activities">No hay actividades disponibles.</p>';
            return;
        }

        todasActividades.forEach((activity) => {
            const fileUrl = getFileUrl(activity.archivo);
            const hasFile = fileUrl && activity.archivo !== 'sin-archivo.pdf';
            
            const activityCard = document.createElement('div');
            activityCard.className = 'activity-card';
            
            activityCard.innerHTML = `
                <div class="activity-header">
                    <h3>${activity.title}</h3>
                    <span class="activity-date">${activity.date}</span>
                </div>
                <p class="activity-description">${activity.description}</p>
                <div class="activity-file">
                    ${hasFile ? `
                        <strong>Archivo:</strong> 
                        <div class="file-actions">
                            <a class="btn-ver" href="${fileUrl}" target="_blank">
                                <i class="fas fa-eye"></i> Ver
                            </a>
                            <a class="btn-descargar" href="${fileUrl}" download="${activity.title}.pdf">
                                <i class="fas fa-download"></i> Descargar
                            </a>
                        </div>
                    ` : '<span class="no-file">Sin archivo adjunto</span>'}
                </div>
            `;

            activitiesList.appendChild(activityCard);
        });
    }

    // Mostrar actividades en admin
    async function loadAdminActivities() {
        if (!adminActivitiesList) return;
        
        adminActivitiesList.innerHTML = '';

        const actividadesGuardadas = await loadActivitiesFromJSON();
        const todasActividades = [...baseActividades, ...actividadesGuardadas];

        if (todasActividades.length === 0) {
            adminActivitiesList.innerHTML = '<p class="no-activities">No hay actividades para gestionar.</p>';
            return;
        }

        todasActividades.forEach((activity, index) => {
            const isBaseActivity = index < baseActividades.length;
            const fileUrl = getFileUrl(activity.archivo);
            const hasFile = fileUrl && activity.archivo !== 'sin-archivo.pdf';
            
            const activityCard = document.createElement('div');
            activityCard.className = 'activity-card admin-activity';

            activityCard.innerHTML = `
                <div class="activity-header">
                    <h3>${activity.title}</h3>
                    <span class="activity-date">${activity.date}</span>
                </div>
                <p class="activity-description">${activity.description}</p>
                <div class="activity-file">
                    ${hasFile ? `
                        <strong>Archivo:</strong> 
                        <span class="file-name">${activity.archivo}</span>
                        <div class="file-actions">
                            <a class="btn-ver" href="${fileUrl}" target="_blank">
                                <i class="fas fa-eye"></i> Ver
                            </a>
                            <a class="btn-descargar" href="${fileUrl}" download="${activity.title}.pdf">
                                <i class="fas fa-download"></i> Descargar
                            </a>
                        </div>
                    ` : '<span class="no-file">Sin archivo adjunto</span>'}
                </div>
                ${!isBaseActivity ? `
                    <div class="activity-actions">
                        <button class="btn btn-small btn-danger" onclick="deleteActivity(${index - baseActividades.length})">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                ` : '<p class="base-activity-notice"><em>Actividad base</em></p>'}
            `;

            adminActivitiesList.appendChild(activityCard);
        });
    }

    // Agregar nueva actividad
    if (addActivityForm) {
        addActivityForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const title = document.getElementById('activity-title').value.trim();
            const description = document.getElementById('activity-description').value.trim();
            let fileName = document.getElementById('activity-file').value.trim();

            if (!title || !description) {
                showMessage('Completa título y descripción', 'error', 'login-message');
                return;
            }

            if (fileName && !fileName.toLowerCase().endsWith('.pdf')) {
                fileName += '.pdf';
            }

            const newActivity = {
                title,
                description,
                archivo: fileName || 'sin-archivo.pdf',
                date: new Date().toLocaleDateString('es-ES')
            };

            // Guardar la nueva actividad
            const actividadesGuardadas = await loadActivitiesFromJSON();
            actividadesGuardadas.push(newActivity);
            await saveActivities(actividadesGuardadas);

            addActivityForm.reset();
            loadAdminActivities();
        });
    }

    // Eliminar actividad
    window.deleteActivity = async function(index) {
        if (confirm('¿Eliminar esta actividad?')) {
            const actividadesGuardadas = await loadActivitiesFromJSON();
            actividadesGuardadas.splice(index, 1);
            await saveActivities(actividadesGuardadas);
            loadAdminActivities();
            showMessage('Actividad eliminada', 'success', 'login-message');
        }
    };

    // Mostrar mensajes
    function showMessage(text, type, elementId = 'activities-message') {
        let messageEl = document.getElementById(elementId);
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = elementId;
            document.getElementById('admin').insertBefore(messageEl, adminPanel);
        }

        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';

        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }

    // Inicializar
    if (document.getElementById('activities').classList.contains('active')) {
        loadActivities();
    }
    
    if (document.getElementById('admin').classList.contains('active')) {
        checkAdminStatus();
    }
});
