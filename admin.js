// Admin Panel Script

const ADMIN_USERNAME = 'adminmeat';
const ADMIN_PASSWORD = 'meat101';

// Check if admin is logged in
let isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';

document.addEventListener('DOMContentLoaded', function() {
    if (isAdminLoggedIn) {
        showAdminPanel();
        loadDashboard();
    } else {
        showLoginScreen();
    }
});

function showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
}

function adminLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const errorDiv = document.getElementById('login-error');

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        isAdminLoggedIn = true;
        showAdminPanel();
        loadDashboard();
        errorDiv.textContent = '';
    } else {
        errorDiv.textContent = 'Invalid username or password';
        errorDiv.style.color = '#ff4444';
    }
}

function adminLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    isAdminLoggedIn = false;
    location.reload();
}

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => {
        s.style.display = 'none';
    });

    // Show selected section
    document.getElementById(`${section}-section`).style.display = 'block';

    // Load section data
    if (section === 'dashboard') loadDashboard();
    else if (section === 'orders') loadAdminOrders();
    else if (section === 'stock') loadStock();
}

function loadDashboard() {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status !== 'delivered').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('completed-orders').textContent = completedOrders;
    document.getElementById('total-revenue').textContent = `Rs. ${totalRevenue}`;

    // Load recent orders
    loadRecentOrders();
}

function loadRecentOrders() {
    const container = document.getElementById('recent-orders-list');
    if (!container) return;

    const recentOrders = orders.slice(-5).reverse();

    if (recentOrders.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No orders yet</p>';
        return;
    }

    container.innerHTML = recentOrders.map(order => `
        <div style="padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <strong>Order #${order.id}</strong>
                <span style="color: var(--neon-red);">Rs. ${order.total}</span>
            </div>
            <div style="color: var(--text-secondary); font-size: 0.9rem;">
                ${order.customer.name} - ${new Date(order.date).toLocaleDateString()}
            </div>
        </div>
    `).join('');
}

function loadAdminOrders() {
    const container = document.getElementById('admin-orders-container');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 3rem; color: var(--text-secondary);">No orders yet</p>';
        return;
    }

    container.innerHTML = '';
    
    // Sort orders by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedOrders.forEach((order, index) => {
        const orderCard = createAdminOrderCard(order, index);
        container.appendChild(orderCard);
    });
}

function createAdminOrderCard(order, index) {
    const card = document.createElement('div');
    card.className = 'admin-order-card';
    card.style.animationDelay = `${index * 0.05}s`;

    const orderDate = new Date(order.date).toLocaleString();

    const statusButtons = [
        { key: 'placed', label: 'Placed' },
        { key: 'preparing', label: 'Being Ready' },
        { key: 'ready', label: 'Ready to Dispatch' },
        { key: 'dispatched', label: 'On the Way' },
        { key: 'delivered', label: 'Delivered' }
    ];

    card.innerHTML = `
        <div class="admin-order-header">
            <div>
                <span class="order-id">Order #${order.id}</span>
            </div>
            <span class="order-date">${orderDate}</span>
        </div>

        <div class="order-customer-info">
            <h4 style="margin-bottom: 1rem;">Customer Details:</h4>
            <div class="info-row">
                <span class="info-label">Name:</span>
                <span>${order.customer.name}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Phone:</span>
                <span>${order.customer.phone}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Email:</span>
                <span>${order.customer.email}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Address:</span>
                <span>${order.customer.address}, ${order.customer.city}</span>
            </div>
            ${order.customer.notes ? `
                <div class="info-row">
                    <span class="info-label">Notes:</span>
                    <span>${order.customer.notes}</span>
                </div>
            ` : ''}
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

        <div class="status-selector">
            <strong style="width: 100%; margin-bottom: 0.5rem;">Update Status:</strong>
            ${statusButtons.map(btn => `
                <button class="status-btn ${order.status === btn.key ? 'active' : ''}" 
                        onclick="updateOrderStatus('${order.id}', '${btn.key}')">
                    ${btn.label}
                </button>
            `).join('')}
        </div>
    `;

    return card;
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    order.status = newStatus;
    
    // Add to status history if not already there
    const existingHistory = order.statusHistory.find(h => h.status === newStatus);
    if (!existingHistory) {
        order.statusHistory.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            label: newStatus
        });
    }

    localStorage.setItem('orders', JSON.stringify(orders));
    loadAdminOrders();
    loadDashboard();
}

