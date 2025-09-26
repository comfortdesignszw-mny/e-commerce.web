// Cart Page JavaScript
class CartPage {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.coupons = {
            'WELCOME10': { discount: 0.1, type: 'percentage' },
            'SAVE20': { discount: 0.2, type: 'percentage' },
            'FREESHIP': { discount: 0, type: 'free_shipping' },
            'FIXED10': { discount: 10, type: 'fixed' }
        };
        this.appliedCoupon = null;
        
        this.init();
    }

    init() {
        this.renderCart();
        this.loadRecommendedProducts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Coupon input
        const couponInput = document.getElementById('couponCode');
        if (couponInput) {
            couponInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.applyCoupon();
                }
            });
        }
    }

    renderCart() {
        const cartItems = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        
        if (this.cart.length === 0) {
            if (cartItems) cartItems.style.display = 'none';
            if (emptyCart) emptyCart.style.display = 'block';
            this.updateSummary();
            return;
        }

        if (cartItems) cartItems.style.display = 'flex';
        if (emptyCart) emptyCart.style.display = 'none';

        if (cartItems) {
            cartItems.innerHTML = this.cart.map(item => this.createCartItemHTML(item)).join('');
        }

        this.updateSummary();
    }

    createCartItemHTML(item) {
        const optionsText = item.selectedOptions ? 
            Object.entries(item.selectedOptions).map(([key, value]) => `${key}: ${value}`).join(', ') : '';

        return `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <a href="product-detail.html?id=${item.id}" class="cart-item-title">${item.title}</a>
                    <p class="cart-item-category">${item.category.charAt(0).toUpperCase() + item.category.slice(1)} Products</p>
                    ${optionsText ? `<p class="cart-item-options">${optionsText}</p>` : ''}
                    <div class="cart-item-actions">
                        <button class="cart-item-action" onclick="moveToWishlist('${item.id}')">Move to Wishlist</button>
                        <button class="cart-item-action" onclick="saveForLater('${item.id}')">Save for Later</button>
                    </div>
                    <div class="cart-item-quantity">
                        <label>Quantity:</label>
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" onchange="setQuantity('${item.id}', this.value)">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)" ${item.quantity >= 10 ? 'disabled' : ''}>+</button>
                        </div>
                    </div>
                </div>
                <div class="cart-item-price">
                    <div class="cart-item-price-current">$${(item.price * item.quantity).toFixed(2)}</div>
                    ${item.originalPrice ? `<div class="cart-item-price-original">$${(item.originalPrice * item.quantity).toFixed(2)}</div>` : ''}
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    updateSummary() {
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping();
        const tax = this.calculateTax(subtotal);
        const total = subtotal + shipping + tax;

        // Apply coupon discount if any
        const discount = this.calculateDiscount(subtotal);
        const finalTotal = total - discount;

        // Update UI
        this.updateElement('subtotal', `$${subtotal.toFixed(2)}`);
        this.updateElement('shipping', shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`);
        this.updateElement('tax', `$${tax.toFixed(2)}`);
        this.updateElement('total', `$${finalTotal.toFixed(2)}`);

        // Update cart count in header
        if (window.app) {
            window.app.updateCartCount();
        }
    }

    calculateSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    calculateShipping() {
        const subtotal = this.calculateSubtotal();
        
        // Free shipping over $50 or if coupon provides free shipping
        if (subtotal >= 50 || (this.appliedCoupon && this.appliedCoupon.type === 'free_shipping')) {
            return 0;
        }
        
        // Check if any physical products
        const hasPhysicalProducts = this.cart.some(item => item.category === 'physical');
        
        if (!hasPhysicalProducts) {
            return 0; // Digital products don't need shipping
        }
        
        return 9.99; // Standard shipping rate
    }

    calculateTax(subtotal) {
        // Simple tax calculation - 8% tax rate
        return subtotal * 0.08;
    }

    calculateDiscount(subtotal) {
        if (!this.appliedCoupon) return 0;

        const coupon = this.coupons[this.appliedCoupon.code];
        if (!coupon) return 0;

        if (coupon.type === 'percentage') {
            return subtotal * coupon.discount;
        } else if (coupon.type === 'fixed') {
            return Math.min(coupon.discount, subtotal);
        }
        
        return 0;
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    loadRecommendedProducts() {
        const recommendedProducts = document.getElementById('recommendedProducts');
        if (!recommendedProducts) return;

        // Sample recommended products
        const recommended = [
            {
                id: 'digital-marketing-course',
                title: 'Digital Marketing Course',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                id: 'mobile-app-template',
                title: 'Mobile App Template',
                price: 39.99,
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            {
                id: 'laptop-stand',
                title: 'Adjustable Laptop Stand',
                price: 45.99,
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            }
        ];

        recommendedProducts.innerHTML = recommended.map(product => `
            <div class="recommended-item" onclick="viewProduct('${product.id}')">
                <img src="${product.image}" alt="${product.title}">
                <div class="recommended-item-details">
                    <div class="recommended-item-title">${product.title}</div>
                    <div class="recommended-item-price">$${product.price.toFixed(2)}</div>
                </div>
                <button class="recommended-item-add" onclick="event.stopPropagation(); addRecommendedToCart('${product.id}')" title="Add to cart">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `).join('');
    }

    applyCoupon() {
        const couponInput = document.getElementById('couponCode');
        const couponMessage = document.getElementById('couponMessage');
        
        if (!couponInput || !couponMessage) return;

        const couponCode = couponInput.value.trim().toUpperCase();
        
        if (!couponCode) {
            couponMessage.textContent = 'Please enter a coupon code';
            couponMessage.className = 'coupon-message error';
            return;
        }

        if (this.coupons[couponCode]) {
            this.appliedCoupon = { code: couponCode, ...this.coupons[couponCode] };
            couponMessage.textContent = `Coupon "${couponCode}" applied successfully!`;
            couponMessage.className = 'coupon-message success';
            this.updateSummary();
        } else {
            couponMessage.textContent = 'Invalid coupon code';
            couponMessage.className = 'coupon-message error';
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            if (window.app) {
                window.app.showNotification('Your cart is empty', 'error');
            }
            return;
        }

        // Save cart state for checkout
        localStorage.setItem('checkoutCart', JSON.stringify(this.cart));
        localStorage.setItem('appliedCoupon', JSON.stringify(this.appliedCoupon));
        
        // Redirect to checkout
        window.location.href = 'checkout.html';
    }
}

// Global functions for HTML onclick handlers
function updateQuantity(itemId, change) {
    if (window.cartPage) {
        const item = window.cartPage.cart.find(item => item.id === itemId);
        if (item) {
            const newQuantity = Math.max(1, Math.min(10, item.quantity + change));
            item.quantity = newQuantity;
            window.cartPage.saveCart();
            window.cartPage.renderCart();
        }
    }
}

function setQuantity(itemId, quantity) {
    if (window.cartPage) {
        const item = window.cartPage.cart.find(item => item.id === itemId);
        if (item) {
            const newQuantity = Math.max(1, Math.min(10, parseInt(quantity) || 1));
            item.quantity = newQuantity;
            window.cartPage.saveCart();
            window.cartPage.renderCart();
        }
    }
}

function removeFromCart(itemId) {
    if (window.cartPage) {
        window.cartPage.cart = window.cartPage.cart.filter(item => item.id !== itemId);
        window.cartPage.saveCart();
        window.cartPage.renderCart();
        
        if (window.app) {
            window.app.showNotification('Item removed from cart', 'info');
        }
    }
}

function moveToWishlist(itemId) {
    if (window.cartPage && window.app) {
        const item = window.cartPage.cart.find(item => item.id === itemId);
        if (item) {
            // Add to wishlist
            window.app.wishlist.push(item);
            window.app.saveWishlist();
            
            // Remove from cart
            window.cartPage.cart = window.cartPage.cart.filter(cartItem => cartItem.id !== itemId);
            window.cartPage.saveCart();
            window.cartPage.renderCart();
            
            window.app.showNotification('Item moved to wishlist', 'success');
        }
    }
}

function saveForLater(itemId) {
    if (window.cartPage) {
        // In a real app, this would save to a "saved for later" list
        if (window.app) {
            window.app.showNotification('Item saved for later', 'info');
        }
    }
}

function applyCoupon() {
    if (window.cartPage) {
        window.cartPage.applyCoupon();
    }
}

function proceedToCheckout() {
    if (window.cartPage) {
        window.cartPage.proceedToCheckout();
    }
}

function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

function addRecommendedToCart(productId) {
    if (window.app) {
        // Sample product data for recommended items
        const recommendedProducts = {
            'digital-marketing-course': {
                id: 'digital-marketing-course',
                title: 'Digital Marketing Course',
                category: 'digital',
                type: 'Digital',
                price: 79.99,
                originalPrice: 99.99,
                rating: 5,
                reviewCount: 28,
                image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            'mobile-app-template': {
                id: 'mobile-app-template',
                title: 'Mobile App Template',
                category: 'digital',
                type: 'Digital',
                price: 39.99,
                originalPrice: 59.99,
                rating: 4,
                reviewCount: 19,
                image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            },
            'laptop-stand': {
                id: 'laptop-stand',
                title: 'Adjustable Laptop Stand',
                category: 'physical',
                type: 'Physical',
                price: 45.99,
                originalPrice: null,
                rating: 4,
                reviewCount: 12,
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            }
        };

        const product = recommendedProducts[productId];
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
            
            window.app.addToCart({ target: { closest: () => mockCard } });
            
            // Refresh cart page
            setTimeout(() => {
                window.cartPage.renderCart();
            }, 500);
        }
    }
}

// Add saveCart method to CartPage
CartPage.prototype.saveCart = function() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
};

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartPage = new CartPage();
});
