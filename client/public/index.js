//AJAX function
const ajax = async (config) => {
    const request = await fetch(config.url, {
        method: config.method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config.data)
    });
    const response = await request.json();
    console.log(reponse.status);
    return response;
}

// Function to check login status and display user info
function checkLoginStatus() {
    const userDisplay = document.getElementById('user-display');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const checkLogin = document.getElementById('checkLogin');

    // Try to get user email from localStorage first, then sessionStorage
    let loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
        loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');
    }

    if (loggedInUserEmail) {
        userDisplay.textContent = `You are logged in as: ${loggedInUserEmail}`;
        userDisplay.classList.add('font-semibold');
        loginButton.style.display = 'none';
        checkLogin.style.display = 'block';
        logoutButton.style.display = 'block'; // Show logout button
    } else {
        userDisplay.textContent = 'You are not logged in.';
        userDisplay.classList.remove('font-semibold');
        loginButton.style.display = 'block';
        checkLogin.style.display = 'none';
        logoutButton.style.display = 'none'; // Hide logout button
    }
}

// Function to handle user logout
function logout() {
    // Clear both localStorage and sessionStorage for user info
    localStorage.removeItem('loggedInUserEmail');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('loggedInUserEmail');
    sessionStorage.removeItem('isLoggedIn');

    // Redirect to the login page
    window.location.href = 'login.html';
}

function cartAdd(item, size) {
    // Try to get user email from localStorage first, then sessionStorage
    let loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
        loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');
    }

    if (!loggedInUserEmail) {
        window.location.href = 'login.html';
    } else {
        let data = {
            email: loggedInUserEmail,
            item: item,
            size: size
        }
        console.log(data)
        let config = {
            url: 'http://localhost:5000/api/carts/add',
            method: 'POST',
            data: data
        }
        let response = ajax(config);
    }
}

function loadCart(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => carts(data));
}
function carts(data) {
    const select = document.getElementById('cart-item');

    // Try to get user email from localStorage first, then sessionStorage
    let loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInUserEmail) {
        loggedInUserEmail = sessionStorage.getItem('loggedInUserEmail');
    }
    let itemInCart = 0;
    if (loggedInUserEmail) {
        data.forEach(cart => {
            if (cart.email == loggedInUserEmail) {
                for (let i = 0; i < cart.carts.length; i++) {
                    itemInCart += cart.carts[i].amount;
                }
            }
        })
    }

    select.innerHTML = `${itemInCart}`;
}

function loadProduct(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => products(data));
}
function products(data) {
    const select = document.getElementById("product-list");
    select.innerHTML = '';
    data.forEach(products => {
        const product = document.createElement('div');
        product.innerHTML =
            `<div>` +
            `<img src='./backend${products.img[0]}' width="100" height="100">` +
            `<img src='./backend${products.img[1]}' width="100" height="100">` +
            `<img src='./backend${products.img[2]}' width="100" height="100">` +
            `<img src='./backend${products.img[3]}' width="100" height="100">` +
            `<img src='./backend${products.img[4]}' width="100" height="100">` +
            `<h1>Name: ${products.name}</h1>` +
            `<p>Details: ${products.detail}</p>` +
            `<h3>Type: ${products.type}</h3>` +
            `<h3>Size: ${products.sizes[3].size}</h3>` +
            `<h3>Price: ${products.price}</h3>`
        if (products.sizes[3].onShop === true) {
            product.innerHTML += `<button type="button" class="buttonGreen" onclick="cartAdd(${products.id}, '${products.sizes[3].size}')">Buy it!</button>` +
                `</div>`;
        } else {
            product.innerHTML += `<button type="button" class="buttonRed">Buy it!</button>` +
                `</div>`;
        }

        select.appendChild(product);
    });
}

// Polling intervals
const POLLING_INTERVAL = 5000;

window.onload = function () {
    loadProduct('http://localhost:5000/api/products');
    loadCart('http://localhost:5000/api/carts');
    checkLoginStatus();

    setInterval(() => loadProduct('http://localhost:5000/api/products'), POLLING_INTERVAL);
    setInterval(() => loadCart('http://localhost:5000/api/carts'), POLLING_INTERVAL);
}


