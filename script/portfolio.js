// Portfolio page specific JavaScript

// ========================================
// Portfolio Page Variables
// ========================================
let currentFilter = 'all';
let currentView = 'grid';
let allPhotos = [];
let filteredPhotos = [];

// ========================================
// Portfolio Filters
// ========================================

// Initialize portfolio filters
function initPortfolioFilters() {
    const categoryFilters = document.getElementById('category-filters');
    if (!categoryFilters || !portfolioData.categories) return;
    
    // Create category filter buttons
    categoryFilters.innerHTML = portfolioData.categories.map(category => `
        <button class="filter-btn" data-filter="${category.id}">
            ${category.name}
        </button>
    `).join('');
    
    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter || 'all';
            setFilter(filter);
        });
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.dataset.view || 'grid';
            setView(view);
        });
    });
}

// Set active filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('filter-btn--active', btn.dataset.filter === filter || (filter === 'all' && !btn.dataset.filter));
    });
    
    // Filter photos and update display
    filterPhotos();
    updatePhotosDisplay();
    updateGalleryHeader();
}

// Set active view
function setView(view) {
    currentView = view;
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('view-btn--active', btn.dataset.view === view);
    });
    
    // Update display
    updatePhotosDisplay();
}

// Filter photos based on current filter
function filterPhotos() {
    if (currentFilter === 'all') {
        filteredPhotos = getAllPhotos();
    } else {
        filteredPhotos = getPhotosByCategory(currentFilter);
    }
}

// ========================================
// Portfolio Categories Overview
// ========================================

// Load portfolio categories overview
function loadPortfolioCategories() {
    const portfolioCategories = document.getElementById('portfolio-categories');
    if (!portfolioCategories || !portfolioData.categories) return;
    
    portfolioCategories.innerHTML = portfolioData.categories.map((category, index) => {
        const photosCount = portfolioData.photos[category.id] ? portfolioData.photos[category.id].length : 0;
        
        return `
            <a href="category.html?id=${category.id}" class="portfolio-category hover-lift" style="animation-delay: ${index * 0.1}s;">
                <div class="portfolio-category__image">
                    <i data-lucide="camera" class="portfolio-category__icon"></i>
                </div>
                <div class="portfolio-category__content">
                    <h3 class="portfolio-category__title">${category.name}</h3>
                    <p class="portfolio-category__description">${category.description}</p>
                    <p class="portfolio-category__count">Voir ${photosCount} photo${photosCount > 1 ? 's' : ''}</p>
                </div>
            </a>
        `;
    }).join('');
    
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ========================================
// Photos Gallery Display
// ========================================

// Update gallery header
function updateGalleryHeader() {
    const galleryTitle = document.getElementById('gallery-title');
    const galleryCount = document.getElementById('gallery-count');
    
    if (galleryTitle) {
        if (currentFilter === 'all') {
            galleryTitle.textContent = 'Toutes mes photos';
        } else {
            const category = getCategoryById(currentFilter);
            galleryTitle.textContent = category ? category.name : currentFilter;
        }
    }
    
    if (galleryCount) {
        const count = filteredPhotos.length;
        galleryCount.textContent = `${count} photo${count > 1 ? 's' : ''}`;
    }
}

// Update photos display based on current view
function updatePhotosDisplay() {
    const photosGrid = document.getElementById('photos-grid');
    const photosList = document.getElementById('photos-list');
    const galleryEmpty = document.getElementById('gallery-empty');
    
    if (!photosGrid || !photosList || !galleryEmpty) return;
    
    if (filteredPhotos.length === 0) {
        // Show empty state
        photosGrid.style.display = 'none';
        photosList.style.display = 'none';
        galleryEmpty.style.display = 'block';
        return;
    }
    
    // Hide empty state
    galleryEmpty.style.display = 'none';
    
    if (currentView === 'grid') {
        // Show grid view
        photosGrid.style.display = 'grid';
        photosList.style.display = 'none';
        displayPhotosGrid();
    } else {
        // Show list view
        photosGrid.style.display = 'none';
        photosList.style.display = 'block';
        displayPhotosList();
    }
}

// Display photos in grid view
function displayPhotosGrid() {
    const photosGrid = document.getElementById('photos-grid');
    if (!photosGrid) return;
    
    photosGrid.innerHTML = filteredPhotos.map((photo, index) => {
        const category = getCategoryById(photo.category);
        
        return `
            <div class="photo__card hover-lift" 
                 style="animation-delay: ${index * 0.05}s;"
                 onclick="openLightbox(${JSON.stringify(filteredPhotos).replace(/"/g, '&quot;')}, ${index})">
                <img src="${photo.image}" alt="${photo.title}" class="photo__image" loading="lazy">
                <div class="photo__overlay">
                    <div class="photo__content">
                        <h3 class="photo__title">${photo.title}</h3>
                        <p class="photo__meta">${category ? category.name : photo.category}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Display photos in list view
function displayPhotosList() {
    const photosList = document.getElementById('photos-list');
    if (!photosList) return;
    
    photosList.innerHTML = filteredPhotos.map((photo, index) => {
        const category = getCategoryById(photo.category);
        
        return `
            <div class="photo__card--list hover-lift" 
                 style="animation-delay: ${index * 0.05}s;"
                 onclick="openLightbox(${JSON.stringify(filteredPhotos).replace(/"/g, '&quot;')}, ${index})">
                <img src="${photo.image}" alt="${photo.title}" class="photo__list-image" loading="lazy">
                <div class="photo__list-content">
                    <h3 class="photo__list-title">${photo.title}</h3>
                    <p class="photo__list-category">${category ? category.name : photo.category}</p>
                    <p class="photo__list-date">Capturée le ${formatDate(photo.date)}</p>
                    ${photo.description ? `<p class="photo__list-description">${photo.description}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Handle photo click for lightbox
function handlePhotoClick(photoIndex) {
    openLightbox(filteredPhotos, photoIndex);
}

// ========================================
// Portfolio Page Initialization
// ========================================

// Initialize portfolio page
function initPortfolioPage() {
    // Load initial data
    allPhotos = getAllPhotos();
    filteredPhotos = allPhotos;
    
    // Initialize components
    initPortfolioFilters();
    loadPortfolioCategories();
    
    // Initial display
    updatePhotosDisplay();
    updateGalleryHeader();
    
    console.log('Portfolio page initialized');
}

// ========================================
// Page Load Event
// ========================================

// Initialize portfolio page when data is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for main.js to load portfolio data
        const checkData = setInterval(() => {
            if (window.portfolioApp && typeof getAllPhotos === 'function') {
                clearInterval(checkData);
                initPortfolioPage();
            }
        }, 100);
    });
} else {
    // Data should already be loaded
    const checkData = setInterval(() => {
        if (window.portfolioApp && typeof getAllPhotos === 'function') {
            clearInterval(checkData);
            initPortfolioPage();
        }
    }, 100);
}

// Export functions for external use
window.portfolioPage = {
    setFilter,
    setView,
    handlePhotoClick,
    filterPhotos,
    updatePhotosDisplay
};