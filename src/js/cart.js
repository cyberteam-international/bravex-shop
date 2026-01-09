import { getCart, getCartTotal, getCartCount } from "./api/cart.js";
import { renderCartItems } from "../components/CartItemCard.js";

/**
 * Форматирование цены с разделителем тысяч
 * @param {number} price - Цена
 * @returns {string} - Отформатированная цена
 */
function formatPrice(price) {
  return new Intl.NumberFormat("es-ES").format(price);
}

/**
 * Обновление итоговой суммы в summary
 */
function updateSummary() {
  const cart = getCart();
  const total = getCartTotal();
  
  // Обновляем Total parcial
  const subtotalEl = document.querySelector('.summary__row:first-child .summary__price');
  if (subtotalEl) {
    subtotalEl.textContent = `${formatPrice(total)}€`;
  }
  
  // Обновляем Total
  const totalEl = document.querySelector('.summary__content > .summary__row:last-child .summary__price');
  if (totalEl) {
    totalEl.textContent = `${formatPrice(total)}€`;
  }

  // Скрываем/показываем кнопку checkout
  const checkoutBtn = document.querySelector('.summary__button');
  if (checkoutBtn) {
    if (cart.length === 0) {
      checkoutBtn.style.display = 'none';
    } else {
      checkoutBtn.style.display = 'flex';
    }
  }
}

/**
 * Загрузка и отображение товаров корзины
 */
function loadCartItems() {
  const container = document.querySelector('.cart__items');
  if (!container) return;

  const cart = getCart();
  renderCartItems(container, cart);
  updateSummary();
}

/**
 * Инициализация страницы корзины
 */
function initCart() {
  loadCartItems();

  // Слушаем обновления корзины
  window.addEventListener('cartUpdated', () => {
    updateSummary();
  });
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  initCart();
});
