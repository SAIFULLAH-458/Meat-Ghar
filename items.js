// Items Page Script

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const itemType = urlParams.get('type');

// Load items based on type
document.addEventListener('DOMContentLoaded', function() {
    loadItems();
});

function loadItems() {
    const container = document.getElementById('items-container');
    const titleElement = document.getElementById('category-title');
    
    if (!container || !itemType) return;

    // Update title
    const titles = {
        chicken: 'Chicken Items',
        mutton: 'Mutton Items',
        beef: 'Beef Items',
        frozen: 'Frozen Foods'
    };
    
    if (titleElement) {
        titleElement.textContent = titles[itemType] || 'Select Items';
    }

    // Get products for this category
    const categoryProducts = products[itemType] || [];

    // Clear container
    container.innerHTML = '';

    // Add each product
    categoryProducts.forEach((product, index) => {
        const itemCard = createItemCard(product, index);
        container.appendChild(itemCard);
    });
}

function createItemCard(product, index) {
    const card = document.createElement('div');
    card.className = 'item-card glass-card';
    card.style.setProperty('--item-index', index);
    
    card.innerHTML = `
        <div class="item-icon">
            <i class="fas ${product.icon}"></i>
        </div>
        <div class="item-details">
            <h3 class="item-name">${product.name}</h3>
            <p class="item-price">Rs. ${product.price}</p>
            <div class="quantity-selector">
                <button class="qty-btn" onclick="decreaseQuantity('${product.id}')">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="qty-display" id="qty-${product.id}">1</span>
                <button class="qty-btn" onclick="increaseQuantity('${product.id}')">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                <span><i class="fas fa-cart-plus"></i> Add to Cart</span>
            </button>
        </div>
    `;
    
    return card;
}

function increaseQuantity(productId) {
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    if (qtyDisplay) {
        let qty = parseInt(qtyDisplay.textContent);
        qty++;
        qtyDisplay.textContent = qty;
    }
}

function decreaseQuantity(productId) {
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    if (qtyDisplay) {
        let qty = parseInt(qtyDisplay.textContent);
        if (qty > 1) {
            qty--;
            qtyDisplay.textContent = qty;
        }
    }
}

function addToCart(productId) {
    // Find product
    let product = null;
    for (let category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }
    
    if (!product) return;

    const qtyDisplay = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyDisplay.textContent);

    // Check if item already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            icon: product.icon
        });
    }

    saveCart();
    updateCartCount();

    // Reset quantity
    qtyDisplay.textContent = '1';

    // Show success animation
    showAddToCartAnimation();
}

function showAddToCartAnimation() {
    // Create floating notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(0, 255, 0, 0.2);
        border: 2px solid #00ff00;
        color: #00ff00;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
        backdrop-filter: blur(10px);
    `;
    notification.innerHTML = '<i class="fas fa-check"></i> Added to cart!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}
