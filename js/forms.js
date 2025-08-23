/* ===== MÓDULO DE FORMULARIOS ===== */

import { DOM, Events, Validation, Storage } from './utils.js';
import { AnimationUtils } from './animations.js';

// Configuración de formularios
const FORM_CONFIG = {
    debounceDelay: 300,
    submitTimeout: 10000,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
    apiEndpoint: '/api/contact', // Cambiar por endpoint real
    recaptchaSiteKey: '', // Agregar clave de reCAPTCHA
    notifications: {
        duration: 5000,
        position: 'top-right'
    }
};

// Mensajes de validación
const VALIDATION_MESSAGES = {
    required: 'Este campo es obligatorio',
    email: 'Por favor, introduce un email válido',
    phone: 'Por favor, introduce un teléfono válido',
    minLength: 'Debe tener al menos {min} caracteres',
    maxLength: 'No puede tener más de {max} caracteres',
    pattern: 'El formato no es válido',
    fileSize: 'El archivo es demasiado grande (máximo {size}MB)',
    fileType: 'Tipo de archivo no permitido',
    url: 'Por favor, introduce una URL válida',
    number: 'Por favor, introduce un número válido',
    date: 'Por favor, introduce una fecha válida'
};

// Clase principal para manejar formularios
class FormManager {
    constructor() {
        this.forms = new Map();
        this.validators = new Map();
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.setupForms();
        this.setupGlobalValidation();
        this.setupFileUploads();
        this.setupAutoSave();
        this.loadSavedData();
    }

    // Configurar formularios
    setupForms() {
        const forms = DOM.selectAll('form');
        forms.forEach(form => this.registerForm(form));
    }

    // Registrar formulario
    registerForm(form) {
        const formId = form.id || `form-${Date.now()}`;
        if (!form.id) form.id = formId;

        const formData = {
            element: form,
            fields: new Map(),
            isValid: false,
            isDirty: false,
            config: this.getFormConfig(form)
        };

        // Registrar campos
        const fields = DOM.selectAll('input, textarea, select', form);
        fields.forEach(field => this.registerField(formData, field));

        // Eventos del formulario
        Events.on(form, 'submit', (e) => this.handleSubmit(e, formData));
        Events.on(form, 'reset', (e) => this.handleReset(e, formData));

        this.forms.set(formId, formData);
        return formData;
    }

    // Obtener configuración del formulario
    getFormConfig(form) {
        return {
            validateOnInput: DOM.getData(form, 'validate-on-input') !== 'false',
            validateOnBlur: DOM.getData(form, 'validate-on-blur') !== 'false',
            autoSave: DOM.getData(form, 'auto-save') === 'true',
            showProgress: DOM.getData(form, 'show-progress') === 'true',
            ajax: DOM.getData(form, 'ajax') !== 'false',
            endpoint: DOM.getData(form, 'endpoint') || FORM_CONFIG.apiEndpoint
        };
    }

    // Registrar campo
    registerField(formData, field) {
        const fieldName = field.name || field.id;
        if (!fieldName) return;

        const fieldData = {
            element: field,
            name: fieldName,
            type: field.type || 'text',
            isValid: true,
            isDirty: false,
            errors: [],
            rules: this.getFieldRules(field)
        };

        // Eventos del campo
        if (formData.config.validateOnInput) {
            Events.on(field, 'input', Events.debounce(() => {
                this.validateField(formData, fieldData);
                this.updateFormState(formData);
            }, FORM_CONFIG.debounceDelay));
        }

        if (formData.config.validateOnBlur) {
            Events.on(field, 'blur', () => {
                this.validateField(formData, fieldData);
                this.updateFormState(formData);
            });
        }

        Events.on(field, 'focus', () => {
            this.clearFieldErrors(fieldData);
        });

        Events.on(field, 'change', () => {
            fieldData.isDirty = true;
            formData.isDirty = true;
            
            if (formData.config.autoSave) {
                this.autoSaveForm(formData);
            }
        });

        formData.fields.set(fieldName, fieldData);
    }

