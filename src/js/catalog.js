import {
  getProducts,
  getProductsByCategory,
  getProductsWithFilters,
} from "./api/products.js";
import { getCategories, getCategoryBySlug } from "./api/categories.js";
import { getAllFilters, getFiltersByCategory } from "./api/filters.js";
import { renderCatalogCards } from "../components/CatalogCard.js";

// Состояние каталога
const catalogState = {
  page: 1,
  pageSize: 8, // Количество товаров на странице
  isLoading: false,
  hasMore: true, // Есть ли ещё товары для загрузки
  categorySlug: null,
  categoryTitle: null,
  filters: [],
  selectedFilters: {},
};

/**
 * Получение slug категории из URL
 * @returns {string|null} - slug категории или null
 */
function getCategorySlugFromUrl() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  // URL: /catalog/{category-slug} → ["catalog", "{category-slug}"]
  // Исключаем /catalog/product/{slug}
  if (
    pathParts.length === 2 &&
    pathParts[0] === "catalog" &&
    pathParts[1] !== "product"
  ) {
    return pathParts[1];
  }
  return null;
}

/**
 * Загрузка и рендер категорий в навигацию
 */
async function loadCategoryTabs() {
  const tabsContainer = document.querySelector(".catalog__tabs");
  if (!tabsContainer) return;

  try {
    const response = await getCategories({ page: 1, pageSize: 20 });
    const categories = response.data || [];

    // Создаём таб "Все" + табы категорий
    const allTab = `<a href="/catalog" class="catalog__tab${
      !catalogState.categorySlug ? " active" : ""
    }">Todos</a>`;

    const categoryTabs = categories
      .map((cat) => {
        const isActive = catalogState.categorySlug === cat.slug;
        return `<a href="/catalog/${cat.slug}" class="catalog__tab${
          isActive ? " active" : ""
        }">${cat.Title}</a>`;
      })
      .join("");

    tabsContainer.innerHTML = allTab + categoryTabs;
  } catch (error) {
    console.error("Error loading category tabs:", error);
  }
}

/**
 * Обновление заголовка каталога
 */
function updateCatalogTitle() {
  const titleEl = document.querySelector(".catalog__header .catalog__title");
  if (titleEl) {
    titleEl.textContent = catalogState.categoryTitle || "Todos los productos";
  }
}

/**
 * Создание HTML для одного фильтра
 * @param {Object} filter - Данные фильтра
 * @param {number} index - Индекс фильтра
 * @returns {string} - HTML разметка
 */
