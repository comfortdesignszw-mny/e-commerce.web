// Product Detail Page JavaScript
class ProductDetailPage {
    constructor() {
        this.product = null;
        this.selectedOptions = {};
        this.quantity = 1;
        this.images = [];
        this.currentImageIndex = 0;
        
        this.init();
    }

    init() {
        this.loadProduct();
        this.setupEventListeners();
        this.renderProduct();
        this.loadRelatedProducts();
    }

    loadProduct() {
        // Get product ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || 'premium-design-template';
        
        // Sample product data - in a real app, this would come from an API
        const products = {
            'premium-design-template': {
                id: 'premium-design-template',
                title: 'Premium Design Template',
                category: 'digital',
                type: 'Digital',
                price: 29.99,
                originalPrice: 49.99,
                rating: 5,
                reviewCount: 24,
                images: [
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                ],
                description: 'Professional design template for modern websites. This template includes all the necessary components for building a stunning, responsive website with clean code and modern design principles.',
                detailedDescription: `
                    <p>This premium design template is perfect for businesses, portfolios, and creative agencies. It features a modern, clean design with excellent typography and user experience.</p>
                    <ul>
                        <li>Fully responsive design that works on all devices</li>
                        <li>Clean, semantic HTML5 code</li>
                        <li>Modern CSS3 with Flexbox and Grid</li>
                        <li>Optimized for performance and SEO</li>
                        <li>Cross-browser compatible</li>
                        <li>Easy to customize and modify</li>
                        <li>Well-documented code</li>
                        <li>Free updates for 1 year</li>
                    </ul>
                `,
                specifications: {
                    brand: 'MarketPlace',
                    model: 'MP-DT-001',
                    dimensions: 'N/A (Digital)',
                    weight: 'N/A (Digital)',
                    color: 'Multiple variants',
                    warranty: '1 Year Updates'
                },
                options: {
                    'Template Style': ['Modern', 'Classic', 'Minimalist'],
                    'Color Scheme': ['Dark', 'Light', 'Colorful'],
                    'Layout': ['Single Page', 'Multi Page', 'Blog']
                },
                inStock: true,
                onSale: true,
                features: [
                    'Fully Responsive',
                    'Modern Design',
                    'Clean Code',
                    'SEO Optimized',
                    'Cross Browser Compatible',
                    'Easy Customization'
                ]
            },
            'wireless-headphones': {
                id: 'wireless-headphones',
                title: 'Wireless Headphones',
                category: 'physical',
                type: 'Physical',
                price: 89.99,
                originalPrice: null,
                rating: 4,
                reviewCount: 18,
                images: [
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    'https://images.unsplash.com/photo-1546435770-a3c426bf4b4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                ],
                description: 'High-quality wireless headphones with noise cancellation technology. Perfect for music lovers and professionals who need clear audio.',
                detailedDescription: `
                    <p>Experience premium sound quality with these wireless headphones. Featuring advanced noise cancellation technology and superior comfort for extended listening sessions.</p>
                    <ul>
                        <li>Active noise cancellation technology</li>
                        <li>30-hour battery life with quick charge</li>
                        <li>Premium sound quality with deep bass</li>
                        <li>Comfortable over-ear design</li>
                        <li>Bluetooth 5.0 connectivity</li>
                        <li>Built-in microphone for calls</li>
                        <li>Foldable design for easy storage</li>
                        <li>2-year manufacturer warranty</li>
                    </ul>
                `,
                specifications: {
                    brand: 'AudioTech',
                    model: 'ATH-WH500',
                    dimensions: '8.5 x 7.2 x 3.1 inches',
                    weight: '0.6 lbs',
                    color: 'Black',
                    warranty: '2 Years'
                },
                options: {
                    'Color': ['Black', 'White', 'Silver'],
                    'Size': ['One Size Fits All'],
                    'Cable': ['Included', 'Not Included']
                },
                inStock: true,
                onSale: false,
                features: [
                    'Noise Cancellation',
                    '30h Battery Life',
                    'Bluetooth 5.0',
                    'Comfortable Design',
                    'Built-in Mic',
                    'Foldable'
                ]
            }
        };

        this.product = products[productId] || products['premium-design-template'];
        this.images = this.product.images;
    }

    setupEventListeners() {
        // Image zoom functionality
        const imageZoom = document.getElementById('imageZoom');
        if (imageZoom) {
            imageZoom.addEventListener('click', () => {
                this.showImageModal();
            });
        }

        // Quantity controls
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.addEventListener('change', (e) => {
                this.quantity = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                e.target.value = this.quantity;
            });
        }
    }

