import api from './index.js';

/**
 * Получение списка коллекций с пагинацией
 * @param {Object} params - Параметры запроса
 * @param {number} params.page - Номер страницы (по умолчанию 1)
 * @param {number} params.pageSize - Количество коллекций на странице (по умолчанию 10)
 * @returns {Promise} - Промис с данными коллекций
 */
export const getCollections = async ({ page = 1, pageSize = 10 } = {}) => {
  const response = await api.get('/api/collections', {
    params: {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
    },
  });
  return response.data;
};

/**
 * Получение одной коллекции по ID
 * @param {string|number} id - ID коллекции
 * @returns {Promise} - Промис с данными коллекции
 */
export const getCollectionById = async (id) => {
  const response = await api.get(`/api/collections/${id}`);
  return response.data;
};

export default {
  getCollections,
  getCollectionById,
};