function loadStock() {
    const container = document.getElementById('stock-items-container');
    if (!container) return;

    const stockData = JSON.parse(localStorage.getItem('stockData')) || {};
    const customStock = JSON.parse(localStorage.getItem('customStock')) || [];

    container.innerHTML = '';

    // Load default products
    for (let category in products) {
        products[category].forEach((product, index) => {
            const stock = stockData[product.id] || 100;
            const stockCard = createStockCard(product, stock, index);
            container.appendChild(stockCard);
        });
    }

    // Load custom products
    customStock.forEach((product, index) => {
        const stockCard = createStockCard(product, product.stock, index + 100);
        container.appendChild(stockCard);
    });
}

function createStockCard(product, stock, index) {
    const card = document.createElement('div');
    card.className = 'stock-item-card';
    card.style.animationDelay = `${(index % 20) * 0.05}s`;

    const stockClass = stock === 0 ? 'out' : (stock < 20 ? 'low' : '');

    card.innerHTML = `
        <h3 class="stock-item-name">${product.name}</h3>
        <div class="stock-item-details">
            <span class="stock-item-price">Rs. ${product.price}</span>
            <span class="stock-quantity ${stockClass}">
                Stock: ${stock} ${stock < 20 ? (stock === 0 ? '⚠️' : '⚠️') : '✓'}
            </span>
        </div>
        <div class="stock-actions-row">
            <button class="stock-btn" onclick="updateStock('${product.id}', 10)">
                <i class="fas fa-plus"></i> Add 10
            </button>
            <button class="stock-btn" onclick="updateStock('${product.id}', -10)">
                <i class="fas fa-minus"></i> Remove 10
            </button>
        </div>
    `;

    return card;
}

function updateStock(productId, change) {
    const stockData = JSON.parse(localStorage.getItem('stockData')) || {};
    
    if (!stockData[productId]) {
        stockData[productId] = 100;
    }
    
    stockData[productId] = Math.max(0, stockData[productId] + change);
    
    localStorage.setItem('stockData', JSON.stringify(stockData));
    loadStock();
}

function showAddStockForm() {
    const form = document.getElementById('add-stock-form');
    if (form) {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }
}

function addStockItem(event) {
    event.preventDefault();

    const category = document.getElementById('stock-category').value;
    const name = document.getElementById('stock-name').value;
    const price = parseInt(document.getElementById('stock-price').value);
    const quantity = parseInt(document.getElementById('stock-quantity').value);

    const customStock = JSON.parse(localStorage.getItem('customStock')) || [];
    
    const newItem = {
        id: 'custom_' + Date.now(),
        name: name,
        price: price,
        stock: quantity,
        category: category,
        icon: getCategoryIcon(category)
    };

    customStock.push(newItem);
    localStorage.setItem('customStock', JSON.stringify(customStock));

    // Reset form
    document.getElementById('stock-category').value = '';
    document.getElementById('stock-name').value = '';
    document.getElementById('stock-price').value = '';
    document.getElementById('stock-quantity').value = '';
    
    showAddStockForm();
    loadStock();
}

function getCategoryIcon(category) {
    const icons = {
        chicken: 'fa-drumstick-bite',
        mutton: 'fa-bone',
        beef: 'fa-hamburger',
        frozen: 'fa-fish'
    };
    return icons[category] || 'fa-utensils';
}
