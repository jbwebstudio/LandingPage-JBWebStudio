/* ===== UTILIDADES GENERALES ===== */

// Utilidades para manipulación del DOM
export const DOM = {
    // Seleccionar elemento
    select: (selector) => document.querySelector(selector),
    
    // Seleccionar múltiples elementos
    selectAll: (selector) => document.querySelectorAll(selector),
    
    // Crear elemento
    create: (tag, className = '', content = '') => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    },
    
    // Agregar clase
    addClass: (element, className) => {
        if (element) element.classList.add(className);
    },
    
    // Remover clase
    removeClass: (element, className) => {
        if (element) element.classList.remove(className);
    },
    
    // Toggle clase
    toggleClass: (element, className) => {
        if (element) element.classList.toggle(className);
    },
    
    // Verificar si tiene clase
    hasClass: (element, className) => {
        return element ? element.classList.contains(className) : false;
    },
    
    // Obtener atributo
    getAttr: (element, attr) => {
        return element ? element.getAttribute(attr) : null;
    },
    
    // Establecer atributo
    setAttr: (element, attr, value) => {
        if (element) element.setAttribute(attr, value);
    },
    
    // Remover atributo
    removeAttr: (element, attr) => {
        if (element) element.removeAttribute(attr);
    },
    
    // Obtener datos del elemento
    getData: (element, key) => {
        return element ? element.dataset[key] : null;
    },
    
    // Establecer datos del elemento
    setData: (element, key, value) => {
        if (element) element.dataset[key] = value;
    }
};

