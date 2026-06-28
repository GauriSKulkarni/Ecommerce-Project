 const API = 'https://ecommerce-project-j8z0.onrender.com/api';

// LOAD CART ITEMS
const loadCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API}/cart/${user.id}`);
        const cartItems = await response.json();

        const cartDiv = document.getElementById('cart-items');
        const summaryDiv = document.getElementById('cart-summary');

        if (cartItems.length === 0) {
            cartDiv.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty!</h3>
                    <a href="index.html" class="btn">Continue Shopping</a>
                </div>
            `;
            return;
        }

        let total = 0;
        cartDiv.innerHTML = '';

        cartItems.forEach(item => {
            total += parseFloat(item.total_price);
            cartDiv.innerHTML += `
                <div class="cart-item">
                    <img src="images/${item.image}" 
                         onerror="this.src='https://via.placeholder.com/100x100?text=${item.name}'"
                         alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>Price: ₹${item.price}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Total: ₹${item.total_price}</p>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        Remove
                    </button>
                </div>
            `;
        });

        document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;
        summaryDiv.style.display = 'block';

    } catch (error) {
        console.error('Error loading cart:', error);
    }
};

// REMOVE FROM CART
const removeFromCart = async (cartId) => {
    try {
        const response = await fetch(`${API}/cart/${cartId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            loadCart();
        }
    } catch (error) {
        console.error('Error removing item:', error);
    }
};

// PLACE ORDER
const placeOrder = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Order placed successfully! Order ID: ${data.order_id}`);
            window.location.href = 'index.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error placing order');
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

loadCart();
checkLogin();
