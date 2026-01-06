import { getProducts } from "./api/products.js";
import { renderCatalogCards } from "../components/CatalogCard.js";

// Состояние каталога
const catalogState = {
  page: 1,
  pageSize: 20,
  isLoading: false,
};

// Загрузка и рендер товаров
async function loadProducts() {
  const container = document.getElementById("catalog-products");
  if (!container || catalogState.isLoading) return;

  catalogState.isLoading = true;

  try {
    const response = await getProducts({
      page: catalogState.page,
      pageSize: catalogState.pageSize,
    });

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

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

const tabsSwiper = new Swiper("#catalog__navigation-swiper", {
  slidesPerView: "auto",
  spaceBetween: 20,
  initialSlide: 0,

  navigation: {
    nextEl: ".catalog__navigation-button_next",
    prevEl: ".catalog__navigation-button_prev",
  },

  breakpoints: {
    992: {
      allowTouchMove: false,
      freeMode: false,
    },
  },
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