    // Obtener reglas de validación del campo
    getFieldRules(field) {
        const rules = [];

        // Required
        if (field.required || DOM.getData(field, 'required') === 'true') {
            rules.push({ type: 'required' });
        }

        // Email
        if (field.type === 'email') {
            rules.push({ type: 'email' });
        }

        // Phone
        if (DOM.getData(field, 'validate') === 'phone') {
            rules.push({ type: 'phone' });
        }

        // URL
        if (field.type === 'url') {
            rules.push({ type: 'url' });
        }

        // Number
        if (field.type === 'number') {
            rules.push({ type: 'number' });
        }

        // Min/Max length
        const minLength = field.minLength || DOM.getData(field, 'min-length');
        if (minLength) {
            rules.push({ type: 'minLength', value: parseInt(minLength) });
        }

        const maxLength = field.maxLength || DOM.getData(field, 'max-length');
        if (maxLength) {
            rules.push({ type: 'maxLength', value: parseInt(maxLength) });
        }

        // Pattern
        const pattern = field.pattern || DOM.getData(field, 'pattern');
        if (pattern) {
            rules.push({ type: 'pattern', value: new RegExp(pattern) });
        }

        // Custom validation
        const customValidator = DOM.getData(field, 'validator');
        if (customValidator && this.validators.has(customValidator)) {
            rules.push({ type: 'custom', validator: customValidator });
        }

        return rules;
    }

    // Validar campo
    validateField(formData, fieldData) {
        const { element, rules } = fieldData;
        const value = this.getFieldValue(element);
        const errors = [];

        rules.forEach(rule => {
            const error = this.validateRule(value, rule, element);
            if (error) {
                errors.push(error);
            }
        });

        fieldData.errors = errors;
        fieldData.isValid = errors.length === 0;

        this.displayFieldErrors(fieldData);
        return fieldData.isValid;
    }

    // Validar regla específica
    validateRule(value, rule, element) {
        switch (rule.type) {
            case 'required':
                if (!Validation.required(value)) {
                    return VALIDATION_MESSAGES.required;
                }
                break;

            case 'email':
                if (value && !Validation.email(value)) {
                    return VALIDATION_MESSAGES.email;
                }
                break;

            case 'phone':
                if (value && !Validation.phone(value)) {
                    return VALIDATION_MESSAGES.phone;
                }
                break;

            case 'url':
                if (value && !Validation.url(value)) {
                    return VALIDATION_MESSAGES.url;
                }
                break;

            case 'number':
                if (value && !Validation.number(value)) {
                    return VALIDATION_MESSAGES.number;
                }
                break;

            case 'minLength':
                if (value && !Validation.minLength(value, rule.value)) {
                    return VALIDATION_MESSAGES.minLength.replace('{min}', rule.value);
                }
                break;

            case 'maxLength':
                if (value && !Validation.maxLength(value, rule.value)) {
                    return VALIDATION_MESSAGES.maxLength.replace('{max}', rule.value);
                }
                break;

            case 'pattern':
                if (value && !rule.value.test(value)) {
                    return VALIDATION_MESSAGES.pattern;
                }
                break;

            case 'custom':
                const validator = this.validators.get(rule.validator);
                if (validator) {
                    const result = validator(value, element);
                    if (result !== true) {
                        return result || 'Valor no válido';
                    }
                }
                break;
        }

        return null;
    }

    // Obtener valor del campo
    getFieldValue(element) {
        switch (element.type) {
            case 'checkbox':
                return element.checked;
            case 'radio':
                const radioGroup = DOM.selectAll(`input[name="${element.name}"]`);
                const checked = Array.from(radioGroup).find(radio => radio.checked);
                return checked ? checked.value : '';
            case 'select-multiple':
                return Array.from(element.selectedOptions).map(option => option.value);
            case 'file':
                return element.files;
            default:
                return element.value.trim();
        }
    }

    // Mostrar errores del campo
    displayFieldErrors(fieldData) {
        const { element, errors } = fieldData;
        
        // Remover errores anteriores
        this.clearFieldErrors(fieldData);

        if (errors.length > 0) {
            DOM.addClass(element, 'error');
            
            // Crear contenedor de errores
            const errorContainer = DOM.create('div', 'field-errors');
            errors.forEach(error => {
                const errorElement = DOM.create('span', 'field-error');
                errorElement.textContent = error;
                errorContainer.appendChild(errorElement);
            });

            // Insertar después del campo
            element.parentNode.insertBefore(errorContainer, element.nextSibling);
            
            // Animar entrada del error
            AnimationUtils.slideIn(errorContainer, 'down', 20);
        } else {
            DOM.removeClass(element, 'error');
            DOM.addClass(element, 'valid');
        }
    }

