let cart = JSON.parse(localStorage.getItem('yassgameCart')) || [];

document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    setupEventListeners();
});

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartNotEmpty = document.getElementById('cartNotEmpty');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartNotEmpty) cartNotEmpty.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartNotEmpty) cartNotEmpty.style.display = 'block';
    if (cartSummary) cartSummary.style.display = 'block';
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-platform">${getPlatformName(item.platform)}</p>
                <div class="cart-item-price">${item.price.toFixed(2)} TND</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
            <div class="cart-item-total">${itemTotal.toFixed(2)} TND</div>
            <button class="btn-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateCartSummary(subtotal);
}

function updateCartSummary(subtotal) {
    const subtotalElement = document.getElementById('cartSubtotal');
    const totalElement = document.getElementById('cartTotal');
    
    if (subtotalElement) {
        subtotalElement.textContent = subtotal.toFixed(2) + ' TND';
    }
    
    if (totalElement) {
        totalElement.textContent = subtotal.toFixed(2) + ' TND';
    }
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('increase') || e.target.parentElement.classList.contains('increase')) {
            const button = e.target.classList.contains('increase') ? e.target : e.target.parentElement;
            const gameId = parseInt(button.getAttribute('data-id'));
            updateQuantity(gameId, 1);
        }
        
        if (e.target.classList.contains('decrease') || e.target.parentElement.classList.contains('decrease')) {
            const button = e.target.classList.contains('decrease') ? e.target : e.target.parentElement;
            const gameId = parseInt(button.getAttribute('data-id'));
            updateQuantity(gameId, -1);
        }
        
        if (e.target.classList.contains('btn-remove') || 
            e.target.parentElement.classList.contains('btn-remove') ||
            e.target.classList.contains('fa-trash')) {
            
            let button;
            if (e.target.classList.contains('fa-trash')) {
                button = e.target.parentElement;
            } else if (e.target.classList.contains('btn-remove')) {
                button = e.target;
            } else {
                button = e.target.parentElement;
            }
            
            const gameId = parseInt(button.getAttribute('data-id'));
            removeFromCart(gameId);
        }
    });
    
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', simulateCheckout);
    }
}

function updateQuantity(gameId, change) {
    const itemIndex = cart.findIndex(item => item.id === gameId);
    
    if (itemIndex === -1) return;
    
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    
    localStorage.setItem('yassgameCart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

function removeFromCart(gameId) {
    cart = cart.filter(item => item.id !== gameId);
    localStorage.setItem('yassgameCart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

function clearCart() {
    if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        cart = [];
        localStorage.setItem('yassgameCart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }
}

function simulateCheckout() {
    if (cart.length === 0) {
        alert('Votre panier est vide !');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (confirm(`Confirmer la commande d'un montant de ${total.toFixed(2)} TND ?`)) {
        alert('Commande simulée avec succès ! Merci pour votre achat.');
        cart = [];
        localStorage.setItem('yassgameCart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function getPlatformName(platform) {
    const platforms = {
        'pc': 'PC',
        'playstation': 'PlayStation',
        'xbox': 'Xbox',
        'nintendo': 'Nintendo'
    };
    
    return platforms[platform] || platform;
}