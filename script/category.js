// Category gallery page specific JavaScript

// ========================================
// Category Page Variables
// ========================================
let currentCategoryId = '';
let currentCategory = null;
let categoryPhotos = [];

// ========================================
// URL Parameter Handling
// ========================================

// Get URL parameters
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Update page title and meta
function updatePageMeta(category) {
    if (!category) return;
    
    // Update page title
    document.title = `${category.name} - Alex Dubois Photographe`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', 
            `Découvrez la galerie ${category.name.toLowerCase()} d'Alex Dubois. ${category.description}`
        );
    }
}

// ========================================
// Category Hero Section
// ========================================

// Load category hero content
function loadCategoryHero() {
    if (!currentCategory) return;
    
    // Update breadcrumb
    const breadcrumbCategory = document.getElementById('breadcrumb-category');
    if (breadcrumbCategory) {
        breadcrumbCategory.textContent = currentCategory.name;
    }
    
    // Update hero content
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle) {
        categoryTitle.textContent = currentCategory.name;
    }
    
    const categoryDescription = document.getElementById('category-description');
    if (categoryDescription) {
        categoryDescription.textContent = currentCategory.description;
    }
    
    const categoryCount = document.getElementById('category-count');
    if (categoryCount) {
        const count = categoryPhotos.length;
        categoryCount.textContent = `${count} photo${count > 1 ? 's' : ''}`;
    }
}

// ========================================
// Category Photos Gallery
// ========================================

// Load category photos
function loadCategoryPhotos() {
    const categoryPhotosContainer = document.getElementById('category-photos');
    const categoryEmpty = document.getElementById('category-empty');
    
    if (!categoryPhotosContainer || !categoryEmpty) return;
    
    if (categoryPhotos.length === 0) {
        // Show empty state
        categoryPhotosContainer.style.display = 'none';
        categoryEmpty.style.display = 'block';
        return;
    }
    
    // Hide empty state
    categoryEmpty.style.display = 'none';
    categoryPhotosContainer.style.display = 'grid';
    
    // Display photos
    categoryPhotosContainer.innerHTML = categoryPhotos.map((photo, index) => `
        <div class="photo__card hover-lift" 
             style="animation-delay: ${index * 0.1}s;"
             onclick="openLightbox(${JSON.stringify(categoryPhotos).replace(/"/g, '&quot;')}, ${index})">
            <img src="${photo.image}" alt="${photo.title}" class="photo__image" loading="lazy">
            <div class="photo__overlay">
                <div class="photo__content">
                    <h3 class="photo__title">${photo.title}</h3>
                    <div class="photo__meta">
                        <div class="photo__date">
                            <i data-lucide="calendar" class="photo__meta-icon"></i>
                            ${formatDate(photo.date)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ========================================
// Related Categories
// ========================================

// Load related categories
function loadRelatedCategories() {
    const relatedCategories = document.getElementById('related-categories');
    if (!relatedCategories || !portfolioData.categories) return;
    
    // Get categories that are not the current category
    const otherCategories = portfolioData.categories.filter(cat => cat.id !== currentCategoryId);
    
    if (otherCategories.length === 0) {
        relatedCategories.innerHTML = `
            <div class="related-categories__empty">
                <p>Aucune autre catégorie disponible.</p>
            </div>
        `;
        return;
    }
    
    relatedCategories.innerHTML = otherCategories.map((category, index) => `
        <a href="category.html?id=${category.id}" class="portfolio-category hover-lift" style="animation-delay: ${index * 0.1}s;">
            <div class="portfolio-category__image">
                <i data-lucide="camera" class="portfolio-category__icon"></i>
            </div>
            <div class="portfolio-category__content">
                <h3 class="portfolio-category__title">${category.name}</h3>
                <p class="portfolio-category__description">${category.description}</p>
            </div>
        </a>
    `).join('');
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ========================================
// Error Handling
// ========================================

// Show category not found error
function showCategoryNotFound() {
    const main = document.querySelector('main');
    if (!main) return;
    
    main.innerHTML = `
        <section class="category-error section">
            <div class="container">
                <div class="category-error__content">
                    <i data-lucide="camera" class="category-error__icon"></i>
                    <h1 class="category-error__title">Catégorie non trouvée</h1>
                    <p class="category-error__description">
                        La catégorie demandée n'existe pas ou n'est plus disponible.
                    </p>
                    <div class="category-error__buttons">
                        <a href="portfolio.html" class="btn btn--primary">
                            <i data-lucide="arrow-left" class="btn__icon btn__icon--left"></i>
                            Retour au Portfolio
                        </a>
                        <a href="index.html" class="btn btn--secondary">
                            Accueil
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <style>
        .category-error {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .category-error__content {
            text-align: center;
            max-width: 500px;
        }
        .category-error__icon {
            width: 80px;
            height: 80px;
            color: var(--color-gray-300);
            margin: 0 auto var(--spacing-xl);
        }
        .category-error__title {
            font-size: 2rem;
            margin-bottom: var(--spacing-lg);
            color: var(--color-gray-800);
        }
        .category-error__description {
            color: var(--color-gray-600);
            margin-bottom: var(--spacing-2xl);
            font-size: 1.125rem;
        }
        .category-error__buttons {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-lg);
            align-items: center;
        }
        @media (min-width: 640px) {
            .category-error__buttons {
                flex-direction: row;
                justify-content: center;
            }
        }
        </style>
    `;
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ========================================
// Category Page Initialization
// ========================================

// Initialize category page
function initCategoryPage() {
    // Get category ID from URL
    currentCategoryId = getURLParameter('id');
    
    if (!currentCategoryId) {
        console.error('No category ID provided in URL');
        showCategoryNotFound();
        return;
    }
    
    // Find category
    currentCategory = getCategoryById(currentCategoryId);
    
    if (!currentCategory) {
        console.error('Category not found:', currentCategoryId);
        showCategoryNotFound();
        return;
    }
    
    // Get category photos
    categoryPhotos = getPhotosByCategory(currentCategoryId);
    
    // Update page meta
    updatePageMeta(currentCategory);
    
    // Load page content
    loadCategoryHero();
    loadCategoryPhotos();
    loadRelatedCategories();
    
    console.log('Category page initialized for:', currentCategory.name);
}

// ========================================
// Page Load Event
// ========================================

// Initialize category page when data is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for main.js to load portfolio data
        const checkData = setInterval(() => {
            if (window.portfolioApp && typeof getCategoryById === 'function') {
                clearInterval(checkData);
                initCategoryPage();
            }
        }, 100);
    });
} else {
    // Data should already be loaded
    const checkData = setInterval(() => {
        if (window.portfolioApp && typeof getCategoryById === 'function') {
            clearInterval(checkData);
            initCategoryPage();
        }
    }, 100);
}

// Export functions for external use
window.categoryPage = {
    currentCategory,
    currentCategoryId,
    categoryPhotos,
    loadCategoryPhotos,
    loadRelatedCategories
};