// Utilidades para eventos
export const Events = {
    // Agregar event listener
    on: (element, event, handler, options = {}) => {
        if (element) {
            element.addEventListener(event, handler, options);
        }
    },
    
    // Remover event listener
    off: (element, event, handler) => {
        if (element) {
            element.removeEventListener(event, handler);
        }
    },
    
    // Disparar evento personalizado
    trigger: (element, eventName, detail = {}) => {
        if (element) {
            const event = new CustomEvent(eventName, { detail });
            element.dispatchEvent(event);
        }
    },
    
    // Delegar eventos
    delegate: (parent, selector, event, handler) => {
        if (parent) {
            parent.addEventListener(event, (e) => {
                if (e.target.matches(selector)) {
                    handler.call(e.target, e);
                }
            });
        }
    },
    
    // Throttle para eventos
    throttle: (func, delay) => {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    },
    
    // Debounce para eventos
    debounce: (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
};

// Utilidades para animaciones
export const Animation = {
    // Fade in
    fadeIn: (element, duration = 300) => {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Fade out
    fadeOut: (element, duration = 300) => {
        if (!element) return;
        
        const start = performance.now();
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Slide up
    slideUp: (element, duration = 300) => {
        if (!element) return;
        
        const height = element.offsetHeight;
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ease`;
        element.style.height = height + 'px';
        
        requestAnimationFrame(() => {
            element.style.height = '0px';
            
            setTimeout(() => {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
                element.style.transition = '';
            }, duration);
        });
    },
    
    // Slide down
    slideDown: (element, duration = 300) => {
        if (!element) return;
        
        element.style.display = 'block';
        const height = element.scrollHeight;
        element.style.overflow = 'hidden';
        element.style.height = '0px';
        element.style.transition = `height ${duration}ms ease`;
        
        requestAnimationFrame(() => {
            element.style.height = height + 'px';
            
            setTimeout(() => {
                element.style.height = '';
                element.style.overflow = '';
                element.style.transition = '';
            }, duration);
        });
    }
};

// Utilidades para validación
export const Validation = {
    // Validar email
    isEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Validar teléfono
    isPhone: (phone) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    },
    
    // Validar URL
    isURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    // Validar longitud mínima
    minLength: (value, min) => {
        return value && value.length >= min;
    },
    
    // Validar longitud máxima
    maxLength: (value, max) => {
        return value && value.length <= max;
    },
    
    // Validar que no esté vacío
    required: (value) => {
        return value && value.trim().length > 0;
    },
    
    // Validar números
    isNumber: (value) => {
        return !isNaN(value) && !isNaN(parseFloat(value));
    },
    
    // Validar enteros
    isInteger: (value) => {
        return Number.isInteger(Number(value));
    }
};

// Utilidades para almacenamiento local
export const Storage = {
    // Guardar en localStorage
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    // Obtener de localStorage
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    // Remover de localStorage
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    // Limpiar localStorage
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    },
    
    // Verificar si existe una clave
    exists: (key) => {
        return localStorage.getItem(key) !== null;
    }
};

// Utilidades para fechas
export const DateUtils = {
    // Formatear fecha
    format: (date, format = 'DD/MM/YYYY') => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    },
    
    // Obtener fecha relativa
    timeAgo: (date) => {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);
        
        const intervals = {
            año: 31536000,
            mes: 2592000,
            semana: 604800,
            día: 86400,
            hora: 3600,
            minuto: 60
        };
        
        for (const [unit, seconds] of Object.entries(intervals)) {
            const interval = Math.floor(diffInSeconds / seconds);
            if (interval >= 1) {
                return `hace ${interval} ${unit}${interval > 1 ? 's' : ''}`;
            }
        }
        
        return 'hace un momento';
    },
    
    // Verificar si es fecha válida
    isValid: (date) => {
        return date instanceof Date && !isNaN(date);
    }
};

// Utilidades para strings
export const StringUtils = {
    // Capitalizar primera letra
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    // Convertir a slug
    slugify: (str) => {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },
    
    // Truncar texto
    truncate: (str, length, suffix = '...') => {
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },
    
    // Remover acentos
    removeAccents: (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },
    
    // Generar ID aleatorio
    randomId: (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

// Utilidades para números
export const NumberUtils = {
    // Formatear como moneda
    currency: (amount, currency = 'USD', locale = 'en-US') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Formatear con separadores de miles
    format: (number, locale = 'en-US') => {
        return new Intl.NumberFormat(locale).format(number);
    },
    
    // Generar número aleatorio
    random: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Redondear a decimales específicos
    round: (number, decimals = 2) => {
        return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },
    
    // Clamp (limitar entre min y max)
    clamp: (number, min, max) => {
        return Math.min(Math.max(number, min), max);
    }
};

// Utilidades para dispositivos
export const Device = {
    // Detectar si es móvil
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Detectar si es tablet
    isTablet: () => {
        return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    },
    
    // Detectar si es desktop
    isDesktop: () => {
        return !Device.isMobile() && !Device.isTablet();
    },
    
    // Obtener tamaño de pantalla
    getScreenSize: () => {
        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    },
    
    // Detectar soporte para touch
    hasTouch: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// Utilidades para URLs
export const URLUtils = {
    // Obtener parámetros de la URL
    getParams: () => {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        for (const [key, value] of params) {
            result[key] = value;
        }
        return result;
    },
    
    // Obtener parámetro específico
    getParam: (name) => {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    },
    
    // Actualizar parámetro de URL
    updateParam: (name, value) => {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.replaceState({}, '', url);
    },
    
    // Remover parámetro de URL
    removeParam: (name) => {
        const url = new URL(window.location);
        url.searchParams.delete(name);
        window.history.replaceState({}, '', url);
    }
};

// Utilidad para logging
export const Logger = {
    log: (message, data = null) => {
        if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
            console.log(`[LOG] ${message}`, data || '');
        }
    },
    
    info: (message, data = null) => {
        if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
            console.info(`[INFO] ${message}`, data || '');
        }
    },
    
    warn: (message, data = null) => {
        if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
            console.warn(`[WARN] ${message}`, data || '');
        }
    },
    
    error: (message, error = null) => {
        console.error(`[ERROR] ${message}`, error || '');
    }
};

// Exportar todas las utilidades como default
export default {
    DOM,
    Events,
    Animation,
    Validation,
    Storage,
    DateUtils,
    StringUtils,
    NumberUtils,
    Device,
    URLUtils,
    Logger
};