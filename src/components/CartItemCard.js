import { removeFromCart } from "../js/api/cart.js";

/**
 * Форматирование цены с разделителем тысяч
 * @param {number} price - Цена
 * @returns {string} - Отформатированная цена
 */
function formatPrice(price) {
  return new Intl.NumberFormat("es-ES").format(price);
}

/**
 * Создание HTML-карточки товара для корзины
 * @param {Object} item - Данные товара из корзины
 * @returns {string} - HTML-разметка карточки
 */
export function createCartItemCard(item) {
  const { documentId, title, price, image, slug, size, description, quantity } =
    item;
  const productUrl = `/catalog/product/${slug || documentId}`;
  const totalPrice = price * quantity;

  return `
    <div class="cart-item" data-document-id="${documentId}" data-size="${
    size || ""
  }">
      <a href="${productUrl}" class="cart-item__image-link">
        <img
          src="${image}"
          alt="${title}"
          class="cart-item__image"
        />
      </a>
      <div class="cart-item__info">
        <div class="cart-item__header">
          <a href="${productUrl}" class="cart-item__title">${title}</a>
          <button class="cart-item__button cart-item__remove" type="button" aria-label="Eliminar">
            <img src="/assets/icons/circleCross.svg" alt="remove" />
          </button>
        </div>
        <p class="cart-item__details">${description || ""}</p>
        <div class="cart-item__footer">
          <span class="cart-item__subtitle">${size ? size : ""} ${
    quantity > 1 ? `x${quantity}` : ""
  }</span>
          <p class="cart-item__price">${formatPrice(totalPrice)}€</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Рендер товаров корзины в контейнер
 * @param {HTMLElement} container - DOM-элемент контейнера
 * @param {Array} items - Массив товаров из корзины
 */
export function renderCartItems(container, items) {
  if (!container) {
    console.error("CartItemCard: Container not found");
    return;
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart__empty">
        <p style="margin-bottom: 20px;">Tu carrito está vacío</p>
        <a href="/catalog" class="button">
          <span>Ir al catálogo</span>
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(createCartItemCard).join("");

  // Инициализируем обработчики для кнопок удаления
  initRemoveButtons(container);
}

/**
 * Инициализация обработчиков для кнопок удаления
 * @param {HTMLElement} container - Контейнер с карточками
 */
function initRemoveButtons(container) {
  const buttons = container.querySelectorAll(".cart-item__remove");

  buttons.forEach((button) => {
    button.addEventListener("click", handleRemoveFromCart);
  });
}

/**
 * Обработчик клика по кнопке удаления из корзины
 * @param {Event} e - Событие клика
 */
function handleRemoveFromCart(e) {
  e.preventDefault();

  const card = e.target.closest(".cart-item");
  if (!card) return;

  const documentId = card.dataset.documentId;
  const size = card.dataset.size || null;

  removeFromCart(documentId, size);

  // Удаляем карточку из DOM с анимацией
  card.style.transition = "opacity 0.3s, transform 0.3s";
  card.style.opacity = "0";
  card.style.transform = "translateX(-20px)";

  setTimeout(() => {
    card.remove();

    // Проверяем, остались ли товары
    const container = document.querySelector(".cart__items");
    if (container && container.children.length === 0) {
      container.innerHTML = `
        <div class="cart__empty">
          <p style="margin-bottom: 20px;">Tu carrito está vacío</p>
          <a href="/catalog" class="button">
            <span>Ir al catálogo</span>
          </a>
        </div>
      `;
    }
  }, 300);
}

export default {
  createCartItemCard,
  renderCartItems,
};
