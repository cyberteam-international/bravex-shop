import { getProducts } from './api/products.js';
import { getCollections } from './api/collections.js';
import { getCategories } from './api/categories.js';
import { renderNewItemCards } from '../components/NewItemCard.js';
import { renderCollectionCards } from '../components/CollectionCard.js';
import { renderCategoryCards } from '../components/CategoryCard.js';

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

/**
 * Загрузка и рендер коллекций (insights) на главной странице
 */
async function loadCollections() {
  const container = document.querySelector('#insights-slider .swiper-wrapper');
  if (!container) return;

  try {
    const response = await getCollections({
      page: 1,
      pageSize: 10,
    });

    const collections = response.data || [];
    renderCollectionCards(container, collections);

    // Инициализируем/обновляем swiper после загрузки коллекций
    if (window.insightsSwiper) {
      window.insightsSwiper.update();
    }
  } catch (error) {
    console.error('Error loading collections:', error);
  }
}

/**
 * Загрузка и рендер категорий на главной странице
 */
async function loadCategories() {
  const container = document.querySelector('.popular-categories__content');
  if (!container) return;

  try {
    const response = await getCategories({
      page: 1,
      pageSize: 8,
    });

    const categories = response.data || [];
    renderCategoryCards(container, categories);
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadNewItems();
  loadCollections();
  loadCategories();
});
