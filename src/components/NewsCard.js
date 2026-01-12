import { API_BASE_URL } from "../js/api/index.js";

/**
 * Получение URL изображения из Thumbnail
 * @param {Object} thumbnail - Объект Thumbnail
 * @param {string} size - Размер изображения (thumbnail, small, medium, large)
 * @returns {string} - URL изображения или заглушка
 */
function getPostImage(thumbnail, size = "thumbnail") {
  if (!thumbnail) return "/assets/img/news/news1.webp";
  
  // Берём нужный размер или fallback на другие
  const imageUrl = 
    thumbnail.formats?.[size]?.url || 
    thumbnail.formats?.small?.url || 
    thumbnail.formats?.medium?.url || 
    thumbnail.url;
  
  if (!imageUrl) return "/assets/img/news/news1.webp";
  
  return imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`;
}

/**
 * Форматирование даты публикации
 * @param {string} dateString - ISO строка даты
 * @returns {string} - Отформатированная дата
 */
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Создание HTML-карточки главной новости (большие карточки)
 * @param {Object} post - Данные поста
 * @returns {string} - HTML-разметка карточки
 */
export function createMainNewsCard(post) {
  const { documentId, Title, SubTitle, Thumbnail, slug } = post;
  const image = getPostImage(Thumbnail, "large"); // Для главных карточек берём large
  const postUrl = `/blog/post/${slug || documentId}`;

  return `
    <a href="${postUrl}" class="news__card" data-post-id="${documentId}">
      <img
        src="${image}"
        alt="${Title}"
        class="news__image"
      />
      <p>${Title} <span>${SubTitle ? ` — ${SubTitle.slice(0, 60)}...` : ""}</span></p>
      <button class="news__card-button">
        <img src="/assets/icons/blackArrow.svg" alt="" />
      </button>
    </a>
  `;
}

/**
 * Создание HTML-карточки обычной новости
 * @param {Object} post - Данные поста
 * @returns {string} - HTML-разметка карточки
 */
export function createNewsCard(post) {
  const { documentId, Title, SubTitle, Thumbnail, slug } = post;
  const image = getPostImage(Thumbnail, "medium"); // Для обычных карточек берём medium
  const postUrl = `/blog/post/${slug || documentId}`;

  return `
    <a href="${postUrl}" class="news__card" data-post-id="${documentId}">
      <img
        src="${image}"
        alt="${Title}"
        class="news__image"
      />
      <p>${Title} <span>${SubTitle ? ` — ${SubTitle.slice(0, 50)}...` : ""}</span></p>
      <button class="news__card-button">
        <img src="/assets/icons/blackArrow.svg" alt="" />
      </button>
    </a>
  `;
}

/**
 * Рендер главных карточек новостей (первые 2)
 * @param {HTMLElement} container - DOM-элемент контейнера
 * @param {Array} posts - Массив постов (2 шт)
 */
export function renderMainNewsCards(container, posts) {
  if (!container) {
    console.error("NewsCard: Main container not found");
    return;
  }

  container.innerHTML = posts.map(createMainNewsCard).join("");
}

/**
 * Рендер карточек новостей в контейнер
 * @param {HTMLElement} container - DOM-элемент контейнера
 * @param {Array} posts - Массив постов
 * @param {boolean} append - Добавлять к существующим (true) или заменить (false)
 */
export function renderNewsCards(container, posts, append = false) {
  if (!container) {
    console.error("NewsCard: Container not found");
    return;
  }

  const cardsHTML = posts.map(createNewsCard).join("");

  if (append) {
    container.insertAdjacentHTML("beforeend", cardsHTML);
  } else {
    container.innerHTML = cardsHTML;
  }
}

export default {
  createMainNewsCard,
  createNewsCard,
  renderMainNewsCards,
  renderNewsCards,
};
