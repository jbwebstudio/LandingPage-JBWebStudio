/* ===== MÓDULO DE NAVEGACIÓN ===== */

import { DOM, Events } from './utils.js';
import { AnimationUtils } from './animations.js';

// Configuración de navegación
const NAV_CONFIG = {
    scrollOffset: 80,
    scrollDuration: 800,
    mobileBreakpoint: 768,
    activeClass: 'active',
    scrolledClass: 'scrolled',
    mobileOpenClass: 'mobile-open'
};

// Clase principal para manejar la navegación
class NavigationManager {
    constructor() {
        this.navbar = null;
        this.mobileToggle = null;
        this.navLinks = [];
        this.sections = [];
        this.currentSection = null;
        this.isScrolling = false;
        this.isMobileOpen = false;
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupSmoothScroll();
        this.setupActiveSection();
        this.setupMobileMenu();
        this.setupScrollSpy();
        this.setupKeyboardNavigation();
    }

    // Cachear elementos del DOM
    cacheElements() {
        this.navbar = DOM.select('.navbar');
        this.mobileToggle = DOM.select('.mobile-toggle');
        this.navLinks = DOM.selectAll('.nav-link');
        this.sections = DOM.selectAll('section[id]');
        this.backToTop = DOM.select('.back-to-top');
    }

