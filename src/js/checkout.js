/**
 * Модуль для обработки оплаты на странице checkout2
 */
import { getCart, getCartTotal, clearCart } from "./api/cart.js";

const BACKEND_URL = "http://localhost:1338";

/**
 * Форматирование цены с разделителем тысяч
 * @param {number} price - Цена
 * @returns {string} - Отформатированная цена
 */
function formatPrice(price) {
  return new Intl.NumberFormat("es-ES").format(price);
}

/**
 * Подготовка данных заказа (товары + доставка)
 * @param {Array} cartItems - Товары из корзины
 * @param {Object} shippingOption - Данные о доставке
 * @returns {Array} - Массив всех items для оплаты
 */
function prepareOrderData(cartItems, shippingOption) {
  const items = [...cartItems];

  // Добавляем доставку как отдельный item, если она платная
  if (shippingOption && shippingOption.price > 0) {
    items.push({
      name: shippingOption.name,
      price: shippingOption.price,
      quantity: 1,
      description: "Shipping cost",
    });
  }

  return items;
}

/**
 * Получение товаров из корзины в формате для Stripe/PayPal
 * @returns {Array} - Массив товаров
 */
function getCartItems() {
  const cart = getCart();

  // Преобразуем в формат, ожидаемый бэкендом
  return cart.map((item) => ({
    name: item.title || "Product",
    price: parseFloat(item.price) || 0,
    quantity: parseInt(item.quantity) || 1,
    description: item.description || item.size || "",
  }));
}

/**
 * Получение данных о доставке из summary блока
 * @returns {Object|null} - Объект с данными доставки или null
 */
function getShippingFromSummary() {
  const summaryInfo = document.querySelector(".summary__info");
  if (!summaryInfo) return null;

  const summaryRows = summaryInfo.querySelectorAll(".summary__row");

  for (const row of summaryRows) {
    const subtitle = row
      .querySelector(".summary__subtitle")
      ?.textContent.trim();
    const priceText = row.querySelector(".summary__price")?.textContent.trim();

    // Ищем строку с доставкой (не Subtotal)
    if (subtitle && subtitle !== "Subtotal" && priceText) {
      const description =
        row.querySelector(".summary__description")?.textContent.trim() || "";

      // Извлекаем цену из строки типа "$15 USD" или "$0 USD"
      const priceMatch = priceText.match(/\$?([\d,]+\.?\d*)/);
      const price = priceMatch ? parseFloat(priceMatch[1].replace(",", "")) : 0;

      return {
        name: subtitle + (description ? ` - ${description}` : ""),
        price: price,
      };
    }
  }

  return null;
}

/**
 * Оплата через Stripe Checkout
 * @param {Array} cartItems - Товары из корзины
 * @param {Object} shippingOption - Данные доставки
 */