    renderProduct() {
        if (!this.product) return;

        // Update breadcrumb
        const breadcrumbProduct = document.getElementById('breadcrumbProduct');
        if (breadcrumbProduct) {
            breadcrumbProduct.textContent = this.product.title;
        }

        // Update product images
        this.renderImages();

        // Update product info
        this.renderProductInfo();

        // Update product options
        this.renderProductOptions();

        // Update specifications
        this.renderSpecifications();

        // Update detailed description
        this.renderDetailedDescription();
    }

    renderImages() {
        const mainImage = document.getElementById('mainProductImage');
        const thumbnails = document.querySelectorAll('.thumbnail img');

        if (mainImage) {
            mainImage.src = this.images[0];
            mainImage.alt = this.product.title;
        }

        thumbnails.forEach((thumb, index) => {
            if (this.images[index]) {
                thumb.src = this.images[index];
                thumb.alt = `${this.product.title} - Image ${index + 1}`;
            }
        });
    }

    renderProductInfo() {
        // Update product badge
        const productBadge = document.getElementById('productBadge');
        if (productBadge) {
            productBadge.textContent = this.product.type;
        }

        // Update title
        const productTitle = document.getElementById('productTitle');
        if (productTitle) {
            productTitle.textContent = this.product.title;
        }

        // Update category
        const productCategory = document.getElementById('productCategory');
        if (productCategory) {
            productCategory.textContent = this.product.category.charAt(0).toUpperCase() + this.product.category.slice(1) + ' Products';
        }

        // Update rating
        const productStars = document.getElementById('productStars');
        if (productStars) {
            productStars.innerHTML = this.renderStars(this.product.rating);
        }

        // Update rating count
        const ratingCount = document.getElementById('ratingCount');
        if (ratingCount) {
            ratingCount.textContent = `(${this.product.reviewCount} reviews)`;
        }

        // Update price
        const currentPrice = document.getElementById('currentPrice');
        const originalPrice = document.getElementById('originalPrice');
        const discountBadge = document.getElementById('discountBadge');

        if (currentPrice) {
            currentPrice.textContent = `$${this.product.price.toFixed(2)}`;
        }

        if (this.product.originalPrice) {
            if (originalPrice) {
                originalPrice.textContent = `$${this.product.originalPrice.toFixed(2)}`;
                originalPrice.style.display = 'inline';
            }
            if (discountBadge) {
                const discount = Math.round((1 - this.product.price / this.product.originalPrice) * 100);
                discountBadge.textContent = `${discount}% OFF`;
                discountBadge.style.display = 'inline';
            }
        }

        // Update description
        const productDescription = document.getElementById('productDescription');
        if (productDescription) {
            productDescription.innerHTML = `<p>${this.product.description}</p>`;
        }
    }

