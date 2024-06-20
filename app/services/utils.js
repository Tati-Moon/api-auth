/**
 * Calculates the pagination limit and offset based on the provided page and size.
 *
 * @param {number} page - The current page number.
 * @param {number} size - The number of items per page.
 * @returns {Object} An object containing the limit and offset.
 * @property {number} limit - The number of items per page.
 * @property {number} offset - The number of items to skip.
 */
const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return {limit, offset};
};

/**
 * Transforms the raw data into a paginated format.
 *
 * @param {Object} data - The raw data from the database query.
 * @param {number} page - The current page number.
 * @param {number} limit - The number of items per page.
 * @returns {Object} An object containing pagination information and the paginated data.
 * @property {number} totalItems - The total number of items.
 * @property {Array} roles - The data rows for the current page.
 * @property {number} totalPages - The total number of pages.
 * @property {number} currentPage - The current page number.
 */
const getPagingData = (data, page, limit) => {
    const {count: totalItems, rows: roles} = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return {
        totalItems,
        roles,
        totalPages,
        currentPage,
    };
};

module.exports = {
    getPagination,
    getPagingData,
};
