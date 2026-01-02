// Inicialización de partículas y sistema completo
document.addEventListener('DOMContentLoaded', function() {
    // Configuración de partículas (combinada)
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
                straight: false,
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
            
            // Mostrar página objetivo
            document.getElementById(targetPage).classList.add('active');
            
            // Actualizar estado de login
            if (targetPage !== 'admin' && targetPage !== 'activities') {
                hideEditForm();
            }
            
            // Cargar contenido específico de la página
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
    // Texto animado en el inicio
    // ----------------------
    const typedTextSpan = document.querySelector('.typed-text');
    if (typedTextSpan) {
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
    }

    // ----------------------
    // Animar barras de habilidades
    // ----------------------
    function animateSkills() {
        const skillProgressBars = document.querySelectorAll('.skill-progress');
        skillProgressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }

    const skillsPage = document.getElementById('skills');
    if (skillsPage) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(skillsPage);
    }

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

    // Credenciales de administrador
    const ADMIN_CREDENTIALS = {
        username: 'nakazu',
        password: 'nakazu'
    };

    // Actividades base
    const BASE_ACTIVITIES = [
        { 
            title: "Ejemplo PDF", 
            description: "PDF inicial de ejemplo", 
            archivo: "ejemplo.pdf", 
            date: new Date().toLocaleDateString('es-ES'),
            file: "ejemplo.pdf"
        }
    ];

    // Función para obtener la URL del archivo
    function getFileUrl(filename) {
        if (!filename || filename === 'sin-archivo.pdf') return null;
        
        // Obtener el nombre del repositorio de la URL
        const repoName = window.location.pathname.split('/')[1] || '';
        let baseUrl = window.location.origin;
        if (repoName) baseUrl += '/' + repoName;
        
        // Si el archivo ya tiene URL completa, usarla
        if (filename.startsWith('http')) return filename;
        
        // Construir URL relativa
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
            return JSON.parse(localStorage.getItem('activities')) || [];
        }
    }

    // Guardar actividades (en localStorage para simulación)
    async function saveActivitiesToJSON(actividades) {
        // Guardar en localStorage como respaldo
        localStorage.setItem('activities', JSON.stringify(actividades));
        
        // Mostrar instrucciones para guardar manualmente en GitHub
        const jsonData = JSON.stringify({ actividades }, null, 2);
        console.log('JSON para copiar en actividades.json en GitHub:');
        console.log(jsonData);
        
        // Crear un elemento para mostrar el JSON
        showMessage(
            'Actividad guardada localmente. Para hacerla permanente, copia este JSON y pégalo en actividades.json en GitHub. Revisa la consola para ver los datos.',
            'info',
            'admin-message'
        );
        
        // También mostrar en un textarea para fácil copia
        const jsonTextarea = document.getElementById('json-output') || document.createElement('textarea');
        jsonTextarea.id = 'json-output';
        jsonTextarea.value = jsonData;
        jsonTextarea.style.width = '100%';
        jsonTextarea.style.height = '150px';
        jsonTextarea.style.marginTop = '10px';
        jsonTextarea.style.padding = '10px';
        jsonTextarea.style.fontFamily = 'monospace';
        jsonTextarea.style.fontSize = '12px';
        
        const adminContainer = document.getElementById('admin');
        if (adminContainer && !document.getElementById('json-output')) {
            adminContainer.appendChild(jsonTextarea);
        }
    }

    // Función para obtener todas las actividades
    async function getActivitiesFromStorage() {
        const actividadesGuardadas = await loadActivitiesFromJSON();
        return [...BASE_ACTIVITIES, ...actividadesGuardadas];
    }

    // ----------------------
    // Sistema de Login
    // ----------------------
    function checkAdminStatus() {
        if (localStorage.getItem('adminLoggedIn') === 'true') {
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
            
            const loginMessage = document.getElementById('login-message');
            
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                // Login exitoso
                localStorage.setItem('adminLoggedIn', 'true');
                showAdminPanel();
                showMessage('Inicio de sesión exitoso', 'success', 'login-message');
                loginForm.reset();
            } else {
                // Login fallido
                showMessage('Usuario o contraseña incorrectos', 'error', 'login-message');
            }
        });
    }

    // Manejar logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            showLoginForm();
            hideEditForm();
            showMessage('Sesión cerrada correctamente', 'success', 'login-message');
        });
    }

    // Función para mostrar el panel de administración
    async function showAdminPanel() {
        if (loginContainer) loginContainer.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'block';
        
        // Cargar actividades en el panel de admin
        await loadAdminActivities();
    }

    // Función para mostrar el formulario de login
    function showLoginForm() {
        if (loginContainer) loginContainer.style.display = 'block';
        if (adminPanel) adminPanel.style.display = 'none';
        hideEditForm();
    }

    // ----------------------
    // Manejo de Actividades
    // ----------------------
    async function loadActivities() {
        if (!activitiesList) return;
        
        activitiesList.innerHTML = '';
        
        const todasActividades = await getActivitiesFromStorage();
        
        if (todasActividades.length === 0) {
            activitiesList.innerHTML = '<p class="no-activities">No hay actividades disponibles.</p>';
            return;
        }
        
        todasActividades.forEach(activity => {
            const fileUrl = getFileUrl(activity.archivo || activity.file);
            const hasFile = fileUrl && (activity.archivo !== 'sin-archivo.pdf' && activity.file !== 'sin-archivo.pdf');
            
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            
            let fileHTML = '';
            if (hasFile) {
                fileHTML = `
                    <div class="activity-file">
                        <a href="${fileUrl}" target="_blank" class="btn-view btn-ver">
                            <i class="fas fa-eye"></i> Ver
                        </a>
                        <a href="${fileUrl}" download="${activity.title}.pdf" class="btn-download btn-descargar">
                            <i class="fas fa-download"></i> Descargar
                        </a>
                    </div>
                `;
            } else {
                fileHTML = '<span class="no-file">Sin archivo adjunto</span>';
            }
            
            activityElement.innerHTML = `
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    ${activity.date ? `<span class="activity-date">${activity.date}</span>` : ''}
                    <div class="activity-file">
                        ${fileHTML}
                    </div>
                </div>
            `;
            
            activitiesList.appendChild(activityElement);
        });
    }

    // Función para renderizar actividades en el panel de administración
    async function loadAdminActivities() {
        if (!adminActivitiesList) return;
        
        adminActivitiesList.innerHTML = '';
        
        const todasActividades = await getActivitiesFromStorage();
        
        if (todasActividades.length === 0) {
            adminActivitiesList.innerHTML = '<p class="no-activities">No hay actividades para gestionar.</p>';
            return;
        }
        
        todasActividades.forEach((activity, index) => {
            const isBaseActivity = index < BASE_ACTIVITIES.length;
            const fileUrl = getFileUrl(activity.archivo || activity.file);
            const hasFile = fileUrl && (activity.archivo !== 'sin-archivo.pdf' && activity.file !== 'sin-archivo.pdf');
            
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item admin-activity-item';
            activityElement.dataset.index = index;
            
            let actionsHTML = '';
            if (!isBaseActivity) {
                actionsHTML = `
                    <div class="activity-actions">
                        <button class="btn-edit" data-index="${index}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" data-index="${index}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                `;
            } else {
                actionsHTML = '<p class="base-activity-notice"><em>Actividad base</em></p>';
            }
            
            activityElement.innerHTML = `
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    ${activity.date ? `<span class="activity-date">${activity.date}</span>` : ''}
                    <div class="activity-file">
                        ${hasFile ? `
                            <strong>Archivo:</strong> 
                            <span class="file-name">${activity.archivo || activity.file}</span>
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
                    ${actionsHTML}
                </div>
            `;
            
            adminActivitiesList.appendChild(activityElement);
        });
        
        // Agregar event listeners para los botones de editar
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const originalIndex = index - BASE_ACTIVITIES.length;
                if (originalIndex >= 0) {
                    showEditActivityForm(originalIndex);
                } else {
                    showMessage('No se pueden editar las actividades base', 'error', 'admin-message');
                }
            });
        });
        
        // Agregar event listeners para los botones de eliminar
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const originalIndex = index - BASE_ACTIVITIES.length;
                if (originalIndex >= 0) {
                    if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
                        deleteActivity(originalIndex);
                    }
                } else {
                    showMessage('No se pueden eliminar las actividades base', 'error', 'admin-message');
                }
            });
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
                showMessage('Por favor completa todos los campos obligatorios', 'error', 'admin-message');
                return;
            }
            
            if (fileName && !fileName.toLowerCase().endsWith('.pdf')) {
                fileName += '.pdf';
            }
            
            const newActivity = {
                title,
                description,
                archivo: fileName || 'sin-archivo.pdf',
                date: new Date().toLocaleDateString('es-ES'),
                file: fileName || 'sin-archivo.pdf'
            };
            
            // Guardar la nueva actividad
            const actividadesGuardadas = await loadActivitiesFromJSON();
            actividadesGuardadas.push(newActivity);
            await saveActivitiesToJSON(actividadesGuardadas);
            
            // Actualizar interfaces
            await loadAdminActivities();
            await loadActivities();
            
            addActivityForm.reset();
            showMessage('Actividad agregada correctamente', 'success', 'admin-message');
        });
    }

    // Función para mostrar el formulario de edición
    async function showEditActivityForm(index) {
        const actividadesGuardadas = await loadActivitiesFromJSON();
        const activity = actividadesGuardadas[index];
        
        if (!activity) {
            showMessage('No se encontró la actividad', 'error', 'admin-message');
            return;
        }
        
        // Crear el formulario de edición
        const editFormHTML = `
            <div class="edit-form-container">
                <h3>Editar Actividad</h3>
                <form id="edit-activity-form" class="edit-activity-form">
                    <div class="form-group">
                        <label for="edit-activity-title">Título *</label>
                        <input type="text" id="edit-activity-title" name="title" value="${activity.title}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-activity-description">Descripción *</label>
                        <textarea id="edit-activity-description" name="description" rows="3" required>${activity.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="edit-activity-file">Archivo PDF</label>
                        <input type="text" id="edit-activity-file" name="file" value="${activity.archivo || activity.file || ''}" placeholder="nombre-archivo.pdf">
                        <small>Debe coincidir exactamente con el nombre del archivo subido a GitHub</small>
                    </div>
                    <input type="hidden" id="edit-activity-index" value="${index}">
                    <div class="form-buttons">
                        <button type="submit" class="btn">Guardar Cambios</button>
                        <button type="button" id="cancel-edit" class="btn btn-cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        `;
        
        // Reemplazar el formulario de agregar con el de editar
        const activityForm = document.querySelector('.activity-form');
        if (activityForm) {
            activityForm.style.display = 'none';
        }
        
        const editFormPlaceholder = document.getElementById('edit-form-placeholder') || document.createElement('div');
        editFormPlaceholder.id = 'edit-form-placeholder';
        editFormPlaceholder.innerHTML = editFormHTML;
        
        if (!document.getElementById('edit-form-placeholder')) {
            const adminContent = document.querySelector('.admin-panel .admin-content') || adminPanel;
            adminContent.insertBefore(editFormPlaceholder, addActivityForm);
        }
        
        // Event listener para el formulario de edición
        document.getElementById('edit-activity-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveEditedActivity();
        });
        
        // Event listener para cancelar edición
        document.getElementById('cancel-edit').addEventListener('click', function() {
            hideEditForm();
        });
    }

    // Función para guardar los cambios de una actividad editada
    async function saveEditedActivity() {
        const index = parseInt(document.getElementById('edit-activity-index').value);
        const title = document.getElementById('edit-activity-title').value.trim();
        const description = document.getElementById('edit-activity-description').value.trim();
        let fileName = document.getElementById('edit-activity-file').value.trim();
        
        if (!title || !description) {
            showMessage('Por favor completa todos los campos obligatorios', 'error', 'admin-message');
            return;
        }
        
        if (fileName && !fileName.toLowerCase().endsWith('.pdf')) {
            fileName += '.pdf';
        }
        
        const actividadesGuardadas = await loadActivitiesFromJSON();
        
        // Actualizar la actividad
        actividadesGuardadas[index] = {
            title: title,
            description: description,
            archivo: fileName || 'sin-archivo.pdf',
            date: new Date().toLocaleDateString('es-ES'),
            file: fileName || 'sin-archivo.pdf'
        };
        
        // Guardar los cambios
        await saveActivitiesToJSON(actividadesGuardadas);
        
        // Actualizar las interfaces
        await loadAdminActivities();
        await loadActivities();
        
        // Ocultar formulario de edición y mostrar el de agregar
        hideEditForm();
        
        showMessage('Actividad actualizada correctamente', 'success', 'admin-message');
    }

    // Función para eliminar una actividad
    async function deleteActivity(index) {
        const actividadesGuardadas = await loadActivitiesFromJSON();
        
        // Eliminar la actividad del array
        actividadesGuardadas.splice(index, 1);
        
        // Guardar los cambios
        await saveActivitiesToJSON(actividadesGuardadas);
        
        // Actualizar las interfaces
        await loadAdminActivities();
        await loadActivities();
        
        showMessage('Actividad eliminada correctamente', 'success', 'admin-message');
    }

    // Función para ocultar el formulario de edición
    function hideEditForm() {
        const editFormPlaceholder = document.getElementById('edit-form-placeholder');
        if (editFormPlaceholder) {
            editFormPlaceholder.innerHTML = '';
        }
        const activityForm = document.querySelector('.activity-form');
        if (activityForm) {
            activityForm.style.display = 'block';
        }
    }

    // Función para mostrar mensajes
    function showMessage(text, type, elementId = 'activities-message') {
        let messageEl = document.getElementById(elementId);
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = elementId;
            
            // Colocar el mensaje en la posición adecuada
            if (elementId === 'login-message' && loginContainer) {
                loginContainer.insertBefore(messageEl, loginContainer.firstChild);
            } else if (elementId === 'admin-message' && adminPanel) {
                adminPanel.insertBefore(messageEl, adminPanel.firstChild);
            } else if (document.getElementById('admin')) {
                document.getElementById('admin').insertBefore(messageEl, document.getElementById('admin').firstChild);
            }
        }
        
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }

    // ----------------------
    // Inicialización
    // ----------------------
    // Verificar si ya hay sesión activa al cargar
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    }
    
    // Cargar actividades si estamos en la página de actividades
    if (document.getElementById('activities') && document.getElementById('activities').classList.contains('active')) {
        loadActivities();
    }
    
    // Verificar estado de admin si estamos en la página de admin
    if (document.getElementById('admin') && document.getElementById('admin').classList.contains('active')) {
        checkAdminStatus();
    }
});
