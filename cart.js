// Cart Page Script

document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
});

function loadCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
        showEmptyCart(container);
        return;
    }

    container.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemCard = createCartItemCard(item, index);
        container.appendChild(itemCard);
    });

    updateCartSummary();
}

function createCartItemCard(item, index) {
    const card = document.createElement('div');
    card.className = 'cart-item';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="cart-item-icon">
            <i class="fas ${item.icon}"></i>
        </div>
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">Rs. ${item.price} each</p>
        </div>
        <div class="cart-item-quantity">
            <button class="cart-qty-btn" onclick="updateCartItemQuantity('${item.id}', -1)">
                <i class="fas fa-minus"></i>
            </button>
            <span class="cart-qty-display">${item.quantity}</span>
            <button class="cart-qty-btn" onclick="updateCartItemQuantity('${item.id}', 1)">
                <i class="fas fa-plus"></i>
            </button>
        </div>
        <div class="cart-item-total">
            Rs. ${item.price * item.quantity}
        </div>
        <button class="remove-btn" onclick="removeFromCart('${item.id}')">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return card;
}

function updateCartItemQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
    }

    saveCart();
    loadCartItems();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    loadCartItems();
}

function updateCartSummary() {
    const subtotal = getCartTotal();
    const deliveryFee = 100;
    const total = subtotal + deliveryFee;

    document.getElementById('subtotal').textContent = `Rs. ${subtotal}`;
    document.getElementById('total').textContent = `Rs. ${total}`;
}

function showEmptyCart(container) {
    container.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>Add some delicious items to your cart</p>
            <button class="neon-btn" onclick="location.href='order-selection.html'">
                <span>Start Shopping</span>
            </button>
        </div>
    `;
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    location.href = 'checkout.html';
}
