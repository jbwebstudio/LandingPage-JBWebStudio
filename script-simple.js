// Script simplificado para la página web

// Funcionalidad del menú hamburguesa
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            const isOpen = mobileMenu.classList.contains('active');
            
            if (isOpen) {
                // Cerrar menú
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                body.classList.remove('mobile-menu-open');
            } else {
                // Abrir menú
                mobileMenu.classList.add('active');
                mobileToggle.classList.add('active');
                mobileToggle.setAttribute('aria-expanded', 'true');
                body.classList.add('mobile-menu-open');
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                body.classList.remove('mobile-menu-open');
            });
        });
        
        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                body.classList.remove('mobile-menu-open');
            }
        });
    }
}

// Smooth scrolling para los enlaces de navegación
// Reemplazar líneas 52-185 con:

// ===== SISTEMA DE ANIMACIONES UNIFICADO =====
function initUnifiedAnimations() {
    // Configuración
    const config = {
        navbarHeight: 80,
        scrollDuration: 800,
        animationDelay: 200
    };

    // Función de easing suave
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // Smooth scroll mejorado
    function smoothScrollTo(target, duration = config.scrollDuration) {
        const start = window.pageYOffset;
        const targetPosition = target.offsetTop - config.navbarHeight;
        const distance = targetPosition - start;
        const startTime = performance.now();

        function animation(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, start + distance * ease);

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    // Manejador unificado para todos los enlaces internos
    function handleInternalLinks() {
        // Enlaces de navegación principal
        document.querySelectorAll('.nav-link[href^="#"], .mobile-nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    // Animación sutil del enlace
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                    
                    smoothScrollTo(target);
                }
            });
        });

        // Botones de servicios con animaciones especiales
        document.querySelectorAll('.service-premium-btn[href^="#"]').forEach(button => {
            // Configurar estilos base
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    // Efecto ripple
                    createRippleEffect(this, e);
                    
                    // Scroll después del efecto
                    setTimeout(() => {
                        smoothScrollTo(target);
                    }, 300);
                }
            });
        });

        // CTA premium
        document.querySelectorAll('.btn-premium-cta[href^="#"]').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    this.style.transform = 'translateY(-3px) scale(0.97)';
                    setTimeout(() => {
                        this.style.transform = 'translateY(-3px) scale(1)';
                        smoothScrollTo(target);
                    }, 150);
                }
            });
        });
    }

    // Crear efecto ripple
    function createRippleEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-effect 0.6s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        button.appendChild(ripple);
        
        // Remover después de la animación
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Animaciones de entrada para elementos con data-aos
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.getAttribute('data-aos') || 'fade-up';
                    const delay = parseInt(element.getAttribute('data-aos-delay')) || 0;
                    
                    setTimeout(() => {
                        animateElement(element, animationType);
                    }, delay);
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observar elementos con data-aos
        document.querySelectorAll('[data-aos]').forEach(el => {
            // Configurar estado inicial
            el.style.opacity = '0';
            el.style.transform = getInitialTransform(el.getAttribute('data-aos'));
            el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            observer.observe(el);
        });
    }

    // Obtener transformación inicial según tipo de animación
    function getInitialTransform(animationType) {
        switch(animationType) {
            case 'fade-up': return 'translateY(30px)';
            case 'zoom-in': return 'scale(0.8)';
            case 'fade-left': return 'translateX(-30px)';
            case 'fade-right': return 'translateX(30px)';
            default: return 'translateY(30px)';
        }
    }

    // Animar elemento
    function animateElement(element, animationType) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) translateX(0) scale(1)';
    }

    // Agregar estilos CSS para ripple
    function addRippleStyles() {
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple-effect {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Inicializar todo
    addRippleStyles();
    handleInternalLinks();
    initScrollAnimations();
}

// Inicializar sistema unificado
initUnifiedAnimations();

// Animaciones al hacer scroll (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animaciones a las secciones
document.querySelectorAll('.sobre-mi, .servicios, .portafolio, .contacto').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Animaciones para las tarjetas de servicios
document.querySelectorAll('.card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    cardObserver.observe(card);
});

// Efecto hover para las tarjetas
document.querySelectorAll('.card, .portfolio-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    });
});

// Función para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Colores según el tipo
    if (type === 'success') {
        notification.style.backgroundColor = '#27ae60';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    } else {
        notification.style.backgroundColor = '#3498db';
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar después de 4 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Botón de scroll to top
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'scroll-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-secundario, #3498db);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    `;
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
        } else {
            button.style.opacity = '0';
        }
    });
    
    document.body.appendChild(button);
}

// Testimonials Slider Functionality
let currentTestimonial = 0;
let testimonials = [];
let totalTestimonials = 0;
let container = null;
let dots = [];
let testimonialInterval = null;

function initTestimonialsSlider() {
    testimonials = document.querySelectorAll('.testimonial-card');
    totalTestimonials = testimonials.length;
    container = document.getElementById('testimonialsContainer');
    dots = document.querySelectorAll('.pagination-dot');
    
    if (container && totalTestimonials > 0) {
        updateTestimonialSlider();
        startTestimonialAutoplay();
        
        // Pause autoplay on hover
        const testimonialsSection = document.querySelector('.testimonials-slider');
        if (testimonialsSection) {
            testimonialsSection.addEventListener('mouseenter', stopTestimonialAutoplay);
            testimonialsSection.addEventListener('mouseleave', startTestimonialAutoplay);
        }
    }
}

function updateTestimonialSlider() {
    if (container) {
        container.style.transform = `translateX(-${currentTestimonial * 100}%)`;
        
        // Update pagination dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTestimonial);
        });
        
        // Update navigation buttons
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (prevBtn) prevBtn.disabled = currentTestimonial === 0;
        if (nextBtn) nextBtn.disabled = currentTestimonial === totalTestimonials - 1;
    }
}

function nextTestimonial() {
    if (currentTestimonial < totalTestimonials - 1) {
        currentTestimonial++;
        updateTestimonialSlider();
    }
}

function previousTestimonial() {
    if (currentTestimonial > 0) {
        currentTestimonial--;
        updateTestimonialSlider();
    }
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonialSlider();
}

function startTestimonialAutoplay() {
    stopTestimonialAutoplay(); // Clear any existing interval
    testimonialInterval = setInterval(() => {
        if (currentTestimonial < totalTestimonials - 1) {
            nextTestimonial();
        } else {
            currentTestimonial = 0;
            updateTestimonialSlider();
        }
    }, 5000);
}

function stopTestimonialAutoplay() {
    if (testimonialInterval) {
        clearInterval(testimonialInterval);
        testimonialInterval = null;
    }
}

// Make functions global for onclick handlers
window.nextTestimonial = nextTestimonial;
window.previousTestimonial = previousTestimonial;
window.goToTestimonial = goToTestimonial;

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        createScrollToTopButton();
        initTestimonialsSlider(); // Agregar inicialización del slider
    });
} else {
    initMobileMenu();
    createScrollToTopButton();
    initTestimonialsSlider(); // Agregar inicialización del slider
}

console.log('Script simplificado cargado correctamente');