    renderProductOptions() {
        const productOptions = document.getElementById('productOptions');
        if (!productOptions || !this.product.options) return;

        let optionsHTML = '';
        Object.keys(this.product.options).forEach(optionName => {
            const optionValues = this.product.options[optionName];
            optionsHTML += `
                <div class="option-group">
                    <label class="option-label">${optionName}:</label>
                    <div class="option-buttons">
                        ${optionValues.map(value => `
                            <button class="option-btn" onclick="selectOption('${optionName}', '${value}')">
                                ${value}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        productOptions.innerHTML = optionsHTML;
    }

    renderSpecifications() {
        if (!this.product.specifications) return;

        Object.keys(this.product.specifications).forEach(spec => {
            const element = document.getElementById(`spec${spec.charAt(0).toUpperCase() + spec.slice(1)}`);
            if (element) {
                element.textContent = this.product.specifications[spec];
            }
        });
    }

    renderDetailedDescription() {
        const detailedDescription = document.getElementById('detailedDescription');
        if (detailedDescription && this.product.detailedDescription) {
            detailedDescription.innerHTML = this.product.detailedDescription;
        }
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

    loadRelatedProducts() {
        const relatedProducts = document.getElementById('relatedProducts');
        if (!relatedProducts) return;

        // Sample related products
        const related = [
            {
                id: 'digital-marketing-course',
                title: 'Digital Marketing Course',
                price: 79.99,
                originalPrice: 99.99,
                rating: 5,
                reviewCount: 28,
                image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                type: 'Digital'
            },
            {
                id: 'mobile-app-template',
                title: 'Mobile App Template',
                price: 39.99,
                originalPrice: 59.99,
                rating: 4,
                reviewCount: 19,
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                type: 'Digital'
            },
            {
                id: 'laptop-stand',
                title: 'Adjustable Laptop Stand',
                price: 45.99,
                originalPrice: null,
                rating: 4,
                reviewCount: 12,
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                type: 'Physical'
            },
            {
                id: 'graphic-design-service',
                title: 'Graphic Design Service',
                price: 150,
                originalPrice: null,
                rating: 5,
                reviewCount: 22,
                image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                type: 'Service'
            }
        ];

        let relatedHTML = '';
        related.forEach(product => {
            relatedHTML += `
                <div class="product-card">
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
                        <p class="product-category">Related Product</p>
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
                            ${product.type === 'Service' ? 'Book Now' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            `;
        });

        relatedProducts.innerHTML = relatedHTML;
    }

    showImageModal() {
        if (!this.images.length) return;

        const modal = document.createElement('div');
        modal.className = 'image-modal-overlay';
        modal.innerHTML = `
            <div class="image-modal">
                <button class="image-modal-close">&times;</button>
                <div class="image-modal-content">
                    <img src="${this.images[this.currentImageIndex]}" alt="${this.product.title}">
                    <div class="image-modal-nav">
                        <button class="image-nav-btn" onclick="changeImage(-1)">❮</button>
                        <button class="image-nav-btn" onclick="changeImage(1)">❯</button>
                    </div>
                    <div class="image-modal-thumbnails">
                        ${this.images.map((img, index) => `
                            <img src="${img}" alt="Thumbnail ${index + 1}" 
                                 class="${index === this.currentImageIndex ? 'active' : ''}"
                                 onclick="goToImage(${index})">
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal functionality
        modal.querySelector('.image-modal-close').addEventListener('click', () => {
            this.closeImageModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeImageModal(modal);
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeImageModal(modal);
            }
        });
    }

    closeImageModal(modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }

    addToCart() {
        if (!this.product) return;

        const productData = {
            ...this.product,
            selectedOptions: { ...this.selectedOptions },
            quantity: this.quantity
        };

        if (window.app) {
            // Create a mock product card element for the addToCart method
            const mockCard = {
                querySelector: (selector) => {
                    const mockElements = {
                        'h3': { textContent: this.product.title },
                        '.current-price': { textContent: `$${this.product.price.toFixed(2)}` },
                        '.product-category': { textContent: this.product.category.charAt(0).toUpperCase() + this.product.category.slice(1) + ' Products' },
                        '.rating-count': { textContent: `(${this.product.reviewCount})` },
                        '.product-badge': { textContent: this.product.type },
                        'img': { src: this.images[0] }
                    };
                    return mockElements[selector] || null;
                }
            };
            
            window.app.addToCart({ target: { closest: () => mockCard } });
        }
    }

    buyNow() {
        this.addToCart();
        // In a real app, this would redirect to checkout
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 500);
    }
}

// Global functions for HTML onclick handlers
function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnail) {
        const img = thumbnail.querySelector('img');
        if (img) {
            mainImage.src = img.src;
        }
        
        // Update active thumbnail
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    }
}

function selectOption(optionName, value) {
    if (window.productDetailPage) {
        window.productDetailPage.selectedOptions[optionName] = value;
        
        // Update UI
        const optionButtons = document.querySelectorAll(`.option-group:has(.option-label:contains('${optionName}')) .option-btn`);
        optionButtons.forEach(btn => {
            btn.classList.remove('selected');
            if (btn.textContent.trim() === value) {
                btn.classList.add('selected');
            }
        });
    }
}