function createFilterHTML(filter, index) {
  const filterId = `filter-${filter.documentId}`;
  const filterSlug = filter.Name.toLowerCase().replace(/\s+/g, "-");

  const valuesHTML = filter.values
    .map(
      (value) => `
    <label class="filter__checkbox">
      <input type="checkbox" name="${filterSlug}" value="${value}" data-filter-id="${filter.documentId}" />
      <span class="filter__checkbox-mark"></span>
      <span class="filter__checkbox-label">${value}</span>
    </label>
  `
    )
    .join("");

  return `
    <div class="filter__section" data-filter-id="${filter.documentId}">
      <input
        class="filter-accordion__toggle"
        type="checkbox"
        id="${filterId}"
        ${index === 0 ? "checked" : ""}
      />
      <label class="filter__header" for="${filterId}">
        <span>${filter.Name}</span>
        <span class="filter__icon"></span>
      </label>
      <div class="filter__content">
        <div class="filter__content-inner">
          <div class="filter__content-data">
            ${valuesHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Загрузка и рендер фильтров
 */
async function loadFilters() {
  const container = document.getElementById("filters-container");
  if (!container) return;

  // Сохраняем ценовой фильтр
  const priceFilter = container.querySelector(".filter__section--price");

  try {
    let response;

    if (catalogState.categorySlug) {
      // Загружаем фильтры для конкретной категории
      response = await getFiltersByCategory(catalogState.categorySlug);
    } else {
      // Загружаем все фильтры
      response = await getAllFilters();
    }

    const filters = response.data || [];
    catalogState.filters = filters;

    // Генерируем HTML для динамических фильтров
    const filtersHTML = filters
      .map((filter, index) => createFilterHTML(filter, index))
      .join("");

    // Вставляем динамические фильтры перед ценовым
    if (priceFilter) {
      // Удаляем старые динамические фильтры
      container
        .querySelectorAll(".filter__section:not(.filter__section--price)")
        .forEach((el) => el.remove());
      // Вставляем новые перед ценовым фильтром
      priceFilter.insertAdjacentHTML("beforebegin", filtersHTML);
    } else {
      container.innerHTML = filtersHTML;
    }

    console.log("Loaded filters:", filters);
  } catch (error) {
    console.error("Error loading filters:", error);
  }
}

// Загрузка и рендер товаров
async function loadProducts(append = false) {
  const container = document.getElementById("catalog-products");
  if (!container || catalogState.isLoading) return;
  if (append && !catalogState.hasMore) return;

  catalogState.isLoading = true;

  // Показываем лоадер
  if (append) {
    // Добавляем лоадер в конец
    const loader = document.createElement('div');
    loader.className = 'catalog__loader catalog__loader--more';
    loader.innerHTML = '<span class="loader"></span>';
    container.appendChild(loader);
  } else {
    container.innerHTML =
      '<div class="catalog__loader"><span class="loader"></span></div>';
  }

  try {
    let response;
    const hasFilters = Object.keys(catalogState.selectedFilters).length > 0;

    if (hasFilters || catalogState.categorySlug) {
      // Загружаем товары с фильтрами
      response = await getProductsWithFilters({
        categorySlug: catalogState.categorySlug,
        characteristics: catalogState.selectedFilters,
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
    const pagination = response.meta?.pagination;
    
    // Проверяем, есть ли ещё товары
    if (pagination) {
      catalogState.hasMore = catalogState.page < pagination.pageCount;
    } else {
      catalogState.hasMore = products.length === catalogState.pageSize;
    }

    console.log(`Loaded page ${catalogState.page}, products:`, products.length, 'hasMore:', catalogState.hasMore);

    // Удаляем лоадер
    const loaders = container.querySelectorAll('.catalog__loader');
    loaders.forEach(l => l.remove());

    if (products.length === 0 && !append) {
      container.innerHTML = `
        <div class="catalog__empty">
          <p>No se encontraron productos</p>
        </div>
      `;
    } else if (products.length > 0) {
      if (append) {
        // Добавляем новые карточки к существующим
        renderCatalogCards(container, products, true);
      } else {
        renderCatalogCards(container, products);
      }
    }
  } catch (error) {
    console.error("Error loading products:", error);
    // Удаляем лоадер при ошибке
    const loaders = container.querySelectorAll('.catalog__loader');
    loaders.forEach(l => l.remove());
    
    if (!append) {
      container.innerHTML = `
        <div class="catalog__error">
          <p>Error al cargar los productos</p>
          <button class="button" onclick="location.reload()">Reintentar</button>
        </div>
      `;
    }
  } finally {
    catalogState.isLoading = false;
  }
}

/**
 * Загрузка следующей страницы товаров
 */
async function loadMoreProducts() {
  if (catalogState.isLoading || !catalogState.hasMore) return;
  
  catalogState.page += 1;
  await loadProducts(true);
}

/**
 * Инициализация бесконечного скролла
 * Использует Intersection Observer для отслеживания появления секции .advantages
 */
function initInfiniteScroll() {
  const advantagesSection = document.querySelector('.advantages');
  
  if (!advantagesSection) {
    console.warn('Infinite scroll: .advantages section not found');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Когда секция .advantages появляется на экране — подгружаем товары
        if (entry.isIntersecting && !catalogState.isLoading && catalogState.hasMore) {
          loadMoreProducts();
        }
      });
    },
    {
      // Срабатывает когда секция появляется на 1px в viewport
      rootMargin: '100px', // Немного заранее, для плавности
      threshold: 0,
    }
  );

  observer.observe(advantagesSection);
  
  // Сохраняем observer в состояние для возможности отключения
  catalogState.infiniteScrollObserver = observer;
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
      console.error("Error loading category:", error);
    }
  }

  // Обновляем заголовок
  updateCatalogTitle();

  // Загружаем табы категорий
  await loadCategoryTabs();

  // Загружаем фильтры
  await loadFilters();

  // Инициализируем обработчики фильтров
  initFilterHandlers();

  // Инициализируем бесконечный скролл
  initInfiniteScroll();

  // Загружаем товары
  await loadProducts();
}

/**
 * Сбор выбранных фильтров из чекбоксов
 * @returns {Object} - Объект с выбранными характеристиками {documentId: [values]}
 */
function collectSelectedFilters() {
  const selectedFilters = {};
  const checkboxes = document.querySelectorAll(
    "#filters-container .filter__checkbox input:checked"
  );

  checkboxes.forEach((checkbox) => {
    const filterId = checkbox.dataset.filterId;
    const value = checkbox.value;

    if (!selectedFilters[filterId]) {
      selectedFilters[filterId] = [];
    }
    selectedFilters[filterId].push(value);
  });

  return selectedFilters;
}

/**
 * Применение фильтров
 */
async function applyFilters() {
  // Собираем выбранные фильтры
  catalogState.selectedFilters = collectSelectedFilters();
  catalogState.page = 1; // Сбрасываем на первую страницу
  catalogState.hasMore = true; // Сбрасываем флаг пагинации

  console.log("Applying filters:", catalogState.selectedFilters);

  // Загружаем товары с фильтрами
  await loadProducts();

  // Закрываем мобильное меню фильтров если открыто
  document.body.classList.remove("filter-open");
}

/**
 * Сброс фильтров
 */
async function resetFilters() {
  // Снимаем все чекбоксы
  const checkboxes = document.querySelectorAll(
    "#filters-container .filter__checkbox input:checked"
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Очищаем выбранные фильтры
  catalogState.selectedFilters = {};
  catalogState.page = 1;
  catalogState.hasMore = true; // Сбрасываем флаг пагинации

  // Загружаем товары без фильтров
  await loadProducts();
}

/**
 * Инициализация обработчиков фильтров
 */
function initFilterHandlers() {
  // Обработчик кнопки "Aplicar"
  const applyButton = document.querySelector(".filter__apply");
  if (applyButton) {
    applyButton.addEventListener("click", (e) => {
      e.preventDefault();
      applyFilters();
    });
  }
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
