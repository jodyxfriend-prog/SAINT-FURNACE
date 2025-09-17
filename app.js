// TechConnect Pro - Interactive JavaScript

// Global variables
let currentUser = null;
let cart = [];
let isLoggedIn = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkLoginStatus();
});

// Initialize App
function initializeApp() {
    // Add smooth scrolling
    setupSmoothScrolling();
    
    // Setup navbar scroll effect
    setupNavbarScroll();
    
    // Setup form validation
    setupFormValidation();
    
    // Load saved cart from localStorage
    loadCartFromStorage();
    
    console.log('TechConnect Pro initialized successfully!');
}

// Setup Event Listeners
function setupEventListeners() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Modal close events
    window.addEventListener('click', (e) => {
        const loginModal = document.getElementById('loginModal');
        const purchaseModal = document.getElementById('purchaseModal');
        
        if (e.target === loginModal) {
            closeLoginModal();
        }
        if (e.target === purchaseModal) {
            closePurchaseModal();
        }
    });
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const purchaseForm = document.getElementById('purchaseForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', handlePurchase);
    }
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Form Validation
function setupFormValidation() {
    // Real-time input validation
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearValidationError);
    });
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }
    
    // CVV formatting
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', formatCVV);
    }
}

// Authentication Functions
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        clearForm('loginForm');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('remember');
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        if (validateLogin(email, password)) {
            // Successful login
            currentUser = {
                email: email,
                name: email.split('@')[0],
                loginTime: new Date().toISOString()
            };
            
            isLoggedIn = true;
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify(currentUser));
            }
            
            showNotification('Login successful! Welcome back.', 'success');
            closeLoginModal();
            updateUIForLoggedInUser();
            
        } else {
            showNotification('Invalid email or password. Please try again.', 'error');
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
    }, 1500);
}

function validateLogin(email, password) {
    // Demo validation - in real app, this would be an API call
    const demoUsers = [
        { email: 'admin@techconnect.com', password: 'admin123' },
        { email: 'user@example.com', password: 'password' },
        { email: 'demo@techconnect.com', password: 'demo123' }
    ];
    
    return demoUsers.some(user => user.email === email && user.password === password);
}

function logout() {
    currentUser = null;
    isLoggedIn = false;
    localStorage.removeItem('rememberedUser');
    localStorage.removeItem('cart');
    cart = [];
    
    updateUIForLoggedOutUser();
    showNotification('You have been logged out successfully.', 'info');
}

function checkLoginStatus() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        currentUser = JSON.parse(rememberedUser);
        isLoggedIn = true;
        updateUIForLoggedInUser();
    }
}

function updateUIForLoggedInUser() {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.textContent = `Hi, ${currentUser.name}`;
        loginBtn.onclick = showUserMenu;
    }
}

function updateUIForLoggedOutUser() {
    const loginBtn = document.querySelector('.btn-login');
    if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = openLoginModal;
    }
}

function showUserMenu() {
    // Create user menu dropdown
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-content">
            <div class="user-info">
                <strong>${currentUser.name}</strong>
                <small>${currentUser.email}</small>
            </div>
            <hr>
            <button onclick="showProfile()">My Profile</button>
            <button onclick="showOrders()">My Orders</button>
            <button onclick="showSupport()">Support</button>
            <hr>
            <button onclick="logout()" class="logout-btn">Logout</button>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // Position menu
    const loginBtn = document.querySelector('.btn-login');
    const rect = loginBtn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 10 + 'px';
    menu.style.right = '2rem';
    menu.style.zIndex = '2001';
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', closeUserMenu, { once: true });
    }, 100);
}

function closeUserMenu() {
    const menu = document.querySelector('.user-menu');
    if (menu) menu.remove();
}

// Product Functions
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = productsSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function purchaseProduct(productId, price) {
    if (!isLoggedIn) {
        showNotification('Please login to purchase products.', 'warning');
        openLoginModal();
        return;
    }
    
    const products = {
        'router-x1': {
            name: 'TechConnect Pro Router X1',
            price: 299.99,
            image: 'https://images.unsplash.com/photo-1554098415-4052459dc340?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwxfHxpbnRlcm5ldCUyMG1vZGVtJTIwcm91dGVyfGVufDB8fHx8MTc1ODEzMjA3OXww&ixlib=rb-4.1.0&q=85',
            features: ['WiFi 6 Technology', 'Up to 3000 Mbps', '8 Gigabit Ports']
        },
        'modem-pro': {
            name: 'TechConnect Cable Modem Pro',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1554098415-cae1af5e4f1a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxpbnRlcm5ldCUyMG1vZGVtJTIwcm91dGVyfGVufDB8fHx8MTc1ODEzMjA3OXww&ixlib=rb-4.1.0&q=85',
            features: ['DOCSIS 3.1', 'Up to 1.2 Gbps', 'Advanced Security']
        },
        'business-hub': {
            name: 'TechConnect Business Hub',
            price: 599.99,
            image: 'https://images.unsplash.com/photo-1606905418909-a1fab8cea661?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHw0fHxpbnRlcm5ldCUyMG1vZGVtJTIwcm91dGVyfGVufDB8fHx8MTc1ODEzMjA3OXww&ixlib=rb-4.1.0&q=85',
            features: ['Enterprise Features', '24/7 Priority Support', 'Advanced Analytics']
        }
    };
    
    const product = products[productId];
    if (!product) {
        showNotification('Product not found.', 'error');
        return;
    }
    
    openPurchaseModal(product);
}

