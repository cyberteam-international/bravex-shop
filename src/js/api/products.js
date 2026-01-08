import api from './index.js';

/**
 * Получение списка товаров с пагинацией
 * @param {Object} params - Параметры запроса
 * @param {number} params.page - Номер страницы (по умолчанию 1)
 * @param {number} params.pageSize - Количество товаров на странице (по умолчанию 20)
 * @returns {Promise} - Промис с данными товаров
 */
export const getProducts = async ({ page = 1, pageSize = 20 } = {}) => {
  const response = await api.get('/api/products', {
    params: {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
    },
  });
  return response.data;
};

/**
 * Получение одного товара по ID
 * @param {string|number} id - ID товара
 * @returns {Promise} - Промис с данными товара
 */
export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

/**
 * Получение одного товара по slug
 * @param {string} slug - Slug товара
 * @returns {Promise} - Промис с данными товара
 */
export const getProductBySlug = async (slug) => {
  const response = await api.get('/api/products', {
    params: {
      'filters[slug][$eq]': slug,
      'populate': '*',
    },
  });
  const products = response.data?.data || [];
  return products.length > 0 ? products[0] : null;
};

/**
 * Получение товаров по slug категории
 * @param {string} categorySlug - Slug категории
 * @param {Object} params - Параметры пагинации
 * @returns {Promise} - Промис с данными товаров
 */
export const getProductsByCategory = async (categorySlug, { page = 1, pageSize = 20 } = {}) => {
  const response = await api.get('/api/products', {
    params: {
      'filters[categories][slug][$eq]': categorySlug,
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
    },
  });
  return response.data;
};

export default {
  getProducts,
  getProductById,
  getProductBySlug,
  getProductsByCategory,
};
