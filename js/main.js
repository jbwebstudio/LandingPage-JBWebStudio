/* ===== ARCHIVO PRINCIPAL DE JAVASCRIPT ===== */

// Importar módulos
import { DOM, Events, Storage, Logger } from './utils.js';
import { initAnimations, getAnimationManager, AnimationUtils } from './animations.js';
import { initNavigation, getNavigationManager, NavigationUtils } from './navigation.js';
import { initForms, getFormManager } from './forms.js';

// Configuración global de la aplicación
const APP_CONFIG = {
    name: 'Jorge Blanco Freelance',
    version: '2.0.0',
    debug: false, // Cambiar a false en producción
    features: {
        animations: true,
        navigation: true,
        forms: true,
        analytics: false, // Habilitar cuando se configure
        serviceWorker: false // Habilitar para PWA
    },
    performance: {
        lazyLoading: true,
        imageOptimization: true,
        prefetchLinks: true
    }
};

// Clase principal de la aplicación
class App {
    constructor() {
        this.isInitialized = false;
        this.managers = {
            animation: null,
            navigation: null,
            form: null
        };
        this.features = new Map();
        this.performanceMetrics = {
            startTime: performance.now(),
            loadTime: null,
            initTime: null
        };
        
        this.init();
    }

    // Inicializar aplicación
    async init() {
        try {
            Logger.log('Iniciando aplicación...', APP_CONFIG);
            
            // Verificar soporte del navegador
            this.checkBrowserSupport();
            
            // Configurar entorno
            this.setupEnvironment();
            
            // Inicializar módulos principales
            await this.initializeModules();
            
            // Configurar características adicionales
            this.setupFeatures();
            
            // Configurar optimizaciones de rendimiento
            this.setupPerformanceOptimizations();
            
            // Configurar manejo de errores
            this.setupErrorHandling();
            
            // Marcar como inicializado
            this.isInitialized = true;
            this.performanceMetrics.initTime = performance.now() - this.performanceMetrics.startTime;
            
            Logger.log(`Aplicación inicializada en ${this.performanceMetrics.initTime.toFixed(2)}ms`);
            
            // Disparar evento de inicialización
            this.dispatchEvent('app:initialized');
            
        } catch (error) {
            Logger.error('Error al inicializar aplicación:', error);
            this.handleInitializationError(error);
        }
    }

    // Verificar soporte del navegador
    checkBrowserSupport() {
        const requiredFeatures = [
            'Promise',
            'fetch',
            'IntersectionObserver',
            'requestAnimationFrame'
        ];
        
        const unsupportedFeatures = requiredFeatures.filter(feature => {
            return !window[feature];
        });
        
        if (unsupportedFeatures.length > 0) {
            Logger.warn('Características no soportadas:', unsupportedFeatures);
            this.showBrowserWarning(unsupportedFeatures);
        }
    }

    // Mostrar advertencia de navegador
    showBrowserWarning(unsupportedFeatures) {
        const warning = DOM.create('div', 'browser-warning');
        warning.innerHTML = `
            <div class="browser-warning-content">
                <h3>Navegador no compatible</h3>
                <p>Tu navegador no soporta algunas características necesarias para el funcionamiento óptimo de este sitio.</p>
                <p>Características no soportadas: ${unsupportedFeatures.join(', ')}</p>
                <p>Por favor, actualiza tu navegador o usa uno más moderno.</p>
                <button class="browser-warning-close">Continuar de todos modos</button>
            </div>
        `;
        
        document.body.appendChild(warning);
        
        const closeBtn = warning.querySelector('.browser-warning-close');
        Events.on(closeBtn, 'click', () => {
            warning.remove();
        });
    }

    // Configurar entorno
    setupEnvironment() {
        // Configurar modo debug
        if (APP_CONFIG.debug) {
            window.APP = this;
            window.Logger = Logger;
            Logger.setLevel('debug');
        }
        
        // Configurar variables CSS dinámicas
        this.setupCSSVariables();
        
        // Configurar meta tags dinámicos
        this.setupMetaTags();
    }

