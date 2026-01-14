/**
 * Модуль для страницы благодарности за заказ (checkout-thanks)
 */
import { clearCart } from "./api/cart.js";

/**
 * Инициализация страницы благодарности
 */
function initThankYouPage() {
  // Проверяем, есть ли информация о завершенном заказе
  const pendingOrder = sessionStorage.getItem("pendingOrder");

  if (pendingOrder) {
    try {
      const orderData = JSON.parse(pendingOrder);
      console.log("Order completed:", orderData);

      // Очищаем sessionStorage
      sessionStorage.removeItem("pendingOrder");

      // Очищаем корзину после успешной оплаты
      clearCart();
      console.log("Cart cleared after successful payment");

      // Опционально: здесь можно отправить информацию о заказе на бэкенд
      // для сохранения в базу данных
    } catch (error) {
      console.error("Error processing completed order:", error);
    }
  }

  // Получаем session_id из URL (Stripe возвращает его после оплаты)
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("session_id");

  if (sessionId) {
    console.log("Stripe session ID:", sessionId);

    // Опционально: можно отобразить ID транзакции пользователю
    // или отправить на сервер для верификации платежа
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  initThankYouPage();
});
