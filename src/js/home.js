import { getProducts } from './api/products.js';
import { renderNewItemCards } from '../components/NewItemCard.js';

/**
 * Загрузка и рендер новинок на главной странице
 */
async function loadNewItems() {
  const container = document.querySelector('#new-items-slider .swiper-wrapper');
  if (!container) return;

  try {
    const response = await getProducts({
      page: 1,
      pageSize: 10,
    });

    const products = response.data || [];
    renderNewItemCards(container, products);

    // Инициализируем/обновляем swiper после загрузки товаров
    if (window.newItemsSwiper) {
      window.newItemsSwiper.update();
    }
  } catch (error) {
    console.error('Error loading new items:', error);
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadNewItems();
});
