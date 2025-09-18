/* ===== MÓDULO DE ANIMACIONES ===== */

import { DOM, Events } from './utils.js';

// Configuración de animaciones
const ANIMATION_CONFIG = {
    duration: {
        fast: 300,
        normal: 600,
        slow: 1000
    },
    easing: {
        easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
        easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
    },
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

// Clase principal para manejar animaciones
class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupLoadingAnimations();
        this.setupParallaxEffects();
        this.setupCounterAnimations();
        this.setupTypingEffect();
    }

    // Configurar Intersection Observer para animaciones al hacer scroll
    setupIntersectionObserver() {
        if (this.isReducedMotion) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, {
            threshold: ANIMATION_CONFIG.threshold,
            rootMargin: ANIMATION_CONFIG.rootMargin
        });

        // Observar elementos con clases de animación
        const animatableElements = DOM.selectAll([
            '.animate-on-scroll',
            '.service-card',
            '.process-step',
            '.portfolio-item',
            '.testimonial-card-grid',
            '.stat-item',
            '.footer-section',
            '.footer-brand'
        ].join(', '));

        animatableElements.forEach(el => observer.observe(el));
        this.observers.set('scroll', observer);
    }

    // Animar elemento cuando entra en viewport
    animateElement(element) {
        const animationType = DOM.getData(element, 'animation') || 'fadeInUp';
        const delay = DOM.getData(element, 'delay') || 0;

        setTimeout(() => {
            DOM.addClass(element, 'animate');
            DOM.addClass(element, `animate-${animationType}`);
        }, delay);
    }

    // Configurar animaciones de scroll
    setupScrollAnimations() {
        let ticking = false;

        const updateScrollAnimations = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;

            // Navbar scroll effect
            const navbar = DOM.select('.navbar');
            if (navbar) {
                if (scrollY > 100) {
                    DOM.addClass(navbar, 'scrolled');
                } else {
                    DOM.removeClass(navbar, 'scrolled');
                }
            }

            // Back to top button
            const backToTop = DOM.select('.back-to-top');
            if (backToTop) {
                if (scrollY > 500) {
                    DOM.addClass(backToTop, 'show');
                } else {
                    DOM.removeClass(backToTop, 'show');
                }
            }

            // Progress bar
            this.updateProgressBar();

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };

        Events.on(window, 'scroll', Events.throttle(onScroll, 16));
    }

    // Actualizar barra de progreso
    updateProgressBar() {
        const progressBar = DOM.select('.progress-bar');
        if (!progressBar) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    // Configurar animaciones hover
    setupHoverAnimations() {
        // Cards hover effect
        const cards = DOM.selectAll('.service-card, .portfolio-item, .testimonial-card-grid');
        cards.forEach(card => {
            Events.on(card, 'mouseenter', () => {
                if (!this.isReducedMotion) {
                    DOM.addClass(card, 'hovered');
                }
            });

            Events.on(card, 'mouseleave', () => {
                DOM.removeClass(card, 'hovered');
            });
        });

        // Button hover effects
        const buttons = DOM.selectAll('.btn');
        buttons.forEach(btn => {
            Events.on(btn, 'mouseenter', () => {
                if (!this.isReducedMotion) {
                    this.addRippleEffect(btn);
                }
            });
        });
    }

    // Efecto ripple para botones
    addRippleEffect(button) {
        const ripple = DOM.create('span', 'ripple');
        button.appendChild(ripple);

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Configurar animaciones de carga
    setupLoadingAnimations() {
        // Stagger animation para elementos en grid
        const grids = DOM.selectAll('.services-grid, .portfolio-grid, .testimonials-grid');
        grids.forEach(grid => {
            const items = grid.children;
            Array.from(items).forEach((item, index) => {
                DOM.setData(item, 'delay', index * 100);
            });
        });

        // Loading skeleton effect
        this.setupSkeletonLoading();
    }

    // Efecto de carga skeleton
    setupSkeletonLoading() {
        const skeletons = DOM.selectAll('.skeleton');
        skeletons.forEach(skeleton => {
            const shimmer = DOM.create('div', 'skeleton-shimmer');
            skeleton.appendChild(shimmer);

            // Remover skeleton cuando el contenido esté listo
            const observer = new MutationObserver(() => {
                if (skeleton.children.length > 1) {
                    DOM.removeClass(skeleton, 'skeleton');
                    observer.disconnect();
                }
            });

            observer.observe(skeleton, { childList: true });
        });
    }

    // Configurar efectos parallax
    setupParallaxEffects() {
        if (this.isReducedMotion) return;

        const parallaxElements = DOM.selectAll('[data-parallax]');
        if (parallaxElements.length === 0) return;

        const updateParallax = () => {
            const scrollY = window.pageYOffset;

            parallaxElements.forEach(element => {
                const speed = parseFloat(DOM.getData(element, 'parallax')) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        Events.on(window, 'scroll', Events.throttle(updateParallax, 16));
    }

    // Configurar animaciones de contador
    setupCounterAnimations() {
        const counters = DOM.selectAll('[data-counter]');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // Animar contador
    animateCounter(element) {
        const target = parseInt(DOM.getData(element, 'counter'));
        const duration = parseInt(DOM.getData(element, 'duration')) || 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Configurar efecto de escritura
    setupTypingEffect() {
        const typingElements = DOM.selectAll('[data-typing]');
        typingElements.forEach(element => {
            const text = DOM.getData(element, 'typing');
            const speed = parseInt(DOM.getData(element, 'typing-speed')) || 100;
            const delay = parseInt(DOM.getData(element, 'typing-delay')) || 0;

            setTimeout(() => {
                this.typeText(element, text, speed);
            }, delay);
        });
    }

    // Efecto de escritura de texto
    typeText(element, text, speed) {
        element.textContent = '';
        let i = 0;

        const typeChar = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            } else {
                // Agregar cursor parpadeante
                const cursor = DOM.create('span', 'typing-cursor');
                cursor.textContent = '|';
                element.appendChild(cursor);
            }
        };

        typeChar();
    }

    // Animar entrada de página
    animatePageEntry() {
        const hero = DOM.select('.hero');
        if (hero) {
            DOM.addClass(hero, 'animate-fadeInUp');
        }

        // Animar elementos del navbar
        const navItems = DOM.selectAll('.nav-item');
        navItems.forEach((item, index) => {
            setTimeout(() => {
                DOM.addClass(item, 'animate-fadeInDown');
            }, index * 100);
        });
    }

    // Animar transición entre secciones
    animateSectionTransition(fromSection, toSection) {
        return new Promise((resolve) => {
            DOM.addClass(fromSection, 'animate-fadeOut');
            
            setTimeout(() => {
                fromSection.style.display = 'none';
                toSection.style.display = 'block';
                DOM.addClass(toSection, 'animate-fadeIn');
                resolve();
            }, ANIMATION_CONFIG.duration.fast);
        });
    }

    // Crear animación personalizada
    createCustomAnimation(element, keyframes, options = {}) {
        if (this.isReducedMotion) return;

        const defaultOptions = {
            duration: ANIMATION_CONFIG.duration.normal,
            easing: ANIMATION_CONFIG.easing.easeOut,
            fill: 'forwards'
        };

        const animationOptions = { ...defaultOptions, ...options };
        return element.animate(keyframes, animationOptions);
    }

    // Pausar todas las animaciones
    pauseAnimations() {
        const style = DOM.create('style');
        style.textContent = `
            *, *::before, *::after {
                animation-play-state: paused !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
        DOM.setData(document.body, 'animations-paused', 'true');
    }

    // Reanudar animaciones
    resumeAnimations() {
        const pauseStyle = DOM.select('style[data-pause-animations]');
        if (pauseStyle) {
            pauseStyle.remove();
        }
        DOM.removeAttr(document.body, 'data-animations-paused');
    }

    // Limpiar observadores
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// Funciones de utilidad para animaciones específicas
export const AnimationUtils = {
    // Shake animation
    shake: (element, intensity = 10) => {
        if (!element) return;
        
        const keyframes = [
            { transform: 'translateX(0)' },
            { transform: `translateX(-${intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: 'translateX(0)' }
        ];
        
        return element.animate(keyframes, {
            duration: 500,
            easing: 'ease-in-out'
        });
    },

    // Bounce animation
    bounce: (element) => {
        if (!element) return;
        
        const keyframes = [
            { transform: 'translateY(0)' },
            { transform: 'translateY(-20px)' },
            { transform: 'translateY(0)' },
            { transform: 'translateY(-10px)' },
            { transform: 'translateY(0)' }
        ];
        
        return element.animate(keyframes, {
            duration: 800,
            easing: 'ease-out'
        });
    },

    // Pulse animation
    pulse: (element, scale = 1.1) => {
        if (!element) return;
        
        const keyframes = [
            { transform: 'scale(1)' },
            { transform: `scale(${scale})` },
            { transform: 'scale(1)' }
        ];
        
        return element.animate(keyframes, {
            duration: 600,
            easing: 'ease-in-out'
        });
    },

    // Rotate animation
    rotate: (element, degrees = 360) => {
        if (!element) return;
        
        const keyframes = [
            { transform: 'rotate(0deg)' },
            { transform: `rotate(${degrees}deg)` }
        ];
        
        return element.animate(keyframes, {
            duration: 1000,
            easing: 'ease-in-out'
        });
    },

    // Slide in from direction
    slideIn: (element, direction = 'left', distance = 100) => {
        if (!element) return;
        
        const transforms = {
            left: [`translateX(-${distance}px)`, 'translateX(0)'],
            right: [`translateX(${distance}px)`, 'translateX(0)'],
            up: [`translateY(-${distance}px)`, 'translateY(0)'],
            down: [`translateY(${distance}px)`, 'translateY(0)']
        };
        
        const [from, to] = transforms[direction] || transforms.left;
        
        const keyframes = [
            { transform: from, opacity: 0 },
            { transform: to, opacity: 1 }
        ];
        
        return element.animate(keyframes, {
            duration: 600,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }
};

// Instancia global del manager de animaciones
let animationManager = null;

// Animación del logo hero
document.addEventListener('DOMContentLoaded', function() {
    const heroLogo = document.querySelector('.hero-logo-image');
    
    if (heroLogo) {
        // Agregar clase loaded después de la animación inicial
        setTimeout(() => {
            heroLogo.classList.add('loaded');
        }, 2000);
    }
});

// Inicializar animaciones cuando el DOM esté listo
export const initAnimations = () => {
    if (document.readyState === 'loading') {
        Events.on(document, 'DOMContentLoaded', () => {
            animationManager = new AnimationManager();
        });
    } else {
        animationManager = new AnimationManager();
    }
};

// Obtener instancia del manager
export const getAnimationManager = () => animationManager;

// Exportar por defecto
export default {
    AnimationManager,
    AnimationUtils,
    initAnimations,
    getAnimationManager
};