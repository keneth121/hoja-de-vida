// ============================================
// MENÚ MÓVIL (Toggle Hamburguesa)
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Animación del icono hamburguesa a X
    const spans = menuToggle.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    });
});

// Cerrar menú al hacer click fuera de él
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// ============================================
// EFECTO DE SCROLL EN EL NAVBAR
// ============================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Agregar sombra cuando se hace scroll
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// SCROLL SUAVE PARA ENLACES INTERNOS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// ANIMACIONES AL HACER SCROLL
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar todos los elementos con clase fade-in-up
document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// ============================================
// ANIMACIÓN DE BARRAS DE PROGRESO (Skills)
// ============================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.tech-progress');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.tech-stack-grid').forEach(grid => {
    skillObserver.observe(grid);
});

// ============================================
// CONTADOR ANIMADO PARA ESTADÍSTICAS DEL HERO
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + '+';
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                if (!isNaN(number)) {
                    animateCounter(stat, number);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// FORMULARIO DE CONTACTO (Integración con Formspree)
// ============================================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        
        // Obtener el botón de envío
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Deshabilitar botón y mostrar estado "Enviando..."
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Enviando...</span>';
        
        // Recopilar datos del formulario
        const formData = new FormData(contactForm);
        
        try {
            // Enviar datos a Formspree (tu endpoint personal)
            const response = await fetch('https://formspree.io/f/mdazzgqv', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            // Verificar si la respuesta fue exitosa
            if (response.ok) {
                // ÉXITO: Mostrar mensaje de confirmación
                formMessage.textContent = '¡Mensaje enviado con éxito! 🚀 Te responderé pronto a tu email.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                contactForm.reset(); // Limpiar formulario
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formMessage.style.display = 'none';
                    formMessage.className = 'form-message';
                }, 5000);
                
            } else {
                // ERROR DEL SERVIDOR: Manejar errores de Formspree
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    const errorMessages = data["errors"].map(error => error["message"]).join(", ");
                    throw new Error(errorMessages);
                } else {
                    throw new Error('Hubo un problema al enviar el formulario.');
                }
            }
            
        } catch (error) {
            // ERROR DE RED O CONEXIÓN
            console.error('Error:', error);
            formMessage.textContent = '❌ Error: ' + error.message + '. Por favor, contáctame directamente por WhatsApp o email.';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            
            // Ocultar mensaje después de 7 segundos
            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.className = 'form-message';
            }, 7000);
            
        } finally {
            // Restaurar botón original (siempre se ejecuta)
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
}

// ============================================
// EFECTO PARALLAX PARA EL HERO (Opcional)
// ============================================
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / 700);
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ============================================
// RESALTAR ENLACE ACTIVO EN EL NAV AL HACER SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.style.color = '';
            });
            if (navLink) {
                navLink.style.color = 'var(--primary)';
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ============================================
// EFECTO DE ESCRITURA PARA TÍTULO DEL HERO (Opcional)
// ============================================
function typeWriter(element, text, speed = 80) {
    let i = 0;
    element.textContent = '';
    element.style.borderRight = '2px solid white';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Remover cursor después de escribir
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 500);
        }
    }
    
    type();
}

// Descomentar para activar el efecto de escritura
// window.addEventListener('load', () => {
//     const heroTitle = document.querySelector('.hero-title');
//     if (heroTitle) {
//         const originalText = heroTitle.textContent;
//         typeWriter(heroTitle, originalText, 60);
//     }
// });

// ============================================
// OPTIMIZACIÓN DE CARGA DE IMÁGENES
// ============================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

// Si usas lazy loading, agrega data-src a las imágenes y usa esto:
// document.querySelectorAll('img[data-src]').forEach(img => {
//     imageObserver.observe(img);
// });

// ============================================
// ANALÍTICAS DE DESCARGA DE CV (Opcional)
// ============================================
const cvDownloadBtn = document.querySelector('a[download]');
if (cvDownloadBtn) {
    cvDownloadBtn.addEventListener('click', () => {
        console.log('CV descargado');
        // Rastrear con Google Analytics si está implementado
        // gtag('event', 'download', { 'event_category': 'CV' });
    });
}

// ============================================
// EASTER EGG - MENSAJE EN CONSOLA
// ============================================
console.log(
    '%c👋 ¡Hola Developer!',
    'font-size: 24px; color: #3b82f6; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);'
);

