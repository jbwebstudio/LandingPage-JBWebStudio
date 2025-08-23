# Manual de Marca - JB WEB Studio

## 📋 Información General de la Marca

### Nombre de la Marca
**JB WEB Studio**
- **Propietario:** Jorge Blanco
- **Tagline:** "Web Studio"
- **Eslogan Principal:** "Transformo tus ideas digitales en resultados reales"

### Propuesta de Valor
- Diseño Web Profesional
- Landing Pages optimizadas, modernas, responsivas y rápidas
- Tiendas Online listas para vender
- SEO avanzado
- **Experiencia:** +50 proyectos exitosos
- **Garantía:** 100% satisfacción garantizada

---

## 🎨 Identidad Visual

### Logo
- **Archivo principal:** `logoSinFondo.png`
- **Versiones disponibles:**
  - `logoSinFondo16px.png` (favicon)
  - `logoSinFondo32px.png` (iconos pequeños)
  - `logoSinFondo180px.png` (footer y usos grandes)

### Uso del Logo
- Siempre mantener proporciones originales
- Usar sobre fondos que permitan buena legibilidad
- Área de respeto mínima: 50px de ancho en navegación
- Efecto hover: `transform: scale(1.05)`

---

## 🎨 Paleta de Colores

### Colores Principales
```css
--primary-color: #2563eb     /* Azul principal */
--primary-dark: #1d4ed8      /* Azul oscuro */
--primary-light: #3b82f6     /* Azul claro */
```

### Colores Secundarios
```css
--secondary-color: #f59e0b   /* Amarillo/Naranja */
--secondary-dark: #d97706    /* Amarillo oscuro */
--secondary-light: #fbbf24   /* Amarillo claro */
```

### Color de Acento
```css
--accent-color: #10b981      /* Verde esmeralda */
--accent-dark: #059669       /* Verde oscuro */
```

### Colores de Texto
```css
--text-primary: #0f172a      /* Texto principal (negro azulado) */
--text-secondary: #475569    /* Texto secundario (gris) */
--text-light: #64748b        /* Texto claro */
--text-nav: #ffffff          /* Texto navegación (blanco) */
```

### Colores de Fondo
```css
--bg-primary: #ffffff        /* Fondo principal (blanco) */
--bg-secondary: #f8fafc      /* Fondo secundario (gris muy claro) */
--bg-tertiary: #e2e8f0       /* Fondo terciario (gris claro) */
```

---

## 🌈 Gradientes de Marca

### Gradiente Principal
```css
--gradient-primary: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)
```

### Gradiente Secundario
```css
--gradient-secondary: linear-gradient(135deg, #f59e0b 0%, #d97706 100%)
```

### Gradiente de Acento
```css
--gradient-accent: linear-gradient(135deg, #10b981 0%, #059669 100%)
```

### Gradiente Hero
```css
--gradient-hero: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)
```

---

## ✍️ Tipografía

### Fuente Principal
**Poppins** (Google Fonts)
```css
--font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

### Jerarquía Tipográfica
```css
--font-size-xs: 0.75rem      /* 12px */
--font-size-sm: 0.875rem     /* 14px */
--font-size-base: 1rem       /* 16px - Base */
--font-size-lg: 1.125rem     /* 18px */
--font-size-xl: 1.25rem      /* 20px */
--font-size-2xl: 1.5rem      /* 24px */
--font-size-3xl: 1.875rem    /* 30px */
--font-size-4xl: 2.25rem     /* 36px */
--font-size-5xl: 3rem        /* 48px */
--font-size-6xl: 3.75rem     /* 60px */
```

### Uso de Tipografía
- **Títulos principales:** Poppins Bold (700)
- **Subtítulos:** Poppins SemiBold (600)
- **Texto base:** Poppins Regular (400)
- **Line-height:** 1.6 para texto base, 1.2 para títulos

---

## 🎯 Elementos de Marca

### Highlight Text (Texto Destacado)
```css
.highlight {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
}
```

### Badge Premium
- Fondo: Gradiente principal
- Color texto: Blanco
- Border-radius: 50px (completamente redondeado)
- Padding: 8px 20px
- Font-weight: 600
- Text-transform: uppercase
- Letter-spacing: 0.5px

---

## 🔘 Sistema de Botones

### Botón Primario
```css
.btn-primary {
    background: var(--gradient-primary);
    color: var(--bg-primary);
    padding: 14px 28px;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### Botón Outline
```css
.btn-outline {
    background: rgba(37, 99, 235, 0.08);
    color: #1d4ed8;
    border: 2px solid var(--primary-color);
    backdrop-filter: blur(4px);
}
```

### Tamaños de Botones
- **Small:** 8px 16px, font-size: 14px
- **Regular:** 14px 28px, font-size: 16px
- **Large:** 16px 32px, font-size: 18px
- **Extra Large:** 20px 40px, font-size: 20px

---

## 🌟 Efectos Visuales

### Sombras
```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

### Glassmorphism
```css
--glass-bg: rgba(255, 255, 255, 0.1)
--glass-border: rgba(255, 255, 255, 0.2)
--glass-blur: blur(10px)
```

### Border Radius
```css
--radius-sm: 6px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
--radius-full: 50px
```

---

## ⚡ Transiciones y Animaciones

### Transiciones Estándar
```css
--transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1)
--transition-normal: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: all 0.5s cubic-bezier(0.4, 0, 0.2, 1)
```

### Efectos Hover
- **Botones:** `translateY(-2px)` + aumento de sombra
- **Tarjetas:** `translateY(-5px)` + `scale(1.02)`
- **Logo:** `scale(1.05)`
- **Enlaces:** Color change + underline animation

---

## 📱 Responsive Design

### Breakpoints
```css
--breakpoint-xs: 480px
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
--breakpoint-2xl: 1536px
```

### Touch Targets (Móvil)
- Mínimo 44px de altura para elementos interactivos
- Botones de ancho completo en móvil
- Espaciado aumentado entre elementos

---

## 📞 Información de Contacto

### Datos de Contacto
- **Email:** jbwebstudiomde@gmail.com
- **Teléfono:** +57 (318) 406-7067
- **WhatsApp:** https://wa.link/j01359

### Redes Sociales
- **Facebook:** https://www.facebook.com/jbwebstudiomde
- **Instagram:** https://www.instagram.com/jbweb.studio/

---

## 📋 Directrices de Uso

### ✅ Permitido
- Usar colores de la paleta oficial
- Mantener proporciones del logo
- Aplicar efectos hover estándar
- Usar gradientes de marca
- Seguir jerarquía tipográfica

### ❌ No Permitido
- Modificar colores de marca
- Distorsionar el logo
- Usar fuentes diferentes a Poppins
- Cambiar border-radius estándar
- Usar sombras no definidas

### 🎯 Tono de Comunicación
- **Profesional** pero **accesible**
- **Confiable** y **moderno**
- **Orientado a resultados**
- **Técnico** pero **comprensible**

---

## 📊 Métricas de Marca

### Estadísticas Clave
- **+50 proyectos exitosos**
- **100% satisfacción garantizada**
- **Respuesta en 2 horas**
- **Consulta gratuita**
- **Freelancer Premium**

---

*Este manual de marca debe ser seguido consistentemente en todas las aplicaciones digitales y materiales de JB WEB Studio para mantener una identidad visual coherente y profesional.*