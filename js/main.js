// E-commerce App JavaScript
class ECommerceApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.setupMobileMenu();
        this.setupSearch();
        this.setupProductInteractions();
        this.setupNewsletter();
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-primary') && e.target.closest('.product-card')) {
                e.preventDefault();
                this.addToCart(e.target.closest('.product-card'));
            }
        });

        // Wishlist buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-icon[title="Add to Wishlist"]')) {
                e.preventDefault();
                this.toggleWishlist(e.target.closest('.product-card'));
            }
        });

        // Quick view buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-icon[title="Quick View"]')) {
                e.preventDefault();
                this.showQuickView(e.target.closest('.product-card'));
            }
        });

        // Cart functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-btn')) {
                e.preventDefault();
                this.showCart();
            }
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav');
        const searchContainer = document.querySelector('.search-container');

        if (mobileMenuBtn && nav) {
            mobileMenuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                mobileMenuBtn.innerHTML = nav.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && !e.target.closest('.mobile-menu-btn')) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');

        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.performSearch(searchInput.value);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(searchInput.value);
                }
            });
        }
    }

    setupProductInteractions() {
        // Product card hover effects
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    setupNewsletter() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.subscribeNewsletter(newsletterForm);
            });
        }
    }

    addToCart(productCard) {
        const product = this.extractProductData(productCard);
        const existingItem = this.cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.updateCartCount();
        this.showNotification('Product added to cart!', 'success');
    }

    toggleWishlist(productCard) {
        const product = this.extractProductData(productCard);
        const existingIndex = this.wishlist.findIndex(item => item.id === product.id);

        if (existingIndex > -1) {
            this.wishlist.splice(existingIndex, 1);
            this.showNotification('Removed from wishlist', 'info');
        } else {
            this.wishlist.push(product);
            this.showNotification('Added to wishlist!', 'success');
        }

        this.saveWishlist();
        this.updateWishlistIcon(productCard);
    }

    showQuickView(productCard) {
        const product = this.extractProductData(productCard);
        this.showModal('Quick View', this.createQuickViewContent(product));
    }

    extractProductData(productCard) {
        const title = productCard.querySelector('h3').textContent;
        const price = productCard.querySelector('.current-price').textContent;
        const category = productCard.querySelector('.product-category').textContent;
        const image = productCard.querySelector('img').src;
        const rating = productCard.querySelector('.rating-count').textContent;

        return {
            id: this.generateId(title),
            title,
            price,
            category,
            image,
            rating,
            type: productCard.querySelector('.product-badge').textContent.toLowerCase()
        };
    }

    generateId(title) {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    updateWishlistIcon(productCard) {
        const wishlistBtn = productCard.querySelector('.btn-icon[title="Add to Wishlist"] i');
        const product = this.extractProductData(productCard);
        const isInWishlist = this.wishlist.some(item => item.id === product.id);
        
        if (wishlistBtn) {
            wishlistBtn.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
        }
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        // In a real app, this would make an API call
        console.log('Searching for:', query);
        this.showNotification(`Searching for "${query}"...`, 'info');
        
        // Simulate search results
        setTimeout(() => {
            window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }, 500);
    }

    subscribeNewsletter(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate API call
        this.showLoading(form.querySelector('button'));
        
        setTimeout(() => {
            this.hideLoading(form.querySelector('button'));
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            form.reset();
        }, 2000);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showCart() {
        if (this.cart.length === 0) {
            this.showModal('Shopping Cart', '<p>Your cart is empty</p>');
            return;
        }

        const cartContent = this.createCartContent();
        this.showModal('Shopping Cart', cartContent);
    }

    createCartContent() {
        let content = '<div class="cart-items">';
        
        this.cart.forEach(item => {
            content += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p class="cart-item-category">${item.category}</p>
                        <div class="cart-item-controls">
                            <button onclick="app.updateQuantity('${item.id}', -1)" class="btn-quantity">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button onclick="app.updateQuantity('${item.id}', 1)" class="btn-quantity">+</button>
                        </div>
                    </div>
                    <div class="cart-item-price">
                        <span class="price">${item.price}</span>
                        <button onclick="app.removeFromCart('${item.id}')" class="btn-remove">×</button>
                    </div>
                </div>
            `;
        });

        const total = this.calculateTotal();
        content += `
            </div>
            <div class="cart-summary">
                <div class="cart-total">
                    <strong>Total: $${total.toFixed(2)}</strong>
                </div>
                <div class="cart-actions">
                    <button onclick="app.clearCart()" class="btn btn-outline">Clear Cart</button>
                    <button onclick="app.proceedToCheckout()" class="btn btn-primary">Checkout</button>
                </div>
            </div>
        `;

        return content;
    }

    createQuickViewContent(product) {
        return `
            <div class="quick-view">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="quick-view-details">
                    <h3>${product.title}</h3>
                    <p class="category">${product.category}</p>
                    <div class="rating">
                        <div class="stars">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <span>${product.rating}</span>
                    </div>
                    <div class="price">${product.price}</div>
                    <p>This is a ${product.type} product. Add it to your cart to purchase.</p>
                    <div class="quick-view-actions">
                        <button onclick="app.addToCartFromModal('${product.id}')" class="btn btn-primary">Add to Cart</button>
                        <button onclick="app.toggleWishlistFromModal('${product.id}')" class="btn btn-outline">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        `;
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
                this.showCart(); // Refresh cart view
            }
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.showCart(); // Refresh cart view
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.showCart(); // Refresh cart view
    }

    calculateTotal() {
        return this.cart.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
    }

    proceedToCheckout() {
        if (this.cart.length === 0) return;
        
        // In a real app, this would redirect to checkout page
        this.showNotification('Redirecting to checkout...', 'info');
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 1000);
    }

    addToCartFromModal(productId) {
        const product = this.cart.find(item => item.id === productId) || 
                      this.wishlist.find(item => item.id === productId);
        
        if (product) {
            this.addToCart({ target: { closest: () => this.createProductCard(product) } });
        }
    }

    toggleWishlistFromModal(productId) {
        // Implementation for modal wishlist toggle
        this.showNotification('Wishlist updated!', 'success');
    }

    createProductCard(product) {
        // Helper method to create product card element for cart operations
        const card = document.createElement('div');
        card.innerHTML = `
            <h3>${product.title}</h3>
            <span class="current-price">${product.price}</span>
            <span class="product-category">${product.category}</span>
        `;
        return card;
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
            }
        });
    }

    closeModal(modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('notification-hide');
                setTimeout(() => {
                    if (notification.parentNode) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('notification-hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        });
    }

    showLoading(button) {
        button.classList.add('loading');
        button.disabled = true;
    }

    hideLoading(button) {
        button.classList.remove('loading');
        button.disabled = false;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ECommerceApp();
});

// Add CSS for modals and notifications
const style = document.createElement('style');
style.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    }

    .modal {
        background: white;
        border-radius: 12px;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
    }

    .modal-content {
        padding: 20px;
    }

    .quick-view {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .quick-view-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
    }

    .quick-view-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }

    .cart-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px 0;
        border-bottom: 1px solid #e5e7eb;
    }

    .cart-item-image {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 8px;
    }

    .cart-item-details {
        flex: 1;
    }

    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 5px;
    }

    .btn-quantity {
        width: 30px;
        height: 30px;
        border: 1px solid #d1d5db;
        background: white;
        border-radius: 4px;
        cursor: pointer;
    }

    .quantity {
        min-width: 30px;
        text-align: center;
    }

    .cart-item-price {
        text-align: right;
    }

    .btn-remove {
        background: none;
        border: none;
        color: #ef4444;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
    }

    .cart-summary {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
    }

    .cart-total {
        font-size: 18px;
        margin-bottom: 15px;
    }

    .cart-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-hide {
        transform: translateX(100%);
    }

    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 20px;
        min-width: 300px;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6b7280;
        margin-left: 10px;
    }

    .notification-success {
        border-left: 4px solid #10b981;
    }

    .notification-error {
        border-left: 4px solid #ef4444;
    }

    .notification-info {
        border-left: 4px solid #3b82f6;
    }

    @media (max-width: 768px) {
        .quick-view {
            grid-template-columns: 1fr;
        }
        
        .cart-item {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .cart-item-price {
            text-align: left;
            width: 100%;
        }
        
        .cart-actions {
            flex-direction: column;
        }
    }
`;

document.head.appendChild(style);
