import { getProductBySlug, getProducts } from "./api/products.js";
import { API_BASE_URL } from "./api/index.js";
import { renderNewItemCards } from "../components/NewItemCard.js";

/**
 * Получение slug из URL
 * @returns {string|null} - slug товара или null
 */
function getSlugFromUrl() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  // URL: /catalog/product/{slug} → ["catalog", "product", "{slug}"]
  if (
    pathParts.length >= 3 &&
    pathParts[0] === "catalog" &&
    pathParts[1] === "product"
  ) {
    return pathParts[2];
  }
  return null;
}

/**
 * Получение URL изображения
 * @param {Object} media - Объект медиа
 * @returns {string} - URL изображения
 */
function getImageUrl(media) {
  if (!media) return "/assets/img/product.webp";
  const imageUrl =
    media.formats?.large?.url || media.formats?.medium?.url || media.url;
  return imageUrl.startsWith("http") ? imageUrl : `${API_BASE_URL}${imageUrl}`;
}

/**
 * Форматирование цены
 * @param {number} price - Цена
 * @returns {string} - Отформатированная цена
 */
function formatPrice(price) {
  return new Intl.NumberFormat("es-ES").format(price);
}

/**
 * Рендер галереи изображений товара
 * @param {Array} media - Массив медиа-файлов
 */
function renderGallery(media) {
  const mainSlider = document.querySelector(
    ".product__main-slider .swiper-wrapper"
  );
  const thumbsSlider = document.querySelector(
    ".product__thumbs-slider .swiper-wrapper"
  );

  if (!mainSlider || !thumbsSlider || !media || media.length === 0) return;

  const mainSlides = media
    .map(
      (item) => `
    <div class="swiper-slide">
      <img
        src="${getImageUrl(item)}"
        alt=""
        class="product__image product__image-main"
      />
    </div>
  `
    )
    .join("");

  const thumbSlides = media
    .map(
      (item) => `
    <div class="swiper-slide">
      <img
        src="${getImageUrl(item)}"
        alt=""
        class="product__image product__image-thumb"
      />
    </div>
  `
    )
    .join("");

  mainSlider.innerHTML = mainSlides;
  thumbsSlider.innerHTML = thumbSlides;

  // Обновляем swipers если они инициализированы
  if (window.productMainSwiper) {
    window.productMainSwiper.update();
  }
  if (window.productThumbsSwiper) {
    window.productThumbsSwiper.update();
  }
}

/**
 * Рендер размеров товара
 * @param {Array} sizes - Массив размеров
 */
function renderSizes(sizes) {
  const sizesList = document.querySelector(".select-sizes__list");
  if (!sizesList || !sizes || sizes.length === 0) return;

  sizesList.innerHTML = sizes
    .map(
      (size, index) => `
    <li class="select-sizes__item${index === 0 ? " active" : ""}">${
        size.Value
      }</li>
  `
    )
    .join("");
}

/**
 * Рендер характеристик товара
 * @param {Array} characteristics - Массив характеристик
 */
function renderCharacteristics(characteristics) {
  const tableEl = document.querySelector(".product__table");
  if (!tableEl) return;

  // Если характеристик нет, скрываем таблицу
  if (!characteristics || characteristics.length === 0) {
    tableEl.style.display = "none";
    return;
  }

  // Генерируем ячейки для каждой характеристики
  const cells = characteristics
    .map((char) => {
      const name = char.filter?.Name || "";
      const value = char.Value || "";
      return `
        <div class="product__cell">${name}</div>
        <div class="product__cell">${value}</div>
      `;
    })
    .join("");

  tableEl.innerHTML = cells;
  tableEl.style.display = "";
}

/**
 * Рендер данных товара на странице
 * @param {Object} product - Данные товара
 */
function renderProduct(product) {
  if (!product) {
    console.error("Product not found");
    return;
  }

  const { Title, Price, Media, Sizes, SKU, Description, Characteristics } =
    product;

  // Обновляем заголовок страницы
  document.title = `BRAVEX - ${Title}`;

  // Название товара
  const titleEl = document.querySelector(".product__title");
  if (titleEl) titleEl.textContent = Title;

  // Цена товара
  const priceEl = document.querySelector(".product__price");
  if (priceEl) priceEl.textContent = `${formatPrice(Price)} EUR`;

  // Код товара
  const skuEl = document.querySelector(".product__preview-label");
  if (skuEl && SKU) skuEl.textContent = `Código de producto: ${SKU}`;

  // Описание товара
  const descEl = document.querySelector(".product__text");
  if (descEl && Description) descEl.textContent = Description;

  // Галерея изображений
  renderGallery(Media);

  // Размеры
  renderSizes(Sizes);

  // Характеристики
  renderCharacteristics(Characteristics);
}

/**
 * Показ ошибки
 */
function showError() {
  const container = document.querySelector(".product");
  if (container) {
    container.innerHTML = `
      <div class="product__error">
        <h2>Producto no encontrado</h2>
        <p>Lo sentimos, el producto que busca no existe.</p>
        <a href="/catalog" class="button">
          <span>Volver al catálogo</span>
        </a>
      </div>
    `;
  }
}

/**
 * Загрузка и отображение товара
 */
async function loadProduct() {
  const slug = getSlugFromUrl();

  if (!slug) {
    console.error("No product slug in URL");
    showError();
    return;
  }

  try {
    const product = await getProductBySlug(slug);

    if (product) {
      console.log("Loaded product:", product);
      renderProduct(product);
      // Загружаем связанные товары
      loadRelatedProducts(product.documentId);
    } else {
      showError();
    }
  } catch (error) {
    console.error("Error loading product:", error);
    showError();
  }
}

/**
 * Загрузка и рендер связанных товаров (исключая текущий)
 * @param {string} excludeDocumentId - documentId товара для исключения
 */
async function loadRelatedProducts(excludeDocumentId) {
  const container = document.querySelector('#new-items-slider .swiper-wrapper');
  if (!container) return;

  try {
    const response = await getProducts({
      page: 1,
      pageSize: 11, // Запрашиваем 11, чтобы после исключения осталось 10
    });

    let products = response.data || [];
    
    // Исключаем текущий товар
    products = products.filter(p => p.documentId !== excludeDocumentId);
    
    // Ограничиваем до 10
    products = products.slice(0, 10);

    renderNewItemCards(container, products);

    // Обновляем swiper
    if (window.newItemsSwiper) {
      window.newItemsSwiper.update();
    }
  } catch (error) {
    console.error('Error loading related products:', error);
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  loadProduct();
});
