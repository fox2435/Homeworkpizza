document.addEventListener('DOMContentLoaded', function () {
    const pizzaList = document.querySelector('.pizza-list');
    const cartItems = document.querySelector('.cart-items');
    const totalPriceEl = document.getElementById('total-price');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCart();

    const pizzas = [
        {
            id: '1',
            title: 'Імпреза',
            description: 'Балик, салямі, куриця, сир моцарелла, сир рокфор, ананаси, томатна паста, петрушка',
            price: 169,
            price_small: 99,
            image: 'images/pizza1.jpg',
            type: 'meat',
            weight: 660,
            size: 40,
            weight_small: 370,
            size_small: 30
        },
        {
            id: '2',
            title: 'BBQ',
            description: 'Мисливські ковбаски, ковбаски папероні, шинка, сир домашній, шампіньйони, петрушка, оливки',
            price: 199,
            price_small: 139,
            image: 'images/pizza6.jpg',
            type: 'meat',
            weight: 780,
            size: 40,
            weight_small: 460,
            size_small: 30
        },
        {
            id: '3',
            title: 'Міксовий поло',
            description: 'Вітчина, куриця копчена, сир моцарелла, ананас, кукурудза, петрушка, соус томатний',
            price: 179,
            price_small: 115,
            image: 'images/pizza3.jpg',
            type: 'pineapple',
            weight: 780,
            size: 40,
            weight_small: 460,
            size_small: 30
        },
        {
            id: '4',
            title: 'Дольче Маре',
            description: 'Криветки тигрові, мідії, ікра червона, філе червоної риби, сир моцарелла, оливкова олія, вершки',
            price: 399,
            price_small: 250,
            image: 'images/pizza4.jpg',
            type: 'seafood',
            weight: 780,
            size: 40,
            weight_small: 460,
            size_small: 30
        },
        {
            id: '5',
            title: 'Россо Густо',
            description: 'Ікра червона, лосось копчений, сир моцарелла, оливкова олія, вершки',
            price: 299,
            price_small: 189,
            image: 'images/pizza5.jpg',
            type: 'seafood',
            weight: 700,
            size: 40,
            weight_small: 400,
            size_small: 30
        },
    ];

    pizzas.forEach(pizza => {
        const pizzaItem = document.createElement('div');
        pizzaItem.classList.add('pizza-item');
        pizzaItem.setAttribute('data-type', pizza.type);
        pizzaItem.innerHTML = `
            <img src="${pizza.image}" alt="${pizza.title}">
            <div class="label ${pizza.id === '1' ? 'new' : pizza.id === '2' ? 'popular' : ''}">${pizza.id === '1' ? 'Нова' : pizza.id === '2' ? 'Популярна' : ''}</div>
            <div class="name">${pizza.title}</div>
            <div class="description">${pizza.description}</div>
            <div class="sizes">
                <span>${pizza.size_small} см</span> <span>${pizza.weight_small} г</span> <span>${pizza.price_small} грн</span>
            </div>
            <div class="sizes">
                <span>${pizza.size} см</span> <span>${pizza.weight} г</span> <span>${pizza.price} грн</span>
            </div>
            <button class="btn" data-id="${pizza.id}" pizza-size="large">Купити (велика)</button>
            <button class="btn" data-id="${pizza.id}" pizza-size="small">Купити (мала)</button>
        `;
        pizzaList.appendChild(pizzaItem);
    });

    pizzaList.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            const id = e.target.getAttribute('data-id');
            const pizza_size = e.target.getAttribute('pizza-size');
            addToCart(id, pizza_size);
        }
    });

    document.querySelector('nav').addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
            const filter = e.target.getAttribute('data-filter');
            filterPizzas(filter);
        }
    });

    function filterPizzas(filter) {
        const allPizzas = document.querySelectorAll('.pizza-item');
        allPizzas.forEach(pizza => {
            if (filter === 'all') {
                pizza.style.display = 'block';
            } else {
                const pizzaType = pizza.getAttribute('data-type');
                if (pizzaType === filter) {
                    pizza.style.display = 'block';
                } else {
                    pizza.style.display = 'none';
                }
            }
        });
    }

    function addToCart(id, pizza_size) {
        const pizza = cart.find(item => item.id === id && item.pizza_size === pizza_size);
        if (pizza) {
            pizza.quantity++;
        } else {
            const pizzaData = pizzas.find(pizza => pizza.id === id);
            cart.push({ id, pizza_size, quantity: 1, price: pizzaData[pizza_size === 'large' ? 'price' : 'price_small'], title: pizzaData.title });
        }
        updateCart();
    }

    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItem = document.createElement('li');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.title} x ${item.quantity} (${item.pizza_size === 'large' ? 'велика' : 'мала'})</span>
                <span>${item.price * item.quantity} грн</span>
                <button data-id="${item.id}" pizza-size="${item.pizza_size}" class="remove">Видалити</button>
            `;
            cartItems.appendChild(cartItem);
        });
        totalPriceEl.textContent = total;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    cartItems.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove')) {
            const id = e.target.getAttribute('data-id');
            const pizza_size = e.target.getAttribute('pizza-size');
            removeFromCart(id, pizza_size);
        }
    });

    function removeFromCart(id, pizza_size) {
        const pizzaIndex = cart.findIndex(item => item.id === id && item.pizza_size === pizza_size);
        if (pizzaIndex > -1) {
            cart.splice(pizzaIndex, 1);
        }
        updateCart();
    }

    clearCartBtn.addEventListener('click', function () {
        cart = [];
        updateCart();
    });

    checkoutBtn.addEventListener('click', function () {
        alert('Дякуємо за замовлення!');
        cart = [];
        updateCart();
    });
});
