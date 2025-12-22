// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация данных для каталога
    const catalogItems = [
        { id: 1, name: "Цемент М500 Д0", description: "Мешок 50 кг, высокое качество, для любых строительных работ", price: "450 ₽", category: "materials", image: "cement" },
        { id: 2, name: "Песок строительный", description: "Речной песок, фракция 1.5-2 мм, мытый, без примесей", price: "1 200 ₽/тонна", category: "materials", image: "sand" },
        { id: 3, name: "Кирпич красный", description: "Облицовочный кирпич, 250x120x65 мм, полнотелый", price: "25 ₽/шт", category: "materials", image: "bricks" },
        { id: 4, name: "Гипсокартон влагостойкий", description: "ГКЛВ 12.5 мм, размер 1200x2500 мм", price: "350 ₽/лист", category: "materials", image: "drywall" },
        { id: 5, name: "Перфоратор SDS-MAX", description: "Мощный перфоратор с 3 режимами, 1500 Вт", price: "8 900 ₽", category: "tools", image: "perforator" },
        { id: 6, name: "Дрель-шуруповерт", description: "Аккумуляторная, 18В, 2 аккумулятора, кейс в комплекте", price: "5 500 ₽", category: "tools", image: "drill" },
        { id: 7, name: "Болгарка 125 мм", description: "Угловая шлифмашина 125 мм, 1100 Вт, защитный кожух", price: "4 200 ₽", category: "tools", image: "grinder" },
        { id: 8, name: "Краска интерьерная", description: "Водоэмульсионная, белая, 10 кг, моющаяся", price: "2 800 ₽", category: "finishing", image: "paint" },
        { id: 9, name: "Обои флизелиновые", description: "Под покраску, плотность 110 г/м², ширина 1.06 м", price: "850 ₽/рулон", category: "finishing", image: "wallpaper" },
        { id: 10, name: "Плитка керамическая", description: "Для ванной комнаты, 30x30 см, влагостойкая", price: "750 ₽/м²", category: "finishing", image: "tiles" },
        { id: 11, name: "Ламинат 33 класс", description: "Класс износостойкости 33, толщина 12 мм, влагостойкий", price: "650 ₽/м²", category: "finishing", image: "laminate" },
        { id: 12, name: "Шпатлевка финишная", description: "Для выравнивания стен, 20 кг, готовая к применению", price: "480 ₽", category: "materials", image: "putty" },
        { id: 13, name: "Смеситель для ванной", description: "Однорычажный, с душем, хром", price: "3 200 ₽", category: "plumbing", image: "mixer" },
        { id: 14, name: "Раковина из искусственного камня", description: "С тумбой, ширина 60 см, белый мат", price: "8 500 ₽", category: "plumbing", image: "sink" },
        { id: 15, name: "Кабель ВВГнг 3x2.5", description: "Кабель силовой, медный, негорючий, 100 м", price: "4 800 ₽", category: "electrical", image: "cable" },
        { id: 16, name: "Розетка с заземлением", description: "Евростандарт, белая, механизм с защитными шторками", price: "120 ₽", category: "electrical", image: "socket" }
    ];
    
    // Корзина
    let cart = JSON.parse(localStorage.getItem('buildpro_cart')) || [];
    
    // Переменные для элементов DOM
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navList = document.querySelector('.nav-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const catalogContainer = document.querySelector('.catalog-items');
    const searchInput = document.getElementById('searchInput');
    const serviceRequestForm = document.getElementById('serviceRequestForm');
    const callbackForm = document.getElementById('callbackForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const cartLink = document.getElementById('cartLink');
    const cartCount = document.getElementById('cartCount');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartPageItems = document.getElementById('cartPageItems');
    const scrollToTop = document.getElementById('scrollToTop');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Инициализация корзины
    function initCart() {
        updateCartCount();
        renderCartItems();
        
        // Открытие корзины
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderCartItems();
        });
        
        // Закрытие корзины
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Закрытие корзины при клике вне ее
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.cart-sidebar') && !e.target.closest('.cart-link') && cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Обработка добавления в корзину
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                
                addToCart(id, name, price);
                this.textContent = 'Добавлено!';
                this.classList.add('added');
                
                setTimeout(() => {
                    this.textContent = 'В корзину';
                    this.classList.remove('added');
                }, 2000);
            });
        });
        
        // Обработка кнопки оформления заказа
        document.querySelector('.checkout-btn').addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            alert(`Заказ оформлен! Сумма заказа: ${getCartTotal()} ₽. Наш менеджер свяжется с вами для подтверждения.`);
            cart = [];
            localStorage.setItem('buildpro_cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Добавление товара в корзину
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                quantity: 1
            });
        }
        
        localStorage.setItem('buildpro_cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        
        // Анимация иконки корзины
        cartLink.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartLink.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Обновление счетчика корзины
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Получение общей суммы корзины
    function getCartTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    // Отрисовка товаров в корзине
    function renderCartItems() {
        const total = getCartTotal();
        cartTotal.textContent = `${total} ₽`;
        
        // Отрисовка в сайдбаре
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Ваша корзина пуста</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">${item.price} ₽ × ${item.quantity} = ${item.price * item.quantity} ₽</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="cart-item-decrease" data-id="${item.id}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="cart-item-increase" data-id="${item.id}">+</button>
                        <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('');
            
            // Добавление обработчиков для кнопок корзины
            document.querySelectorAll('.cart-item-decrease').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    updateCartItemQuantity(id, -1);
                });
            });
            
            document.querySelectorAll('.cart-item-increase').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    updateCartItemQuantity(id, 1);
                });
            });
            
            document.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    removeCartItem(id);
                });
            });
        }
        
        // Отрисовка на странице корзины
        if (cartPageItems) {
            if (cart.length === 0) {
                cartPageItems.innerHTML = `
                    <div class="empty-cart-page">
                        <i class="fas fa-shopping-cart"></i>
                        <h3>Ваша корзина пуста</h3>
                        <p>Добавьте товары из каталога, чтобы сделать заказ</p>
                        <a href="#catalog" class="btn btn-primary">Перейти в каталог</a>
                    </div>
                `;
            } else {
                cartPageItems.innerHTML = cart.map(item => `
                    <div class="cart-page-item" data-id="${item.id}">
                        <div class="cart-page-item-info">
                            <h4>${item.name}</h4>
                            <div class="cart-page-item-price">${item.price} ₽</div>
                        </div>
                        <div class="cart-page-item-actions">
                            <button class="cart-item-decrease" data-id="${item.id}">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="cart-item-increase" data-id="${item.id}">+</button>
                            <button class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                        </div>
                        <div class="cart-page-item-total">${item.price * item.quantity} ₽</div>
                    </div>
                `).join('');
                
                // Итоговая сумма
                cartPageItems.innerHTML += `
                    <div class="cart-page-total">
                        <div class="cart-page-total-label">Итого:</div>
                        <div class="cart-page-total-price">${total} ₽</div>
                    </div>
                    <div class="cart-page-actions">
                        <a href="#catalog" class="btn btn-secondary">Продолжить покупки</a>
                        <button class="btn btn-primary checkout-page-btn">Оформить заказ</button>
                    </div>
                `;
                
                // Обработчики для страницы корзины
                document.querySelectorAll('.cart-page-item .cart-item-decrease').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        updateCartItemQuantity(id, -1);
                    });
                });
                
                document.querySelectorAll('.cart-page-item .cart-item-increase').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        updateCartItemQuantity(id, 1);
                    });
                });
                
                document.querySelectorAll('.cart-page-item .cart-item-remove').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        removeCartItem(id);
                    });
                });
                
                document.querySelector('.checkout-page-btn')?.addEventListener('click', function() {
                    alert(`Заказ оформлен! Сумма заказа: ${total} ₽. Наш менеджер свяжется с вами для подтверждения.`);
                    cart = [];
                    localStorage.setItem('buildpro_cart', JSON.stringify(cart));
                    updateCartCount();
                    renderCartItems();
                });
            }
        }
    }
    
    // Обновление количества товара в корзине
    function updateCartItemQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            }
            
            localStorage.setItem('buildpro_cart', JSON.stringify(cart));
            updateCartCount();
            renderCartItems();
        }
    }
    
    // Удаление товара из корзины
    function removeCartItem(id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('buildpro_cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
    
    // Навигация по страницам
    function navigateToPage(pageId) {
        // Скрыть все страницы
        pages.forEach(page => {
            page.classList.remove('active');
        });
        
        // Показать выбранную страницу
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Обновить URL без перезагрузки страницы
            history.pushState(null, '', `#${pageId}`);
            
            // Если открыта корзина, обновить ее содержимое
            if (pageId === 'cart') {
                renderCartItems();
            }
        }
        
        // Обновить активную ссылку в навигации
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
        
        // Закрыть мобильное меню, если оно открыто
        if (navList.classList.contains('active')) {
            navList.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }
    
    // Инициализация навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            navigateToPage(pageId);
            
            // Прокрутка к началу страницы
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Обработка хэша в URL при загрузке страницы
    function handleInitialPage() {
        const hash = window.location.hash.substring(1);
        const validPages = ['home', 'about', 'catalog', 'services', 'contact', 'cart'];
        
        if (validPages.includes(hash)) {
            navigateToPage(hash);
        } else {
            // По умолчанию показываем главную страницу
            navigateToPage('home');
        }
    }
    
    // Инициализация каталога
    function initCatalog() {
        // Отобразить все товары при загрузке
        renderCatalogItems('all');
        
        // Добавить обработчики для кнопок фильтра
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Удалить активный класс со всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Добавить активный класс к текущей кнопке
                this.classList.add('active');
                
                // Отфильтровать товары
                const filter = this.getAttribute('data-filter');
                renderCatalogItems(filter);
            });
        });
        
        // Обработка поиска
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                
                // Если есть поисковый запрос, показать все товары и отфильтровать по поиску
                if (searchTerm) {
                    renderCatalogItems('all', searchTerm);
                } else {
                    // Иначе показать товары по активному фильтру
                    renderCatalogItems(activeFilter);
                }
            });
        }
        
        // Обработка ссылок в футере
        document.querySelectorAll('.footer-links a[data-filter]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const filter = this.getAttribute('data-filter');
                
                // Перейти на страницу каталога
                navigateToPage('catalog');
                
                // Активировать соответствующий фильтр
                setTimeout(() => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add('active');
                    renderCatalogItems(filter);
                }, 100);
            });
        });
    }
    
    // Рендер товаров каталога
    function renderCatalogItems(filter, searchTerm = '') {
        // Очистить контейнер
        catalogContainer.innerHTML = '';
        
        // Фильтрация товаров
        let filteredItems = catalogItems;
        
        if (filter !== 'all') {
            filteredItems = catalogItems.filter(item => item.category === filter);
        }
        
        // Поиск товаров
        if (searchTerm) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Сообщение, если товаров не найдено
        if (filteredItems.length === 0) {
            catalogContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Товары не найдены</h3>
                    <p>Попробуйте изменить параметры поиска или фильтрации</p>
                </div>
            `;
            return;
        }
        
        // Создание элементов товаров
        filteredItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'catalog-item';
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="item-price">${item.price}</div>
                <button class="btn btn-outline add-to-catalog-cart" data-id="${item.id}" data-name="${item.name}" data-price="${parseFloat(item.price.replace(/\s/g, ''))}">В корзину</button>
            `;
            
            catalogContainer.appendChild(itemElement);
        });
        
        // Добавить обработчики для кнопок заказа
        document.querySelectorAll('.add-to-catalog-cart').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                
                addToCart(id, name, price);
                this.textContent = 'Добавлено!';
                this.classList.add('added');
                
                setTimeout(() => {
                    this.textContent = 'В корзину';
                    this.classList.remove('added');
                }, 2000);
            });
        });
    }
    
    // Обработка формы заявки на услугу
    if (serviceRequestForm) {
        serviceRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // В реальном приложении здесь был бы AJAX-запрос на сервер
            alert('Ваша заявка принята! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }
    
    // Обработка формы обратного звонка
    if (callbackForm) {
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // В реальном приложении здесь был бы AJAX-запрос на сервер
            alert('Спасибо за заявку! Мы перезвоним вам в течение 30 минут.');
            this.reset();
        });
    }
    
    // Обработка формы подписки на рассылку
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // В реальном приложении здесь был бы AJAX-запрос на сервер
            alert(`Спасибо за подписку! На адрес ${email} будут приходить наши новости и акции.`);
            this.reset();
        });
    }
    
    // Мобильное меню
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.innerHTML = navList.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Закрытие мобильного меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-btn') && navList.classList.contains('active')) {
            navList.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Обработка нажатия клавиши Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            if (cartSidebar.classList.contains('active')) {
                cartSidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Кнопка "Наверх"
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollToTop.classList.add('visible');
        } else {
            scrollToTop.classList.remove('visible');
        }
    });
    
    scrollToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Анимация для кнопок при наведении
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Добавление интерактивности для карточек товаров
    const productCards = document.querySelectorAll('.product-card, .catalog-item, .feature-card, .service-card, .contact-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Инициализация при загрузке
    handleInitialPage();
    initCatalog();
    initCart();
    
    // Обработка изменения хэша в URL
    window.addEventListener('hashchange', handleInitialPage);
    
    // Анимация элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Наблюдение за элементами для анимации при прокрутке
    document.querySelectorAll('.feature-card, .product-card, .service-card, .stat').forEach(el => {
        observer.observe(el);
    });
});
// Добавляем обработку мобильных событий
if ('ontouchstart' in window) {
    // Улучшаем touch события
    document.addEventListener('DOMContentLoaded', function() {
        // Увеличиваем область нажатия для маленьких элементов
        const smallButtons = document.querySelectorAll('.filter-btn, .cart-item-decrease, .cart-item-increase');
        smallButtons.forEach(btn => {
            btn.style.minWidth = '44px';
            btn.style.minHeight = '44px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
        });
        
        // Добавляем feedback при касании
        const touchElements = document.querySelectorAll('.btn, .nav-link, .product-card, .catalog-item');
        touchElements.forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            });
            
            el.addEventListener('touchend', function() {
                this.style.opacity = '1';
            });
            
            el.addEventListener('touchcancel', function() {
                this.style.opacity = '1';
            });
        });
        
        // Предотвращаем выделение текста при касании
        document.addEventListener('selectstart', function(e) {
            if (e.target.matches('.btn, .nav-link, .product-card, .catalog-item')) {
                e.preventDefault();
            }
        });
    });
}

// Адаптация к изменению размера экрана
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Обновляем высоту hero секции
        const hero = document.querySelector('.hero');
        if (hero && window.innerWidth <= 768) {
            hero.style.minHeight = window.innerHeight - 70 + 'px';
        }
        
        // Пересчитываем положение корзины
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            cartSidebar.style.height = window.innerHeight + 'px';
        }
    }, 250);
});

// Инициализация при полной загрузке страницы
window.addEventListener('load', function() {
    // Добавляем класс загруженной страницы для анимаций
    document.body.classList.add('page-loaded');
    
    // Скрываем preloader если есть
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }, 500);
    }
    
    // Проверяем поддержку Service Worker для PWA
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
});