    // Limpiar errores del campo
    clearFieldErrors(fieldData) {
        const { element } = fieldData;
        DOM.removeClass(element, 'error');
        DOM.removeClass(element, 'valid');
        
        const errorContainer = element.parentNode.querySelector('.field-errors');
        if (errorContainer) {
            errorContainer.remove();
        }
    }

    // Actualizar estado del formulario
    updateFormState(formData) {
        const allFieldsValid = Array.from(formData.fields.values())
            .every(field => field.isValid);
        
        formData.isValid = allFieldsValid;
        
        // Actualizar botón de envío
        const submitButton = DOM.select('button[type="submit"], input[type="submit"]', formData.element);
        if (submitButton) {
            submitButton.disabled = !allFieldsValid;
            
            if (allFieldsValid) {
                DOM.removeClass(submitButton, 'disabled');
                DOM.addClass(submitButton, 'enabled');
            } else {
                DOM.addClass(submitButton, 'disabled');
                DOM.removeClass(submitButton, 'enabled');
            }
        }
    }

    // Manejar envío del formulario
    async handleSubmit(e, formData) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Validar todos los campos
        const isValid = this.validateForm(formData);
        if (!isValid) {
            this.showNotification('Por favor, corrige los errores antes de enviar', 'error');
            return;
        }

        this.isSubmitting = true;
        
