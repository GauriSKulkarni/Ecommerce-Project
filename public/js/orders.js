 const API = 'http://localhost:5000/api';

// LOAD ORDERS
const loadOrders = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API}/orders/${user.id}`);
        const orders = await response.json();

        const ordersDiv = document.getElementById('orders-list');

        if (orders.length === 0) {
            ordersDiv.innerHTML = `
                <div class="empty-cart">
                    <h3>No orders yet!</h3>
                    <a href="index.html" class="btn">Start Shopping</a>
                </div>
            `;
            return;
        }

        ordersDiv.innerHTML = '';

        orders.forEach(order => {
            const date = new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            ordersDiv.innerHTML += `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <h3>Order #${order.id}</h3>
                            <p class="order-date">${date}</p>
                        </div>
                        <div>
                            <span class="order-status ${order.status}">${order.status}</span>
                            <p class="order-total">₹${order.total_amount}</p>
                        </div>
                    </div>
                    <button class="btn view-details-btn" 
                            onclick="loadOrderDetails(${order.id}, this)">
                        View Details
                    </button>
                    <div class="order-details" id="details-${order.id}" style="display:none">
                        <!-- Details loaded here -->
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error('Error loading orders:', error);
    }
};

// LOAD ORDER DETAILS
const loadOrderDetails = async (orderId, btn) => {
    const detailsDiv = document.getElementById(`details-${orderId}`);

    if (detailsDiv.style.display === 'block') {
        detailsDiv.style.display = 'none';
        btn.textContent = 'View Details';
        return;
    }

    try {
        const response = await fetch(`${API}/orders/details/${orderId}`);
        const items = await response.json();

        detailsDiv.innerHTML = `
            <table class="order-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>₹${item.price}</td>
                            <td>${item.quantity}</td>
                            <td>₹${item.total_price}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        detailsDiv.style.display = 'block';
        btn.textContent = 'Hide Details';

    } catch (error) {
        console.error('Error loading order details:', error);
    }
};

// CHECK LOGIN
const checkLogin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'inline';
    }
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
};

loadOrders();
checkLogin();
