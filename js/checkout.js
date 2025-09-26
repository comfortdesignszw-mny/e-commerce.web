// Checkout Page JavaScript with PayNow Integration
class CheckoutPage {
    constructor() {
        this.currentStep = 1;
        this.cart = JSON.parse(localStorage.getItem('checkoutCart')) || JSON.parse(localStorage.getItem('cart')) || [];
        this.appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon')) || null;
        this.orderData = {
            customer: {},
            payment: {},
            items: [],
            totals: {}
        };
        
        // Add sample data for testing if cart is empty
        if (this.cart.length === 0) {
            this.cart = [
                {
                    id: 1,
                    title: 'Sample Product 1',
                    price: 29.99,
                    quantity: 1,
                    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    category: 'digital'
                },
                {
                    id: 2,
                    title: 'Sample Product 2',
                    price: 49.99,
                    quantity: 2,
                    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                    category: 'physical'
                }
            ];
            console.log('Added sample cart data for testing');
        }
        
        this.init();
    }

    init() {
        console.log('Initializing checkout page...');
        this.generateOrderReference();
        this.loadCartData();
        this.setupEventListeners();
        this.updateOrderSummary();
        console.log('Checkout page initialization complete');
    }

    loadCartData() {
        console.log('Loading cart data...');
        console.log('Cart from localStorage:', this.cart);
        
        if (this.cart.length === 0) {
            console.log('Cart is empty, showing empty cart message');
            this.showEmptyCart();
            return;
        }

        this.orderData.items = this.cart;
        this.calculateTotals();
        this.updateOrderSummary();
        console.log('Cart data loaded successfully');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Payment method selection
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        console.log('Found payment methods:', paymentMethods.length);
        
        paymentMethods.forEach(method => {
            method.addEventListener('change', (e) => {
                console.log('Payment method changed:', e.target.value);
                this.handlePaymentMethodChange(e.target.value);
            });
        });

        // Form submission
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOrderSubmission();
            });
        }

        // Form validation
        this.setupFormValidation();
        
        console.log('Event listeners set up complete');
    }

    setupFormValidation() {
        const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = value !== '';
        
        if (isValid) {
            field.classList.remove('error');
        } else {
            field.classList.add('error');
        }
        
        return isValid;
    }

    validateStep(stepNumber) {
        const step = document.getElementById(`step${stepNumber}`);
        if (!step) {
            console.error(`Step ${stepNumber} not found`);
            return false;
        }
        
        const requiredFields = step.querySelectorAll('input[required], select[required]');
        let isValid = true;

        console.log(`Validating step ${stepNumber}, found ${requiredFields.length} required fields`);

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
                console.log(`Field ${field.name || field.id} is invalid`);
            }
        });

        console.log(`Step ${stepNumber} validation result:`, isValid);
        return isValid;
    }

    nextStep() {
        console.log('nextStep called, current step:', this.currentStep);
        
        if (this.currentStep === 1) {
            if (!this.validateStep(1)) {
                this.showNotification('Please fill in all required fields', 'error');
                return;
            }
            this.saveCustomerInfo();
        } else if (this.currentStep === 2) {
            const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
            if (!selectedPayment) {
                this.showNotification('Please select a payment method', 'error');
                return;
            }
            this.savePaymentInfo();
        }

        this.currentStep++;
        console.log('Moving to step:', this.currentStep);
        this.updateStepDisplay();
        
        // Update payment amounts when moving to step 2
        if (this.currentStep === 2) {
            this.updatePaymentAmounts();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        console.log('Updating step display, current step:', this.currentStep);
        
        // Update step indicators
        const steps = document.querySelectorAll('.step');
        console.log('Found', steps.length, 'step indicators');
        
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                console.log('Marking step', stepNumber, 'as completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
                console.log('Marking step', stepNumber, 'as active');
            }
        });

        // Update step content
        const stepContents = document.querySelectorAll('.checkout-step');
        console.log('Found', stepContents.length, 'step contents');
        
        stepContents.forEach((content, index) => {
            const stepNumber = index + 1;
            content.classList.remove('active');
            
            if (stepNumber === this.currentStep) {
                content.classList.add('active');
                console.log('Activating step content:', stepNumber);
            }
        });
        
        // Force a reflow to ensure changes are applied
        document.body.offsetHeight;
    }

    saveCustomerInfo() {
        const formData = new FormData(document.getElementById('checkoutForm'));
        this.orderData.customer = {
            email: formData.get('email'),
            phone: formData.get('phone'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            country: formData.get('country'),
            saveInfo: formData.get('saveInfo') === 'on'
        };
    }

    savePaymentInfo() {
        const formData = new FormData(document.getElementById('checkoutForm'));
        this.orderData.payment = {
            method: formData.get('paymentMethod'),
            ecocashNumber: formData.get('ecocashNumber') || null
        };
    }

    handlePaymentMethodChange(method) {
        console.log('Payment method changed to:', method);
        
        // Hide all payment details
        const paymentDetails = document.querySelectorAll('.payment-details');
        paymentDetails.forEach(detail => {
            detail.style.display = 'none';
        });

        // Show relevant payment details
        const methodDetails = document.getElementById(`${method}Details`);
        if (methodDetails) {
            methodDetails.style.display = 'block';
            console.log('Showing payment details for:', method);
            this.updatePaymentAmounts();
        } else {
            console.log('Payment details not found for:', method);
        }
    }

    updatePaymentAmounts() {
        const total = this.orderData.totals.total;
        const reference = this.orderData.reference;

        // Update PayNow amounts
        document.getElementById('paynowAmount').textContent = `$${total.toFixed(2)}`;
        document.getElementById('paynowRef').textContent = reference;

        // Update EcoCash amounts
        document.getElementById('ecocashAmount').textContent = `$${total.toFixed(2)}`;
        document.getElementById('ecocashRef').textContent = reference;

        // Update Bank Transfer amounts
        document.getElementById('bankAmount').textContent = `$${total.toFixed(2)}`;
        document.getElementById('bankRef').textContent = reference;
    }

    calculateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = this.calculateShipping(subtotal);
        const tax = this.calculateTax(subtotal);
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal + shipping + tax - discount;

        this.orderData.totals = {
            subtotal,
            shipping,
            tax,
            discount,
            total
        };

        this.updateOrderSummary();
    }

    calculateShipping(subtotal) {
        // Free shipping over $50
        if (subtotal >= 50) {
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
        // 8% tax rate
        return subtotal * 0.08;
    }

    calculateDiscount(subtotal) {
        if (!this.appliedCoupon) return 0;

        const coupon = this.getCouponDetails(this.appliedCoupon.code);
        if (!coupon) return 0;

        if (coupon.type === 'percentage') {
            return subtotal * coupon.discount;
        } else if (coupon.type === 'fixed') {
            return Math.min(coupon.discount, subtotal);
        }
        
        return 0;
    }

    getCouponDetails(code) {
        const coupons = {
            'WELCOME10': { discount: 0.1, type: 'percentage' },
            'SAVE20': { discount: 0.2, type: 'percentage' },
            'FREESHIP': { discount: 0, type: 'free_shipping' },
            'FIXED10': { discount: 10, type: 'fixed' }
        };
        return coupons[code];
    }

    updateOrderSummary() {
        console.log('Updating order summary...');
        console.log('Cart items:', this.cart);
        console.log('Order data items:', this.orderData.items);
        
        // Ensure we have items to display
        if (this.cart.length > 0) {
            this.orderData.items = this.cart;
            this.calculateTotals();
        }
        
        this.updateSummaryItems();
        this.updateSummaryTotals();
        this.updateOrderItems();
        this.updateOrderTotals();
        
        console.log('Order summary update complete');
    }

    updateSummaryItems() {
        const summaryItems = document.getElementById('summaryItems');
        if (!summaryItems) {
            console.log('Summary items container not found');
            return;
        }

        const items = this.orderData.items || this.cart;
        console.log('Updating summary items with:', items);

        if (items.length === 0) {
            summaryItems.innerHTML = '<p>No items in cart</p>';
            return;
        }

        summaryItems.innerHTML = items.map(item => `
            <div class="summary-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="summary-item-details">
                    <div class="summary-item-title">${item.title}</div>
                    <div class="summary-item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="summary-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }

    updateSummaryTotals() {
        const totals = this.orderData.totals;
        
        this.updateElement('summarySubtotal', `$${totals.subtotal.toFixed(2)}`);
        this.updateElement('summaryShipping', totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`);
        this.updateElement('summaryTax', `$${totals.tax.toFixed(2)}`);
        this.updateElement('summaryTotal', `$${totals.total.toFixed(2)}`);
    }

    updateOrderItems() {
        const orderItems = document.getElementById('orderItems');
        if (!orderItems) {
            console.log('Order items container not found');
            return;
        }

        const items = this.orderData.items || this.cart;
        console.log('Updating order items with:', items);

        if (items.length === 0) {
            orderItems.innerHTML = '<p>No items in order</p>';
            return;
        }

        orderItems.innerHTML = items.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="order-item-details">
                    <div class="order-item-title">${item.title}</div>
                    <div class="order-item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }

    updateOrderTotals() {
        const totals = this.orderData.totals;
        
        this.updateElement('orderSubtotal', `$${totals.subtotal.toFixed(2)}`);
        this.updateElement('orderShipping', totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`);
        this.updateElement('orderTax', `$${totals.tax.toFixed(2)}`);
        this.updateElement('orderTotal', `$${totals.total.toFixed(2)}`);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    generateOrderReference() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        this.orderData.reference = `MP-${timestamp}-${random}`;
    }

    handleOrderSubmission() {
        if (!this.validateStep(3)) {
            this.showNotification('Please agree to the terms and conditions', 'error');
            return;
        }

        // Save order notes
        const orderNotes = document.getElementById('orderNotes').value;
        this.orderData.notes = orderNotes;

        // Process order based on payment method
        const paymentMethod = this.orderData.payment.method;
        
        switch (paymentMethod) {
            case 'paynow':
                this.processPayNowPayment();
                break;
            case 'ecocash':
                this.processEcoCashPayment();
                break;
            case 'innbucks':
                this.processInnBucksPayment();
                break;
            case 'banktransfer':
                this.processBankTransferPayment();
                break;
            case 'cod':
                this.processCashOnDelivery();
                break;
            default:
                this.showNotification('Please select a payment method', 'error');
        }
    }

    processPayNowPayment() {
        this.showNotification('Redirecting to PayNow...', 'info');
        
        // Simulate PayNow integration
        setTimeout(() => {
            this.initiatePayNowPayment();
        }, 1000);
    }

    initiatePayNowPayment() {
        // In a real implementation, this would integrate with PayNow API
        const paynowData = {
            amount: this.orderData.totals.total,
            reference: this.orderData.reference,
            customer: this.orderData.customer,
            items: this.orderData.items
        };

        // Generate QR code (in real implementation, this would come from PayNow API)
        this.generateQRCode(paynowData);
        
        // Show payment instructions
        this.showPayNowInstructions();
    }

    generateQRCode(data) {
        // In a real implementation, this would generate a QR code from PayNow API
        const qrCode = document.querySelector('.qr-code');
        if (qrCode) {
            qrCode.innerHTML = `
                <div style="font-size: 0.8rem; text-align: center;">
                    <div style="width: 150px; height: 150px; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; border-radius: 8px;">
                        QR Code
                    </div>
                    <p>Scan with your banking app</p>
                </div>
            `;
        }
    }

    showPayNowInstructions() {
        // Show payment status modal
        this.showPaymentModal('PayNow Payment', `
            <div class="payment-instructions">
                <h3>Complete Your PayNow Payment</h3>
                <div class="payment-details">
                    <p><strong>Amount:</strong> $${this.orderData.totals.total.toFixed(2)}</p>
                    <p><strong>Reference:</strong> ${this.orderData.reference}</p>
                </div>
                <div class="payment-actions">
                    <button class="btn btn-primary" onclick="checkoutPage.checkPaymentStatus()">
                        I've Made the Payment
                    </button>
                    <button class="btn btn-outline" onclick="checkoutPage.cancelPayment()">
                        Cancel Payment
                    </button>
                </div>
            </div>
        `);
    }

    processEcoCashPayment() {
        this.showNotification('Processing EcoCash payment...', 'info');
        
        // Simulate EcoCash payment processing
        setTimeout(() => {
            this.showPaymentModal('EcoCash Payment', `
                <div class="payment-instructions">
                    <h3>EcoCash Payment Instructions</h3>
                    <div class="payment-details">
                        <p><strong>Amount:</strong> $${this.orderData.totals.total.toFixed(2)}</p>
                        <p><strong>Reference:</strong> ${this.orderData.reference}</p>
                        <p><strong>EcoCash Number:</strong> ${this.orderData.payment.ecocashNumber}</p>
                    </div>
                    <p>You will receive an EcoCash prompt on your mobile device. Please complete the payment to proceed.</p>
                    <div class="payment-actions">
                        <button class="btn btn-primary" onclick="checkoutPage.completeOrder()">
                            Payment Completed
                        </button>
                        <button class="btn btn-outline" onclick="checkoutPage.cancelPayment()">
                            Cancel Payment
                        </button>
                    </div>
                </div>
            `);
        }, 1000);
    }

    processInnBucksPayment() {
        this.showNotification('Processing InnBucks payment...', 'info');
        
        setTimeout(() => {
            this.showPaymentModal('InnBucks Payment', `
                <div class="payment-instructions">
                    <h3>InnBucks Payment Instructions</h3>
                    <div class="payment-details">
                        <p><strong>Amount:</strong> $${this.orderData.totals.total.toFixed(2)}</p>
                        <p><strong>Reference:</strong> ${this.orderData.reference}</p>
                    </div>
                    <p>Please complete the payment using your InnBucks account.</p>
                    <div class="payment-actions">
                        <button class="btn btn-primary" onclick="checkoutPage.completeOrder()">
                            Payment Completed
                        </button>
                        <button class="btn btn-outline" onclick="checkoutPage.cancelPayment()">
                            Cancel Payment
                        </button>
                    </div>
                </div>
            `);
        }, 1000);
    }

    processBankTransferPayment() {
        this.showNotification('Bank transfer details displayed', 'info');
        
        this.showPaymentModal('Bank Transfer Payment', `
            <div class="payment-instructions">
                <h3>Bank Transfer Instructions</h3>
                <div class="bank-details">
                    <p><strong>Bank:</strong> Standard Chartered Bank Zimbabwe</p>
                    <p><strong>Account Name:</strong> MarketPlace (Pvt) Ltd</p>
                    <p><strong>Account Number:</strong> 1234567890</p>
                    <p><strong>Branch Code:</strong> 12345</p>
                    <p><strong>Amount:</strong> $${this.orderData.totals.total.toFixed(2)}</p>
                    <p><strong>Reference:</strong> ${this.orderData.reference}</p>
                </div>
                <p>Please complete the bank transfer and upload the proof of payment below.</p>
                <div class="payment-actions">
                    <button class="btn btn-primary" onclick="checkoutPage.completeOrder()">
                        Transfer Completed
                    </button>
                    <button class="btn btn-outline" onclick="checkoutPage.cancelPayment()">
                        Cancel Payment
                    </button>
                </div>
            </div>
        `);
    }

    processCashOnDelivery() {
        this.showNotification('Processing Cash on Delivery order...', 'info');
        
        setTimeout(() => {
            this.completeOrder();
        }, 1000);
    }

    checkPaymentStatus() {
        // In a real implementation, this would check with PayNow API
        this.showNotification('Checking payment status...', 'info');
        
        setTimeout(() => {
            // Simulate payment verification
            const isPaid = Math.random() > 0.3; // 70% success rate for demo
            
            if (isPaid) {
                this.completeOrder();
            } else {
                this.showNotification('Payment not yet received. Please try again or contact support.', 'error');
            }
        }, 2000);
    }

    completeOrder() {
        this.showNotification('Order placed successfully!', 'success');
        
        // Clear cart
        localStorage.removeItem('cart');
        localStorage.removeItem('checkoutCart');
        localStorage.removeItem('appliedCoupon');
        
        // Redirect to confirmation page
        setTimeout(() => {
            window.location.href = 'order-confirmation.html?ref=' + this.orderData.reference;
        }, 2000);
    }

    cancelPayment() {
        this.closePaymentModal();
        this.showNotification('Payment cancelled', 'info');
    }

    showPaymentModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'payment-modal-overlay';
        modal.innerHTML = `
            <div class="payment-modal">
                <div class="payment-modal-header">
                    <h2>${title}</h2>
                    <button class="payment-modal-close">&times;</button>
                </div>
                <div class="payment-modal-content">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal functionality
        modal.querySelector('.payment-modal-close').addEventListener('click', () => {
            this.closePaymentModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closePaymentModal();
            }
        });
    }

    closePaymentModal() {
        const modal = document.querySelector('.payment-modal-overlay');
        if (modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = '';
        }
    }

    showEmptyCart() {
        const checkoutForm = document.querySelector('.checkout-form-container');
        if (checkoutForm) {
            checkoutForm.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-content">
                        <i class="fas fa-shopping-cart"></i>
                        <h2>Your cart is empty</h2>
                        <p>Add some items to your cart before checking out.</p>
                        <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                    </div>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        if (window.app) {
            window.app.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Global functions for HTML onclick handlers
function nextStep() {
    console.log('nextStep() called globally');
    if (window.checkoutPage) {
        console.log('Calling checkoutPage.nextStep()');
        window.checkoutPage.nextStep();
    } else {
        console.error('CheckoutPage not initialized');
        // Try to initialize if not available
        if (typeof CheckoutPage !== 'undefined') {
            console.log('Initializing CheckoutPage...');
            window.checkoutPage = new CheckoutPage();
            window.checkoutPage.nextStep();
        }
    }
}

function prevStep() {
    console.log('prevStep() called globally');
    if (window.checkoutPage) {
        console.log('Calling checkoutPage.prevStep()');
        window.checkoutPage.prevStep();
    } else {
        console.error('CheckoutPage not initialized');
        // Try to initialize if not available
        if (typeof CheckoutPage !== 'undefined') {
            console.log('Initializing CheckoutPage...');
            window.checkoutPage = new CheckoutPage();
            window.checkoutPage.prevStep();
        }
    }
}

// Make functions available globally
window.nextStep = nextStep;
window.prevStep = prevStep;

// Initialize checkout page when DOM is loaded
function initializeCheckout() {
    if (!window.checkoutPage) {
        console.log('Initializing checkout page...');
        window.checkoutPage = new CheckoutPage();
        console.log('Checkout page initialized:', window.checkoutPage);
    }
}

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCheckout);
} else {
    initializeCheckout();
}

// Add CSS for payment modal
const style = document.createElement('style');
style.textContent = `
    .payment-modal-overlay {
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

    .payment-modal {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .payment-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
    }

    .payment-modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6b7280;
    }

    .payment-modal-content {
        padding: 20px;
    }

    .payment-instructions h3 {
        font-size: 1.25rem;
        color: #1f2937;
        margin-bottom: 1rem;
    }

    .payment-details {
        background-color: #f9fafb;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .payment-details p {
        margin: 0.5rem 0;
        font-size: 0.875rem;
    }

    .payment-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 1.5rem;
    }

    .bank-details {
        background-color: #f9fafb;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .bank-details p {
        margin: 0.5rem 0;
        font-size: 0.875rem;
    }

    @media (max-width: 768px) {
        .payment-actions {
            flex-direction: column;
        }
    }
`;

document.head.appendChild(style);
