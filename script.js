const products = [
    {
        id: 1,
        brand: "boAt",
        name: "boAt Rockerz 450",
        description: "On-ear wireless headphones with up to 15 hours of playback and immersive audio.",
        currentPrice: 1499,
        originalPrice: 3990,
        discount: "62% OFF",
        save: 2491,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        badge: "Best Seller",
        rating: "★★★★☆"
    },
    {
        id: 2,
        brand: "Noise",
        name: "Noise ColorFit Smart Watch",
        description: "1.4\" full touch display smart watch with 24x7 heart rate monitoring and IP68.",
        currentPrice: 2999,
        originalPrice: 4999,
        discount: "40% OFF",
        save: 2000,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        badge: "New Arrival",
        rating: "★★★★★"
    },
    {
        id: 3,
        brand: "JBL",
        name: "JBL Go Essential",
        description: "Portable waterproof bluetooth speaker with rich JBL original pro sound.",
        currentPrice: 1799,
        originalPrice: 2999,
        discount: "40% OFF",
        save: 1200,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
        badge: "Limited Offer",
        rating: "★★★★☆"
    },
    {
        id: 4,
        brand: "Zebronics",
        name: "Zebronics Gaming Mouse",
        description: "Ergonomic RGB gaming mouse with 6 buttons and braided cable.",
        currentPrice: 699,
        originalPrice: 1299,
        discount: "46% OFF",
        save: 600,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80",
        badge: "",
        rating: "★★★★★"
    },
    {
        id: 5,
        brand: "Mi",
        name: "Mi Power Bank 3i",
        description: "20000mAh fast charging power bank with dual input and triple output ports.",
        currentPrice: 1299,
        originalPrice: 2199,
        discount: "40% OFF",
        save: 900,
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80",
        badge: "Sale",
        rating: "★★★☆☆"
    },
    {
        id: 6,
        brand: "Portronics",
        name: "Portronics USB Hub",
        description: "High-speed 4-port USB hub with elegant design and fast data sync.",
        currentPrice: 899,
        originalPrice: 1499,
        discount: "40% OFF",
        save: 600,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
        badge: "In Stock",
        rating: "★★★★☆"
    }
];

// State
let cart = [];

// Format Indian Rupee
const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const cartCountEl = document.getElementById('cartCount');
const toastEl = document.getElementById('toast');

// Modal Elements
const buyModal = document.getElementById('buyModal');
const closeBuyModal = document.getElementById('closeBuyModal');
const modalDetails = document.getElementById('modalDetails');
const confirmOrderBtn = document.getElementById('confirmOrderBtn');
const successMessage = document.getElementById('successMessage');