function openPurchaseModal(product) {
    const modal = document.getElementById('purchaseModal');
    const detailsDiv = document.getElementById('purchaseDetails');
    
    if (modal && detailsDiv) {
        // Populate product details
        detailsDiv.innerHTML = `
            <div class="purchase-product">
                <img src="${product.image}" alt="${product.name}" class="purchase-product-image">
                <div class="purchase-product-info">
                    <h3>${product.name}</h3>
                    <div class="purchase-features">
                        ${product.features.map(feature => `<span><i class="fas fa-check"></i> ${feature}</span>`).join('')}
                    </div>
                    <div class="purchase-price">$${product.price}</div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Store product in modal for form submission
        modal.dataset.product = JSON.stringify(product);
    }
}

function closePurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        clearForm('purchaseForm');
    }
}

function handlePurchase(e) {
    e.preventDefault();
    
    const modal = document.getElementById('purchaseModal');
    const product = JSON.parse(modal.dataset.product);
    
    const formData = new FormData(e.target);
    const purchaseData = {
        product: product,
        customer: currentUser,
        paymentInfo: {
            cardName: formData.get('cardName'),
            cardNumber: formData.get('cardNumber'),
            expiry: formData.get('expiry'),
            cvv: formData.get('cvv')
        },
        timestamp: new Date().toISOString(),
        orderId: generateOrderId()
    };
    
    // Show loading state
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Add to orders
        addToOrders(purchaseData);
        
        showNotification(`Purchase successful! Order ID: ${purchaseData.orderId}`, 'success');
        closePurchaseModal();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success animation
        showPurchaseSuccess(product);
        
    }, 2000);
}

function generateOrderId() {
    return 'TC' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
}

function addToOrders(purchaseData) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(purchaseData);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Plan Selection
function selectPlan(planType) {
    if (!isLoggedIn) {
        showNotification('Please login to select a plan.', 'warning');
        openLoginModal();
        return;
    }
    
    const plans = {
        basic: { name: 'Basic Plan', price: 39.99, speed: '100 Mbps' },
        pro: { name: 'Pro Plan', price: 69.99, speed: '500 Mbps' },
        enterprise: { name: 'Enterprise Plan', price: 149.99, speed: '1 Gbps' }
    };
    
    const plan = plans[planType];
    showNotification(`${plan.name} selected! Redirecting to setup...`, 'success');
    
    // Simulate plan selection
    setTimeout(() => {
        showNotification(`Welcome to ${plan.name}! Setup will begin shortly.`, 'info');
    }, 1500);
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[type];
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icon}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function showPurchaseSuccess(product) {
    const successDiv = document.createElement('div');
    successDiv.className = 'purchase-success';
    successDiv.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Purchase Successful!</h3>
            <p>Thank you for purchasing ${product.name}</p>
            <p>You will receive a confirmation email shortly.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn-primary">
                Continue Shopping
            </button>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        // Clear validation errors
        const errorElements = form.querySelectorAll('.error');
        errorElements.forEach(el => el.classList.remove('error'));
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Form Validation Functions
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    clearValidationError(e);
    
    switch (input.type) {
        case 'email':
            if (!isValidEmail(value)) {
                showInputError(input, 'Please enter a valid email address');
            }
            break;
        case 'password':
            if (value.length < 6) {
                showInputError(input, 'Password must be at least 6 characters');
            }
            break;
        case 'text':
            if (input.name === 'cardNumber' && !isValidCardNumber(value)) {
                showInputError(input, 'Please enter a valid card number');
            }
            if (input.name === 'expiry' && !isValidExpiry(value)) {
                showInputError(input, 'Please enter a valid expiry date (MM/YY)');
            }
            if (input.name === 'cvv' && !isValidCVV(value)) {
                showInputError(input, 'Please enter a valid CVV');
            }
            break;
    }
}

function clearValidationError(e) {
    const input = e.target;
    input.classList.remove('error');
    const errorMsg = input.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showInputError(input, message) {
    input.classList.add('error');
    
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    
    input.parentNode.appendChild(errorMsg);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
}

function isValidExpiry(expiry) {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return expiryRegex.test(expiry);
}

function isValidCVV(cvv) {
    return /^\d{3,4}$/.test(cvv);
}

// Input Formatting Functions
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    if (formattedValue.length > 19) {
        formattedValue = formattedValue.substr(0, 19);
    }
    
    e.target.value = formattedValue;
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
}

function formatCVV(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 4) {
        value = value.substring(0, 4);
    }
    
    e.target.value = value;
}

// Cart Functions
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Profile Functions
function showProfile() {
    closeUserMenu();
    showNotification('Profile page coming soon!', 'info');
}

function showOrders() {
    closeUserMenu();
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    if (orders.length === 0) {
        showNotification('No orders found.', 'info');
        return;
    }
    
    showNotification(`You have ${orders.length} order(s). Check your email for details.`, 'info');
}

function showSupport() {
    closeUserMenu();
    showNotification('Support chat opening...', 'info');
}

function showRegisterForm() {
    showNotification('Registration form coming soon! For now, use demo login: demo@techconnect.com / demo123', 'info');
}

// Analytics and Tracking
function trackEvent(eventName, eventData = {}) {
    console.log('Event tracked:', eventName, eventData);
    // In a real app, this would send data to analytics service
}

// Initialize performance monitoring
window.addEventListener('load', () => {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    trackEvent('page_load', { loadTime: loadTime });
});

// Track scroll depth
let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
    const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
            trackEvent('scroll_depth', { depth: maxScrollDepth });
        }
    }
});

// Export functions for global access
window.TechConnect = {
    openLoginModal,
    closeLoginModal,
    openPurchaseModal,
    closePurchaseModal,
    purchaseProduct,
    selectPlan,
    scrollToProducts,
    logout,
    showProfile,
    showOrders,
    showSupport,
    showRegisterForm
};

console.log('TechConnect Pro JavaScript loaded successfully! 🚀');
