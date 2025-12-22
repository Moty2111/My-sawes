// mobile.js - Мобильные взаимодействия и оптимизации

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, мобильное ли устройство
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Оптимизации для мобильных устройств
    if (isMobile || isTouchDevice) {
        optimizeForMobile();
    }
    
    // Функция оптимизации для мобильных
    function optimizeForMobile() {
        console.log('Оптимизация для мобильного устройства');
        
        // 1. Улучшение навигации
        improveMobileNavigation();
        
        // 2. Улучшение форм для мобильных
        improveMobileForms();
        
        // 3. Улучшение галереи/слайдеров
        improveMobileGalleries();
        
        // 4. Оптимизация производительности
        optimizePerformance();
        
        // 5. Улучшение взаимодействия с корзиной
        improveMobileCart();
        
        // 6. Адаптация жестов
        addGestureSupport();
        
        // 7. Предотвращение масштабирования при фокусе на полях ввода
        preventZoomOnFocus();
    }
    
    // Улучшение мобильной навигации
    function improveMobileNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navList = document.querySelector('.nav-list');
        
        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    
                    // Анимация кнопки меню
                    mobileMenuBtn.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        mobileMenuBtn.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        });
        
        // Свайп для закрытия меню
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            // Если свайп вправо и меню открыто - закрываем его
            if (swipeDistance > swipeThreshold && navList.classList.contains('active')) {
                navList.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
        
        // Вибрация при клике (если поддерживается)
        if ('vibrate' in navigator) {
            mobileMenuBtn.addEventListener('touchstart', () => {
                navigator.vibrate(10);
            });
            
            navLinks.forEach(link => {
                link.addEventListener('touchstart', () => {
                    navigator.vibrate(5);
                });
            });
        }
    }
    
    // Улучшение форм для мобильных
    function improveMobileForms() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Добавляем подсказки для виртуальной клавиатуры
            if (input.type === 'tel') {
                input.setAttribute('inputmode', 'tel');
                input.setAttribute('pattern', '[0-9]*');
            }
            
            if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
            }
            
            if (input.type === 'number') {
                input.setAttribute('inputmode', 'numeric');
            }
            
            // Улучшение фокуса на мобильных
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
                
                // Прокрутка к полю ввода
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                    });
                }, 300);
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
        
        // Автоматический переход между полями формы
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            const input = group.querySelector('input, select, textarea');
            if (input && index < formGroups.length - 1) {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter' && this.type !== 'textarea') {
                        e.preventDefault();
                        const nextInput = formGroups[index + 1].querySelector('input, select, textarea');
                        if (nextInput) nextInput.focus();
                    }
                });
            }
        });
    }
    
    // Улучшение галереи для мобильных
    function improveMobileGalleries() {
        const productImages = document.querySelectorAll('.product-image');
        
        productImages.forEach(image => {
            // Добавляем возможность увеличения при касании
            image.style.cursor = 'pointer';
            
            image.addEventListener('click', function() {
                const productName = this.closest('.product-card, .catalog-item')?.querySelector('h3')?.textContent || 'Товар';
                
                // Создаем модальное окно с увеличенным изображением
                const modal = document.createElement('div');
                modal.className = 'image-modal';
                modal.innerHTML = `
                    <div class="modal-overlay"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4>${productName}</h4>
                            <button class="modal-close"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="modal-image" style="background-image: ${this.style.backgroundImage}"></div>
                        <div class="modal-actions">
                            <button class="btn btn-primary add-from-modal">Добавить в корзину</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // Закрытие модального окна
                modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
                modal.querySelector('.modal-close').addEventListener('click', closeModal);
                
                // Добавление в корзину из модального окна
                const productCard = this.closest('.product-card, .catalog-item');
                const addButton = productCard?.querySelector('.add-to-cart');
                if (addButton) {
                    modal.querySelector('.add-from-modal').addEventListener('click', () => {
                        addButton.click();
                        closeModal();
                    });
                }
                
                // Закрытие при нажатии Escape
                document.addEventListener('keydown', function escHandler(e) {
                    if (e.key === 'Escape') {
                        closeModal();
                        document.removeEventListener('keydown', escHandler);
                    }
                });
                
                function closeModal() {
                    modal.classList.add('closing');
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                }
                
                // Анимация появления
                setTimeout(() => {
                    modal.classList.add('active');
                }, 10);
            });
        });
        
        // Добавляем стили для модального окна
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: none;
            }
            
            .image-modal.active {
                display: block;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0.9);
                width: 90%;
                max-width: 500px;
                background: var(--white);
                border-radius: 15px;
                overflow: hidden;
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .image-modal.active .modal-content {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            
            .image-modal.closing .modal-content {
                transform: translate(-50%, -50%) scale(0.9);
                opacity: 0;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background: var(--primary-color);
                color: white;
            }
            
            .modal-header h4 {
                margin: 0;
                font-size: 1.2rem;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 5px;
            }
            
            .modal-image {
                height: 300px;
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                background-color: #f5f5f5;
            }
            
            .modal-actions {
                padding: 20px;
                text-align: center;
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                }
                
                .modal-image {
                    height: 250px;
                }
            }
        `;
        document.head.appendChild(modalStyles);
    }
    
    // Оптимизация производительности для мобильных
    function optimizePerformance() {
        // Ленивая загрузка изображений
        const images = document.querySelectorAll('img, .product-image, .construction-image');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.tagName === 'IMG' && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.classList.contains('product-image') || img.classList.contains('construction-image')) {
                        // Уже загружены через CSS
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        images.forEach(img => imageObserver.observe(img));
        
        // Оптимизация анимаций
        if ('requestAnimationFrame' in window) {
            // Используем requestAnimationFrame для плавных анимаций
            const animatedElements = document.querySelectorAll('.feature-card, .product-card, .service-card');
            animatedElements.forEach(el => {
                el.style.willChange = 'transform, opacity';
            });
        }
        
        // Предотвращение блокировки основного потока
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Загрузка второстепенных ресурсов
                console.log('Загрузка второстепенных ресурсов...');
            });
        }
    }
    
    // Улучшение мобильной корзины
    function improveMobileCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartItems = document.getElementById('cartItems');
        
        if (cartSidebar) {
            // Свайп для закрытия корзины
            let cartTouchStartY = 0;
            let cartTouchEndY = 0;
            
            cartSidebar.addEventListener('touchstart', e => {
                cartTouchStartY = e.changedTouches[0].screenY;
            }, { passive: true });
            
            cartSidebar.addEventListener('touchend', e => {
                cartTouchEndY = e.changedTouches[0].screenY;
                handleCartSwipe();
            }, { passive: true });
            
            function handleCartSwipe() {
                const swipeThreshold = 100;
                const swipeDistance = cartTouchEndY - cartTouchStartY;
                
                // Если свайп вниз - закрываем корзину
                if (swipeDistance > swipeThreshold && cartSidebar.classList.contains('active')) {
                    cartSidebar.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    if ('vibrate' in navigator) {
                        navigator.vibrate(10);
                    }
                }
            }
            
            // Pull-to-refresh для обновления корзины
            let refreshStartY = 0;
            let isRefreshing = false;
            
            cartItems.addEventListener('touchstart', e => {
                if (cartItems.scrollTop === 0) {
                    refreshStartY = e.touches[0].pageY;
                }
            }, { passive: true });
            
            cartItems.addEventListener('touchmove', e => {
                if (!refreshStartY || isRefreshing) return;
                
                const touchY = e.touches[0].pageY;
                const refreshDistance = touchY - refreshStartY;
                
                if (refreshDistance > 50 && cartItems.scrollTop === 0) {
                    isRefreshing = true;
                    showRefreshIndicator();
                }
            }, { passive: true });
            
            cartItems.addEventListener('touchend', () => {
                if (isRefreshing) {
                    // Обновляем корзину
                    setTimeout(() => {
                        hideRefreshIndicator();
                        isRefreshing = false;
                        refreshStartY = 0;
                        
                        // Здесь можно обновить данные корзины
                        console.log('Корзина обновлена');
                    }, 1000);
                }
            });
            
            function showRefreshIndicator() {
                let indicator = document.querySelector('.refresh-indicator');
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.className = 'refresh-indicator';
                    indicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Обновление...';
                    cartItems.prepend(indicator);
                }
                indicator.classList.add('active');
            }
            
            function hideRefreshIndicator() {
                const indicator = document.querySelector('.refresh-indicator');
                if (indicator) {
                    indicator.classList.remove('active');
                    setTimeout(() => {
                        if (indicator.parentNode) {
                            indicator.remove();
                        }
                    }, 300);
                }
            }
        }
    }
    
    // Добавление поддержки жестов
    function addGestureSupport() {
        // Двойное касание для увеличения
        let lastTap = 0;
        
        document.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                // Двойное касание
                handleDoubleTap(e);
            }
            
            lastTap = currentTime;
        });
        
        function handleDoubleTap(e) {
            const target = e.target;
            
            // Увеличение изображений товаров при двойном касании
            if (target.closest('.product-image') || target.closest('.catalog-item')) {
                const productImage = target.closest('.product-image') || 
                                     target.closest('.catalog-item, .product-card');
                if (productImage) {
                    productImage.style.transform = productImage.style.transform === 'scale(1.1)' 
                        ? 'scale(1)' 
                        : 'scale(1.1)';
                    
                    productImage.style.transition = 'transform 0.3s ease';
                    
                    // Автоматическое возвращение через 2 секунды
                    setTimeout(() => {
                        productImage.style.transform = 'scale(1)';
                    }, 2000);
                }
            }
        }
        
        // Долгое нажатие для контекстного меню
        let longPressTimer;
        
        document.addEventListener('touchstart', function(e) {
            const target = e.target;
            
            // Для товаров в корзине
            if (target.closest('.cart-item') || target.closest('.cart-page-item')) {
                longPressTimer = setTimeout(() => {
                    showCartItemMenu(e);
                }, 800);
            }
        });
        
        document.addEventListener('touchend', function() {
            clearTimeout(longPressTimer);
        });
        
        document.addEventListener('touchmove', function() {
            clearTimeout(longPressTimer);
        });
        
        function showCartItemMenu(e) {
            const cartItem = e.target.closest('.cart-item, .cart-page-item');
            if (!cartItem) return;
            
            const itemId = cartItem.dataset.id;
            const itemName = cartItem.querySelector('h4')?.textContent || 'Товар';
            
            // Создаем контекстное меню
            const menu = document.createElement('div');
            menu.className = 'context-menu';
            menu.innerHTML = `
                <div class="menu-overlay"></div>
                <div class="menu-content">
                    <h4>${itemName}</h4>
                    <button class="menu-item remove-item" data-id="${itemId}">
                        <i class="fas fa-trash"></i> Удалить из корзины
                    </button>
                    <button class="menu-item move-to-wishlist" data-id="${itemId}">
                        <i class="fas fa-heart"></i> В избранное
                    </button>
                    <button class="menu-item cancel-menu">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                </div>
            `;
            
            document.body.appendChild(menu);
            
            // Позиционирование меню
            const menuContent = menu.querySelector('.menu-content');
            menuContent.style.top = e.changedTouches[0].pageY + 'px';
            menuContent.style.left = Math.min(e.changedTouches[0].pageX, window.innerWidth - 250) + 'px';
            
            // Обработчики меню
            menu.querySelector('.menu-overlay').addEventListener('click', closeMenu);
            menu.querySelector('.cancel-menu').addEventListener('click', closeMenu);
            
            menu.querySelector('.remove-item').addEventListener('click', function() {
                const id = this.dataset.id;
                // Удаляем товар из корзины
                console.log(`Удаление товара ${id} из корзины`);
                closeMenu();
            });
            
            menu.querySelector('.move-to-wishlist').addEventListener('click', function() {
                const id = this.dataset.id;
                // Добавляем в избранное
                console.log(`Добавление товара ${id} в избранное`);
                closeMenu();
            });
            
            function closeMenu() {
                menu.classList.add('closing');
                setTimeout(() => {
                    menu.remove();
                }, 300);
            }
            
            // Анимация появления
            setTimeout(() => {
                menu.classList.add('active');
            }, 10);
            
            // Вибрация
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        }
        
        // Добавляем стили для контекстного меню
        const contextMenuStyles = document.createElement('style');
        contextMenuStyles.textContent = `
            .context-menu {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 3000;
                display: none;
            }
            
            .context-menu.active {
                display: block;
            }
            
            .menu-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .menu-content {
                position: absolute;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                min-width: 200px;
                transform: translate(-50%, -50%) scale(0.9);
                opacity: 0;
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .context-menu.active .menu-content {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            
            .context-menu.closing .menu-content {
                transform: translate(0, 0) scale(0.9);
                opacity: 0;
            }
            
            .menu-content h4 {
                margin: 0;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                font-size: 1rem;
                text-align: center;
            }
            
            .menu-item {
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
                padding: 15px;
                border: none;
                background: none;
                text-align: left;
                font-size: 1rem;
                color: var(--text-color);
                border-bottom: 1px solid var(--medium-gray);
                cursor: pointer;
                transition: background 0.2s ease;
            }
            
            .menu-item:last-child {
                border-bottom: none;
            }
            
            .menu-item:hover {
                background: var(--light-gray);
            }
            
            .menu-item i {
                width: 20px;
                text-align: center;
            }
            
            .refresh-indicator {
                text-align: center;
                padding: 15px;
                background: var(--primary-color);
                color: white;
                transform: translateY(-100%);
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .refresh-indicator.active {
                transform: translateY(0);
                opacity: 1;
            }
            
            .refresh-indicator i {
                margin-right: 10px;
            }
        `;
        document.head.appendChild(contextMenuStyles);
    }
    
    // Предотвращение масштабирования при фокусе на полях ввода
    function preventZoomOnFocus() {
        const viewport = document.querySelector('meta[name="viewport"]');
        let originalContent = viewport.getAttribute('content');
        
        document.addEventListener('focusin', function(e) {
            if (e.target.matches('input, select, textarea')) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        });
        
        document.addEventListener('focusout', function() {
            viewport.setAttribute('content', originalContent);
        });
    }
    
    // Адаптация к изменению ориентации устройства
    window.addEventListener('orientationchange', function() {
        // Обновляем высоту некоторых элементов при изменении ориентации
        setTimeout(() => {
            const heroHeight = document.querySelector('.hero')?.offsetHeight;
            const catalogHeight = document.querySelector('.catalog-items')?.offsetHeight;
            
            if (heroHeight) {
                document.querySelector('.hero').style.minHeight = heroHeight + 'px';
            }
            
            // Пересчитываем положение элементов
            window.dispatchEvent(new Event('resize'));
        }, 300);
    });
    
    // Оптимизация для медленных сетей
    if ('connection' in navigator) {
        const connection = navigator.connection;
        
        if (connection.saveData === true || connection.effectiveType.includes('2g')) {
            // Режим экономии данных
            console.log('Режим экономии данных активирован');
            
            // Отключаем тяжелые анимации
            document.body.classList.add('save-data-mode');
            
            // Упрощаем интерфейс
            const heavyElements = document.querySelectorAll('.construction-icon, .feature-icon, .service-icon');
            heavyElements.forEach(el => {
                el.style.animation = 'none';
            });
            
            // Используем упрощенные изображения
            const images = document.querySelectorAll('.product-image, .construction-image');
            images.forEach(img => {
                // Здесь можно заменить на миниатюры
            });
        }
    }
    
    // Добавляем иконку для установки PWA
    if ('serviceWorker' in navigator && window.matchMedia('(display-mode: standalone)').matches === false) {
        // Показываем кнопку "Добавить на главный экран"
        const installButton = document.createElement('button');
        installButton.className = 'pwa-install-btn';
        installButton.innerHTML = '<i class="fas fa-plus-circle"></i> Установить приложение';
        installButton.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 0.9rem;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: pulse 2s infinite;
        `;
        
        document.body.appendChild(installButton);
        
        installButton.addEventListener('click', async () => {
            // Здесь должна быть логика установки PWA
            console.log('Установка приложения...');
            installButton.style.display = 'none';
        });
        
        // Скрываем кнопку после 10 секунд
        setTimeout(() => {
            installButton.style.opacity = '0';
            setTimeout(() => {
                installButton.remove();
            }, 500);
        }, 10000);
    }
});

// Обработка состояния сети
window.addEventListener('online', function() {
    showNetworkStatus('Соединение восстановлено', 'success');
});

window.addEventListener('offline', function() {
    showNetworkStatus('Нет соединения с интернетом', 'error');
});

function showNetworkStatus(message, type) {
    const status = document.createElement('div');
    status.className = `network-status ${type}`;
    status.textContent = message;
    status.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 100%;
        padding: 15px;
        text-align: center;
        font-weight: 600;
        z-index: 2000;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'success') {
        status.style.backgroundColor = '#4CAF50';
        status.style.color = 'white';
    } else {
        status.style.backgroundColor = '#f44336';
        status.style.color = 'white';
    }
    
    document.body.appendChild(status);
    
    // Показываем уведомление
    setTimeout(() => {
        status.style.transform = 'translateY(0)';
    }, 10);
    
    // Скрываем через 3 секунды
    setTimeout(() => {
        status.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            status.remove();
        }, 300);
    }, 3000);
}

// Оптимизация для разных плотностей пикселей
if (window.devicePixelRatio > 1) {
    document.documentElement.classList.add('high-dpi');
    
    // Используем изображения высокого разрешения
    const highResImages = document.querySelectorAll('[data-src-2x]');
    highResImages.forEach(img => {
        if (window.devicePixelRatio >= 2) {
            img.src = img.dataset.src2x;
        }
    });
}

// Улучшение скролла на iOS
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.body.style.WebkitOverflowScrolling = 'touch';
    
    // Фикс для фиксированного положения на iOS
    document.addEventListener('touchmove', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            e.preventDefault();
        }
    }, { passive: false });
}