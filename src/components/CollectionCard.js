import { API_BASE_URL } from "../js/api/index.js";

/**
 * Получение URL превью изображения коллекции
 * @param {Object} cover - Объект обложки коллекции
 * @returns {string} - URL изображения
 */
function getCollectionImage(cover) {
  if (!cover) {
    return "/assets/img/insights1.webp"; // Заглушка
  }

  // Используем medium или small формат если есть, иначе оригинал
  const imageUrl =
    cover.formats?.medium?.url || cover.formats?.small?.url || cover.url;

  // Добавляем базовый URL если путь относительный
  return imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`;
}

/**
 * Создание HTML-карточки коллекции для слайдера "Insights"
 * @param {Object} collection - Данные коллекции
 * @param {number|string} collection.id - ID коллекции
 * @param {string} collection.documentId - Document ID коллекции (Strapi)
 * @param {string} collection.Title - Название коллекции
 * @param {string} collection.Description - Описание коллекции
 * @param {Object} collection.Cover - Обложка коллекции
 * @returns {string} - HTML-разметка карточки
 */
export function createCollectionCard(collection) {
  const { id, documentId, Title, Description, Thumbnail } = collection;
  const image = getCollectionImage(Thumbnail);

  // Разбиваем название на части для стилизации
  const titleParts = Title ? Title.split(" ") : ["New", "collection"];
  const firstPart = titleParts.slice(0, 2).join(" ");
  const secondPart = titleParts.slice(2).join(" ");

  return `
    <div class="swiper-slide insights__swiper-slide" data-collection-id="${id}" data-document-id="${documentId}">
      <img
        src="${image}"
        alt="${Title || "Collection"}"
        class="insights__image"
      />
      <div class="insights__info">
        <p>${firstPart} <span>${secondPart ? " " + secondPart : ""}</span></p>
        <span>${Description || ""}</span>
      </div>
      <button class="insights__button">
        <img
          src="/assets/icons/blackArrow.svg"
          alt=""
          class="insights__image"
        />
      </button>
    </div>
  `;
}

/**
 * Рендер карточек коллекций в swiper-контейнер
 * @param {HTMLElement} container - DOM-элемент swiper-wrapper
 * @param {Array} collections - Массив коллекций
 */
export function renderCollectionCards(container, collections) {
  if (!container) {
    console.error("CollectionCard: Container not found");
    return;
  }

  container.innerHTML = collections.map(createCollectionCard).join("");
}

export default {
  createCollectionCard,
  renderCollectionCards,
};
