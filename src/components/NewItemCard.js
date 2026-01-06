import { API_BASE_URL } from '../js/api/index.js';

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
  const { id, documentId, Title, Price, Media, Sizes } = product;
  const image = getProductImage(Media);
  const size = getProductSize(Sizes);

  return `
    <div class="swiper-slide new-items__swiper-slide" data-product-id="${id}" data-document-id="${documentId}">
      <img
        src="${image}"
        alt="${Title}"
        class="new-items__image"
      />
      <div class="new-items__info">
        <p class="new-items__info-title">${size}</p>
        <p class="new-items__info-subtitle">
          <span>${Title}</span>
          <span>${formatPrice(Price)}€</span>
        </p>
      </div>
      <button class="new-items__button">
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
}

export default {
  createNewItemCard,
  renderNewItemCards,
};
