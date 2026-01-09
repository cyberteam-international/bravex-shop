import { API_BASE_URL } from "../js/api/index.js";
import { addToCart } from "../js/api/cart.js";

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
  const { id, documentId, Title, Price, Media, slug, Description } = product;
  const image = getProductImage(Media);
  const productUrl = `/catalog/product/${slug || documentId}`;

  return `
    <div class="catalog-card" data-product-id="${id}" data-document-id="${documentId}" data-title="${Title}" data-price="${Price}" data-image="${image}" data-slug="${slug || documentId}" data-description="${Description || ''}">
      <a href="${productUrl}" class="catalog-card__image">
        <img src="${image}" alt="${Title}" />
      </a>
      <div class="catalog-card__info">
        <p class="catalog-card__info-title">${Title}</p>
        <span>${formatPrice(Price)}€</span>
        <a href="${productUrl}" class="button catalog-card__button">
          <span>Más detalles</span>
        </a>
      </div>
      <button class="catalog-card__plus-button" type="button" aria-label="Añadir al carrito">
        <img src="/assets/icons/plus.svg" alt="" />
      </button>
    </div>
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

  // Инициализируем обработчики для кнопок добавления в корзину
  initAddToCartButtons(container);
}

/**
 * Инициализация обработчиков для кнопок добавления в корзину
 * @param {HTMLElement} container - Контейнер с карточками
 */
function initAddToCartButtons(container) {
  const buttons = container.querySelectorAll('.catalog-card__plus-button');
  
  buttons.forEach(button => {
    // Удаляем старый обработчик если есть
    button.removeEventListener('click', handleAddToCart);
    // Добавляем новый
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
  
  const card = e.target.closest('.catalog-card');
  if (!card) return;

  const product = {
    documentId: card.dataset.documentId,
    title: card.dataset.title,
    price: parseFloat(card.dataset.price),
    image: card.dataset.image,
    slug: card.dataset.slug,
    description: card.dataset.description || '',
    size: '', // Из каталога добавляем без размера
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
  
  // Импортируем динамически чтобы избежать циклических зависимостей
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
  createCatalogCard,
  renderCatalogCards,
};
