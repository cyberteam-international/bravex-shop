import api from './index.js';

/**
 * Получение всех фильтров со значениями
 * @returns {Promise} - Промис с данными фильтров
 */
export const getAllFilters = async () => {
  const response = await api.get('/api/filters/all-with-values');
  return response.data;
};

/**
 * Получение фильтров для конкретной категории
 * @param {string} categorySlug - Slug категории
 * @returns {Promise} - Промис с данными фильтров
 */
export const getFiltersByCategory = async (categorySlug) => {
  const response = await api.get(`/api/filters/category/${categorySlug}`);
  return response.data;
};

export default {
  getAllFilters,
  getFiltersByCategory,
};