        try {
            // Mostrar estado de carga
            this.showLoadingState(formData);
            
            // Recopilar datos del formulario
            const data = this.collectFormData(formData);
            
            // Enviar formulario
            if (formData.config.ajax) {
                await this.submitFormAjax(formData, data);
            } else {
                this.submitFormTraditional(formData, data);
            }
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            this.showNotification('Error al enviar el formulario. Por favor, inténtalo de nuevo.', 'error');
            this.hideLoadingState(formData);
        } finally {
            this.isSubmitting = false;
        }
    }

    // Validar formulario completo
    validateForm(formData) {
        let isValid = true;
        
        formData.fields.forEach(fieldData => {
            if (!this.validateField(formData, fieldData)) {
                isValid = false;
            }
        });
        
        this.updateFormState(formData);
        return isValid;
    }

    // Recopilar datos del formulario
    collectFormData(formData) {
        const data = new FormData();
        
        formData.fields.forEach(fieldData => {
            const { element, name } = fieldData;
            const value = this.getFieldValue(element);
            
            if (element.type === 'file') {
                Array.from(value).forEach(file => {
                    data.append(name, file);
                });
            } else if (Array.isArray(value)) {
                value.forEach(val => {
                    data.append(name, val);
                });
            } else if (value !== '' && value !== false) {
                data.append(name, value);
            }
        });
        
        return data;
    }

    // Enviar formulario via AJAX
    async submitFormAjax(formData, data) {
        const response = await fetch(formData.config.endpoint, {
            method: 'POST',
            body: data,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            this.handleSubmitSuccess(formData, result);
        } else {
            this.handleSubmitError(formData, result);
        }
    }

    // Enviar formulario tradicional
    submitFormTraditional(formData, data) {
        // Crear formulario temporal para envío tradicional
        const tempForm = DOM.create('form');
        tempForm.method = 'POST';
        tempForm.action = formData.config.endpoint;
        tempForm.style.display = 'none';
        
        // Agregar campos
        for (const [key, value] of data.entries()) {
            const input = DOM.create('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            tempForm.appendChild(input);
        }
        
        document.body.appendChild(tempForm);
        tempForm.submit();
    }

    // Manejar éxito del envío
    handleSubmitSuccess(formData, result) {
        this.hideLoadingState(formData);
        this.showNotification(result.message || '¡Formulario enviado correctamente!', 'success');
        
        // Limpiar formulario
        this.resetForm(formData);
        
        // Limpiar datos guardados
        this.clearSavedData(formData);
        
        // Callback personalizado
        const onSuccess = DOM.getData(formData.element, 'on-success');
        if (onSuccess && window[onSuccess]) {
            window[onSuccess](result);
        }
    }

    // Manejar error del envío
    handleSubmitError(formData, result) {
        this.hideLoadingState(formData);
        this.showNotification(result.message || 'Error al enviar el formulario', 'error');
        
        // Mostrar errores específicos de campos
        if (result.errors) {
            Object.entries(result.errors).forEach(([fieldName, errors]) => {
                const fieldData = formData.fields.get(fieldName);
                if (fieldData) {
                    fieldData.errors = Array.isArray(errors) ? errors : [errors];
                    fieldData.isValid = false;
                    this.displayFieldErrors(fieldData);
                }
            });
        }
    }

    // Mostrar estado de carga
    showLoadingState(formData) {
        const submitButton = DOM.select('button[type="submit"], input[type="submit"]', formData.element);
        if (submitButton) {
            submitButton.disabled = true;
            DOM.addClass(submitButton, 'loading');
            
            // Guardar texto original
            const originalText = submitButton.textContent;
            DOM.setData(submitButton, 'original-text', originalText);
            submitButton.textContent = 'Enviando...';
        }
        
        DOM.addClass(formData.element, 'submitting');
    }

    // Ocultar estado de carga
    hideLoadingState(formData) {
        const submitButton = DOM.select('button[type="submit"], input[type="submit"]', formData.element);
        if (submitButton) {
            submitButton.disabled = false;
            DOM.removeClass(submitButton, 'loading');
            
            // Restaurar texto original
            const originalText = DOM.getData(submitButton, 'original-text');
            if (originalText) {
                submitButton.textContent = originalText;
            }
        }
        
        DOM.removeClass(formData.element, 'submitting');
    }

    // Manejar reset del formulario
    handleReset(e, formData) {
        setTimeout(() => {
            this.resetForm(formData);
        }, 0);
    }

    // Resetear formulario
    resetForm(formData) {
        formData.fields.forEach(fieldData => {
            fieldData.isValid = true;
            fieldData.isDirty = false;
            fieldData.errors = [];
            this.clearFieldErrors(fieldData);
        });
        
        formData.isValid = false;
        formData.isDirty = false;
        
        this.updateFormState(formData);
    }

    // Configurar validación global
    setupGlobalValidation() {
        // Validador personalizado para confirmar contraseña
        this.addValidator('confirmPassword', (value, element) => {
            const passwordField = DOM.select(`#${DOM.getData(element, 'confirm')}`);
            if (passwordField && value !== passwordField.value) {
                return 'Las contraseñas no coinciden';
            }
            return true;
        });
        
        // Validador para términos y condiciones
        this.addValidator('terms', (value, element) => {
            if (!value) {
                return 'Debes aceptar los términos y condiciones';
            }
            return true;
        });
    }

    // Agregar validador personalizado
    addValidator(name, validator) {
        this.validators.set(name, validator);
    }

    // Configurar subida de archivos
    setupFileUploads() {
        const fileInputs = DOM.selectAll('input[type="file"]');
        fileInputs.forEach(input => {
            Events.on(input, 'change', (e) => {
                this.handleFileUpload(e.target);
            });
        });
    }

    // Manejar subida de archivos
    handleFileUpload(input) {
        const files = Array.from(input.files);
        const errors = [];
        
        files.forEach(file => {
            // Validar tamaño
            if (file.size > FORM_CONFIG.maxFileSize) {
                errors.push(`${file.name}: ${VALIDATION_MESSAGES.fileSize.replace('{size}', FORM_CONFIG.maxFileSize / 1024 / 1024)}`);
            }
            
            // Validar tipo
            if (!FORM_CONFIG.allowedFileTypes.includes(file.type)) {
                errors.push(`${file.name}: ${VALIDATION_MESSAGES.fileType}`);
            }
        });
        
        if (errors.length > 0) {
            this.showNotification(errors.join('\n'), 'error');
            input.value = '';
            return;
        }
        
        // Mostrar preview de archivos
        this.showFilePreview(input, files);
    }

    // Mostrar preview de archivos
    showFilePreview(input, files) {
        const previewContainer = input.parentNode.querySelector('.file-preview') || 
            (() => {
                const container = DOM.create('div', 'file-preview');
                input.parentNode.appendChild(container);
                return container;
            })();
        
        previewContainer.innerHTML = '';
        
        files.forEach(file => {
            const fileItem = DOM.create('div', 'file-item');
            
            if (file.type.startsWith('image/')) {
                const img = DOM.create('img', 'file-thumbnail');
                img.src = URL.createObjectURL(file);
                fileItem.appendChild(img);
            }
            
            const fileName = DOM.create('span', 'file-name');
            fileName.textContent = file.name;
            fileItem.appendChild(fileName);
            
            const fileSize = DOM.create('span', 'file-size');
            fileSize.textContent = this.formatFileSize(file.size);
            fileItem.appendChild(fileSize);
            
            previewContainer.appendChild(fileItem);
        });
    }

    // Formatear tamaño de archivo
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Configurar auto-guardado
    setupAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.forms.forEach(formData => {
                if (formData.config.autoSave && formData.isDirty) {
                    this.autoSaveForm(formData);
                }
            });
        }, 30000); // Auto-guardar cada 30 segundos
    }

    // Auto-guardar formulario
    autoSaveForm(formData) {
        const data = {};
        
        formData.fields.forEach(fieldData => {
            const value = this.getFieldValue(fieldData.element);
            if (value !== '' && value !== false && fieldData.element.type !== 'password') {
                data[fieldData.name] = value;
            }
        });
        
        Storage.set(`form-${formData.element.id}`, data);
    }

    // Cargar datos guardados
    loadSavedData() {
        this.forms.forEach(formData => {
            if (formData.config.autoSave) {
                const savedData = Storage.get(`form-${formData.element.id}`);
                if (savedData) {
                    this.populateForm(formData, savedData);
                }
            }
        });
    }

    // Poblar formulario con datos
    populateForm(formData, data) {
        Object.entries(data).forEach(([fieldName, value]) => {
            const fieldData = formData.fields.get(fieldName);
            if (fieldData) {
                const element = fieldData.element;
                
                switch (element.type) {
                    case 'checkbox':
                        element.checked = value;
                        break;
                    case 'radio':
                        if (element.value === value) {
                            element.checked = true;
                        }
                        break;
                    default:
                        element.value = value;
                }
            }
        });
    }

    // Limpiar datos guardados
    clearSavedData(formData) {
        Storage.remove(`form-${formData.element.id}`);
    }

    // Mostrar notificación
    showNotification(message, type = 'info') {
        const notification = DOM.create('div', `notification notification-${type}`);
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Cerrar">&times;</button>
        `;
        
        // Posicionar notificación
        const container = this.getNotificationContainer();
        container.appendChild(notification);
        
        // Animar entrada
        AnimationUtils.slideIn(notification, 'down', 50);
        
        // Auto-cerrar
        setTimeout(() => {
            this.hideNotification(notification);
        }, FORM_CONFIG.notifications.duration);
        
        // Cerrar manualmente
        const closeBtn = notification.querySelector('.notification-close');
        Events.on(closeBtn, 'click', () => {
            this.hideNotification(notification);
        });
    }

    // Obtener contenedor de notificaciones
    getNotificationContainer() {
        let container = DOM.select('.notifications-container');
        if (!container) {
            container = DOM.create('div', 'notifications-container');
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }
        return container;
    }

    // Ocultar notificación
    hideNotification(notification) {
        AnimationUtils.slideIn(notification, 'up', 50).then(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    // Obtener formulario por ID
    getForm(formId) {
        return this.forms.get(formId);
    }

    // Destruir instancia
    destroy() {
        // Limpiar interval de auto-guardado
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        // Limpiar formularios
        this.forms.clear();
        this.validators.clear();
    }
}

// Instancia global del manager de formularios
let formManager = null;

// Inicializar formularios cuando el DOM esté listo
export const initForms = () => {
    if (document.readyState === 'loading') {
        Events.on(document, 'DOMContentLoaded', () => {
            formManager = new FormManager();
        });
    } else {
        formManager = new FormManager();
    }
};

// Obtener instancia del manager
export const getFormManager = () => formManager;

// Exportar por defecto
export default {
    FormManager,
    initForms,
    getFormManager,
    VALIDATION_MESSAGES
};