    // Configurar variables CSS dinámicas
    setupCSSVariables() {
        const root = document.documentElement;
        
        // Altura de viewport
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            root.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        Events.on(window, 'resize', Events.throttle(setVH, 100));
        
        // Ancho de scrollbar
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        root.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
        
        // Detección de dispositivo táctil
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        root.style.setProperty('--is-touch', isTouchDevice ? '1' : '0');
        
        if (isTouchDevice) {
            DOM.addClass(document.body, 'touch-device');
        }
    }

    // Configurar meta tags dinámicos
    setupMetaTags() {
        // Theme color basado en el esquema de color
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const themeColor = prefersDark ? '#0f0f23' : '#ffffff';
        
        let themeColorMeta = DOM.select('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = DOM.create('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }
        themeColorMeta.content = themeColor;
    }

    // Inicializar módulos principales
    async initializeModules() {
        const initPromises = [];
        
        // Inicializar animaciones
        if (APP_CONFIG.features.animations) {
            initPromises.push(this.initAnimations());
        }
        
        // Inicializar navegación
        if (APP_CONFIG.features.navigation) {
            initPromises.push(this.initNavigation());
        }
        
        // Inicializar formularios
        if (APP_CONFIG.features.forms) {
            initPromises.push(this.initForms());
        }
        
        await Promise.all(initPromises);
    }

    // Inicializar animaciones
    async initAnimations() {
        try {
            initAnimations();
            this.managers.animation = getAnimationManager();
            Logger.log('Módulo de animaciones inicializado');
        } catch (error) {
            Logger.error('Error al inicializar animaciones:', error);
        }
    }

    // Inicializar navegación
    async initNavigation() {
        try {
            initNavigation();
            this.managers.navigation = getNavigationManager();
            Logger.log('Módulo de navegación inicializado');
        } catch (error) {
            Logger.error('Error al inicializar navegación:', error);
        }
    }

    // Inicializar formularios
    async initForms() {
        try {
            initForms();
            this.managers.form = getFormManager();
            Logger.log('Módulo de formularios inicializado');
        } catch (error) {
            Logger.error('Error al inicializar formularios:', error);
        }
    }

    // Configurar características adicionales
    setupFeatures() {
        // Lazy loading de imágenes
        if (APP_CONFIG.performance.lazyLoading) {
            this.setupLazyLoading();
        }
        
        // Prefetch de enlaces
        if (APP_CONFIG.performance.prefetchLinks) {
            this.setupLinkPrefetch();
        }
        
        // Service Worker
        if (APP_CONFIG.features.serviceWorker) {
            this.setupServiceWorker();
        }
        
        // Analytics
        if (APP_CONFIG.features.analytics) {
            this.setupAnalytics();
        }
        
        // Configurar atajos de teclado
        this.setupKeyboardShortcuts();
        
        // Configurar modo oscuro
        this.setupDarkMode();
    }

    // Configurar lazy loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                            DOM.addClass(img, 'loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });
            
            const lazyImages = DOM.selectAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
            
