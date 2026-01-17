// Tracking Page Script

document.addEventListener('DOMContentLoaded', function() {
    loadActiveOrders();
    loadOrderHistory();
});

function loadActiveOrders() {
    const container = document.getElementById('active-orders-container');
    if (!container) return;

    const activeOrders = orders.filter(order => order.status !== 'delivered');

    if (activeOrders.length === 0) {
        showEmptyState(container, 'active');
        return;
    }

    container.innerHTML = '';
    activeOrders.forEach((order, index) => {
        const orderCard = createOrderTrackingCard(order, index);
        container.appendChild(orderCard);
    });
}

function loadOrderHistory() {
    const container = document.getElementById('order-history-container');
    if (!container) return;

    let completedOrders = orders.filter(order => order.status === 'delivered');

    // Keep only the last 3 completed orders
    if (completedOrders.length > 3) {
        // Sort by date (most recent first)
        completedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Get the last 3 orders
        const ordersToKeep = completedOrders.slice(0, 3);
        const orderIdsToKeep = ordersToKeep.map(o => o.id);
        
        // Remove older orders from the main orders array
        orders = orders.filter(order => {
            // Keep all non-delivered orders
            if (order.status !== 'delivered') return true;
            // Keep only the last 3 delivered orders
            return orderIdsToKeep.includes(order.id);
        });
        
        // Update localStorage
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Update completedOrders to only the last 3
        completedOrders = ordersToKeep;
    }

    if (completedOrders.length === 0) {
        showEmptyState(container, 'history');
        return;
    }

    // Sort by date (most recent first) for display
    completedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = '';
    completedOrders.forEach((order, index) => {
        const orderCard = createOrderHistoryCard(order, index);
        container.appendChild(orderCard);
    });
}

function createOrderTrackingCard(order, index) {
    const card = document.createElement('div');
    card.className = 'order-tracking-card';

    const orderDate = new Date(order.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Order status steps
    const statusSteps = [
        { key: 'placed', label: 'Order Placed', icon: 'fa-clipboard-check' },
        { key: 'preparing', label: 'Order Being Ready', icon: 'fa-blender' },
        { key: 'ready', label: 'Ready to Dispatch', icon: 'fa-box' },
        { key: 'dispatched', label: 'On the Way', icon: 'fa-truck' },
        { key: 'delivered', label: 'Delivered', icon: 'fa-check-circle' }
    ];

    const currentStatusIndex = statusSteps.findIndex(step => step.key === order.status);

    let timelineHTML = '';
    statusSteps.forEach((step, index) => {
        const isCompleted = index < currentStatusIndex;
        const isActive = index === currentStatusIndex;
        const statusClass = isCompleted ? 'completed' : (isActive ? 'active' : '');
        
        const historyItem = order.statusHistory.find(h => h.status === step.key);
        const timeText = historyItem ? new Date(historyItem.timestamp).toLocaleString() : '';

        timelineHTML += `
            <div class="timeline-step ${statusClass}">
                <div class="timeline-icon">
                    <i class="fas ${step.icon}"></i>
                </div>
                <div class="timeline-content">
                    <h4 class="timeline-title">${step.label}</h4>
                    ${timeText ? `<p class="timeline-time">${timeText}</p>` : ''}
                </div>
            </div>
        `;
    });

    card.innerHTML = `
        <div class="order-header">
            <div>
                <span class="order-id">Order #${order.id}</span>
            </div>
            <span class="order-date">${orderDate}</span>
        </div>
        
        <div class="order-items-summary">
            <h4>Order Items:</h4>
            ${order.items.map(item => `
                <div class="order-item-row">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>Rs. ${item.price * item.quantity}</span>
                </div>
            `).join('')}
            <div class="order-total">Total: Rs. ${order.total}</div>
        </div>

        <div class="order-status-timeline">
            ${timelineHTML}
        </div>
    `;

    return card;
}

function createOrderHistoryCard(order, index) {
    const card = document.createElement('div');
    card.className = 'order-tracking-card';

    const orderDate = new Date(order.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="order-header">
            <div>
                <span class="order-id">Order #${order.id}</span>
                <span style="color: #00ff00; margin-left: 1rem;">
                    <i class="fas fa-check-circle"></i> Delivered
                </span>
            </div>
            <span class="order-date">${orderDate}</span>
        </div>
        
        <div class="order-items-summary">
            <h4>Order Items:</h4>
            ${order.items.map(item => `
                <div class="order-item-row">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>Rs. ${item.price * item.quantity}</span>
                </div>
            `).join('')}
            <div class="order-total">Total: Rs. ${order.total}</div>
        </div>
    `;

    return card;
}

function showEmptyState(container, type) {
    const messages = {
        active: {
            icon: 'fa-box-open',
            title: 'No Active Orders',
            text: 'You don\'t have any active orders at the moment'
        },
        history: {
            icon: 'fa-history',
            title: 'No Order History',
            text: 'Your completed orders will appear here'
        }
    };

    const msg = messages[type];

    container.innerHTML = `
        <div class="empty-state">
            <i class="fas ${msg.icon}"></i>
            <h3>${msg.title}</h3>
            <p>${msg.text}</p>
            <button class="neon-btn" onclick="location.href='order-selection.html'">
                <span>Place an Order</span>
            </button>
        </div>
    `;
}
