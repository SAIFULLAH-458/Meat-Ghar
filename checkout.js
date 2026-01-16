// Checkout Page Script

document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
});

function loadOrderSummary() {
    const container = document.getElementById('order-items-preview');
    if (!container) return;

    container.innerHTML = '';

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'preview-item';
        itemDiv.innerHTML = `
            <div>
                <span class="preview-item-name">${item.name}</span>
                <span class="preview-item-qty">x${item.quantity}</span>
            </div>
            <span>Rs. ${item.price * item.quantity}</span>
        `;
        container.appendChild(itemDiv);
    });

    const subtotal = getCartTotal();
    const deliveryFee = 100;
    const total = subtotal + deliveryFee;

    document.getElementById('sidebar-subtotal').textContent = `Rs. ${subtotal}`;
    document.getElementById('sidebar-total').textContent = `Rs. ${total}`;
}

function placeOrder(event) {
    event.preventDefault();

    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const notes = document.getElementById('notes').value.trim();

    if (!name || !email || !phone || !address || !city) {
        alert('Please fill all required fields');
        return;
    }

    // Create order
    const orderId = 'MG' + Date.now();
    const order = {
        id: orderId,
        customer: {
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            notes: notes
        },
        items: [...cart],
        subtotal: getCartTotal(),
        deliveryFee: 100,
        total: getCartTotal() + 100,
        status: 'placed',
        statusHistory: [
            {
                status: 'placed',
                timestamp: new Date().toISOString(),
                label: 'Order Placed'
            }
        ],
        date: new Date().toISOString()
    };

    // Save order
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Update stock (reduce quantities)
    updateStockAfterOrder(order.items);

    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();

    // Show success modal
    showOrderSuccessModal(orderId);
}

function updateStockAfterOrder(orderItems) {
    // This function will be used by admin to track stock
    // Stock data will be managed in admin panel
    const stockData = JSON.parse(localStorage.getItem('stockData')) || {};
    
    orderItems.forEach(item => {
        if (!stockData[item.id]) {
            stockData[item.id] = 100; // Default stock
        }
        stockData[item.id] -= item.quantity;
    });
    
    localStorage.setItem('stockData', JSON.stringify(stockData));
}

function showOrderSuccessModal(orderId) {
    const modal = document.getElementById('order-confirmation-modal');
    const orderIdDisplay = document.getElementById('order-id-display');
    
    if (modal && orderIdDisplay) {
        orderIdDisplay.textContent = orderId;
        modal.classList.add('active');
        
        // Add confetti effect
        createConfetti();
    }
}

function createConfetti() {
    const colors = ['#ff0033', '#ffffff', '#ff6666', '#ffcccc'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: 1;
                transform: rotate(${Math.random() * 360}deg);
                animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
                z-index: 10000;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 30);
    }
}

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            top: 100vh;
            transform: rotate(${Math.random() * 720}deg);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
