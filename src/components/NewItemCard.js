import { API_BASE_URL } from '../js/api/index.js';
import { addToCart } from '../js/api/cart.js';

/**
 * Получение URL превью изображения товара
 * @param {Array} media - Массив медиа-файлов
 * @returns {string} - URL изображения
 */
function getProductImage(media) {
  if (!media || media.length === 0) {
    return '/assets/img/itemsSlider1.webp'; // Заглушка
  }

  const firstImage = media[0];
  // Используем small формат если есть, иначе оригинал
  const imageUrl = firstImage.formats?.small?.url || firstImage.url;

  // Добавляем базовый URL если путь относительный
  return imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`;
}

/**
 * Форматирование цены с разделителем тысяч
 * @param {number} price - Цена
 * @returns {string} - Отформатированная цена
 */
function formatPrice(price) {
  return new Intl.NumberFormat('es-ES').format(price);
}

/**
 * Получение размера товара из характеристик
 * @param {Array} sizes - Массив размеров товара
 * @returns {string} - Строка с размером
 */
function getProductSize(sizes) {
  if (!sizes || sizes.length === 0) {
    return 'XL 110x150'; // Заглушка
  }
  return sizes[0].Title || 'XL 110x150';
}

/**
 * Создание HTML-карточки товара для слайдера "Novedades"
 * @param {Object} product - Данные товара
 * @param {number|string} product.id - ID товара
 * @param {string} product.documentId - Document ID товара (Strapi)
 * @param {string} product.Title - Название товара
 * @param {string} product.Price - Цена товара
 * @param {Array} product.Media - Массив медиа-файлов
 * @param {Array} product.Sizes - Массив размеров
 * @returns {string} - HTML-разметка карточки
 */
export function createNewItemCard(product) {
  const { id, documentId, Title, Price, Media, Sizes, slug, Description } = product;
  const image = getProductImage(Media);
  const size = getProductSize(Sizes);
  const productUrl = `/catalog/product/${slug || documentId}`;

  return `
    <div class="swiper-slide new-items__swiper-slide" data-product-id="${id}" data-document-id="${documentId}" data-title="${Title}" data-price="${Price}" data-image="${image}" data-slug="${slug || documentId}" data-description="${Description || ''}">
      <a href="${productUrl}" class="new-items__image-link">
        <img
          src="${image}"
          alt="${Title}"
          class="new-items__image"
        />
      </a>
      <div class="new-items__info">
        <p class="new-items__info-title">${size}</p>
        <p class="new-items__info-subtitle">
          <span>${Title}</span>
          <span>${formatPrice(Price)}€</span>
        </p>
      </div>
      <button class="new-items__button" type="button" aria-label="Añadir al carrito">
        <img src="/assets/icons/plus.svg" alt="" />
      </button>
    </div>
  `;
}

/**
 * Рендер карточек товаров в swiper-контейнер
 * @param {HTMLElement} container - DOM-элемент swiper-wrapper
 * @param {Array} products - Массив товаров
 */
export function renderNewItemCards(container, products) {
  if (!container) {
    console.error('NewItemCard: Container not found');
    return;
  }

  container.innerHTML = products.map(createNewItemCard).join('');
  
  // Инициализируем обработчики для кнопок добавления в корзину
  initAddToCartButtons(container);
}

/**
 * Инициализация обработчиков для кнопок добавления в корзину
 * @param {HTMLElement} container - Контейнер с карточками
 */
function initAddToCartButtons(container) {
  const buttons = container.querySelectorAll('.new-items__button');
  
  buttons.forEach(button => {
    button.removeEventListener('click', handleAddToCart);
    button.addEventListener('click', handleAddToCart);
  });
}

/**
 * Обработчик клика по кнопке добавления в корзину
 * @param {Event} e - Событие клика
 */
function handleAddToCart(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const card = e.target.closest('.new-items__swiper-slide');
  if (!card) return;

  const product = {
    documentId: card.dataset.documentId,
    title: card.dataset.title,
    price: parseFloat(card.dataset.price),
    image: card.dataset.image,
    slug: card.dataset.slug,
    description: card.dataset.description || '',
    size: '',
  };

  addToCart(product, 1);
  
  // Визуальная обратная связь - меняем плюсик на галочку
  const button = e.currentTarget;
  const img = button.querySelector('img');
  const originalSrc = img.src;
  
  img.src = '/assets/icons/check.svg';
  button.classList.add('added');
  
  setTimeout(() => {
    img.src = originalSrc;
    button.classList.remove('added');
  }, 3000);
  
  // Обновляем badge корзины
  updateCartBadge();
}

/**
 * Обновление badge корзины в header
 */
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  
  import('../js/api/cart.js').then(({ getCartCount }) => {
    const count = getCartCount();
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count;
      badge.classList.add('visible');
    } else {
      badge.textContent = '';
      badge.classList.remove('visible');
    }
  });
}

export default {
  createNewItemCard,
  renderNewItemCards,
};
