 const API ='https://ecommerce-project-j8z0.onrender.com/api';

// LOAD PRODUCTS
const loadProducts = async () => {
    try {
        const response = await fetch(`${API}/products`);
        const products = await response.json();
        
        const grid = document.getElementById('products-grid');
        grid.innerHTML = '';

        products.forEach(product => {
            grid.innerHTML += `
                <div class="product-card">
                    <img src="images/${product.image}" 
                         onerror="this.src='https://via.placeholder.com/250x200?text=${product.name}'"
                         alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">₹${product.price}</div>
                    <button class="add-to-cart-btn" 
                            onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
};

// ADD TO CART
const addToCart = async (product_id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please login first!');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API}/cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: user.id,
                product_id,
                quantity: 1
            })
        });
        const data = await response.json();
        showMessage('Product added to cart!', 'success');
        updateCartCount();
    } catch (error) {
        showMessage('Error adding to cart', 'error');
    }
};

// UPDATE CART COUNT
const updateCartCount = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
        const response = await fetch(`${API}/cart/${user.id}`);
        const cartItems = await response.json();
        document.getElementById('cart-count').textContent = cartItems.length;
    } catch (error) {
        console.error('Error updating cart count');
    }
};

// SHOW MESSAGE
const showMessage = (text, type) => {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    msg.style.display = 'block';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
};

// CHECK LOGIN STATUS
const checkLogin = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'inline';
    }
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.reload();
    });
};

// RUN ON PAGE LOAD
loadProducts();
checkLogin();
updateCartCount();
