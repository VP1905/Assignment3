const API_BASE_URL = "http://localhost:8080";

const API_PRODUCTS = `${API_BASE_URL}/products`;
const API_CART = `${API_BASE_URL}/cart_items`;

// Load products on index page
async function loadProducts() {
    const response = await fetch(API_PRODUCTS);
    const products = await response.json();

    let html = "";
    products.forEach(p => {
        html += `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <p><strong>Price: $${p.price}</strong></p>
                <button class="btn-add" onclick="addToCart(${p.id}, '${p.name}', ${p.price}, '${p.image}')">
                    Add to Cart
                </button>
            </div>
        `;
    });

    document.getElementById("product-list").innerHTML = html;
}

// Add product to cart
async function addToCart(id, name, price, image) {
    const response = await fetch(API_CART, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            productId: id,
            productName: name,
            price: price,
            image: image
        })
    });

    if (response.ok) {
        alert("Product added to cart!");
        window.location.href = "cart.html"; 
    } else {
        alert("Failed to add product");
    }
}

// Load cart items
async function loadCart() {
    const response = await fetch(API_CART);
    const items = await response.json();

    console.log("Cart items from API:", items); 

    const emptyMessage = document.getElementById("empty-message");
    const cartContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    if (items.length === 0) {
        if (emptyMessage) {
            emptyMessage.style.display = "block";
        }
        cartContainer.innerHTML = "";

        if (totalElement) {
            totalElement.innerText = "Total: $0.00";
        }
        return;
    } else {
        if (emptyMessage) {
            emptyMessage.style.display = "none";
        }
    }

    let html = "";
    let total = 0;

    items.forEach(item => {
        total += item.price;

        html += `
            <div class="product-card">
                <img src="${item.image}" alt="${item.productName}">
                <h3>${item.productName}</h3>
                <p>Price: $${item.price}</p>
                <button class="btn-delete" onclick="deleteItem(${item.id})">Remove</button>
            </div>
        `;
    });

    if (totalElement) {
        totalElement.innerText = `Total: $${total.toFixed(2)}`;
    }

    cartContainer.innerHTML = html;
}


// Delete individual item
async function deleteItem(id) {
    const response = await fetch(`${API_CART}/${id}`, { method: "DELETE" });
    if (response.ok) {
        loadCart();
    }
}

// Empty full cart
async function emptyCart() {
    const response = await fetch(`${API_CART}/emptycart`, { method: "DELETE" });
    if (response.ok) {
        loadCart();
    }
}

// Which page?
if (window.location.pathname.includes("index")) {
    loadProducts();
} else if (window.location.pathname.includes("cart")) {
    loadCart();
}