// Cart Elements
const cartToggle = document.getElementById('cartToggle');
const cartModal = document.getElementById('cartModal');
const closeCartModal = document.getElementById('closeCartModal');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSummary = document.getElementById('cartSummary');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const cartGrandTotal = document.getElementById('cartGrandTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize
function init() {
    renderProducts(products);
    setupEventListeners();
    updateCartUI();
}

// Render Products
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7f8c8d;">No products found.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        let badgeHTML = '';
        if (product.badge) {
            badgeHTML = `<span class="badge" style="background-color: #e74c3c;">${product.badge}</span>`;
        }
        
        card.innerHTML = `
            ${badgeHTML}
            <button class="wishlist-btn" onclick="toggleWishlist(this, '${product.name.replace(/'/g, "\\'")}')">❤</button>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-brand">${product.brand}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-rating">${product.rating}</div>
            <p class="product-desc">${product.description}</p>
            
            <div class="price-container">
                <span class="product-price">${formatINR(product.currentPrice)}</span>
                <span class="original-price">${formatINR(product.originalPrice)}</span>
                <span class="discount-text">${product.discount}</span>
                <span class="save-text">Save ${formatINR(product.save)}</span>
            </div>
            
            <div class="quantity-selector">
                <button class="qty-btn" onclick="updateQty(${product.id}, -1)">-</button>
                <input type="number" id="qty-${product.id}" class="qty-input" value="1" min="1" readonly>
                <button class="qty-btn" onclick="updateQty(${product.id}, 1)">+</button>
            </div>
            
            <div class="action-buttons">
                <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="buy-now-btn" onclick="buyNow(${product.id})">Buy Now</button>
            </div>
        `;
        
        productsGrid.appendChild(card);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.brand.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    });

    // Buy Now Modal
    closeBuyModal.addEventListener('click', () => {
        buyModal.classList.remove('active');
        successMessage.style.display = 'none';
        confirmOrderBtn.style.display = 'block';
    });

    confirmOrderBtn.addEventListener('click', () => {
        confirmOrderBtn.style.display = 'none';
        successMessage.style.display = 'block';
        setTimeout(() => {
            buyModal.classList.remove('active');
            successMessage.style.display = 'none';
            confirmOrderBtn.style.display = 'block';
        }, 2000);
    });

    // Cart Modal
    cartToggle.addEventListener('click', () => {
        cartModal.classList.add('active');
    });

    closeCartModal.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCartUI();
        showToast('Cart cleared!');
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            cartModal.classList.remove('active');
            
            // Populate checkout modal with cart total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalSaved = cart.reduce((sum, item) => {
                const product = products.find(p => p.id === item.id);
                return sum + (product.save * item.quantity);
            }, 0);
            
            modalDetails.innerHTML = `
                <div class="modal-details">
                    <p><strong>Total Items:</strong> ${cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    <p style="color: #27ae60; font-size: 14px; margin-top: 5px;"><strong>Total Savings:</strong> ${formatINR(totalSaved)}</p>
                    <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
                    <p style="font-size: 18px;"><strong>Total Amount:</strong> ${formatINR(total)}</p>
                </div>
            `;
            buyModal.classList.add('active');
            
            // Clear cart after opening checkout
            cart = [];
            updateCartUI();
        }
    });

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === buyModal) {
            buyModal.classList.remove('active');
            successMessage.style.display = 'none';
            confirmOrderBtn.style.display = 'block';
        }
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
}

// Update Quantity
window.updateQty = function(productId, change) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyInput.value);
    
    const newQty = currentQty + change;
    if (newQty >= 1) {
        qtyInput.value = newQty;
    }
};

// Add to Cart
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.currentPrice,
            quantity: quantity
        });
    }
    
    updateCartUI();
    showToast(`${quantity} x ${product.name} added to cart!`);
    
    // Reset quantity input
    qtyInput.value = 1;
};

// Remove from cart
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
};

// Update Cart UI
function updateCartUI() {
    // Update count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
    
    // Update modal content
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.style.display = 'block';
        cartSummary.style.display = 'none';
    } else {
        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'block';
        
        let cartHTML = '';
        let grandTotal = 0;
        
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            grandTotal += subtotal;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${formatINR(item.price)} x ${item.quantity}</div>
                    </div>
                    <div class="cart-item-subtotal">${formatINR(subtotal)}</div>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">X</button>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        cartGrandTotal.textContent = formatINR(grandTotal);
    }
}

// Toggle Wishlist
window.toggleWishlist = function(btn, productName) {
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
        showToast(`${productName} added to wishlist!`);
    } else {
        showToast(`${productName} removed from wishlist!`);
    }
};

// Buy Now
window.buyNow = function(productId) {
    const product = products.find(p => p.id === productId);
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    const total = product.currentPrice * quantity;
    const totalSaved = product.save * quantity;
    
    modalDetails.innerHTML = `
        <div class="modal-details">
            <p><strong>Product:</strong> ${product.name}</p>
            <p><strong>Price:</strong> ${formatINR(product.currentPrice)}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p style="color: #27ae60; font-size: 14px; margin-top: 5px;"><strong>Total Savings:</strong> ${formatINR(totalSaved)}</p>
            <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
            <p style="font-size: 18px;"><strong>Total Amount:</strong> ${formatINR(total)}</p>
        </div>
    `;
    
    buyModal.classList.add('active');
};

// Show Toast Notification
function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// Run app
init();
