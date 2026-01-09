import { API_BASE_URL } from "../js/api/index.js";

/**
 * Получение URL превью изображения товара
 * @param {Array} media - Массив медиа-файлов
 * @returns {string} - URL изображения
 */
function getProductImage(media) {
  if (!media || media.length === 0) {
    return "/assets/img/itemsSlider1.webp"; // Заглушка
  }

  const firstImage = media[0];
  // Используем small формат если есть, иначе оригинал
  const imageUrl = firstImage.formats?.small?.url || firstImage.url;

  // Добавляем базовый URL если путь относительный
  return imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`;
}

/**
 * Создание HTML-карточки товара для каталога
 * @param {Object} product - Данные товара
 * @param {number|string} product.id - ID товара
 * @param {string} product.documentId - Document ID товара (Strapi)
 * @param {string} product.Title - Название товара
 * @param {string} product.Price - Цена товара
 * @param {Array} product.Media - Массив медиа-файлов
 * @returns {string} - HTML-разметка карточки
 */
export function createCatalogCard(product) {
  const { id, documentId, Title, Price, Media, slug } = product;
  const image = getProductImage(Media);
  const productUrl = `/catalog/product/${slug || documentId}`;

  return `
    <a href="${productUrl}" class="catalog-card" data-product-id="${id}" data-document-id="${documentId}">
      <div class="catalog-card__image">
        <img src="${image}" alt="${Title}" />
      </div>
      <div class="catalog-card__info">
        <p class="catalog-card__info-title">${Title}</p>
        <span>${formatPrice(Price)}€</span>
        <button class="button catalog-card__button">
          <span>Más detalles</span>
        </button>
      </div>
      <button class="catalog-card__plus-button">
        <img src="/assets/icons/plus.svg" alt="" />
      </button>
    </a>
  `;
}

/**
 * Форматирование цены с разделителем тысяч
 * @param {number} price - Цена
 * @returns {string} - Отформатированная цена
 */
function formatPrice(price) {
  return new Intl.NumberFormat("es-ES").format(price);
}

/**
 * Рендер карточек товаров в контейнер
 * @param {HTMLElement} container - DOM-элемент контейнера
 * @param {Array} products - Массив товаров
 * @param {boolean} append - Добавлять к существующим (true) или заменить (false)
 */
export function renderCatalogCards(container, products, append = false) {
  if (!container) {
    console.error("CatalogCard: Container not found");
    return;
  }

  const cardsHTML = products.map(createCatalogCard).join("");
  
  if (append) {
    container.insertAdjacentHTML("beforeend", cardsHTML);
  } else {
    container.innerHTML = cardsHTML;
  }
}

export default {
  createCatalogCard,
  renderCatalogCards,
};
