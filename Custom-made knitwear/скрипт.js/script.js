// Массив товаров
const products = [
    {
        id: 1,
        name: "Палантин",
        price: 4000,
        description: "ОПИСАНИЕ",
        image: "palantin.jpg",
        materials: "МАТЕРИАЛ",
        sizes: "180×70 см",
        colors: ["бордовый", "серый"],
    },
     {
        id: 2,
        name: "Плед",
        price: 6000, // Лучше использовать число для цены
        description: "ОПИСАНИЕ",
        image: "pled.jpg",
        materials: "МАТЕРИАЛ",
        sizes: ["150×200 см", "200×220 см"], // Варианты размеров
        priceVariants: {
            "150×200 см": 6000,
            "200×220 см": 8000
        },
        colors: ["синий", "фиолетовый", "зеленый"],
    },
    // Добавить другие товары
];

// Корзина
let cart = [];

// Загрузка товаров
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});

// Отображение товаров
function renderProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Формируем блок с ценой (с учетом вариантов)
        let priceBlock;
        if (product.priceVariants) {
            // Если есть варианты цен (как у пледа)
            priceBlock = `
                <div class="price-variants">
                    <select class="size-selector" data-product-id="${product.id}">
                        ${Object.entries(product.priceVariants).map(([size, price]) => 
                            `<option value="${price}">${size} - ${price} руб.</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        } else {
            // Если простая цена (как у палантина)
            priceBlock = `
                <div class="price-simple">
                    <span class="price">${product.price} руб.</span>
                    ${Array.isArray(product.sizes) ? 
                       `<div class="available-sizes">Размеры: ${product.sizes.join(', ')}</div>` : 
                       `<div class="size">Размер: ${product.sizes}</div>`}
                </div>
            `;
        }
        
        // Формируем блок с цветами
        const colorsBlock = product.colors ? 
            `<div class="colors">Цвета: ${product.colors.join(', ')}</div>` : '';
        
        // Формируем карточку товара
        productCard.innerHTML = `
           <img src="${product.image}" 
         onerror="this.src='https://via.placeholder.com/300?text=Нет+изображения'">
    <!-- ... --> <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="description">${product.description}</div>
                <div class="materials">Состав: ${product.materials}</div>
                ${colorsBlock}
                ${priceBlock}
                <button class="add-to-cart" data-product-id="${product.id}">В корзину</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Добавляем обработчики событий для селекторов размера
    document.querySelectorAll('.size-selector').forEach(select => {
        select.addEventListener('change', function() {
            const productId = this.getAttribute('data-product-id');
            const selectedPrice = this.value;
            // Здесь можно обновить отображаемую цену
            console.log(`Выбран вариант для товара ${productId}: ${this.options[this.selectedIndex].text}`);
        });
    });
    
    // Добавляем обработчики для кнопок "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            addToCart(productId);
        });
    });
}

// Функция добавления в корзину (пример)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Для товаров с вариантами цен получаем выбранный вариант
    let selectedPrice = product.price;
    let selectedSize = null;
    
    if (product.priceVariants) {
        const selector = document.querySelector(`.size-selector[data-product-id="${productId}"]`);
        if (selector) {
            selectedPrice = parseInt(selector.value);
            selectedSize = selector.options[selector.selectedIndex].text.split(' - ')[0];
        }
    }
    
    // Формируем объект для корзины
    const cartItem = {
        id: product.id,
        name: product.name,
        price: selectedPrice,
        size: selectedSize || product.sizes,
        image: product.image
    };
    
    // Добавляем в корзину (ваша реализация может отличаться)
    cart.push(cartItem);
    updateCartCount();
    
    // Уведомление пользователя
    alert(`Товар "${product.name}" ${selectedSize ? `(размер: ${selectedSize}) ` : ''}добавлен в корзину!`);
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}