    // Vincular eventos
    bindEvents() {
        // Scroll event
        Events.on(window, 'scroll', Events.throttle(() => {
            this.handleScroll();
        }, 16));

        // Resize event
        Events.on(window, 'resize', Events.debounce(() => {
            this.handleResize();
        }, 250));

        // Mobile toggle
        if (this.mobileToggle) {
            Events.on(this.mobileToggle, 'click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Nav links
        this.navLinks.forEach(link => {
            Events.on(link, 'click', (e) => {
                this.handleNavClick(e, link);
            });
        });

        // Back to top
        if (this.backToTop) {
            Events.on(this.backToTop, 'click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }

        // Close mobile menu on outside click
        Events.on(document, 'click', (e) => {
            if (this.isMobileOpen && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // ESC key to close mobile menu
        Events.on(document, 'keydown', (e) => {
            if (e.key === 'Escape' && this.isMobileOpen) {
                this.closeMobileMenu();
            }
        });
    }

    // Manejar scroll
    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Navbar scroll effect
        if (scrollY > 100) {
            DOM.addClass(this.navbar, NAV_CONFIG.scrolledClass);
        } else {
            DOM.removeClass(this.navbar, NAV_CONFIG.scrolledClass);
        }

        // Update active section
        if (!this.isScrolling) {
            this.updateActiveSection();
        }

        // Back to top button
        if (this.backToTop) {
            if (scrollY > 500) {
                DOM.addClass(this.backToTop, 'show');
            } else {
                DOM.removeClass(this.backToTop, 'show');
            }
        }
    }

    // Manejar redimensionamiento
    handleResize() {
        const isMobile = window.innerWidth < NAV_CONFIG.mobileBreakpoint;
        
        if (!isMobile && this.isMobileOpen) {
            this.closeMobileMenu();
        }
    }

    // Configurar scroll suave
    setupSmoothScroll() {
        // Polyfill para navegadores que no soportan scroll-behavior: smooth
        if (!('scrollBehavior' in document.documentElement.style)) {
            this.enableSmoothScrollPolyfill();
        }
    }

    // Polyfill para scroll suave
    enableSmoothScrollPolyfill() {
        const easeInOutQuad = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        this.smoothScrollTo = (target, duration = NAV_CONFIG.scrollDuration) => {
            const start = window.pageYOffset;
            const startTime = performance.now();

            const animateScroll = (currentTime) => {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutQuad(progress);
                
                window.scrollTo(0, start + (target - start) * ease);
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    this.isScrolling = false;
                }
            };

            this.isScrolling = true;
            requestAnimationFrame(animateScroll);
        };
    }

    // Manejar click en enlaces de navegación
    handleNavClick(e, link) {
        const href = link.getAttribute('href');
        
        // Solo manejar enlaces internos
        if (!href || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetSection = DOM.select(`#${targetId}`);
        
        if (targetSection) {
            this.scrollToSection(targetSection);
            
            // Cerrar menú móvil si está abierto
            if (this.isMobileOpen) {
                this.closeMobileMenu();
            }
            
            // Actualizar URL sin recargar página
            this.updateURL(href);
        }
    }

    // Scroll a sección específica
    scrollToSection(section) {
        const rect = section.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        const targetPosition = scrollTop + rect.top - NAV_CONFIG.scrollOffset;
        
        if (this.smoothScrollTo) {
            this.smoothScrollTo(targetPosition);
        } else {
            this.isScrolling = true;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Reset scrolling flag after animation
            setTimeout(() => {
                this.isScrolling = false;
            }, NAV_CONFIG.scrollDuration);
        }
    }

    // Scroll al inicio
    scrollToTop() {
        if (this.smoothScrollTo) {
            this.smoothScrollTo(0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Configurar detección de sección activa
    setupActiveSection() {
        // Marcar sección inicial como activa
        this.updateActiveSection();
    }

    // Configurar scroll spy
    setupScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    this.setActiveNavLink(id);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: `-${NAV_CONFIG.scrollOffset}px 0px -50% 0px`
        });

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Actualizar sección activa
    updateActiveSection() {
        const scrollY = window.pageYOffset + NAV_CONFIG.scrollOffset + 1;
        
        let currentSection = null;
        
        this.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = window.pageYOffset + rect.top;
            const sectionBottom = sectionTop + rect.height;
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                currentSection = section.id;
            }
        });
        
        if (currentSection && currentSection !== this.currentSection) {
            this.setActiveNavLink(currentSection);
            this.currentSection = currentSection;
        }
    }

    // Establecer enlace de navegación activo
    setActiveNavLink(sectionId) {
        // Remover clase activa de todos los enlaces
        this.navLinks.forEach(link => {
            DOM.removeClass(link, NAV_CONFIG.activeClass);
            DOM.removeClass(link.parentElement, NAV_CONFIG.activeClass);
        });
        
        // Agregar clase activa al enlace correspondiente
        const activeLink = DOM.select(`[href="#${sectionId}"]`);
        if (activeLink) {
            DOM.addClass(activeLink, NAV_CONFIG.activeClass);
            DOM.addClass(activeLink.parentElement, NAV_CONFIG.activeClass);
        }
    }

    // Configurar menú móvil
    setupMobileMenu() {
        if (!this.mobileToggle) return;
        
        // Crear overlay para menú móvil
        this.createMobileOverlay();
        
        // Configurar animaciones
        this.setupMobileAnimations();
    }

    // Crear overlay para menú móvil
    createMobileOverlay() {
        const overlay = DOM.create('div', 'mobile-overlay');
        document.body.appendChild(overlay);
        
        Events.on(overlay, 'click', () => {
            this.closeMobileMenu();
        });
        
        this.mobileOverlay = overlay;
    }

    // Configurar animaciones del menú móvil
    setupMobileAnimations() {
        const navMenu = DOM.select('.nav-menu');
        if (!navMenu) return;
        
        // Preparar elementos para animación
        const navItems = DOM.selectAll('.nav-item', navMenu);
        navItems.forEach((item, index) => {
            DOM.setData(item, 'index', index);
        });
    }

    // Alternar menú móvil
    toggleMobileMenu() {
        if (this.isMobileOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    // Abrir menú móvil
    openMobileMenu() {
        this.isMobileOpen = true;
        
        DOM.addClass(this.navbar, NAV_CONFIG.mobileOpenClass);
        DOM.addClass(document.body, 'mobile-menu-open');
        DOM.addClass(this.mobileOverlay, 'show');
        
        // Animar elementos del menú
        this.animateMobileMenuItems(true);
        
        // Enfocar primer elemento del menú
        const firstNavLink = this.navLinks[0];
        if (firstNavLink) {
            setTimeout(() => firstNavLink.focus(), 300);
        }
    }

    // Cerrar menú móvil
    closeMobileMenu() {
        this.isMobileOpen = false;
        
        // Animar elementos del menú
        this.animateMobileMenuItems(false);
        
        setTimeout(() => {
            DOM.removeClass(this.navbar, NAV_CONFIG.mobileOpenClass);
            DOM.removeClass(document.body, 'mobile-menu-open');
            DOM.removeClass(this.mobileOverlay, 'show');
        }, 300);
    }

    // Animar elementos del menú móvil
    animateMobileMenuItems(show) {
        const navItems = DOM.selectAll('.nav-item');
        
        navItems.forEach((item, index) => {
            const delay = show ? index * 50 : (navItems.length - index - 1) * 50;
            
            setTimeout(() => {
                if (show) {
                    AnimationUtils.slideIn(item, 'right', 50);
                } else {
                    AnimationUtils.slideIn(item, 'left', 50);
                }
            }, delay);
        });
    }

    // Configurar navegación por teclado
    setupKeyboardNavigation() {
        Events.on(document, 'keydown', (e) => {
            // Navegación con Tab en menú móvil
            if (this.isMobileOpen && e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
            
            // Atajos de teclado
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Home':
                        e.preventDefault();
                        this.scrollToTop();
                        break;
                }
            }
        });
    }

    // Manejar navegación con Tab
    handleTabNavigation(e) {
        const focusableElements = this.navLinks.filter(link => {
            return link.offsetParent !== null; // Elemento visible
        });
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }

    // Actualizar URL sin recargar página
    updateURL(hash) {
        if (history.pushState) {
            const newURL = window.location.pathname + window.location.search + hash;
            history.pushState(null, null, newURL);
        } else {
            window.location.hash = hash;
        }
    }

    // Navegar a sección por ID
    navigateToSection(sectionId) {
        const section = DOM.select(`#${sectionId}`);
        if (section) {
            this.scrollToSection(section);
            this.updateURL(`#${sectionId}`);
        }
    }

    // Obtener sección actual
    getCurrentSection() {
        return this.currentSection;
    }

    // Obtener todas las secciones
    getSections() {
        return this.sections.map(section => ({
            id: section.id,
            title: section.querySelector('h1, h2, h3')?.textContent || section.id,
            element: section
        }));
    }

    // Crear breadcrumb dinámico
    createBreadcrumb() {
        const breadcrumb = DOM.create('nav', 'breadcrumb');
        const list = DOM.create('ol', 'breadcrumb-list');
        
        // Home
        const homeItem = DOM.create('li', 'breadcrumb-item');
        const homeLink = DOM.create('a', 'breadcrumb-link');
        homeLink.href = '#';
        homeLink.textContent = 'Inicio';
        homeItem.appendChild(homeLink);
        list.appendChild(homeItem);
        
        // Current section
        if (this.currentSection) {
            const currentItem = DOM.create('li', 'breadcrumb-item active');
            currentItem.textContent = this.getSectionTitle(this.currentSection);
            list.appendChild(currentItem);
        }
        
        breadcrumb.appendChild(list);
        return breadcrumb;
    }

    // Obtener título de sección
    getSectionTitle(sectionId) {
        const section = DOM.select(`#${sectionId}`);
        if (section) {
            const heading = section.querySelector('h1, h2, h3');
            return heading ? heading.textContent : sectionId;
        }
        return sectionId;
    }

    // Destruir instancia
    destroy() {
        // Remover event listeners
        Events.off(window, 'scroll');
        Events.off(window, 'resize');
        
        if (this.mobileToggle) {
            Events.off(this.mobileToggle, 'click');
        }
        
        this.navLinks.forEach(link => {
            Events.off(link, 'click');
        });
        
        if (this.backToTop) {
            Events.off(this.backToTop, 'click');
        }
        
        // Remover overlay móvil
        if (this.mobileOverlay && this.mobileOverlay.parentNode) {
            this.mobileOverlay.parentNode.removeChild(this.mobileOverlay);
        }
        
        // Limpiar referencias
        this.navbar = null;
        this.mobileToggle = null;
        this.navLinks = [];
        this.sections = [];
        this.currentSection = null;
    }
}

// Instancia global del manager de navegación
let navigationManager = null;

// Inicializar navegación cuando el DOM esté listo
export const initNavigation = () => {
    if (document.readyState === 'loading') {
        Events.on(document, 'DOMContentLoaded', () => {
            navigationManager = new NavigationManager();
        });
    } else {
        navigationManager = new NavigationManager();
    }
};

// Obtener instancia del manager
export const getNavigationManager = () => navigationManager;

// Funciones de utilidad
export const NavigationUtils = {
    // Scroll suave a elemento
    scrollToElement: (element, offset = NAV_CONFIG.scrollOffset) => {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        const targetPosition = scrollTop + rect.top - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },
    
    // Obtener posición de scroll de elemento
    getElementScrollPosition: (element, offset = NAV_CONFIG.scrollOffset) => {
        if (!element) return 0;
        
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        return scrollTop + rect.top - offset;
    },
    
    // Verificar si elemento está en viewport
    isElementInViewport: (element, threshold = 0.5) => {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementHeight = rect.height;
        
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const visibilityRatio = visibleHeight / elementHeight;
        
        return visibilityRatio >= threshold;
    }
};

// Exportar por defecto
export default {
    NavigationManager,
    NavigationUtils,
    initNavigation,
    getNavigationManager
};