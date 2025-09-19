// ====================================
// COMPREHENSIVE CODE SNIPPETS LIBRARY
// ====================================

// Global snippets object with extensive code templates
window.codeSnippets = {

    // HTML SNIPPETS
    html: [
        {
            name: 'HTML5 Boilerplate',
            description: 'Complete HTML5 document structure',
            code: `<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Opis strony">
    <meta name="keywords" content="słowa, kluczowe">
    <meta name="author" content="Autor">
    <title>Tytuł Strony</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">O nas</a></li>
                <li><a href="#contact">Kontakt</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h1>Witaj na stronie!</h1>
            <p>To jest przykładowa treść.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 Nazwa firmy. Wszystkie prawa zastrzeżone.</p>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>`
        },
        {
            name: 'Modern Card Component',
            description: 'Responsive card with image and content',
            code: `<div class="card">
    <div class="card-image">
        <img src="https://picsum.photos/300/200" alt="Card image">
    </div>
    <div class="card-content">
        <div class="card-header">
            <h3 class="card-title">Card Title</h3>
            <span class="card-badge">New</span>
        </div>
        <p class="card-description">
            This is a description of the card content. It can contain multiple lines of text.
        </p>
        <div class="card-actions">
            <button class="btn btn-primary">Read More</button>
            <button class="btn btn-secondary">Share</button>
        </div>
    </div>
</div>`
        },
        {
            name: 'Contact Form',
            description: 'Complete contact form with validation',
            code: `<form class="contact-form" id="contactForm">
    <div class="form-group">
        <label for="name">Imię i nazwisko *</label>
        <input type="text" id="name" name="name" required>
    </div>
    
    <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-group">
        <label for="phone">Telefon</label>
        <input type="tel" id="phone" name="phone">
    </div>
    
    <div class="form-group">
        <label for="subject">Temat *</label>
        <select id="subject" name="subject" required>
            <option value="">Wybierz temat</option>
            <option value="general">Ogólne pytanie</option>
            <option value="support">Wsparcie techniczne</option>
            <option value="business">Współpraca biznesowa</option>
        </select>
    </div>
    
    <div class="form-group">
        <label for="message">Wiadomość *</label>
        <textarea id="message" name="message" rows="5" required></textarea>
    </div>
    
    <div class="form-group checkbox-group">
        <input type="checkbox" id="privacy" name="privacy" required>
        <label for="privacy">Akceptuję politykę prywatności *</label>
    </div>
    
    <button type="submit" class="btn btn-primary">Wyślij wiadomość</button>
</form>`
        },
        {
            name: 'Hero Section',
            description: 'Modern hero section with call-to-action',
            code: `<section class="hero">
    <div class="hero-background">
        <img src="https://picsum.photos/1920/1080" alt="Hero background">
    </div>
    <div class="hero-content">
        <div class="hero-text">
            <h1 class="hero-title">Witaj w przyszłości</h1>
            <p class="hero-subtitle">
                Odkryj niesamowite możliwości naszej platformy i zmień sposób, w jaki pracujesz.
            </p>
            <div class="hero-actions">
                <button class="btn btn-primary btn-large">Rozpocznij teraz</button>
                <button class="btn btn-outline btn-large">Dowiedz się więcej</button>
            </div>
        </div>
    </div>
    <div class="hero-scroll-indicator">
        <i class="fas fa-chevron-down"></i>
    </div>
</section>`
        },
        {
            name: 'Navigation Menu',
            description: 'Responsive navigation with mobile menu',
            code: `<nav class="navbar">
    <div class="nav-container">
        <div class="nav-brand">
            <a href="#" class="nav-logo">
                <i class="fas fa-code"></i>
                Brand
            </a>
        </div>
        
        <div class="nav-menu" id="navMenu">
            <a href="#home" class="nav-link active">Home</a>
            <a href="#about" class="nav-link">O nas</a>
            <a href="#services" class="nav-link">Usługi</a>
            <a href="#portfolio" class="nav-link">Portfolio</a>
            <a href="#contact" class="nav-link">Kontakt</a>
        </div>
        
        <div class="nav-toggle" id="navToggle">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </div>
</nav>`
        },
        {
            name: 'Image Gallery',
            description: 'Responsive image gallery grid',
            code: `<div class="gallery">
    <div class="gallery-item">
        <img src="https://picsum.photos/400/300?random=1" alt="Gallery image 1">
        <div class="gallery-overlay">
            <h4>Image Title 1</h4>
            <p>Image description</p>
        </div>
    </div>
    <div class="gallery-item">
        <img src="https://picsum.photos/400/300?random=2" alt="Gallery image 2">
        <div class="gallery-overlay">
            <h4>Image Title 2</h4>
            <p>Image description</p>
        </div>
    </div>
    <div class="gallery-item">
        <img src="https://picsum.photos/400/300?random=3" alt="Gallery image 3">
        <div class="gallery-overlay">
            <h4>Image Title 3</h4>
            <p>Image description</p>
        </div>
    </div>
    <div class="gallery-item">
        <img src="https://picsum.photos/400/300?random=4" alt="Gallery image 4">
        <div class="gallery-overlay">
            <h4>Image Title 4</h4>
            <p>Image description</p>
        </div>
    </div>
</div>`
        },
        {
            name: 'Modal Dialog',
            description: 'Accessible modal dialog',
            code: `<div class="modal-backdrop" id="modalBackdrop">
    <div class="modal-dialog" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDesc">
        <div class="modal-header">
            <h2 id="modalTitle">Modal Title</h2>
            <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
            <p id="modalDesc">This is the modal content. You can put any content here.</p>
            <form class="modal-form">
                <div class="form-group">
                    <label for="modalInput">Input field:</label>
                    <input type="text" id="modalInput" name="modalInput">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" data-action="cancel">Cancel</button>
            <button class="btn btn-primary" data-action="confirm">Confirm</button>
        </div>
    </div>
</div>`
        }
    ],

    // CSS SNIPPETS
    css: [
        {
            name: 'CSS Reset & Base',
            description: 'Modern CSS reset and base styles',
            code: `/* CSS Reset */
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Base Styles */
:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #f8f9fa;
    --dark-color: #343a40;
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --border-radius: 8px;
    --transition: all 0.3s ease;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

html {
    font-size: 16px;
    scroll-behavior: smooth;
}

body {
    font-family: var(--font-family);
    line-height: 1.6;
    color: var(--dark-color);
    background-color: var(--light-color);
}

img {
    max-width: 100%;
    height: auto;
    display: block;
}

a {
    text-decoration: none;
    color: inherit;
    transition: var(--transition);
}

button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
}`
        },
        {
            name: 'Flexbox Utilities',
            description: 'Comprehensive flexbox utility classes',
            code: `.flex {
    display: flex;
}

.flex-column {
    flex-direction: column;
}

.flex-row {
    flex-direction: row;
}

.flex-wrap {
    flex-wrap: wrap;
}

.flex-nowrap {
    flex-wrap: nowrap;
}

/* Justify Content */
.justify-start {
    justify-content: flex-start;
}

.justify-end {
    justify-content: flex-end;
}

.justify-center {
    justify-content: center;
}

.justify-between {
    justify-content: space-between;
}

.justify-around {
    justify-content: space-around;
}

.justify-evenly {
    justify-content: space-evenly;
}

/* Align Items */
.items-start {
    align-items: flex-start;
}

.items-end {
    align-items: flex-end;
}

.items-center {
    align-items: center;
}

.items-stretch {
    align-items: stretch;
}

.items-baseline {
    align-items: baseline;
}

/* Flex Grow/Shrink */
.flex-1 {
    flex: 1;
}

.flex-auto {
    flex: auto;
}

.flex-none {
    flex: none;
}

/* Common Combinations */
.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}`
        },
        {
            name: 'CSS Grid Layout',
            description: 'Modern CSS Grid system',
            code: `.grid {
    display: grid;
}

/* Grid Template Columns */
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-5 { grid-template-columns: repeat(5, 1fr); }
.grid-cols-6 { grid-template-columns: repeat(6, 1fr); }
.grid-cols-12 { grid-template-columns: repeat(12, 1fr); }

/* Auto-fit and Auto-fill */
.grid-auto-fit {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.grid-auto-fill {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* Grid Gap */
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-5 { gap: 1.25rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }

/* Column Span */
.col-span-1 { grid-column: span 1; }
.col-span-2 { grid-column: span 2; }
.col-span-3 { grid-column: span 3; }
.col-span-4 { grid-column: span 4; }
.col-span-full { grid-column: 1 / -1; }

/* Row Span */
.row-span-1 { grid-row: span 1; }
.row-span-2 { grid-row: span 2; }
.row-span-3 { grid-row: span 3; }
.row-span-full { grid-row: 1 / -1; }

/* Grid Areas Example */
.grid-layout {
    display: grid;
    grid-template-areas:
        "header header header"
        "sidebar main main"
        "footer footer footer";
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 250px 1fr;
    gap: 1rem;
    min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }`
        },
        {
            name: 'Modern Buttons',
            description: 'Beautiful button styles with variants',
            code: `.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.2;
    border: 2px solid transparent;
    border-radius: var(--border-radius);
    cursor: pointer;
    text-decoration: none;
    transition: var(--transition);
    position: relative;
    overflow: hidden;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
}

/* Button Sizes */
.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

.btn-lg {
    padding: 1rem 2rem;
    font-size: 1.125rem;
}

.btn-xl {
    padding: 1.25rem 2.5rem;
    font-size: 1.25rem;
}

/* Button Variants */
.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: color-mix(in srgb, var(--primary-color) 85%, black);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.btn-secondary {
    background: var(--secondary-color);
    color: white;
}

.btn-success {
    background: var(--success-color);
    color: white;
}

.btn-danger {
    background: var(--danger-color);
    color: white;
}

.btn-outline {
    background: transparent;
    border-color: var(--primary-color);
    color: var(--primary-color);
}

.btn-outline:hover {
    background: var(--primary-color);
    color: white;
}

/* Gradient Button */
.btn-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    position: relative;
}

.btn-gradient::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.btn-gradient:hover::before {
    opacity: 1;
}

.btn-gradient span {
    position: relative;
    z-index: 1;
}`
        },
        {
            name: 'Card Components',
            description: 'Modern card designs with hover effects',
            code: `.card {
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    overflow: hidden;
    transition: var(--transition);
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image {
    position: relative;
    overflow: hidden;
}

.card-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: var(--transition);
}

.card:hover .card-image img {
    transform: scale(1.05);
}

.card-content {
    padding: 1.5rem;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--dark-color);
}

.card-badge {
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
}

.card-description {
    color: var(--secondary-color);
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.card-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

/* Card Variants */
.card-horizontal {
    display: flex;
    flex-direction: row;
}

.card-horizontal .card-image {
    flex: 0 0 200px;
}

.card-horizontal .card-content {
    flex: 1;
}

.card-minimal {
    box-shadow: none;
    border: 1px solid #e9ecef;
}

.card-elevated {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}`
        },
        {
            name: 'Responsive Typography',
            description: 'Fluid typography system',
            code: `/* Responsive Typography */
.text-xs { font-size: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem); }
.text-sm { font-size: clamp(0.875rem, 0.8rem + 0.375vw, 1rem); }
.text-base { font-size: clamp(1rem, 0.9rem + 0.5vw, 1.125rem); }
.text-lg { font-size: clamp(1.125rem, 1rem + 0.625vw, 1.25rem); }
.text-xl { font-size: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem); }
.text-2xl { font-size: clamp(1.5rem, 1.3rem + 1vw, 2rem); }
.text-3xl { font-size: clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem); }
.text-4xl { font-size: clamp(2.25rem, 1.9rem + 1.75vw, 3rem); }
.text-5xl { font-size: clamp(3rem, 2.5rem + 2.5vw, 4rem); }

/* Headings */
h1, .h1 {
    font-size: clamp(2rem, 1.5rem + 2.5vw, 3.5rem);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
}

h2, .h2 {
    font-size: clamp(1.75rem, 1.3rem + 2.25vw, 3rem);
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 0.875rem;
}

h3, .h3 {
    font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 0.75rem;
}

h4, .h4 {
    font-size: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
    font-weight: 500;
    line-height: 1.4;
    margin-bottom: 0.625rem;
}

h5, .h5 {
    font-size: clamp(1.125rem, 1rem + 0.625vw, 1.5rem);
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 0.5rem;
}

h6, .h6 {
    font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 0.5rem;
}

/* Text Utilities */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-justify { text-align: justify; }

.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.leading-tight { line-height: 1.25; }
.leading-normal { line-height: 1.5; }
.leading-relaxed { line-height: 1.625; }
.leading-loose { line-height: 2; }`
        },
        {
            name: 'CSS Animations',
            description: 'Smooth animations and transitions',
            code: `/* Keyframe Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        transform: translateY(0);
    }
    40%, 43% {
        transform: translateY(-20px);
    }
    70% {
        transform: translateY(-10px);
    }
    90% {
        transform: translateY(-4px);
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* Animation Classes */
.animate-fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
}

.animate-slideInLeft {
    animation: slideInLeft 0.6s ease-out forwards;
}

.animate-slideInRight {
    animation: slideInRight 0.6s ease-out forwards;
}

.animate-bounce {
    animation: bounce 2s infinite;
}

.animate-pulse {
    animation: pulse 2s infinite;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Hover Animations */
.hover-lift {
    transition: transform 0.3s ease;
}

.hover-lift:hover {
    transform: translateY(-5px);
}

.hover-scale {
    transition: transform 0.3s ease;
}

.hover-scale:hover {
    transform: scale(1.05);
}

.hover-rotate {
    transition: transform 0.3s ease;
}

.hover-rotate:hover {
    transform: rotate(5deg);
}

/* Loading Animation */
.loading {
    position: relative;
    overflow: hidden;
}

.loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}`
        }
    ],

    // JAVASCRIPT SNIPPETS
    js: [
        {
            name: 'Modern Async Function',
            description: 'Async/await with error handling',
            code: `async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${ response.status }\`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Usage example
async function loadUserData() {
    try {
        const userData = await fetchData('/api/user/123');
        console.log('User data loaded:', userData);
        return userData;
    } catch (error) {
        console.error('Failed to load user data:', error);
        return null;
    }
}`
        },
        {
            name: 'DOM Manipulation Helper',
            description: 'Utility functions for DOM operations',
            code: `// DOM Helper Functions
const DOM = {
    // Element selection
    $(selector) {
        return document.querySelector(selector);
    },
    
    $$(selector) {
        return Array.from(document.querySelectorAll(selector));
    },
    
    // Element creation
    create(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Append children
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },
    
    // Event handling
    on(element, event, handler, options = {}) {
        element.addEventListener(event, handler, options);
        return () => element.removeEventListener(event, handler, options);
    },
    
    // Class utilities
    addClass(element, className) {
        element.classList.add(className);
    },
    
    removeClass(element, className) {
        element.classList.remove(className);
    },
    
    toggleClass(element, className) {
        element.classList.toggle(className);
    },
    
    hasClass(element, className) {
        return element.classList.contains(className);
    },
    
    // Animation helpers
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }
};

// Usage examples
const button = DOM.$('#myButton');
const removeListener = DOM.on(button, 'click', () => {
    console.log('Button clicked!');
});

const newDiv = DOM.create('div', {
    className: 'my-class',
    id: 'myDiv',
    textContent: 'Hello World!'
});`
        },
        {
            name: 'Local Storage Manager',
            description: 'Complete localStorage wrapper with expiration',
            code: `class StorageManager {
    constructor(prefix = 'app_') {
        this.prefix = prefix;
        this.isSupported = this.checkSupport();
    }
    
    checkSupport() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    getKey(key) {
        return this.prefix + key;
    }
    
    set(key, value, expirationMinutes = null) {
        if (!this.isSupported) return false;
        
        try {
            const item = {
                value: value,
                timestamp: Date.now(),
                expiration: expirationMinutes ? Date.now() + (expirationMinutes * 60 * 1000) : null
            };
            
            localStorage.setItem(this.getKey(key), JSON.stringify(item));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    }
    
    get(key, defaultValue = null) {
        if (!this.isSupported) return defaultValue;
        
        try {
            const itemStr = localStorage.getItem(this.getKey(key));
            if (!itemStr) return defaultValue;
            
            const item = JSON.parse(itemStr);
            
            // Check expiration
            if (item.expiration && Date.now() > item.expiration) {
                this.remove(key);
                return defaultValue;
            }
            
            return item.value;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    }
    
    remove(key) {
        if (!this.isSupported) return false;
        
        try {
            localStorage.removeItem(this.getKey(key));
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }
    
    clear() {
        if (!this.isSupported) return false;
        
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }
    
    exists(key) {
        return this.get(key) !== null;
    }
    
    getAll() {
        if (!this.isSupported) return {};
        
        const items = {};
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                const cleanKey = key.replace(this.prefix, '');
                items[cleanKey] = this.get(cleanKey);
            }
        });
        
        return items;
    }
    
    size() {
        return Object.keys(this.getAll()).length;
    }
}

// Usage
const storage = new StorageManager('myApp_');

// Set data with expiration (30 minutes)
storage.set('userToken', 'abc123', 30);

// Get data
const token = storage.get('userToken', 'defaultToken');

// Set permanent data
storage.set('userPreferences', {
    theme: 'dark',
    language: 'en'
});

// Get all data
const allData = storage.getAll();
console.log('All stored data:', allData);`
        },
        {
            name: 'Event Emitter',
            description: 'Custom event system for component communication',
            code: `class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }
    
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        return this.on(event, wrapper);
    }
    
    off(event, callback) {
        if (!this.events[event]) return;
        
        if (!callback) {
            // Remove all listeners for this event
            delete this.events[event];
            return;
        }
        
        this.events[event] = this.events[event].filter(cb => cb !== callback);
        
        if (this.events[event].length === 0) {
            delete this.events[event];
        }
    }
    
    emit(event, ...args) {
        if (!this.events[event]) return false;
        
        this.events[event].forEach(callback => {
            try {
                callback(...args);
            } catch (error) {
                console.error(\`Error in event listener for '\${event}':\`, error);
            }
        });
        
        return true;
    }
    
    listenerCount(event) {
        return this.events[event] ? this.events[event].length : 0;
    }
    
    eventNames() {
        return Object.keys(this.events);
    }
    
    removeAllListeners() {
        this.events = {};
    }
}

// Global event bus
const eventBus = new EventEmitter();

// Usage examples
const unsubscribe = eventBus.on('user-login', (user) => {
    console.log('User logged in:', user);
    updateUI(user);
});

eventBus.once('app-ready', () => {
    console.log('App is ready!');
});

// Emit events
eventBus.emit('user-login', { id: 123, name: 'John Doe' });
eventBus.emit('app-ready');

// Unsubscribe
unsubscribe();`
        },
        {
            name: 'Form Validation',
            description: 'Comprehensive form validation system',
            code: `class FormValidator {
    constructor(form, options = {}) {
        this.form = form;
        this.options = {
            showErrors: true,
            errorClass: 'error',
            successClass: 'success',
            errorContainer: '.error-message',
            ...options
        };
        this.errors = {};
        this.rules = {};
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    addRule(fieldName, rules) {
        this.rules[fieldName] = rules;
        return this;
    }
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.rules[fieldName];
        
        if (!rules) return true;
        
        const errors = [];
        
        // Required validation
        if (rules.required && !value) {
            errors.push(rules.messages?.required || 'This field is required');
        }
        
        if (value) {
            // Min length validation
            if (rules.minLength && value.length < rules.minLength) {
                errors.push(rules.messages?.minLength || \`Minimum length is \${ rules.minLength } characters\`);
            }
            
            // Max length validation
            if (rules.maxLength && value.length > rules.maxLength) {
                errors.push(rules.messages?.maxLength || \`Maximum length is \${ rules.maxLength } characters\`);
            }
            
            // Pattern validation
            if (rules.pattern && !rules.pattern.test(value)) {
                errors.push(rules.messages?.pattern || 'Invalid format');
            }
            
            // Email validation
            if (rules.email) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    errors.push(rules.messages?.email || 'Please enter a valid email address');
                }
            }
            
            // Custom validation
            if (rules.custom && typeof rules.custom === 'function') {
                const customResult = rules.custom(value, field);
                if (customResult !== true) {
                    errors.push(customResult || 'Custom validation failed');
                }
            }
        }
        
        if (errors.length > 0) {
            this.errors[fieldName] = errors;
            this.showFieldError(field, errors[0]);
            return false;
        } else {
            delete this.errors[fieldName];
            this.showFieldSuccess(field);
            return true;
        }
    }
    
    validateForm() {
        this.errors = {};
        let isValid = true;
        
        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(\`[name = "\${fieldName}"]\`);
            if (field) {
                const fieldValid = this.validateField(field);
                if (!fieldValid) isValid = false;
            }
        });
        
        return isValid;
    }
    
    showFieldError(field, message) {
        if (!this.options.showErrors) return;
        
        this.clearFieldMessages(field);
        field.classList.add(this.options.errorClass);
        field.classList.remove(this.options.successClass);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    showFieldSuccess(field) {
        this.clearFieldMessages(field);
        field.classList.remove(this.options.errorClass);
        field.classList.add(this.options.successClass);
    }
    
    clearFieldError(field) {
        field.classList.remove(this.options.errorClass);
        this.clearFieldMessages(field);
    }
    
    clearFieldMessages(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateForm()) {
            this.onSuccess();
        } else {
            this.onError();
        }
    }
    
    onSuccess() {
        console.log('Form is valid!');
        // Override this method or pass a callback
        if (this.options.onSuccess) {
            this.options.onSuccess(this.getFormData());
        }
    }
    
    onError() {
        console.log('Form has errors:', this.errors);
        if (this.options.onError) {
            this.options.onError(this.errors);
        }
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
    
    reset() {
        this.form.reset();
        this.errors = {};
        
        // Clear all error states
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            this.clearFieldError(field);
            field.classList.remove(this.options.successClass);
        });
    }
}

// Usage
const form = document.getElementById('myForm');
const validator = new FormValidator(form, {
    onSuccess: (data) => {
        console.log('Form submitted successfully:', data);
    },
    onError: (errors) => {
        console.log('Form errors:', errors);
    }
});

validator
    .addRule('email', {
        required: true,
        email: true,
        messages: {
            required: 'Email is required',
            email: 'Please enter a valid email address'
        }
    })
    .addRule('password', {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        messages: {
            required: 'Password is required',
            minLength: 'Password must be at least 8 characters',
            pattern: 'Password must contain uppercase, lowercase and number'
        }
    })
    .addRule('confirmPassword', {
        required: true,
        custom: (value, field) => {
            const password = form.querySelector('[name="password"]').value;
            return value === password || 'Passwords do not match';
        }
    });`
        },
        {
            name: 'API Client',
            description: 'Complete API client with interceptors',
            code: `class APIClient {
    constructor(baseURL = '', options = {}) {
        this.baseURL = baseURL;
        this.options = {
            timeout: 10000,
            retries: 3,
            retryDelay: 1000,
            ...options
        };
        this.interceptors = {
            request: [],
            response: []
        };
    }
    
    addRequestInterceptor(interceptor) {
        this.interceptors.request.push(interceptor);
    }
    
    addResponseInterceptor(interceptor) {
        this.interceptors.response.push(interceptor);
    }
    
    async request(url, options = {}) {
        const fullURL = this.baseURL + url;
        let config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            ...this.options,
            ...options
        };
        
        // Apply request interceptors
        for (const interceptor of this.interceptors.request) {
            config = await interceptor(config);
        }
        
        let lastError;
        
        for (let attempt = 0; attempt <= this.options.retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), config.timeout);
                
                const response = await fetch(fullURL, {
                    ...config,
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                let result = {
                    data: null,
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    config: config
                };
                
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        result.data = await response.json();
                    } else {
                        result.data = await response.text();
                    }
                } else {
                    throw new Error(\`HTTP \${ response.status }: \${ response.statusText } \`);
                }
                
                // Apply response interceptors
                for (const interceptor of this.interceptors.response) {
                    result = await interceptor(result);
                }
                
                return result;
                
            } catch (error) {
                lastError = error;
                
                if (attempt < this.options.retries) {
                    await this.delay(this.options.retryDelay * Math.pow(2, attempt));
                    continue;
                }
                
                throw error;
            }
        }
        
        throw lastError;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }
    
    post(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    put(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    patch(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
    
    delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }
}

// Usage
const api = new APIClient('https://api.example.com', {
    timeout: 5000,
    retries: 2
});

// Add auth interceptor
api.addRequestInterceptor(async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
});

// Add error handling interceptor
api.addResponseInterceptor(async (response) => {
    if (response.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    }
    return response;
});

// Make requests
async function fetchUserData() {
    try {
        const response = await api.get('/users/me');
        console.log('User data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
        throw error;
    }
}

async function updateUser(userData) {
    try {
        const response = await api.put('/users/me', userData);
        console.log('User updated:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to update user:', error);
        throw error;
    }
}`
        }
    ]
};

// Function to get snippets by category
window.getSnippetsByCategory = function (category) {
    return window.codeSnippets[category] || [];
};

// Function to search snippets
window.searchSnippets = function (query, category = null) {
    const categories = category ? [category] : Object.keys(window.codeSnippets);
    const results = [];

    categories.forEach(cat => {
        window.codeSnippets[cat].forEach(snippet => {
            if (snippet.name.toLowerCase().includes(query.toLowerCase()) ||
                snippet.description.toLowerCase().includes(query.toLowerCase()) ||
                snippet.code.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    ...snippet,
                    category: cat
                });
            }
        });
    });

    return results;
};

// Function to get random snippet
window.getRandomSnippet = function (category = null) {
    const categories = category ? [category] : Object.keys(window.codeSnippets);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const snippets = window.codeSnippets[randomCategory];
    const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];

    return {
        ...randomSnippet,
        category: randomCategory
    };
};

console.log('📚 Comprehensive Code Snippets Library loaded!');
console.log(`📊 Available snippets: HTML(${window.codeSnippets.html.length}), CSS(${window.codeSnippets.css.length}), JS(${window.codeSnippets.js.length})`);
console.log('🔍 Use getSnippetsByCategory(category), searchSnippets(query), or getRandomSnippet() to explore!');
