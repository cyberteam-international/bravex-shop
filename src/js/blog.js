import { getPosts } from "./api/posts.js";
import { renderMainNewsCards, renderNewsCards } from "../components/NewsCard.js";

// Состояние страницы блога
const blogState = {
  page: 1,
  pageSize: 8,
  isLoading: false,
  hasMore: true,
  isFirstLoad: true, // Первая загрузка (включает главные карточки)
};

/**
 * Загрузка и рендер главных новостей (первые 2)
 */
async function loadMainPosts() {
  const container = document.querySelector(".news__main-section");
  if (!container) return [];

  try {
    const response = await getPosts({
      page: 1,
      pageSize: 2,
    });

    const posts = response.data || [];
    
    if (posts.length > 0) {
      renderMainNewsCards(container, posts);
    } else {
      container.innerHTML = '<p class="news__empty">No hay noticias principales</p>';
    }

    return posts;
  } catch (error) {
    console.error("Error loading main posts:", error);
    container.innerHTML = '<p class="news__error">Error al cargar noticias</p>';
    return [];
  }
}

/**
 * Загрузка и рендер остальных новостей
 * @param {boolean} append - Добавлять к существующим
 */
async function loadPosts(append = false) {
  const container = document.querySelector(".all-news__wrapper");
  if (!container || blogState.isLoading) return;
  if (append && !blogState.hasMore) return;

  blogState.isLoading = true;

  // Показываем лоадер
  if (append) {
    const loader = document.createElement("div");
    loader.className = "news__loader news__loader--more";
    loader.innerHTML = '<span class="loader"></span>';
    container.appendChild(loader);
  } else {
    container.innerHTML = '<div class="news__loader"><span class="loader"></span></div>';
  }

  try {
    // Запрашиваем с учётом offset (первые 2 уже показаны в main-section)
    const offset = 2;
    const effectivePage = blogState.page;
    const effectivePageSize = blogState.pageSize;
    
    // Для первой страницы пропускаем первые 2 поста
    const response = await getPosts({
      page: effectivePage,
      pageSize: effectivePageSize,
    });

    let posts = response.data || [];
    const pagination = response.meta?.pagination;

    // На первой странице пропускаем первые 2 (они в main-section)
    if (blogState.isFirstLoad && blogState.page === 1) {
      posts = posts.slice(2);
      blogState.isFirstLoad = false;
    }

    // Проверяем, есть ли ещё посты
    if (pagination) {
      blogState.hasMore = blogState.page < pagination.pageCount;
    } else {
      blogState.hasMore = posts.length === effectivePageSize;
    }

    console.log(`Loaded page ${blogState.page}, posts:`, posts.length, "hasMore:", blogState.hasMore);

    // Удаляем лоадер
    const loaders = container.querySelectorAll(".news__loader");
    loaders.forEach((l) => l.remove());

    if (posts.length === 0 && !append) {
      container.innerHTML = '<p class="news__empty">No hay más noticias</p>';
    } else if (posts.length > 0) {
      renderNewsCards(container, posts, append);
    }
  } catch (error) {
    console.error("Error loading posts:", error);
    const loaders = container.querySelectorAll(".news__loader");
    loaders.forEach((l) => l.remove());

    if (!append) {
      container.innerHTML = `
        <div class="news__error">
          <p>Error al cargar las noticias</p>
          <button class="button" onclick="location.reload()">Reintentar</button>
        </div>
      `;
    }
  } finally {
    blogState.isLoading = false;
  }
}

/**
 * Загрузка следующей страницы постов
 */
async function loadMorePosts() {
  if (blogState.isLoading || !blogState.hasMore) return;

  blogState.page += 1;
  await loadPosts(true);
}

/**
 * Инициализация бесконечного скролла
 * Использует Intersection Observer для отслеживания появления секции .new-collection
 */
function initInfiniteScroll() {
  const triggerSection = document.querySelector(".new-collection");

  if (!triggerSection) {
    console.warn("Infinite scroll: .new-collection section not found");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !blogState.isLoading && blogState.hasMore) {
          loadMorePosts();
        }
      });
    },
    {
      rootMargin: "100px",
      threshold: 0,
    }
  );

  observer.observe(triggerSection);
  blogState.infiniteScrollObserver = observer;
}

/**
 * Инициализация страницы блога
 */
async function initBlog() {
  // Загружаем главные новости (первые 2)
  await loadMainPosts();

  // Загружаем остальные новости
  await loadPosts();

  // Инициализируем бесконечный скролл
  initInfiniteScroll();
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  initBlog();
});
