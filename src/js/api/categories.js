import api from './index.js';

/**
 * Получение списка категорий с пагинацией
 * @param {Object} params - Параметры запроса
 * @param {number} params.page - Номер страницы (по умолчанию 1)
 * @param {number} params.pageSize - Количество категорий на странице (по умолчанию 8)
 * @returns {Promise} - Промис с данными категорий
 */
export const getCategories = async ({ page = 1, pageSize = 8 } = {}) => {
  const response = await api.get('/api/categories', {
    params: {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
    },
  });
  return response.data;
};

/**
 * Получение одной категории по ID
 * @param {string|number} id - ID категории
 * @returns {Promise} - Промис с данными категории
 */
export const getCategoryById = async (id) => {
  const response = await api.get(`/api/categories/${id}`);
  return response.data;
};

export default {
  getCategories,
  getCategoryById,
};
