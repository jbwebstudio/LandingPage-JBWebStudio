/**
 * Blog JavaScript - Funcionalidad interactiva para la página del blog
 * Incluye filtros de categorías, carga de más artículos y animaciones
 */

class BlogManager {
    constructor() {
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.articleCards = document.querySelectorAll('.article-card');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        this.articlesGrid = document.querySelector('.articles-grid');
        this.newsletterForm = document.querySelector('.newsletter-form');
        
        this.currentCategory = 'all';
        this.articlesPerPage = 6;
        this.currentPage = 1;
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.setupCategoryFilters();
        this.setupLoadMore();
        this.setupNewsletter();
        this.setupScrollAnimations();
        this.showInitialArticles();
    }
    
    /**
     * Configurar filtros de categorías
     */
    setupCategoryFilters() {
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const category = button.dataset.category;
                this.filterByCategory(category);
                this.updateActiveCategory(button);
            });
        });
    }
    
    /**
     * Filtrar artículos por categoría
     */
    filterByCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        
        // Añadir clase de loading
        this.articlesGrid.classList.add('loading');
        
        setTimeout(() => {
            this.articleCards.forEach(card => {
                const cardCategory = card.dataset.category;
                const shouldShow = category === 'all' || cardCategory === category;
                
                if (shouldShow) {
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                    card.style.display = 'block';
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                    setTimeout(() => {
                        if (card.classList.contains('hidden')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
            
            // Remover clase de loading
            this.articlesGrid.classList.remove('loading');
            
            // Actualizar botón de cargar más
            this.updateLoadMoreButton();
        }, 300);
    }
    
    /**
     * Actualizar categoría activa
     */
    updateActiveCategory(activeButton) {
        this.categoryButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    /**
     * Configurar funcionalidad de cargar más
     */
    setupLoadMore() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }
    }
    
    /**
     * Cargar más artículos
     */
    loadMoreArticles() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.loadMoreBtn.classList.add('loading');
        this.loadMoreBtn.innerHTML = `
            <span class="btn-text">Cargando...</span>
            <i class="fas fa-spinner" aria-hidden="true"></i>
        `;
        
        // Simular carga de artículos (en una implementación real, esto sería una llamada AJAX)
        setTimeout(() => {
            this.currentPage++;
            
            // Aquí se cargarían más artículos desde el servidor
            // Por ahora, simplemente mostramos un mensaje
            console.log(`Cargando página ${this.currentPage} de categoría: ${this.currentCategory}`);
            
            this.isLoading = false;
            this.loadMoreBtn.classList.remove('loading');
            this.loadMoreBtn.innerHTML = `
                <span class="btn-text">Cargar Más Artículos</span>
                <i class="fas fa-chevron-down" aria-hidden="true"></i>
            `;
            
            // Simular que no hay más artículos después de 3 páginas
            if (this.currentPage >= 3) {
                this.loadMoreBtn.style.display = 'none';
                this.showNoMoreArticlesMessage();
            }
        }, 1500);
    }
    
    /**
     * Mostrar mensaje de no más artículos
     */
    showNoMoreArticlesMessage() {
        const message = document.createElement('div');
        message.className = 'no-more-articles';
        message.innerHTML = `
            <p>¡Has visto todos los artículos disponibles!</p>
            <p>Suscríbete a nuestro newsletter para recibir nuevos artículos.</p>
        `;
        message.style.cssText = `
            text-align: center;
            padding: var(--spacing-xl);
            color: var(--color-texto-secundario);
            font-style: italic;
        `;
        
        this.loadMoreBtn.parentNode.replaceChild(message, this.loadMoreBtn);
    }
    
    /**
     * Actualizar botón de cargar más según la categoría
     */
    updateLoadMoreButton() {
        const visibleArticles = Array.from(this.articleCards).filter(card => 
            card.style.display !== 'none' && !card.classList.contains('hidden')
        );
        
        if (visibleArticles.length === 0) {
            this.loadMoreBtn.style.display = 'none';
        } else {
            this.loadMoreBtn.style.display = 'inline-flex';
        }
    }
    
    /**
     * Mostrar artículos iniciales
     */
    showInitialArticles() {
        this.articleCards.forEach((card, index) => {
            card.style.display = 'block';
            card.classList.add('visible');
            
            // Animación escalonada
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    /**
     * Configurar formulario de newsletter
     */
    setupNewsletter() {
        if (this.newsletterForm) {
            this.newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(e);
            });
        }
    }
    
    /**
     * Manejar envío de newsletter
     */
    handleNewsletterSubmit(e) {
        const formData = new FormData(e.target);
        const email = e.target.querySelector('input[type="email"]').value;
        const submitBtn = e.target.querySelector('.newsletter-submit-btn');
        
        if (!this.validateEmail(email)) {
            this.showNotification('Por favor, ingresa un email válido', 'error');
            return;
        }
        
        // Deshabilitar botón durante el envío
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Suscribiendo...</span>
            <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
        `;
        
        // Simular envío (en una implementación real, esto sería una llamada AJAX)
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span>Suscribirse</span>
                <i class="fas fa-paper-plane" aria-hidden="true"></i>
            `;
            
            e.target.reset();
            this.showNotification('¡Gracias por suscribirte! Recibirás nuestras últimas actualizaciones.', 'success');
        }, 2000);
    }
    
    /**
     * Validar email
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Mostrar notificación
     */
    showNotification(message, type = 'info') {
        // Remover notificación existente
        const existingNotification = document.querySelector('.blog-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `blog-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Cerrar notificación">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Configurar cierre
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            if (document.body.contains(notification)) {
                this.hideNotification(notification);
            }
        }, 5000);
    }
    
    /**
     * Ocultar notificación
     */
    hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    }
    
    /**
     * Configurar animaciones de scroll
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observar elementos para animación
        const elementsToAnimate = document.querySelectorAll('.article-card, .newsletter-section');
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
    }
}

/**
 * Utilidades adicionales para el blog
 */
class BlogUtils {
    /**
     * Formatear fecha
     */
    static formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
    
    /**
     * Calcular tiempo de lectura
     */
    static calculateReadTime(content) {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const readTime = Math.ceil(words / wordsPerMinute);
        return `${readTime} min lectura`;
    }
    
    /**
     * Compartir en redes sociales
     */
    static shareArticle(platform, url, title) {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }
}

// Inicializar el blog cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new BlogManager();
});

// Exportar para uso global
window.BlogManager = BlogManager;
window.BlogUtils = BlogUtils;