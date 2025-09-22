/**
 * Lazy Loading Implementation for Images
 * Optimiza la carga de imágenes para mejorar el rendimiento
 */

class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.images = [];
        this.init();
    }

    init() {
        // Verificar soporte para Intersection Observer
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback para navegadores antiguos
            this.loadAllImages();
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px 0px', // Cargar imágenes 50px antes de que sean visibles
            threshold: 0.01
        };

        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.observeImages();
    }

    observeImages() {
        // Seleccionar todas las imágenes que no tienen loading="eager"
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        
        images.forEach(img => {
            // Si la imagen ya tiene data-src, usar ese sistema
            if (img.hasAttribute('data-src')) {
                this.imageObserver.observe(img);
            } else if (img.getAttribute('loading') === 'lazy') {
                // Para imágenes con loading="lazy", agregar data-src
                img.setAttribute('data-src', img.src);
                img.removeAttribute('src');
                img.setAttribute('loading', 'lazy');
                this.imageObserver.observe(img);
            }
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        // Crear una nueva imagen para precargar
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // Aplicar efecto de fade-in
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease-in-out';
            
            img.src = src;
            img.removeAttribute('data-src');
            
            // Fade in effect
            setTimeout(() => {
                img.style.opacity = '1';
            }, 10);
            
            // Agregar clase para indicar que la imagen se cargó
            img.classList.add('lazy-loaded');
        };

        imageLoader.onerror = () => {
            // En caso de error, mostrar imagen placeholder o de error
            img.classList.add('lazy-error');
            console.warn('Error loading lazy image:', src);
        };

        imageLoader.src = src;
    }

    loadAllImages() {
        // Fallback: cargar todas las imágenes inmediatamente
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }

    // Método para agregar nuevas imágenes dinámicamente
    addImage(img) {
        if (this.imageObserver && img.hasAttribute('data-src')) {
            this.imageObserver.observe(img);
        }
    }

    // Método para destruir el observer
    destroy() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// CSS para efectos de carga
const lazyLoadingStyles = `
    <style>
        img[data-src] {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        
        img.lazy-loaded {
            background: none;
            animation: none;
        }
        
        img.lazy-error {
            background: #f5f5f5;
            position: relative;
        }
        
        img.lazy-error::after {
            content: '⚠️ Error al cargar imagen';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        
        @keyframes loading {
            0% {
                background-position: 200% 0;
            }
            100% {
                background-position: -200% 0;
            }
        }
        
        /* Optimización para imágenes críticas */
        .hero-image,
        .logo-icon,
        img[loading="eager"] {
            opacity: 1 !important;
        }
    </style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', lazyLoadingStyles);

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyImageLoader();
});

// Exportar para uso en otros scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyImageLoader;
}