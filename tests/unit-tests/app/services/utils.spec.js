const {
    getPagination,
    getPagingData,
} = require('../../../../app/services/utils');

// Tests for getPagination
describe('getPagination', () => {
    it('should return default limit and offset when no page and size are provided', () => {
        const result = getPagination();
        expect(result).toEqual({limit: 3, offset: 0});
    });

    it('should calculate the offset correctly based on the page and default limit', () => {
        const result = getPagination(2);
        expect(result).toEqual({limit: 3, offset: 6});
    });

    it('should use provided size to calculate limit and offset correctly', () => {
        const result = getPagination(2, 5);
        expect(result).toEqual({limit: 5, offset: 10});
    });

    it('should return correct limit and offset when size is provided but page is 0', () => {
        const result = getPagination(0, 4);
        expect(result).toEqual({limit: 4, offset: 0});
    });

    it('should return correct limit and offset when page is null', () => {
        const result = getPagination(null, 4);
        expect(result).toEqual({limit: 4, offset: 0});
    });

    it('should return correct limit and offset when size is null', () => {
        const result = getPagination(2, null);
        expect(result).toEqual({limit: 3, offset: 6});
    });
});

// Tests for getPagingData
describe('getPagingData', () => {
    it('should calculate totalPages correctly and return correct paging data', () => {
        const data = {
            count: 15,
            rows: ['role1', 'role2', 'role3'],
        };
        const result = getPagingData(data, 2, 5);
        expect(result).toEqual({
            totalItems: 15,
            roles: data.rows,
            totalPages: 3,
            currentPage: 2,
        });
    });

    it('should handle zero totalItems correctly', () => {
        const data = {
            count: 0,
            rows: [],
        };
        const result = getPagingData(data, 1, 5);
        expect(result).toEqual({
            totalItems: 0,
            roles: data.rows,
            totalPages: 0,
            currentPage: 1,
        });
    });

    it('should handle null page correctly', () => {
        const data = {
            count: 10,
            rows: ['role1', 'role2'],
        };
        const result = getPagingData(data, null, 3);
        expect(result).toEqual({
            totalItems: 10,
            roles: data.rows,
            totalPages: 4,
            currentPage: 0,
        });
    });
});