async function payWithStripe(cartItems, shippingOption) {
  try {
    // Подготавливаем все items (товары + доставка)
    const items = prepareOrderData(cartItems, shippingOption);

    // URL для возврата пользователя после оплаты
    const currentUrl = window.location.origin;
    const successUrl = `${currentUrl}/cart/checkout-thanks/`;
    const cancelUrl = `${currentUrl}/cart/checkout2/`;

    console.log("Sending Stripe payment request:", {
      items,
      successUrl,
      cancelUrl,
    });

    // Отправляем запрос на бэкенд для создания Checkout Session
    const response = await fetch(
      `${BACKEND_URL}/api/stripe/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items,
          successUrl: successUrl,
          cancelUrl: cancelUrl,
        }),
      }
    );

    const data = await response.json();
    console.log("Stripe response:", data);

    if (!data.success) {
      throw new Error(data.error || "Failed to create checkout session");
    }

    // Сохраняем информацию о заказе перед редиректом
    sessionStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        items: cartItems,
        shipping: shippingOption,
        timestamp: Date.now(),
      })
    );

    // Перенаправляем пользователя на страницу оплаты Stripe
    console.log("Redirecting to Stripe:", data.url);
    window.location.href = data.url;
  } catch (error) {
    console.error("Stripe payment error:", error);
    alert("Error al crear la sesión de pago: " + error.message);
    throw error;
  }
}

/**
 * Оплата через PayPal
 * @param {Array} cartItems - Товары из корзины
 * @param {Object} shippingOption - Данные доставки
 */
async function payWithPayPal(cartItems, shippingOption) {
  try {
    // Подготавливаем все items (товары + доставка)
    const items = prepareOrderData(cartItems, shippingOption);

    // URL для возврата пользователя
    const currentUrl = window.location.origin;
    const successUrl = `${currentUrl}/cart/checkout-thanks/`;
    const cancelUrl = `${currentUrl}/cart/checkout2/`;

    console.log("Sending PayPal payment request:", {
      items,
      successUrl,
      cancelUrl,
    });

    // TODO: Реализовать PayPal интеграцию
    alert("PayPal integration coming soon!");
    throw new Error("PayPal not implemented yet");
  } catch (error) {
    console.error("PayPal payment error:", error);
    alert("Error al crear la sesión de PayPal: " + error.message);
    throw error;
  }
}

/**
 * Обновление summary блока с актуальными данными корзины
 */
function updateSummary() {
  const cart = getCart();
  const subtotal = getCartTotal();

  // Обновляем Subtotal
  const subtotalRow = document.querySelector(
    ".summary__info .summary__row:first-child"
  );
  if (subtotalRow) {
    const priceEl = subtotalRow.querySelector(".summary__price");
    if (priceEl) {
      priceEl.textContent = `$${formatPrice(subtotal)} USD`;
    }
  }

  // Получаем стоимость доставки
  const shipping = getShippingFromSummary();
  const shippingCost = shipping ? shipping.price : 0;

  // Обновляем Total
  const totalRow = document.querySelector(
    ".summary__content > .summary__row:last-child"
  );
  if (totalRow) {
    const priceEl = totalRow.querySelector(".summary__price");
    if (priceEl) {
      const total = subtotal + shippingCost;
      priceEl.textContent = `$${formatPrice(total)} USD`;
    }
  }
}

/**
 * Обработка нажатия на кнопку "Continuar"
 */
async function handleContinue() {
  const button = document.getElementById("continue-button");
  if (!button) return;

  // Получаем выбранный метод оплаты
  const selectedPaymentMethod = document.querySelector(
    'input[name="shipping-method"]:checked'
  )?.value;

  if (!selectedPaymentMethod) {
    alert("Por favor, selecciona un método de pago");
    return;
  }

  // Получаем товары из корзины
  const cartItems = getCartItems();

  if (!cartItems || cartItems.length === 0) {
    alert("Tu carrito está vacío");
    window.location.href = "/cart/";
    return;
  }

  // Получаем данные доставки
  const shippingOption = getShippingFromSummary();

  // Блокируем кнопку
  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Procesando...";

  try {
    // Вызываем соответствующую функцию оплаты
    if (selectedPaymentMethod === "Stripe") {
      await payWithStripe(cartItems, shippingOption);
    } else if (selectedPaymentMethod === "PayPal") {
      await payWithPayPal(cartItems, shippingOption);
    } else {
      throw new Error("Método de pago no válido");
    }
  } catch (error) {
    // Возвращаем кнопку в нормальное состояние при ошибке
    button.disabled = false;
    button.textContent = originalText;
  }
}

/**
 * Инициализация страницы checkout2
 */
function initCheckout() {
  // Проверяем, есть ли товары в корзине
  const cart = getCart();
  if (cart.length === 0) {
    // Если корзина пуста - редирект на главную страницу корзины
    console.warn("Cart is empty, redirecting to cart page");
    window.location.href = "/cart/";
    return;
  }

  // Обновляем summary
  updateSummary();

  // Добавляем обработчик на кнопку
  const button = document.getElementById("continue-button");
  if (button) {
    button.addEventListener("click", handleContinue);
  }

  console.log("Checkout page initialized");
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  initCheckout();
});
