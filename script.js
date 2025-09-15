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
    
    // Navegación entre páginas
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
    
    // Efecto de escritura
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
    
    // Iniciar el efecto de escritura
    type();
    
    // Animar barras de habilidades
    function animateSkills() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    }
    
    // Ejecutar animación de habilidades cuando la página de habilidades es visible
    const skillsPage = document.getElementById('skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(skillsPage);
    
    // Sistema de actividades
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const addActivityForm = document.getElementById('add-activity-form');
    const activitiesList = document.getElementById('activities-list');
    
    // Verificar si ya está logueado
    if (localStorage.getItem('loggedIn') === 'true') {
        showAdminPanel();
    }
    
    // Cargar actividades al iniciar (si estamos en la página de actividades)
    if (document.getElementById('activities').classList.contains('active')) {
        loadActivities();
    }
    
    // Manejar inicio de sesión
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === 'nakazu' && password === 'nakazu') {
            // Credenciales correctas
            localStorage.setItem('loggedIn', 'true');
            showAdminPanel();
            showMessage('Inicio de sesión exitoso', 'success');
        } else {
            // Credenciales incorrectas
            showMessage('Usuario o contraseña incorrectos', 'error');
        }
    });
    
    // Mostrar panel de administración
    function showAdminPanel() {
        loginContainer.style.display = 'none';
        adminPanel.style.display = 'block';
    }
    
    // Cargar actividades desde localStorage
    function loadActivities() {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        activitiesList.innerHTML = '';
        
        if (activities.length === 0) {
            activitiesList.innerHTML = '<p>No hay actividades aún.</p>';
            return;
        }
        
        activities.forEach((activity, index) => {
            const activityCard = document.createElement('div');
            activityCard.className = 'activity-card';
            
            // Verificar si el usuario está logueado para mostrar opciones de edición
            const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
            
            activityCard.innerHTML = `
                <h3>${activity.title}</h3>
                <p>${activity.description}</p>
                <div class="activity-date">${activity.date}</div>
                
                ${activity.file ? `
                    <div>
                        <strong>Archivo:</strong> 
                        <a href="#" class="download-link" data-filename="${activity.file}" data-filecontent="${activity.fileContent || ''}">${activity.file}</a>
                    </div>
                ` : ''}
                
                ${isLoggedIn ? `
                    <div class="activity-actions">
                        <button class="btn btn-small" onclick="toggleEditForm(${index})">Editar</button>
                        <button class="btn btn-small" onclick="deleteActivity(${index})">Eliminar</button>
                    </div>
                    
                    <div id="edit-form-${index}" class="edit-form">
                        <h4>Editar Actividad</h4>
                        <form onsubmit="updateActivity(event, ${index})">
                            <div class="form-group">
                                <label for="edit-title-${index}">Título</label>
                                <input type="text" id="edit-title-${index}" value="${activity.title}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-description-${index}">Descripción</label>
                                <textarea id="edit-description-${index}" required>${activity.description}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="edit-file-${index}">Reemplazar archivo (opcional)</label>
                                <input type="file" id="edit-file-${index}">
                            </div>
                            <button type="submit" class="btn btn-small">Guardar</button>
                            <button type="button" class="btn btn-small" onclick="toggleEditForm(${index})">Cancelar</button>
                        </form>
                    </div>
                ` : ''}
            `;
            
            activitiesList.appendChild(activityCard);
        });
        
        // Agregar event listeners para descargas
        document.querySelectorAll('.download-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const filename = this.getAttribute('data-filename');
                const fileContent = this.getAttribute('data-filecontent');
                downloadFile(filename, fileContent);
            });
        });
    }
    
    // Agregar nueva actividad
    addActivityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('activity-title').value;
        const description = document.getElementById('activity-description').value;
        const fileInput = document.getElementById('activity-file');
        
        let fileName = null;
        let fileContent = null;
        
        // Si hay un archivo, procesarlo
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            fileName = file.name;
            
            // Leer el contenido del archivo
            const reader = new FileReader();
            reader.onload = function(e) {
                fileContent = e.target.result;
                
                // Crear la actividad con el contenido del archivo
                const newActivity = {
                    title,
                    description,
                    file: fileName,
                    fileContent: fileContent,
                    date: new Date().toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                };
                
                // Guardar en localStorage
                const activities = JSON.parse(localStorage.getItem('activities')) || [];
                activities.push(newActivity);
                localStorage.setItem('activities', JSON.stringify(activities));
                
                // Limpiar formulario
                addActivityForm.reset();
                
                // Recargar actividades
                loadActivities();
                
                showMessage('Actividad agregada correctamente', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            // Crear actividad sin archivo
            const newActivity = {
                title,
                description,
                file: null,
                fileContent: null,
                date: new Date().toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };
            
            // Guardar en localStorage
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            activities.push(newActivity);
            localStorage.setItem('activities', JSON.stringify(activities));
            
            // Limpiar formulario
            addActivityForm.reset();
            
            // Recargar actividades
            loadActivities();
            
            showMessage('Actividad agregada correctamente', 'success');
        }
    });
    
    // Función para alternar formulario de edición
    window.toggleEditForm = function(index) {
        const editForm = document.getElementById(`edit-form-${index}`);
        if (editForm.style.display === 'block') {
            editForm.style.display = 'none';
        } else {
            editForm.style.display = 'block';
        }
    };
    
    // Función para actualizar actividad
    window.updateActivity = function(e, index) {
        e.preventDefault();
        
        const title = document.getElementById(`edit-title-${index}`).value;
        const description = document.getElementById(`edit-description-${index}`).value;
        const fileInput = document.getElementById(`edit-file-${index}`);
        
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        let fileName = activities[index].file;
        let fileContent = activities[index].fileContent;
        
        // Si se sube un nuevo archivo, procesarlo
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            fileName = file.name;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                fileContent = e.target.result;
                
                // Actualizar actividad
                activities[index] = {
                    title,
                    description,
                    file: fileName,
                    fileContent: fileContent,
                    date: activities[index].date // Mantener la fecha original
                };
                
                localStorage.setItem('activities', JSON.stringify(activities));
                loadActivities();
                
                showMessage('Actividad actualizada correctamente', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            // Actualizar actividad sin cambiar el archivo
            activities[index] = {
                title,
                description,
                file: fileName,
                fileContent: fileContent,
                date: activities[index].date // Mantener la fecha original
            };
            
            localStorage.setItem('activities', JSON.stringify(activities));
            loadActivities();
            
            showMessage('Actividad actualizada correctamente', 'success');
        }
    };
    
    // Función para eliminar actividad
    window.deleteActivity = function(index) {
        if (confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            activities.splice(index, 1);
            localStorage.setItem('activities', JSON.stringify(activities));
            loadActivities();
            showMessage('Actividad eliminada', 'success');
        }
    };
    
    // Función para descargar archivo
    function downloadFile(filename, fileContent) {
        if (fileContent) {
            // Si tenemos el contenido del archivo (almacenado como Data URL)
            const link = document.createElement('a');
            link.href = fileContent;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Si no tenemos el contenido, crear un archivo de ejemplo
            const element = document.createElement('a');
            const blob = new Blob(['Contenido del archivo: ' + filename], { type: 'text/plain' });
            element.href = URL.createObjectURL(blob);
            element.download = filename;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }
    
    // Mostrar mensajes
    function showMessage(text, type) {
        // Crear elemento de mensaje si no existe
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
});