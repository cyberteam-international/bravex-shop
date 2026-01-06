import { API_BASE_URL } from '../js/api/index.js';

/**
 * Получение URL изображения категории
 * @param {Object} thumbnail - Объект изображения категории
 * @returns {string} - URL изображения
 */
function getCategoryImage(thumbnail) {
  if (!thumbnail) {
    return '/assets/img/categories1.webp'; // Заглушка
  }

  // Используем medium или small формат если есть, иначе оригинал
  const imageUrl = thumbnail.formats?.medium?.url || thumbnail.formats?.small?.url || thumbnail.url;

  // Добавляем базовый URL если путь относительный
  return imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`;
}

/**
 * Создание HTML-карточки категории
 * @param {Object} category - Данные категории
 * @param {number|string} category.id - ID категории
 * @param {string} category.documentId - Document ID категории (Strapi)
 * @param {string} category.Title - Название категории
 * @param {Object} category.Thumbnail - Изображение категории
 * @returns {string} - HTML-разметка карточки
 */
export function createCategoryCard(category) {
  const { id, documentId, Title, Thumbnail } = category;
  const image = getCategoryImage(Thumbnail);

  return `
    <div class="popular-categories__card" data-category-id="${id}" data-document-id="${documentId}">
      <img
        src="${image}"
        alt="${Title || 'Category'}"
        class="popular-categories__image"
      />
      <p class="popular-categories__subtitle">${Title || ''}</p>
    </div>
  `;
}

/**
 * Рендер карточек категорий в контейнер
 * @param {HTMLElement} container - DOM-элемент контейнера
 * @param {Array} categories - Массив категорий
 */
export function renderCategoryCards(container, categories) {
  if (!container) {
    console.error('CategoryCard: Container not found');
    return;
  }

  container.innerHTML = categories.map(createCategoryCard).join('');
}

export default {
  createCategoryCard,
  renderCategoryCards,
};
