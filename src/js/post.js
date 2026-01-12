import { getPostBySlug, getPosts } from "./api/posts.js";
import { API_BASE_URL } from "./api/index.js";
import { renderNewsCards } from "../components/NewsCard.js";
/**
 * Загрузка и рендер последних новостей (кроме текущей)
 * @param {string} currentSlug - slug текущей новости
 */
async function loadRelatedNews(currentSlug) {
  const sliderWrapper = document.querySelector(".insights__swiper-wrapper");
  if (!sliderWrapper) return;

  try {
    // Получаем 9 новостей (на случай если текущая попала в топ-8)
    const response = await getPosts({ page: 1, pageSize: 9 });
    let posts = response.data || [];
    // Исключаем текущий пост по slug
    posts = posts.filter(post => post.slug !== currentSlug);
    // Оставляем только 8
    posts = posts.slice(0, 8);

    // Очищаем слайдер
    sliderWrapper.innerHTML = "";
    // Рендерим карточки как слайды
    posts.forEach(post => {
      const cardHTML = `
        <div class="swiper-slide insights__swiper-slide">
          <a href="/blog/post/${post.slug}" class="insights__card-link">
            <img src="${post.Thumbnail?.formats?.medium?.url ? (post.Thumbnail.formats.medium.url.startsWith('http') ? post.Thumbnail.formats.medium.url : API_BASE_URL + post.Thumbnail.formats.medium.url) : '/assets/img/news/news1.webp'}" alt="${post.Title}" class="insights__image" />
            <div class="insights__info">
              <p>${post.Title}${post.SubTitle ? `<span> — ${post.SubTitle.slice(0, 40)}...</span>` : ""}</p>
              <span>${post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : ""}</span>
            </div>
            <button class="insights__button">
              <img src="/assets/icons/blackArrow.svg" alt="" class="insights__image" />
            </button>
          </a>
        </div>
      `;
      sliderWrapper.insertAdjacentHTML("beforeend", cardHTML);
    });
  } catch (error) {
    console.error("Error loading related news for slider:", error);
    sliderWrapper.innerHTML = '<p class="insights__error">Error al cargar noticias</p>';
  }
}

/**
 * Получение slug из URL
 * @returns {string|null} - slug поста или null
 */
function getSlugFromUrl() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  // URL: /blog/post/{slug} → ["blog", "post", "{slug}"]
  if (
    pathParts.length >= 3 &&
    pathParts[0] === "blog" &&
    pathParts[1] === "post"
  ) {
    return pathParts[2];
  }
  return null;
}

/**
 * Получение URL изображения
 * @param {Object} thumbnail - Объект Thumbnail
 * @param {string} size - Размер (large, medium, small)
 * @returns {string} - URL изображения
 */
function getImageUrl(thumbnail, size = "large") {
  if (!thumbnail) return "/assets/img/singleNews1.webp";
  
  const imageUrl = 
    thumbnail.formats?.[size]?.url || 
    thumbnail.formats?.large?.url || 
    thumbnail.formats?.medium?.url || 
    thumbnail.url;
  
  if (!imageUrl) return "/assets/img/singleNews1.webp";
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
 * Парсинг markdown контента в HTML
 * @param {string} content - Markdown контент
 * @returns {string} - HTML контент
 */
function parseMarkdownContent(content) {
  if (!content) return "";

  let html = content;

  // Заменяем заголовки #...# на <p class="single-news__title">
  html = html.replace(/#([^#]+)#/g, '<p class="single-news__section-title">$1</p>');

  // Заменяем изображения ![alt](url) на <img>
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    return `<img src="${fullUrl}" alt="${alt}" class="single-news__content-image" />`;
  });

  // Заменяем двойные переносы на параграфы
  const paragraphs = html.split(/\n\n+/);
  html = paragraphs
    .map((p) => {
      p = p.trim();
      if (!p) return "";
      // Если это уже тег (img или title), не оборачиваем
      if (p.startsWith("<")) return p;
      // Заменяем одиночные переносы на <br>
      p = p.replace(/\n/g, "<br />");
      return `<p class="single-news__article-text">${p}</p>`;
    })
    .filter(Boolean)
    .join("\n");

  return html;
}

/**
 * Рендер данных поста на странице
 * @param {Object} post - Данные поста
 */
function renderPost(post) {
  if (!post) {
    console.error("Post not found");
    return;
  }

  const { Title, SubTitle, Content, Thumbnail, publishedAt } = post;

  // Обновляем заголовок страницы
  document.title = `BRAVEX - ${Title}`;

  // Breadcrumbs - название поста
  const breadcrumbActive = document.querySelector(".breadcrumbs__link_active");
  if (breadcrumbActive) {
    breadcrumbActive.textContent = Title.length > 60 ? Title.slice(0, 60) + "..." : Title;
  }

  // Section 1 - Заголовок и главное изображение
  const section1Title = document.querySelector(".single-news__section-1 .single-news__title");
  if (section1Title) section1Title.textContent = Title;

  const section1Text = document.querySelector(".single-news__section-1 .single-news__text");
  if (section1Text) section1Text.textContent = SubTitle || "";

  const mainImage = document.querySelector(".single-news__section-1 .single-news__image:not(.single-news__image_mobile)");
  if (mainImage && Thumbnail) {
    mainImage.src = getImageUrl(Thumbnail, "large");
    mainImage.alt = Title;
  }

  const mobileImage = document.querySelector(".single-news__section-1 .single-news__image_mobile");
  if (mobileImage && Thumbnail) {
    mobileImage.src = getImageUrl(Thumbnail, "medium");
    mobileImage.alt = Title;
  }

  // Section 3 - Контент статьи
  const articleContainer = document.querySelector(".single-news__section-3 .single-news__article");
  if (articleContainer && Content) {
    // Парсим markdown в HTML
    const contentHTML = parseMarkdownContent(Content);
    articleContainer.innerHTML = contentHTML;
  }
}

/**
 * Показ ошибки
 */
function showError() {
  const container = document.querySelector(".single-news");
  if (container) {
    container.innerHTML = `
      <div class="single-news__error">
        <h2>Noticia no encontrada</h2>
        <p>Lo sentimos, la noticia que busca no existe.</p>
        <a href="/blog" class="button">
          <span>Volver al blog</span>
        </a>
      </div>
    `;
  }
}

/**
 * Загрузка и отображение поста
 */
async function loadPost() {
  const slug = getSlugFromUrl();

  if (!slug) {
    console.error("No post slug in URL");
    showError();
    return;
  }

  try {
    const post = await getPostBySlug(slug);

    if (post) {
      console.log("Loaded post:", post);
      renderPost(post);
      // Загружаем связанные новости в слайдер
      loadRelatedNews(slug);
    } else {
      showError();
    }
  } catch (error) {
    console.error("Error loading post:", error);
    showError();
  }
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  loadPost();
});
