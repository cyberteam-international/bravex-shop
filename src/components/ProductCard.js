// Компонент карточки товара
function createProductCard(product) {
  return `
    <div class="swiper-slide insights__swiper-slide" data-product-id="${
      product.id
    }">
      <img
        src="${product.image}"
        alt="${product.title}"
        class="insights__image"
      />
      <div class="insights__info">
        <p>${product.title.substring(0, 20)}<span> ${
    product.category
  } </span></p>
        <span>$${product.price}</span>
      </div>
      <button class="insights__button">
        <img
          src="./assets/icons/blackArrow.svg"
          alt=""
          class="insights__image"
        />
      </button>
    </div>
  `;
}

// Загрузка товаров из API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Рендер товаров в контейнер
async function renderProducts(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error("Container not found:", containerSelector);
    return;
  }

  // Показываем лоадер
  container.innerHTML = '<div class="loading">Loading products...</div>';

  const products = await fetchProducts();

  if (products.length === 0) {
    container.innerHTML = '<div class="error">Failed to load products</div>';
    return;
  }

  // Рендерим карточки товаров
  container.innerHTML = products.map(createProductCard).join("");

  return products;
}

// Экспорт для глобального использования
window.ProductCard = {
  createProductCard,
  fetchProducts,
  renderProducts,
};
