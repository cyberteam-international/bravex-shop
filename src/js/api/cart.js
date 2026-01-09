/**
 * Модуль для работы с корзиной (localStorage)
 */

const CART_STORAGE_KEY = 'bravex_cart';

/**
 * Получить корзину из localStorage
 * @returns {Array} - Массив товаров в корзине
 */
export function getCart() {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
}

/**
 * Сохранить корзину в localStorage
 * @param {Array} cart - Массив товаров
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Диспатчим событие для обновления UI
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

/**
 * Добавить товар в корзину
 * @param {Object} product - Данные товара
 * @param {string} product.documentId - Document ID товара
 * @param {string} product.title - Название товара
 * @param {number} product.price - Цена товара
 * @param {string} product.image - URL изображения
 * @param {string} product.slug - Slug товара
 * @param {string} product.size - Размер (опционально)
 * @param {string} product.description - Описание (опционально)
 * @param {number} quantity - Количество (по умолчанию 1)
 * @returns {boolean} - Успешно ли добавлено
 */
export function addToCart(product, quantity = 1) {
  const cart = getCart();
  
  // Проверяем, есть ли уже такой товар с таким же размером
  const existingIndex = cart.findIndex(
    item => item.documentId === product.documentId && item.size === product.size
  );

  if (existingIndex !== -1) {
    // Увеличиваем количество
    cart[existingIndex].quantity += quantity;
  } else {
    // Добавляем новый товар
    cart.push({
      documentId: product.documentId,
      title: product.title,
      price: product.price,
      image: product.image,
      slug: product.slug,
      size: product.size || '',
      description: product.description || '',
      quantity: quantity,
      addedAt: Date.now(),
    });
  }

  saveCart(cart);
  console.log('Added to cart:', product.title, 'Quantity:', quantity);
  return true;
}

/**
 * Удалить товар из корзины
 * @param {string} documentId - Document ID товара
 * @param {string} size - Размер товара (опционально)
 * @returns {boolean} - Успешно ли удалено
 */
export function removeFromCart(documentId, size = null) {
  const cart = getCart();
  
  const newCart = cart.filter(item => {
    if (size !== null) {
      return !(item.documentId === documentId && item.size === size);
    }
    return item.documentId !== documentId;
  });

  saveCart(newCart);
  console.log('Removed from cart:', documentId);
  return true;
}

/**
 * Обновить количество товара в корзине
 * @param {string} documentId - Document ID товара
 * @param {number} quantity - Новое количество
 * @param {string} size - Размер товара (опционально)
 * @returns {boolean} - Успешно ли обновлено
 */
export function updateQuantity(documentId, quantity, size = null) {
  const cart = getCart();
  
  const item = cart.find(item => {
    if (size !== null) {
      return item.documentId === documentId && item.size === size;
    }
    return item.documentId === documentId;
  });

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(documentId, size);
    }
    item.quantity = quantity;
    saveCart(cart);
    return true;
  }

  return false;
}

/**
 * Очистить корзину
 */
export function clearCart() {
  saveCart([]);
  console.log('Cart cleared');
}

/**
 * Получить количество товаров в корзине
 * @returns {number} - Общее количество товаров
 */
export function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Получить общую сумму корзины
 * @returns {number} - Общая сумма
 */
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Проверить, есть ли товар в корзине
 * @param {string} documentId - Document ID товара
 * @returns {boolean}
 */
export function isInCart(documentId) {
  const cart = getCart();
  return cart.some(item => item.documentId === documentId);
}

export default {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartCount,
  getCartTotal,
  isInCart,
};