console.log(
    '%c¡Veo que te gusta revisar el código! 👨‍💻',
    'font-size: 16px; color: #6b7280; padding: 10px 0;'
);

console.log(
    '%cSi estás buscando un desarrollador que escribe código limpio y funcional, hablemos 💬',
    'font-size: 14px; color: #9ca3af;'
);

console.log(
    '%cKenneth Jiménez | kennethjimenez744@gmail.com | +57 310 549 5452',
    'font-size: 14px; color: #3b82f6; font-weight: bold; padding: 10px 0;'
);

console.log(
    '%c⭐ Este portafolio fue construido con HTML5, CSS3 y JavaScript Vanilla (sin frameworks)',
    'font-size: 12px; color: #f59e0b; font-style: italic; padding: 10px 0;'
);

// ============================================
// ANIMACIÓN DE CARGA
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Ocultar spinner de carga si tienes uno
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
});

// ============================================
// EVITAR PALABRAS HUÉRFANAS EN TÍTULOS
// ============================================
function preventOrphans() {
    const titles = document.querySelectorAll('h1, h2, h3, .hero-title, .section-title');
    titles.forEach(title => {
        const text = title.innerHTML;
        const words = text.split(' ');
        if (words.length > 2) {
            const lastTwo = words.slice(-2).join('&nbsp;');
            const beginning = words.slice(0, -2).join(' ');
            title.innerHTML = beginning + ' ' + lastTwo;
        }
    });
}

// Llamar al cargar
// preventOrphans();

// ============================================
// ATAJOS DE TECLADO (Easter Egg - Código Konami)
// ============================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        console.log('%c🎮 ¡CÓDIGO KONAMI ACTIVADO! 🎮', 'font-size: 30px; color: #f59e0b; font-weight: bold;');
        console.log('%c¡Encontraste el Easter Egg! 🥚', 'font-size: 20px; color: #3b82f6;');
        console.log('%cEres de los míos 😎 - Kenneth', 'font-size: 16px; color: #6b7280;');
        
        // Agregar animación divertida
        document.body.style.animation = 'rainbow 2s linear';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Agregar animación rainbow al CSS si usas el código Konami
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
// document.head.appendChild(style);

// ============================================
// DETECTAR SI EL USUARIO ESTÁ EN MÓVIL
// ============================================
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    console.log('Usuario móvil detectado - optimizaciones aplicadas');
    // Agregar optimizaciones específicas para móvil
    document.body.classList.add('mobile-device');
}

// ============================================
// API DE COMPARTIR (Para dispositivos móviles)
// ============================================
const shareBtn = document.querySelector('.share-btn'); // Agregar este botón si lo deseas
if (shareBtn && navigator.share) {
    shareBtn.addEventListener('click', async () => {
        try {
            await navigator.share({
                title: 'Kenneth Jiménez - Desarrollador Full Stack',
                text: 'Revisa mi portafolio de desarrollo web',
                url: window.location.href
            });
        } catch (error) {
            console.log('Error al compartir:', error);
        }
    });
}

// ============================================
// OPTIMIZACIÓN DE RENDIMIENTO
// ============================================
// Función debounce para mejor rendimiento
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce a eventos de scroll si es necesario
// window.addEventListener('scroll', debounce(highlightNavLink, 10));

// ============================================
// MEJORAS DE ACCESIBILIDAD
// ============================================
// Enlace para saltar al contenido principal
const skipLink = document.createElement('a');
skipLink.href = '#sobre-mi';
skipLink.textContent = 'Saltar al contenido principal';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// ============================================
// OPTIMIZACIÓN DE ESTILOS DE IMPRESIÓN
// ============================================
window.addEventListener('beforeprint', () => {
    console.log('Preparando página para impresión...');
});

window.addEventListener('afterprint', () => {
    console.log('Impresión completada');
});

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portafolio cargado exitosamente');
    console.log('💻 Kenneth Jiménez - Full Stack Developer');
    
    // Inicializar características adicionales aquí
    highlightNavLink();
});

// ============================================
// REGISTRO DE SERVICE WORKER (OPCIONAL - Para PWA)
// ============================================
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('/sw.js')
//             .then(registration => console.log('SW registrado:', registration))
//             .catch(error => console.log('Falló el registro de SW:', error));
//     });
// }
