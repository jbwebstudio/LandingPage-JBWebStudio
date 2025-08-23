/**
 * Manejo del Formulario de Contacto con EmailJS
 * JB Web Studio
 */

class ContactForm {
    constructor() {
        this.form = null;
        this.emailService = null;
        this.initialize();
    }

    initialize() {
        // ✅ Verificar que el formulario existe
        this.form = document.getElementById('contact-form');
        
        if (!this.form) {
            console.error('❌ Formulario de contacto no encontrado');
            return;
        }

        console.log('✅ Formulario encontrado:', this.form);

        // ✅ Obtener la instancia de EmailService
        this.emailService = window.EmailService;
        
        if (!this.emailService) {
            console.error('❌ EmailService no está disponible');
            return;
        }

        if (!this.emailService.isConfigured()) {
            console.error('❌ EmailService no está configurado correctamente');
            return;
        }

        console.log('✅ EmailService configurado correctamente');
        
        // ✅ Configurar el evento de envío
        this.setupFormSubmission();
    }

    setupFormSubmission() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📧 Iniciando envío del formulario...');
            
            try {
                // ✅ Validar campos antes del envío
                if (!this.validateForm()) {
                    return;
                }

                // ✅ Cambiar estado del botón
                this.setSubmitState(true);

                // ✅ Obtener datos del formulario
                const formData = this.getFormData();
                console.log('📋 Datos del formulario:', formData);

                // ✅ Enviar email usando la instancia
                const result = await this.emailService.sendEmail(formData);
                console.log('✅ Resultado del envío:', result);

                if (result.success) {
                    // ✅ Mostrar mensaje de éxito
                    this.showNotification('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
                    
                    // ✅ Resetear formulario
                    this.resetForm();
                } else {
                    // ✅ Mostrar error específico
                    this.showNotification(result.message, 'error');
                }

            } catch (error) {
                console.error('❌ Error al enviar email:', error);
                this.showNotification('Error inesperado al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
            } finally {
                // ✅ Restaurar estado del botón
                this.setSubmitState(false);
            }
        });
    }

    validateForm() {
        const nombre = document.getElementById('nombre')?.value?.trim();
        const email = document.getElementById('email')?.value?.trim();
        const servicio = document.getElementById('servicio')?.value;
        const presupuesto = document.getElementById('presupuesto')?.value;
        const mensaje = document.getElementById('mensaje')?.value?.trim();

        if (!nombre) {
            this.showNotification('Por favor, ingresa tu nombre', 'error');
            return false;
        }

        if (!email || !this.isValidEmail(email)) {
            this.showNotification('Por favor, ingresa un email válido', 'error');
            return false;
        }

        if (!servicio) {
            this.showNotification('Por favor, selecciona un servicio', 'error');
            return false;
        }

        if (!presupuesto) {
            this.showNotification('Por favor, selecciona un presupuesto', 'error');
            return false;
        }

        if (!mensaje) {
            this.showNotification('Por favor, escribe tu mensaje', 'error');
            return false;
        }

        return true;
    }

    getFormData() {
        return {
            from_name: document.getElementById('nombre')?.value?.trim() || '',
            from_email: document.getElementById('email')?.value?.trim() || '',
            service_type: document.getElementById('servicio')?.value || '',
            budget_range: document.getElementById('presupuesto')?.value || '',
            message: document.getElementById('mensaje')?.value?.trim() || ''
        };
    }

    setSubmitState(isSubmitting) {
        if (!this.form) {
            console.warn('⚠️ No se puede cambiar estado: formulario no encontrado');
            return;
        }

        const submitBtn = this.form.querySelector('button[type="submit"]');
        if (submitBtn) {
            if (isSubmitting) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            } else {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar solicitud';
            }
        } else {
            console.warn('⚠️ Botón de envío no encontrado');
        }
    }

    resetForm() {
        if (this.form) {
            this.form.reset();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // ✅ Remover notificaciones existentes
        const existingNotifications = document.querySelectorAll('.contact-form-notification');
        existingNotifications.forEach(notification => notification.remove());

        // ✅ Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = 'contact-form-notification';
        notification.textContent = message;
        
        // ✅ Estilos de la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // ✅ Colores según el tipo
        if (type === 'success') {
            notification.style.backgroundColor = '#27ae60';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#e74c3c';
        } else {
            notification.style.backgroundColor = '#3498db';
        }
        
        // ✅ Agregar al DOM
        document.body.appendChild(notification);
        
        // ✅ Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // ✅ Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// ✅ Inicializar cuando el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 Inicializando ContactForm...');
        window.contactForm = new ContactForm();
    });
} else {
    console.log('🚀 Inicializando ContactForm...');
    window.contactForm = new ContactForm();
}