/**
 * Servicio de EmailJS para JB Web Studio
 * Manejo singleton para una sola instancia global
 */

class EmailService {
    constructor() {
        // Configuración de EmailJS - CLAVES REALES
        this.serviceID = 'JBwebStudio_xftc5g3';
        this.templateID = 'template_bnhvzjd';
        this.publicKey = 'Z0g6iyjBvdKjDOVxQ';
        
        this.init();
    }

    init() {
        // ✅ Inicialización correcta para EmailJS v4
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.publicKey);
            console.log('✅ EmailJS inicializado correctamente');
        } else {
            console.error('❌ EmailJS no está cargado');
        }
    }

    async sendEmail(formData) {
        try {
            // ✅ Verificar que EmailJS esté disponible
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS no está disponible');
            }

            // Preparar los datos del template
            const templateParams = {
                from_name: formData.from_name,
                from_email: formData.from_email,
                service_type: formData.service_type,
                budget_range: formData.budget_range,
                message: formData.message,
                to_email: 'jbwebstudiomde@gmail.com',
                reply_to: formData.from_email,
                timestamp: new Date().toLocaleString('es-ES', {
                    timeZone: 'America/Bogota',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            console.log('📧 Enviando email con parámetros:', templateParams);

            // ✅ Usar emailjs.send con la sintaxis correcta
            const response = await emailjs.send(
                this.serviceID,
                this.templateID,
                templateParams
            );

            console.log('✅ Email enviado exitosamente:', response);
            return {
                success: true,
                message: '¡Mensaje enviado exitosamente! Te responderé pronto.',
                response: response
            };

        } catch (error) {
            console.error('❌ Error detallado al enviar email:', error);
            
            let errorMessage = 'Hubo un problema al enviar tu mensaje. ';
            
            if (error.status === 400) {
                errorMessage += 'Datos del formulario inválidos.';
            } else if (error.status === 401) {
                errorMessage += 'Error de autenticación con EmailJS.';
            } else if (error.status === 402) {
                errorMessage += 'Límite de envíos alcanzado.';
            } else if (error.status === 404) {
                errorMessage += 'Servicio o template no encontrado.';
            } else {
                errorMessage += 'Error de conexión. Intenta nuevamente.';
            }

            return {
                success: false,
                message: errorMessage,
                error: error
            };
        }
    }

    isConfigured() {
        const isValid = this.publicKey && 
                       this.serviceID && 
                       this.templateID &&
                       this.publicKey.trim() !== '' &&
                       this.serviceID.trim() !== '' &&
                       this.templateID.trim() !== '';
        
        console.log('🔧 Configuración válida:', isValid);
        return isValid;
    }
}

// ✅ CREAR INSTANCIA GLOBAL SINGLETON
window.emailServiceInstance = new EmailService();

// ✅ Exportar la instancia para uso global
window.EmailService = window.emailServiceInstance;