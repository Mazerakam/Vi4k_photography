// Main JavaScript for Portfolio Site

// ========================================
// Global Variables
// ========================================
let portfolioData = {};
let currentTestimonial = 0;
let testimonialInterval;

// ========================================
// Utility Functions
// ========================================

// Format date to French locale
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Format date to short French locale
function formatDateShort(dateString) {
    const options = { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show loading spinner
function showLoading(element) {
    element.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Chargement...</p>
        </div>
    `;
}

// Show error message
function showError(element, message = 'Une erreur est survenue') {
    element.innerHTML = `
        <div class="error-message">
            <i data-lucide="alert-triangle"></i>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn btn--primary">Réessayer</button>
        </div>
    `;
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ========================================
// Data Loading Functions
// ========================================

// Load portfolio data
async function loadPortfolioData() {
    try {
        const response = await fetch('./data/portfolio.json');
        if (!response.ok) {
            throw new Error('Failed to load portfolio data');
        }
        portfolioData = await response.json();
        console.log('Portfolio data loaded successfully');
        return portfolioData;
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        throw error;
    }
}

// Get all photos
function getAllPhotos() {
    const allPhotos = [];
    if (portfolioData.photos) {
        Object.keys(portfolioData.photos).forEach(category => {
            allPhotos.push(...portfolioData.photos[category]);
        });
    }
    return allPhotos;
}

// Get photos by category
function getPhotosByCategory(categoryId) {
    if (!portfolioData.photos || !portfolioData.photos[categoryId]) {
        return [];
    }
    return portfolioData.photos[categoryId];
}

// Get category by ID
function getCategoryById(categoryId) {
    if (!portfolioData.categories) return null;
    return portfolioData.categories.find(cat => cat.id === categoryId);
}

// ========================================
// Navigation Functions
// ========================================

// Initialize navigation
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            
            // Update icon
            const icon = navToggle.querySelector('.nav__toggle-icon');
            if (navMenu.classList.contains('show')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            
            // Re-initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
                const icon = navToggle.querySelector('.nav__toggle-icon');
                icon.setAttribute('data-lucide', 'menu');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('show');
                const icon = navToggle.querySelector('.nav__toggle-icon');
                icon.setAttribute('data-lucide', 'menu');
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }
}

// ========================================
// Animation Functions
// ========================================

// Initialize scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Animate skill bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill__progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ========================================
// Home Page Functions
// ========================================

// Load categories for home page
function loadHomeCategories() {
    const categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid) return;
    
    if (!portfolioData.categories || portfolioData.categories.length === 0) {
        categoriesGrid.innerHTML = `
            <div class="categories__empty">
                <p>Aucune catégorie disponible pour le moment.</p>
            </div>
        `;
        return;
    }
    
    categoriesGrid.innerHTML = portfolioData.categories.map((category, index) => `
        <a href="category.html?id=${category.id}" class="category__card hover-lift" style="animation-delay: ${index * 0.2}s;">
            <div class="category__image">
                <i data-lucide="camera" class="category__icon"></i>
            </div>
            <div class="category__content">
                <h3 class="category__title">${category.name}</h3>
                <p class="category__description">${category.description}</p>
                <span class="category__link">
                    Voir la galerie
                    <i data-lucide="chevron-right" class="category__link-icon"></i>
                </span>
            </div>
        </a>
    `).join('');
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Load testimonials for home page
function loadHomeTestimonials() {
    const testimonialsCard = document.getElementById('testimonials-card');
    const testimonialsDots = document.getElementById('testimonials-dots');
    
    if (!testimonialsCard || !testimonialsDots) return;
    
    if (!portfolioData.testimonials || portfolioData.testimonials.length === 0) {
        testimonialsCard.innerHTML = `
            <div class="testimonials__empty">
                <p>Aucun témoignage disponible pour le moment.</p>
            </div>
        `;
        return;
    }
    
    // Load first testimonial
    updateTestimonial();
    
    // Create dots
    testimonialsDots.innerHTML = portfolioData.testimonials.map((_, index) => `
        <button class="testimonial__dot ${index === 0 ? 'testimonial__dot--active' : ''}" 
                onclick="setTestimonial(${index})"></button>
    `).join('');
    
    // Start auto-rotation
    startTestimonialRotation();
}

// Update testimonial display
function updateTestimonial() {
    const testimonialsCard = document.getElementById('testimonials-card');
    if (!testimonialsCard || !portfolioData.testimonials) return;
    
    const testimonial = portfolioData.testimonials[currentTestimonial];
    testimonialsCard.innerHTML = `
        <blockquote class="testimonials__quote">
            "${testimonial.text}"
        </blockquote>
        <cite class="testimonials__author">— ${testimonial.name}</cite>
    `;
}

// Set specific testimonial
function setTestimonial(index) {
    if (!portfolioData.testimonials || index >= portfolioData.testimonials.length) return;
    
    currentTestimonial = index;
    updateTestimonial();
    updateTestimonialDots();
    
    // Restart auto-rotation
    clearInterval(testimonialInterval);
    startTestimonialRotation();
}

// Update testimonial dots
function updateTestimonialDots() {
    const dots = document.querySelectorAll('.testimonial__dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('testimonial__dot--active', index === currentTestimonial);
    });
}

// Start testimonial auto-rotation
function startTestimonialRotation() {
    if (!portfolioData.testimonials || portfolioData.testimonials.length <= 1) return;
    
    testimonialInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % portfolioData.testimonials.length;
        updateTestimonial();
        updateTestimonialDots();
    }, 5000);
}

// ========================================
// Services Functions
// ========================================

// Load services for about page
function loadServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;
    
    if (!portfolioData.services || portfolioData.services.length === 0) {
        servicesGrid.innerHTML = `
            <div class="services__empty">
                <p>Aucun service disponible pour le moment.</p>
            </div>
        `;
        return;
    }
    
    servicesGrid.innerHTML = portfolioData.services.map((service, index) => `
        <div class="service__card animate-on-scroll" style="animation-delay: ${index * 0.1}s;">
            <i data-lucide="camera" class="service__icon"></i>
            <h3 class="service__title">${service.name}</h3>
            <p class="service__description">${service.description}</p>
            <div class="service__meta">
                <span class="service__price">${service.price}</span>
                <span class="service__duration">${service.duration}</span>
            </div>
        </div>
    `).join('');
    
    // Re-initialize Lucide icons and animations
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    initScrollAnimations();
}

// Load services for contact page
function loadContactServices() {
    const contactServices = document.getElementById('contact-services');
    if (!contactServices) return;
    
    if (!portfolioData.services || portfolioData.services.length === 0) {
        contactServices.innerHTML = '<p>Aucun service disponible.</p>';
        return;
    }
    
    contactServices.innerHTML = portfolioData.services.map(service => `
        <div class="contact__service-item">
            <i data-lucide="camera" class="contact__service-icon"></i>
            <div class="contact__service-content">
                <p class="contact__service-name">${service.name}</p>
                <p class="contact__service-details">${service.price} • ${service.duration}</p>
            </div>
        </div>
    `).join('');
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ========================================
// About Page Functions
// ========================================

// Load photographer information
function loadPhotographerInfo() {
    // Update bio
    const bioElement = document.getElementById('photographer-bio');
    if (bioElement && portfolioData.photographer) {
        bioElement.textContent = portfolioData.photographer.bio;
    }
    
    // Update location
    const locationElement = document.getElementById('photographer-location');
    if (locationElement && portfolioData.photographer) {
        locationElement.textContent = portfolioData.photographer.location;
    }
    
    // Update experience
    const experienceElement = document.getElementById('photographer-experience');
    if (experienceElement && portfolioData.photographer) {
        experienceElement.textContent = portfolioData.photographer.experience;
    }
}

// ========================================
// Lightbox Functions
// ========================================

let currentLightboxIndex = 0;
let lightboxPhotos = [];

// Initialize lightbox
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    if (!lightbox) return;
    
    // Close lightbox events
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeLightbox);
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // Navigation events
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                navigateLightbox('next');
                break;
        }
    });
}

// Open lightbox
function openLightbox(photos, index) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightboxPhotos = photos;
    currentLightboxIndex = index;
    
    updateLightboxContent();
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
}

// Navigate lightbox
function navigateLightbox(direction) {
    if (!lightboxPhotos || lightboxPhotos.length === 0) return;
    
    if (direction === 'next') {
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxPhotos.length;
    } else {
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxPhotos.length) % lightboxPhotos.length;
    }
    
    updateLightboxContent();
}

// Update lightbox content
function updateLightboxContent() {
    if (!lightboxPhotos || lightboxPhotos.length === 0) return;
    
    const photo = lightboxPhotos[currentLightboxIndex];
    const category = getCategoryById(photo.category);
    
    // Update image
    const lightboxImage = document.getElementById('lightbox-image');
    if (lightboxImage) {
        lightboxImage.src = photo.image;
        lightboxImage.alt = photo.title;
    }
    
    // Update title
    const lightboxTitle = document.getElementById('lightbox-title');
    if (lightboxTitle) {
        lightboxTitle.textContent = photo.title;
    }
    
    // Update category
    const lightboxCategory = document.getElementById('lightbox-category');
    if (lightboxCategory) {
        lightboxCategory.textContent = category ? category.name : photo.category;
    }
    
    // Update date
    const lightboxDate = document.getElementById('lightbox-date');
    if (lightboxDate) {
        lightboxDate.textContent = formatDate(photo.date);
    }
    
    // Update counter
    const lightboxCounter = document.getElementById('lightbox-counter');
    if (lightboxCounter) {
        lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${lightboxPhotos.length}`;
    }
    
    // Show/hide navigation buttons
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    if (lightboxPhotos.length <= 1) {
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
    } else {
        if (lightboxPrev) lightboxPrev.style.display = 'flex';
        if (lightboxNext) lightboxNext.style.display = 'flex';
    }
}

// ========================================
// Page-Specific Initialization
// ========================================

// Initialize home page
function initHomePage() {
    loadHomeCategories();
    loadHomeTestimonials();
}

// Initialize about page
function initAboutPage() {
    loadPhotographerInfo();
    loadServices();
    animateSkillBars();
}

// Initialize contact page
function initContactPage() {
    loadContactServices();
}

// ========================================
// Main Initialization
// ========================================

// Main initialization function
async function init() {
    try {
        // Load data
        await loadPortfolioData();
        
        // Initialize common components
        initNavigation();
        initScrollAnimations();
        initLightbox();
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Page-specific initialization
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'index.html':
            case '':
                initHomePage();
                break;
            case 'about.html':
                initAboutPage();
                break;
            case 'contact.html':
                initContactPage();
                break;
        }
        
        console.log('Portfolio site initialized successfully');
        
    } catch (error) {
        console.error('Error initializing portfolio site:', error);
        
        // Show error message on main content areas
        const mainElement = document.querySelector('main');
        if (mainElement) {
            showError(mainElement, 'Impossible de charger le contenu du portfolio. Veuillez réessayer.');
        }
    }
}

// ========================================
// Event Listeners
// ========================================

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(testimonialInterval);
    } else {
        startTestimonialRotation();
    }
});

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Export functions for external use
window.portfolioApp = {
    openLightbox,
    closeLightbox,
    setTestimonial,
    formatDate,
    formatDateShort,
    getAllPhotos,
    getPhotosByCategory,
    getCategoryById
};