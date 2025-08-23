/**
 * Sistema de Consentimiento de Cookies para JB Web Studio
 * Cumple con RGPD y normativas de privacidad
 */

class CookieConsent {
    constructor() {
        this.cookieName = 'jbweb_cookie_consent';
        this.cookieExpiry = 365; // días
        this.init();
    }

    init() {
        // Verificar si ya existe consentimiento
        if (!this.hasConsent()) {
            this.showBanner();
        } else {
            this.loadAcceptedCookies();
        }
        
        // Agregar event listeners
        this.addEventListeners();
    }

    hasConsent() {
        return this.getCookie(this.cookieName) !== null;
    }

    showBanner() {
        const banner = this.createBanner();
        document.body.appendChild(banner);
        
        // Mostrar banner con animación
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-banner';
        
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <h3>🍪 Uso de Cookies</h3>
                    <p>Utilizamos cookies para mejorar tu experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Al hacer clic en "Aceptar todas", consientes el uso de TODAS las cookies.</p>
                    <p><a href="cookies.html" target="_blank" class="cookie-policy-link">Ver Política de Cookies</a></p>
                </div>
                <div class="cookie-banner-actions">
                    <button id="cookie-accept-all" class="cookie-btn cookie-btn-accept">Aceptar todas</button>
                    <button id="cookie-accept-necessary" class="cookie-btn cookie-btn-necessary">Solo necesarias</button>
                    <button id="cookie-settings" class="cookie-btn cookie-btn-settings">Configurar</button>
                    <button id="cookie-reject" class="cookie-btn cookie-btn-reject">Rechazar</button>
                </div>
            </div>
        `;
        
        return banner;
    }

    createSettingsModal() {
        const modal = document.createElement('div');
        modal.id = 'cookie-settings-modal';
        modal.className = 'cookie-modal';
        
        modal.innerHTML = `
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h3>Configuración de Cookies</h3>
                    <button id="cookie-modal-close" class="cookie-modal-close">&times;</button>
                </div>
                <div class="cookie-modal-body">
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h4>Cookies Necesarias</h4>
                            <label class="cookie-switch">
                                <input type="checkbox" id="necessary-cookies" checked disabled>
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        <p>Estas cookies son esenciales para el funcionamiento del sitio web y no se pueden desactivar.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h4>Cookies de Análisis</h4>
                            <label class="cookie-switch">
                                <input type="checkbox" id="analytics-cookies">
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        <p>Nos ayudan a entender cómo los visitantes interactúan con el sitio web recopilando información de forma anónima.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h4>Cookies de Marketing</h4>
                            <label class="cookie-switch">
                                <input type="checkbox" id="marketing-cookies">
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        <p>Se utilizan para rastrear a los visitantes en los sitios web para mostrar anuncios relevantes y atractivos.</p>
                    </div>
                </div>
                <div class="cookie-modal-footer">
                    <button id="cookie-save-settings" class="cookie-btn cookie-btn-accept">Guardar configuración</button>
                    <button id="cookie-accept-selected" class="cookie-btn cookie-btn-primary">Aceptar seleccionadas</button>
                </div>
            </div>
        `;
        
        return modal;
    }

    addEventListeners() {
        // Event delegation para botones del banner
        document.addEventListener('click', (e) => {
            switch(e.target.id) {
                case 'cookie-accept-all':
                    this.acceptAll();
                    break;
                case 'cookie-accept-necessary':
                    this.acceptNecessary();
                    break;
                case 'cookie-settings':
                    this.showSettings();
                    break;
                case 'cookie-reject':
                    this.rejectAll();
                    break;
                case 'cookie-modal-close':
                    this.closeSettings();
                    break;
                case 'cookie-save-settings':
                case 'cookie-accept-selected':
                    this.saveSettings();
                    break;
            }
        });

        // Cerrar modal al hacer clic fuera
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('cookie-settings-modal');
            if (modal && e.target === modal) {
                this.closeSettings();
            }
        });
    }

    acceptAll() {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.hideBanner();
        this.loadAcceptedCookies();
    }

    acceptNecessary() {
        const consent = {
            necessary: true,
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.hideBanner();
        this.loadAcceptedCookies();
    }

    rejectAll() {
        const consent = {
            necessary: true, // Siempre necesarias
            analytics: false,
            marketing: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.hideBanner();
        this.loadAcceptedCookies();
    }

    showSettings() {
        const modal = this.createSettingsModal();
        document.body.appendChild(modal);
        
        // Cargar configuración actual si existe
        const currentConsent = this.getConsent();
        if (currentConsent) {
            document.getElementById('analytics-cookies').checked = currentConsent.analytics;
            document.getElementById('marketing-cookies').checked = currentConsent.marketing;
        }
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    closeSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    saveSettings() {
        const consent = {
            necessary: true,
            analytics: document.getElementById('analytics-cookies').checked,
            marketing: document.getElementById('marketing-cookies').checked,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.closeSettings();
        this.hideBanner();
        this.loadAcceptedCookies();
    }

    hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    saveConsent(consent) {
        this.setCookie(this.cookieName, JSON.stringify(consent), this.cookieExpiry);
        
        // Disparar evento personalizado
        const event = new CustomEvent('cookieConsentChanged', {
            detail: consent
        });
        document.dispatchEvent(event);
    }

    getConsent() {
        const consentCookie = this.getCookie(this.cookieName);
        return consentCookie ? JSON.parse(consentCookie) : null;
    }

    loadAcceptedCookies() {
        const consent = this.getConsent();
        if (!consent) return;

        // Cargar cookies según el consentimiento
        if (consent.analytics) {
            this.loadAnalyticsCookies();
        }
        
        if (consent.marketing) {
            this.loadMarketingCookies();
        }
        
        // Siempre cargar cookies necesarias
        this.loadNecessaryCookies();
    }

    loadNecessaryCookies() {
        // Cookies técnicas necesarias para el funcionamiento
        console.log('Cargando cookies necesarias...');
        
        // Ejemplo: Cookie de sesión, preferencias de idioma, etc.
        this.setCookie('jbweb_session', 'active', 1);
    }

    loadAnalyticsCookies() {
        console.log('Cargando cookies de análisis...');
        
        // Ejemplo: Google Analytics, etc.
        // Aquí puedes integrar Google Analytics u otras herramientas
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }

    loadMarketingCookies() {
        console.log('Cargando cookies de marketing...');
        
        // Ejemplo: Facebook Pixel, Google Ads, etc.
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
    }

    // Utilidades para manejo de cookies
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    // Método público para cambiar consentimiento
    updateConsent() {
        this.showSettings();
    }

    // Método público para resetear consentimiento
    resetConsent() {
        this.deleteCookie(this.cookieName);
        location.reload();
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cookieConsent = new CookieConsent();
    });
} else {
    window.cookieConsent = new CookieConsent();
}

// Exportar para uso global
window.CookieConsent = CookieConsent;