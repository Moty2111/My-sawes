// Service Worker для BuildPro
const CACHE_NAME = 'buildpro-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/mobile.css',
  '/script.js',
  '/mobile.js',
  '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация и очистка старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Стратегия кэширования: Cache First, затем Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Кэш найден - возвращаем его
        if (response) {
          return response;
        }

        // Клонируем запрос
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Проверяем валидность ответа
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонируем ответ
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(error => {
          // Оффлайн режим: для HTML страниц показываем оффлайн страницу
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Фоновая синхронизация
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCart());
  }
});

// Функция синхронизации корзины
function syncCart() {
  return new Promise((resolve, reject) => {
    // Здесь должна быть логика синхронизации с сервером
    console.log('Синхронизация корзины...');
    resolve();
  });
}

// Получение push-уведомлений
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление от BuildPro',
    icon: 'icons/icon-192x192.png',
    badge: 'icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Перейти в магазин',
        icon: 'icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: 'icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BuildPro', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // Открываем приложение
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});