            this.features.set('lazyLoading', imageObserver);
        }
    }

    // Configurar prefetch de enlaces
    setupLinkPrefetch() {
        const linkObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target;
                    const href = link.href;
                    
                    if (href && !link.dataset.prefetched) {
                        this.prefetchLink(href);
                        link.dataset.prefetched = 'true';
                    }
                }
            });
        }, {
            threshold: 0.1
        });
        
        const links = DOM.selectAll('a[href^="/"], a[href^="./"]');
        links.forEach(link => linkObserver.observe(link));
        
        this.features.set('linkPrefetch', linkObserver);
    }

    // Prefetch de enlace
    prefetchLink(href) {
        const link = DOM.create('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    }

    // Configurar Service Worker
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                Logger.log('Service Worker registrado:', registration);
                this.features.set('serviceWorker', registration);
            } catch (error) {
                Logger.error('Error al registrar Service Worker:', error);
            }
        }
    }

    // Configurar analytics
    setupAnalytics() {
        // Implementar cuando se configure Google Analytics o similar
        Logger.log('Analytics configurado');
    }

    // Configurar atajos de teclado
    setupKeyboardShortcuts() {
        Events.on(document, 'keydown', (e) => {
            // Ctrl/Cmd + K para búsqueda
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            
            // Escape para cerrar modales
            if (e.key === 'Escape') {
                this.closeModals();
            }
            
            // Alt + H para ir al inicio
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                this.goToHome();
            }
        });
    }

    // Configurar modo oscuro
    setupDarkMode() {
        const darkModeToggle = DOM.select('.dark-mode-toggle');
        if (darkModeToggle) {
            Events.on(darkModeToggle, 'click', () => {
                this.toggleDarkMode();
            });
        }
        
        // Detectar preferencia del sistema
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        Events.on(prefersDark, 'change', (e) => {
            if (!Storage.get('darkMode')) {
                this.setDarkMode(e.matches);
            }
        });
        
        // Aplicar modo guardado
        const savedDarkMode = Storage.get('darkMode');
        if (savedDarkMode !== null) {
            this.setDarkMode(savedDarkMode);
        } else if (prefersDark.matches) {
            this.setDarkMode(true);
        }
    }

    // Alternar modo oscuro
    toggleDarkMode() {
        const isDark = DOM.hasClass(document.body, 'dark-mode');
        this.setDarkMode(!isDark);
    }

    // Establecer modo oscuro
    setDarkMode(isDark) {
        if (isDark) {
            DOM.addClass(document.body, 'dark-mode');
        } else {
            DOM.removeClass(document.body, 'dark-mode');
        }
        
        Storage.set('darkMode', isDark);
        
        // Actualizar theme-color
        const themeColorMeta = DOM.select('meta[name="theme-color"]');
        if (themeColorMeta) {
            themeColorMeta.content = isDark ? '#0f0f23' : '#ffffff';
        }
    }

    // Configurar optimizaciones de rendimiento
    setupPerformanceOptimizations() {
        // Optimizar scroll
        this.optimizeScrollPerformance();
        
        // Optimizar resize
        this.optimizeResizePerformance();
        
        // Precargar recursos críticos
        this.preloadCriticalResources();
    }

    // Optimizar rendimiento de scroll
    optimizeScrollPerformance() {
        let ticking = false;
        
        const optimizedScroll = () => {
            // Lógica de scroll optimizada ya está en los módulos
            ticking = false;
        };
        
        Events.on(window, 'scroll', () => {
            if (!ticking) {
                requestAnimationFrame(optimizedScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    // Optimizar rendimiento de resize
    optimizeResizePerformance() {
        Events.on(window, 'resize', Events.debounce(() => {
            // Recalcular variables CSS
            this.setupCSSVariables();
            
            // Notificar a módulos
            this.dispatchEvent('app:resize');
        }, 250));
    }

    // Precargar recursos críticos
    preloadCriticalResources() {
        const criticalResources = [
            // Agregar URLs de recursos críticos
        ];
        
        criticalResources.forEach(url => {
            const link = DOM.create('link');
            link.rel = 'preload';
            link.href = url;
            link.as = this.getResourceType(url);
            document.head.appendChild(link);
        });
    }

    // Obtener tipo de recurso
    getResourceType(url) {
        const extension = url.split('.').pop().toLowerCase();
        const typeMap = {
            'css': 'style',
            'js': 'script',
            'woff': 'font',
            'woff2': 'font',
            'jpg': 'image',
            'jpeg': 'image',
            'png': 'image',
            'webp': 'image',
            'svg': 'image'
        };
        return typeMap[extension] || 'fetch';
    }

    // Configurar manejo de errores
    setupErrorHandling() {
        // Errores de JavaScript
        Events.on(window, 'error', (e) => {
            Logger.error('Error de JavaScript:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });
        });
        
        // Promesas rechazadas
        Events.on(window, 'unhandledrejection', (e) => {
            Logger.error('Promesa rechazada:', e.reason);
        });
        
        // Errores de recursos
        Events.on(window, 'error', (e) => {
            if (e.target !== window) {
                Logger.error('Error de recurso:', {
                    element: e.target.tagName,
                    source: e.target.src || e.target.href,
                    message: 'Failed to load resource'
                });
            }
        }, true);
    }

    // Manejar error de inicialización
    handleInitializationError(error) {
        const errorMessage = DOM.create('div', 'initialization-error');
        errorMessage.innerHTML = `
            <div class="error-content">
                <h2>Error de inicialización</h2>
                <p>Ha ocurrido un error al cargar la aplicación.</p>
                <button class="retry-button">Reintentar</button>
            </div>
        `;
        
        document.body.appendChild(errorMessage);
        
        const retryButton = errorMessage.querySelector('.retry-button');
        Events.on(retryButton, 'click', () => {
            location.reload();
        });
    }

    // Funciones de utilidad
    openSearch() {
        // Implementar búsqueda
        Logger.log('Abrir búsqueda');
    }

    closeModals() {
        const modals = DOM.selectAll('.modal.show, .overlay.show');
        modals.forEach(modal => {
            DOM.removeClass(modal, 'show');
        });
    }

    goToHome() {
        if (this.managers.navigation) {
            this.managers.navigation.navigateToSection('hero');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Disparar evento personalizado
    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(eventName, {
            detail: { ...detail, app: this }
        });
        document.dispatchEvent(event);
    }

    // API pública
    getManager(name) {
        return this.managers[name];
    }

    getFeature(name) {
        return this.features.get(name);
    }

    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            currentTime: performance.now() - this.performanceMetrics.startTime
        };
    }

    // Destruir aplicación
    destroy() {
        // Limpiar managers
        Object.values(this.managers).forEach(manager => {
            if (manager && typeof manager.destroy === 'function') {
                manager.destroy();
            }
        });
        
        // Limpiar features
        this.features.forEach(feature => {
            if (feature && typeof feature.disconnect === 'function') {
                feature.disconnect();
            }
        });
        
        // Limpiar event listeners
        Events.removeAll();
        
        Logger.log('Aplicación destruida');
    }
}

// Inicializar aplicación cuando el DOM esté listo
let app = null;

const initApp = () => {
    if (document.readyState === 'loading') {
        Events.on(document, 'DOMContentLoaded', () => {
            app = new App();
        });
    } else {
        app = new App();
    }
};

// Manejar carga de la página
Events.on(window, 'load', () => {
    if (app) {
        app.performanceMetrics.loadTime = performance.now() - app.performanceMetrics.startTime;
        Logger.log(`Página cargada en ${app.performanceMetrics.loadTime.toFixed(2)}ms`);
        app.dispatchEvent('app:loaded');
    }
});

// Inicializar
initApp();

// Exportar para uso global
window.App = app;

// Exportar por defecto
export default {
    App,
    APP_CONFIG,
    getApp: () => app
};

// Testimonials Slider Functionality
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
const totalTestimonials = testimonials.length;
const container = document.getElementById('testimonialsContainer');
const dots = document.querySelectorAll('.pagination-dot');

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

// Auto-play functionality
let testimonialInterval;

function startTestimonialAutoplay() {
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
    clearInterval(testimonialInterval);
}

// Initialize testimonials slider
document.addEventListener('DOMContentLoaded', function() {
    updateTestimonialSlider();
    startTestimonialAutoplay();
    
    // Pause autoplay on hover
    const testimonialsSection = document.querySelector('.testimonials-slider');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', stopTestimonialAutoplay);
        testimonialsSection.addEventListener('mouseleave', startTestimonialAutoplay);
    }
});