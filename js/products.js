// Products Page JavaScript
class ProductsPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.currentSort = 'featured';
        this.filters = {
            category: [],
            priceRange: { min: 0, max: 1000 },
            rating: [],
            availability: []
        };
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.applyURLParams();
        this.renderProducts();
    }

    loadProducts() {
        // Sample product data - in a real app, this would come from an API
        this.products = [
            {
                id: 'premium-design-template',
                title: 'Premium Design Template',
                category: 'digital',
                type: 'Digital',
                price: 29.99,
                originalPrice: 49.99,
                rating: 5,
                reviewCount: 24,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                inStock: true,
                onSale: true,
                description: 'Professional design template for modern websites'
            },
            {
                id: 'wireless-headphones',
                title: 'Wireless Headphones',
                category: 'physical',
                type: 'Physical',
                price: 89.99,
                originalPrice: null,
                rating: 4,
                reviewCount: 18,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                inStock: true,
                onSale: false,
                description: 'High-quality wireless headphones with noise cancellation'
            },
            {
                id: 'web-development-service',
                title: 'Web Development Service',
                category: 'services',
                type: 'Service',
                price: 500,
                originalPrice: null,
                rating: 5,
                reviewCount: 32,
                image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                inStock: true,
                onSale: false,
                description: 'Professional web development services for your business'
            },
            {
                id: 'smart-watch',
                title: 'Smart Watch',
                category: 'physical',
                type: 'Physical',
                price: 199.99,
                originalPrice: 249.99,
                rating: 4,
                reviewCount: 15,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                inStock: true,
                onSale: true,
                description: 'Advanced smartwatch with health monitoring features'
            },
            {
                id: 'digital-marketing-course',
                title: 'Digital Marketing Course',
                category: 'digital',
                type: 'Digital',
                price: 79.99,
                originalPrice: 99.99,
                rating: 5,
                reviewCount: 28,
                image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                inStock: true,
                onSale: true,
                description: 'Comprehensive digital marketing course for beginners'
            },
            {
                id: 'laptop-stand',
                title: 'Adjustable Laptop Stand',
                category: 'physical',
                type: 'Physical',
                price: 45.99,
                originalPrice: null,
                rating: 4,
                reviewCount: 12,
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                inStock: true,
                onSale: false,
                description: 'Ergonomic laptop stand for better posture'
            },
            {
                id: 'graphic-design-service',
                title: 'Graphic Design Service',
                category: 'services',
                type: 'Service',
                price: 150,
                originalPrice: null,
                rating: 5,
                reviewCount: 22,
                image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                inStock: true,
                onSale: false,
                description: 'Professional graphic design services for your brand'
            },
            {
                id: 'mobile-app-template',
                title: 'Mobile App Template',
                category: 'digital',
                type: 'Digital',
                price: 39.99,
                originalPrice: 59.99,
                rating: 4,
                reviewCount: 19,
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                inStock: true,
                onSale: true,
                description: 'Modern mobile app template with clean design'
            }
        ];

        this.filteredProducts = [...this.products];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }

        // Price range slider
        const priceSlider = document.getElementById('priceSlider');
        if (priceSlider) {
            priceSlider.addEventListener('input', (e) => {
                this.updatePriceRange(e.target.value);
            });
        }
    }

    applyURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const search = urlParams.get('search');

        if (category) {
            this.filters.category = [category];
            this.updateFilterUI();
        }

        if (search) {
            this.searchProducts(search);
            if (document.getElementById('productSearch')) {
                document.getElementById('productSearch').value = search;
            }
        }
    }

    updateFilterUI() {
        // Update checkboxes based on current filters
        Object.keys(this.filters).forEach(filterType => {
            if (filterType === 'priceRange') return;
            
            this.filters[filterType].forEach(value => {
                const checkbox = document.querySelector(`input[name="${filterType}"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        });
    }

    searchProducts(query) {
        if (!query.trim()) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product =>
                product.title.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.currentPage = 1;
        this.renderProducts();
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.category.length > 0 && !this.filters.category.includes(product.category)) {
                return false;
            }

            // Price range filter
            if (product.price < this.filters.priceRange.min || product.price > this.filters.priceRange.max) {
                return false;
            }

            // Rating filter
            if (this.filters.rating.length > 0 && !this.filters.rating.includes(product.rating.toString())) {
                return false;
            }

            // Availability filter
            if (this.filters.availability.includes('in-stock') && !product.inStock) {
                return false;
            }
            if (this.filters.availability.includes('on-sale') && !product.onSale) {
                return false;
            }

            return true;
        });

        this.currentPage = 1;
        this.renderProducts();
    }

    updatePriceRange(sliderValue) {
        this.filters.priceRange.max = parseInt(sliderValue);
        const maxPriceInput = document.getElementById('maxPrice');
        if (maxPriceInput) {
            maxPriceInput.value = sliderValue;
        }
        this.applyFilters();
    }

    sortProducts() {
        const sortSelect = document.getElementById('sortSelect');
        if (!sortSelect) return;

        this.currentSort = sortSelect.value;

        this.filteredProducts.sort((a, b) => {
            switch (this.currentSort) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return b.id.localeCompare(a.id); // Simple implementation
                case 'name':
                    return a.title.localeCompare(b.title);
                default: // featured
                    return 0;
            }
        });

        this.renderProducts();
    }

    toggleView(view) {
        this.currentView = view;
        const productsGrid = document.getElementById('productsGrid');
        const viewButtons = document.querySelectorAll('.view-btn');

        // Update active button
        viewButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });

        // Update grid class
        if (productsGrid) {
            productsGrid.className = view === 'list' ? 'products-grid list-view' : 'products-grid';
        }

        this.renderProducts();
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const productsCount = document.getElementById('productsCount');
        
        if (!productsGrid) return;

        // Update count
        if (productsCount) {
            productsCount.textContent = this.filteredProducts.length;
        }

        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        // Clear existing products
        productsGrid.innerHTML = '';

        if (productsToShow.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search" style="font-size: 48px; color: #cbd5e1; margin-bottom: 16px;"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        // Render products
        productsToShow.forEach(product => {
            const productCard = this.createProductCard(product);
            productsGrid.appendChild(productCard);
        });

        this.updatePagination();
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                <div class="product-badge">${product.type}</div>
                <div class="product-actions">
                    <button class="btn-icon" title="Add to Wishlist" onclick="toggleWishlist('${product.id}')">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="btn-icon" title="Quick View" onclick="showQuickView('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)} Products</p>
                <div class="product-rating">
                    <div class="stars">
                        ${this.renderStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="btn btn-primary btn-full" onclick="addToCart('${product.id}')">
                    ${product.category === 'services' ? 'Book Now' : 'Add to Cart'}
                </button>
            </div>
        `;

        return card;
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const pagination = document.querySelector('.pagination');
        
        if (!pagination) return;

        // Update pagination numbers
        const paginationNumbers = pagination.querySelector('.pagination-numbers');
        if (paginationNumbers) {
            let numbersHTML = '';
            
            // Show first page
            if (this.currentPage > 3) {
                numbersHTML += `<button class="pagination-number" onclick="goToPage(1)">1</button>`;
                if (this.currentPage > 4) {
                    numbersHTML += `<span class="pagination-dots">...</span>`;
                }
            }

            // Show pages around current page
            const startPage = Math.max(1, this.currentPage - 2);
            const endPage = Math.min(totalPages, this.currentPage + 2);

            for (let i = startPage; i <= endPage; i++) {
                const activeClass = i === this.currentPage ? 'active' : '';
                numbersHTML += `<button class="pagination-number ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
            }

            // Show last page
            if (this.currentPage < totalPages - 2) {
                if (this.currentPage < totalPages - 3) {
                    numbersHTML += `<span class="pagination-dots">...</span>`;
                }
                numbersHTML += `<button class="pagination-number" onclick="goToPage(${totalPages})">${totalPages}</button>`;
            }

            paginationNumbers.innerHTML = numbersHTML;
        }

        // Update previous/next buttons
        const prevBtn = pagination.querySelector('.pagination-btn:first-child');
        const nextBtn = pagination.querySelector('.pagination-btn:last-child');

        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const newPage = this.currentPage + direction;
        
        if (newPage >= 1 && newPage <= totalPages) {
            this.goToPage(newPage);
        }
    }
}

// Global functions for HTML onclick handlers
function applyFilters() {
    if (window.productsPage) {
        // Update filters from form inputs
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
        const ratingCheckboxes = document.querySelectorAll('input[name="rating"]:checked');
        const availabilityCheckboxes = document.querySelectorAll('input[name="availability"]:checked');
        
        window.productsPage.filters.category = Array.from(categoryCheckboxes).map(cb => cb.value);
        window.productsPage.filters.rating = Array.from(ratingCheckboxes).map(cb => cb.value);
        window.productsPage.filters.availability = Array.from(availabilityCheckboxes).map(cb => cb.value);
        
        // Update price range
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        
        if (minPrice) {
            window.productsPage.filters.priceRange.min = parseInt(minPrice);
        }
        if (maxPrice) {
            window.productsPage.filters.priceRange.max = parseInt(maxPrice);
        }
        
        window.productsPage.applyFilters();
    }
}

function clearAllFilters() {
    if (window.productsPage) {
        // Reset all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Reset price inputs
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('priceSlider').value = 1000;
        
        // Reset filters
        window.productsPage.filters = {
            category: [],
            priceRange: { min: 0, max: 1000 },
            rating: [],
            availability: []
        };
        
        window.productsPage.applyFilters();
    }
}

function updatePriceRange() {
    if (window.productsPage) {
        const slider = document.getElementById('priceSlider');
        const maxPriceInput = document.getElementById('maxPrice');
        
        if (slider && maxPriceInput) {
            maxPriceInput.value = slider.value;
            window.productsPage.updatePriceRange(slider.value);
        }
    }
}

function toggleView(view) {
    if (window.productsPage) {
        window.productsPage.toggleView(view);
    }
}

function sortProducts() {
    if (window.productsPage) {
        window.productsPage.sortProducts();
    }
}

function goToPage(page) {
    if (window.productsPage) {
        window.productsPage.goToPage(page);
    }
}

function changePage(direction) {
    if (window.productsPage) {
        window.productsPage.changePage(direction);
    }
}

function addToCart(productId) {
    if (window.app) {
        const product = window.productsPage.products.find(p => p.id === productId);
        if (product) {
            // Create a mock product card element for the addToCart method
            const mockCard = {
                querySelector: (selector) => {
                    const mockElements = {
                        'h3': { textContent: product.title },
                        '.current-price': { textContent: `$${product.price.toFixed(2)}` },
                        '.product-category': { textContent: product.category.charAt(0).toUpperCase() + product.category.slice(1) + ' Products' },
                        '.rating-count': { textContent: `(${product.reviewCount})` },
                        '.product-badge': { textContent: product.type },
                        'img': { src: product.image }
                    };
                    return mockElements[selector] || null;
                }
            };
            
            window.app.addToCart({ target: { closest: () => mockCard } });
        }
    }
}

function toggleWishlist(productId) {
    if (window.app) {
        const product = window.productsPage.products.find(p => p.id === productId);
        if (product) {
            const mockCard = {
                querySelector: (selector) => {
                    const mockElements = {
                        'h3': { textContent: product.title },
                        '.current-price': { textContent: `$${product.price.toFixed(2)}` },
                        '.product-category': { textContent: product.category.charAt(0).toUpperCase() + product.category.slice(1) + ' Products' },
                        '.rating-count': { textContent: `(${product.reviewCount})` },
                        '.product-badge': { textContent: product.type },
                        'img': { src: product.image }
                    };
                    return mockElements[selector] || null;
                }
            };
            
            window.app.toggleWishlist({ target: { closest: () => mockCard } });
        }
    }
}

function showQuickView(productId) {
    if (window.app) {
        const product = window.productsPage.products.find(p => p.id === productId);
        if (product) {
            const mockCard = {
                querySelector: (selector) => {
                    const mockElements = {
                        'h3': { textContent: product.title },
                        '.current-price': { textContent: `$${product.price.toFixed(2)}` },
                        '.product-category': { textContent: product.category.charAt(0).toUpperCase() + product.category.slice(1) + ' Products' },
                        '.rating-count': { textContent: `(${product.reviewCount})` },
                        '.product-badge': { textContent: product.type },
                        'img': { src: product.image }
                    };
                    return mockElements[selector] || null;
                }
            };
            
            window.app.showQuickView({ target: { closest: () => mockCard } });
        }
    }
}

// Initialize products page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productsPage = new ProductsPage();
});
