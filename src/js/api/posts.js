import api from "./index.js";

/**
 * Получение списка постов с пагинацией
 * @param {Object} params - Параметры запроса
 * @param {number} params.page - Номер страницы
 * @param {number} params.pageSize - Количество постов на странице
 * @returns {Promise<Object>} - Ответ API с данными и мета-информацией
 */
export async function getPosts({ page = 1, pageSize = 8 } = {}) {
  const response = await api.get("/api/posts", {
    params: {
      "populate": "*",
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
      "sort[0]": "publishedAt:desc",
    },
  });
  return response.data;
}

/**
 * Получение поста по ID
 * @param {string} id - ID поста
 * @returns {Promise<Object>} - Данные поста
 */
export async function getPostById(id) {
  const response = await api.get(`/api/posts/${id}`);
  return response.data.data;
}

/**
 * Получение поста по slug
 * @param {string} slug - Slug поста
 * @returns {Promise<Object|null>} - Данные поста или null
 */
export async function getPostBySlug(slug) {
  const response = await api.get("/api/posts", {
    params: {
      "populate": "*",
      "filters[slug][$eq]": slug,
    },
  });
  const posts = response.data.data;
  return posts && posts.length > 0 ? posts[0] : null;
}

export default {
  getPosts,
  getPostById,
  getPostBySlug,
};
