// About page specific JavaScript

// ========================================
// About Page Functions
// ========================================

// Initialize about page specific features
function initAboutPageFeatures() {
    // Skills animation is already handled in main.js via animateSkillBars()
    // Services loading is already handled in main.js via loadServices()
    
    initScrollCounters();
    initPhilosophyAnimations();
    
    console.log('About page features initialized');
}

// ========================================
// Stats Counter Animation
// ========================================

// Initialize scroll-triggered counter animations
function initScrollCounters() {
    const statsItems = document.querySelectorAll('.stats__item');
    if (statsItems.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateCounter(entry.target);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });
    
    statsItems.forEach(item => observer.observe(item));
}

// Animate individual counter
function animateCounter(statsItem) {
    const numberElement = statsItem.querySelector('.stats__number');
    if (!numberElement) return;
    
    const finalText = numberElement.textContent;
    const hasPlus = finalText.includes('+');
    const numberValue = parseInt(finalText.replace(/\D/g, ''));
    
    if (isNaN(numberValue)) return;
    
    let currentValue = 0;
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = numberValue / steps;
    const stepDuration = duration / steps;
    
    const counter = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= numberValue) {
            currentValue = numberValue;
            clearInterval(counter);
        }
        
        const displayValue = Math.floor(currentValue);
        numberElement.textContent = displayValue + (hasPlus ? '+' : '');
    }, stepDuration);
}

// ========================================
// Philosophy Section Animations
// ========================================

// Initialize philosophy section animations
function initPhilosophyAnimations() {
    const valueCards = document.querySelectorAll('.value__card');
    if (valueCards.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.3 });
    
    valueCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.2}s`;
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
}

// ========================================
// Interactive Elements
// ========================================

// Add hover effects to story cards
function initStoryCardEffects() {
    const storyCards = document.querySelectorAll('.story__card');
    
    storyCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize skill bar interactions
function initSkillBarInteractions() {
    const skillItems = document.querySelectorAll('.skill__item');
    
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.skill__progress');
        const percentage = item.querySelector('.skill__percentage');
        
        if (!progressBar || !percentage) return;
        
        item.addEventListener('mouseenter', () => {
            progressBar.style.filter = 'brightness(1.1)';
            percentage.style.color = 'var(--color-lime-600)';
            percentage.style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', () => {
            progressBar.style.filter = 'brightness(1)';
            percentage.style.color = '';
            percentage.style.transform = 'scale(1)';
        });
    });
}

// ========================================
// Dynamic Content Loading
// ========================================

// Load photographer information into about page
function loadAboutPhotographerInfo() {
    if (!portfolioData.photographer) return;
    
    const photographer = portfolioData.photographer;
    
    // Update bio
    const bioElement = document.getElementById('photographer-bio');
    if (bioElement) {
        bioElement.textContent = photographer.bio;
    }
    
    // Update location
    const locationElement = document.getElementById('photographer-location');
    if (locationElement) {
        locationElement.textContent = photographer.location;
    }
    
    // Update experience
    const experienceElement = document.getElementById('photographer-experience');
    if (experienceElement) {
        experienceElement.textContent = photographer.experience;
    }
    
    // Update contact links in CTA section
    updateAboutContactLinks(photographer);
}

// Update contact links in about page CTA
function updateAboutContactLinks(photographer) {
    // Update email links
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.href = `mailto:${photographer.email}`;
    });
    
    // Update phone links
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.href = `tel:${photographer.phone}`;
    });
}

// ========================================
// Smooth Scrolling for Internal Links
// ========================================

// Initialize smooth scrolling for about page anchors
function initAboutSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// About Page Initialization
// ========================================

// Initialize all about page features
function initAboutPage() {
    // Load photographer information
    if (typeof loadPhotographerInfo === 'function') {
        loadPhotographerInfo();
    }
    
    // Load services
    if (typeof loadServices === 'function') {
        loadServices();
    }
    
    // Initialize about-specific features
    initAboutPageFeatures();
    initStoryCardEffects();
    initSkillBarInteractions();
    initAboutSmoothScroll();
    
    // Load dynamic content
    loadAboutPhotographerInfo();
    
    console.log('About page fully initialized');
}

// ========================================
// Responsive Adjustments
// ========================================

// Handle responsive adjustments for about page
function handleAboutResponsive() {
    const handleResize = debounce(() => {
        // Recalculate animations if needed
        const skillBars = document.querySelectorAll('.skill__progress');
        skillBars.forEach(bar => {
            // Reset and re-trigger animations if visible
            if (isElementInViewport(bar)) {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }
        });
    }, 250);
    
    window.addEventListener('resize', handleResize);
}

// Check if element is in viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// Accessibility Enhancements
// ========================================

// Add accessibility enhancements for about page
function initAboutAccessibility() {
    // Add ARIA labels to skill bars
    const skillBars = document.querySelectorAll('.skill__progress');
    skillBars.forEach(bar => {
        const skillItem = bar.closest('.skill__item');
        const skillName = skillItem?.querySelector('.skill__name')?.textContent;
        const percentage = skillItem?.querySelector('.skill__percentage')?.textContent;
        
        if (skillName && percentage) {
            bar.setAttribute('aria-label', `${skillName}: ${percentage}`);
            bar.setAttribute('role', 'progressbar');
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', '100');
            bar.setAttribute('aria-valuenow', percentage.replace('%', ''));
        }
    });
    
    // Add ARIA labels to stats
    const statsNumbers = document.querySelectorAll('.stats__number');
    statsNumbers.forEach(number => {
        const statsItem = number.closest('.stats__item');
        const label = statsItem?.querySelector('.stats__label')?.textContent;
        
        if (label) {
            number.setAttribute('aria-label', `${number.textContent} ${label}`);
        }
    });
}

// ========================================
// Performance Optimizations
// ========================================

// Lazy load images in about section if any
function initAboutImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// Page Load Event
// ========================================

// Initialize about page when data is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for main.js to load portfolio data
        const checkData = setInterval(() => {
            if (window.portfolioApp && portfolioData) {
                clearInterval(checkData);
                initAboutPage();
                handleAboutResponsive();
                initAboutAccessibility();
                initAboutImageLazyLoading();
            }
        }, 100);
    });
} else {
    // Data should already be loaded
    const checkData = setInterval(() => {
        if (window.portfolioApp && portfolioData) {
            clearInterval(checkData);
            initAboutPage();
            handleAboutResponsive();
            initAboutAccessibility();
            initAboutImageLazyLoading();
        }
    }, 100);
}

// Export functions for external use
window.aboutPage = {
    initAboutPage,
    animateCounter,
    initScrollCounters,
    loadAboutPhotographerInfo
};