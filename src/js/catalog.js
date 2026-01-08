import { getProducts, getProductsByCategory } from "./api/products.js";
import { getCategories, getCategoryBySlug } from "./api/categories.js";
import { renderCatalogCards } from "../components/CatalogCard.js";

// Состояние каталога
const catalogState = {
  page: 1,
  pageSize: 20,
  isLoading: false,
  categorySlug: null,
  categoryTitle: null,
};

/**
 * Получение slug категории из URL
 * @returns {string|null} - slug категории или null
 */
function getCategorySlugFromUrl() {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  // URL: /catalog/{category-slug} → ["catalog", "{category-slug}"]
  // Исключаем /catalog/product/{slug}
  if (pathParts.length === 2 && pathParts[0] === 'catalog' && pathParts[1] !== 'product') {
    return pathParts[1];
  }
  return null;
}

/**
 * Загрузка и рендер категорий в навигацию
 */
async function loadCategoryTabs() {
  const tabsContainer = document.querySelector('.catalog__tabs');
  if (!tabsContainer) return;

  try {
    const response = await getCategories({ page: 1, pageSize: 20 });
    const categories = response.data || [];

    // Создаём таб "Все" + табы категорий
    const allTab = `<a href="/catalog" class="catalog__tab${!catalogState.categorySlug ? ' active' : ''}">Todos</a>`;
    
    const categoryTabs = categories.map(cat => {
      const isActive = catalogState.categorySlug === cat.slug;
      return `<a href="/catalog/${cat.slug}" class="catalog__tab${isActive ? ' active' : ''}">${cat.Title}</a>`;
    }).join('');

    tabsContainer.innerHTML = allTab + categoryTabs;
  } catch (error) {
    console.error('Error loading category tabs:', error);
  }
}

/**
 * Обновление заголовка каталога
 */
function updateCatalogTitle() {
  const titleEl = document.querySelector('.catalog__header .catalog__title');
  if (titleEl) {
    titleEl.textContent = catalogState.categoryTitle || 'CATÁLOGO';
  }
}

// Загрузка и рендер товаров
async function loadProducts() {
  const container = document.getElementById("catalog-products");
  if (!container || catalogState.isLoading) return;

  catalogState.isLoading = true;

  try {
    let response;
    
    if (catalogState.categorySlug) {
      // Загружаем товары конкретной категории
      response = await getProductsByCategory(catalogState.categorySlug, {
        page: catalogState.page,
        pageSize: catalogState.pageSize,
      });
    } else {
      // Загружаем все товары
      response = await getProducts({
        page: catalogState.page,
        pageSize: catalogState.pageSize,
      });
    }

    const products = response.data || [];
    console.log("Loaded products:", products);
    renderCatalogCards(container, products);
  } catch (error) {
    console.error("Error loading products:", error);
    container.innerHTML = `
      <div class="catalog__error">
        <p>Error al cargar los productos</p>
        <button class="button" onclick="location.reload()">Reintentar</button>
      </div>
    `;
  } finally {
    catalogState.isLoading = false;
  }
}

/**
 * Инициализация каталога
 */
async function initCatalog() {
  // Определяем текущую категорию из URL
  catalogState.categorySlug = getCategorySlugFromUrl();

  // Если есть slug категории, получаем её название
  if (catalogState.categorySlug) {
    try {
      const category = await getCategoryBySlug(catalogState.categorySlug);
      if (category) {
        catalogState.categoryTitle = category.Title;
      }
    } catch (error) {
      console.error('Error loading category:', error);
    }
  }

  // Обновляем заголовок
  updateCatalogTitle();

  // Загружаем табы категорий
  await loadCategoryTabs();

  // Загружаем товары
  await loadProducts();
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  initCatalog();
});

//filterModal
const filterButton = document.querySelector(".catalog__filter-button");
const filter = document.querySelector(".catalog__filter");

filterButton?.addEventListener("click", () => {
  document.body.classList.add("filter-open");
});

document.addEventListener("click", (e) => {
  if (
    document.body.classList.contains("filter-open") &&
    !filter.contains(e.target) &&
    !e.target.closest(".catalog__filter-button")
  ) {
    document.body.classList.remove("filter-open");
  }

  if (
    document.body.classList.contains("filter-open") &&
    e.target === filter &&
    e.offsetX > filter.offsetWidth - 50 &&
    e.offsetY < 50
  ) {
    document.body.classList.remove("filter-open");
  }
});