function changeQuantity(delta) {
    if (window.productDetailPage) {
        const newQuantity = Math.max(1, Math.min(10, window.productDetailPage.quantity + delta));
        window.productDetailPage.quantity = newQuantity;
        
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.value = newQuantity;
        }
    }
}

function addToCart() {
    if (window.productDetailPage) {
        window.productDetailPage.addToCart();
    }
}

function buyNow() {
    if (window.productDetailPage) {
        window.productDetailPage.buyNow();
    }
}

function toggleWishlist() {
    if (window.productDetailPage && window.app) {
        const product = window.productDetailPage.product;
        if (product) {
            const mockCard = {
                querySelector: (selector) => {
                    const mockElements = {
                        'h3': { textContent: product.title },
                        '.current-price': { textContent: `$${product.price.toFixed(2)}` },
                        '.product-category': { textContent: product.category.charAt(0).toUpperCase() + product.category.slice(1) + ' Products' },
                        '.rating-count': { textContent: `(${product.reviewCount})` },
                        '.product-badge': { textContent: product.type },
                        'img': { src: window.productDetailPage.images[0] }
                    };
                    return mockElements[selector] || null;
                }
            };
            
            window.app.toggleWishlist({ target: { closest: () => mockCard } });
        }
    }
}

function shareProduct() {
    if (navigator.share) {
        navigator.share({
            title: window.productDetailPage?.product?.title || 'Product',
            text: 'Check out this product!',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            if (window.app) {
                window.app.showNotification('Product link copied to clipboard!', 'success');
            }
        });
    }
}

function showTab(tabName) {
    // Hide all tab panels
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabPanels.forEach(panel => panel.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab panel
    const selectedPanel = document.getElementById(`${tabName}-tab`);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }

    // Add active class to selected tab button
    const selectedButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Image modal functions
function changeImage(direction) {
    if (window.productDetailPage) {
        const newIndex = window.productDetailPage.currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < window.productDetailPage.images.length) {
            window.productDetailPage.currentImageIndex = newIndex;
            const modalImg = document.querySelector('.image-modal img');
            if (modalImg) {
                modalImg.src = window.productDetailPage.images[newIndex];
            }
            updateModalThumbnails();
        }
    }
}

function goToImage(index) {
    if (window.productDetailPage) {
        window.productDetailPage.currentImageIndex = index;
        const modalImg = document.querySelector('.image-modal img');
        if (modalImg) {
            modalImg.src = window.productDetailPage.images[index];
        }
        updateModalThumbnails();
    }
}

function updateModalThumbnails() {
    const thumbnails = document.querySelectorAll('.image-modal-thumbnails img');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === window.productDetailPage.currentImageIndex);
    });
}

// Initialize product detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productDetailPage = new ProductDetailPage();
});

// Add CSS for image modal
const style = document.createElement('style');
style.textContent = `
    .image-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    }

    .image-modal {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        background: white;
        border-radius: 12px;
        overflow: hidden;
    }

    .image-modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        z-index: 10001;
    }

    .image-modal-content {
        position: relative;
    }

    .image-modal img {
        width: 100%;
        height: 70vh;
        object-fit: contain;
    }

    .image-modal-nav {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        transform: translateY(-50%);
    }

    .image-nav-btn {
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .image-modal-thumbnails {
        display: flex;
        gap: 10px;
        padding: 20px;
        justify-content: center;
        background: #f8f9fa;
    }

    .image-modal-thumbnails img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        border: 3px solid transparent;
        transition: border-color 0.2s ease;
    }

    .image-modal-thumbnails img.active {
        border-color: #2563eb;
    }

    @media (max-width: 768px) {
        .image-modal {
            max-width: 95vw;
            max-height: 95vh;
        }
        
        .image-modal img {
            height: 60vh;
        }
        
        .image-modal-thumbnails {
            padding: 15px;
        }
        
        .image-modal-thumbnails img {
            width: 50px;
            height: 50px;
        }
    }
`;

document.head.appendChild(style);
