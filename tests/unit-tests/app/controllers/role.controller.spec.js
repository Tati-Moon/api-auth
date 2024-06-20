const {
    getAllWithPagination,
    getById,
    create,
    update,
} = require('../../../../app/controllers/role.controller');
const RoleService = require('../../../../app/services/role.service');
const RoleBuilder = require('../utils/roleBuilder');
const CONSTANTS = require('../utils/constants');

jest.mock('.../../../../app/services/role.service');
jest.mock('../../../../app/validators/validator', () => ({
    validateRole: jest.fn((req, res, next) => next()),
}));

const DEFAULT_ROLE_NAME = 'admin';
const DEFAULT_ROLE_ID = 1;

describe('Role Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            query: {},
            params: {},
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    describe('getAllWithPagination', () => {
        it('should get all roles with pagination successfully', async () => {
            const mockData = [
                new RoleBuilder()
                    .withId(DEFAULT_ROLE_ID)
                    .withName(DEFAULT_ROLE_NAME)
                    .build(),
            ];
            RoleService.getAllRoles.mockResolvedValue(mockData);

            await getAllWithPagination(req, res, next);

            expect(RoleService.getAllRoles).toHaveBeenCalledWith(
                undefined,
                undefined,
                undefined,
            );
            expect(res.send).toHaveBeenCalledWith(mockData);
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Some error';
            RoleService.getAllRoles.mockRejectedValue(new Error(errorMessage));

            await getAllWithPagination(req, res, next);

            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            );
            expect(res.send).toHaveBeenCalledWith({
                message: errorMessage || CONSTANTS.MESSAGES.ROLE_OCCURRED,
            });
        });
    });

    describe('getById', () => {
        it('should get a role by id successfully', async () => {
            const mockData = new RoleBuilder()
                .withId(DEFAULT_ROLE_ID)
                .withName(DEFAULT_ROLE_NAME)
                .build();
            RoleService.getRoleById.mockResolvedValue(mockData);
            req.params.id = DEFAULT_ROLE_ID;

            await getById(req, res, next);

            expect(RoleService.getRoleById).toHaveBeenCalledWith(1);
            expect(res.send).toHaveBeenCalledWith(mockData);
        });

        it('should return 404 if role not found', async () => {
            RoleService.getRoleById.mockResolvedValue(null);
            req.params.id = DEFAULT_ROLE_ID;

            await getById(req, res, next);

            expect(RoleService.getRoleById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.NOT_FOUND,
            );
            expect(res.send).toHaveBeenCalledWith({
                message: CONSTANTS.MESSAGES.ROLE_NOT_FOUND(1),
            });
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Some error';
            RoleService.getRoleById.mockRejectedValue(new Error(errorMessage));
            req.params.id = DEFAULT_ROLE_ID;

            await getById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            );
            expect(res.send).toHaveBeenCalledWith({
                message:
                    CONSTANTS.MESSAGES.ROLE_RETRIEVAL_ERROR(DEFAULT_ROLE_ID),
            });
        });
    });

    describe('create', () => {
        it('should create a role successfully', async () => {
            const mockData = new RoleBuilder()
                .withId(DEFAULT_ROLE_ID)
                .withName(DEFAULT_ROLE_NAME)
                .build();
            RoleService.createRole.mockResolvedValue(mockData);
            req.body.name = DEFAULT_ROLE_NAME;

            await create[1](req, res, next);

            expect(RoleService.createRole).toHaveBeenCalledWith(
                DEFAULT_ROLE_NAME,
            );
            expect(res.send).toHaveBeenCalledWith(mockData);
        });

        it('should return 500 if a duplicate entry error occurs', async () => {
            const errorMessage = 'SequelizeUniqueConstraintError';
            RoleService.createRole.mockRejectedValue({name: errorMessage});
            req.body.name = DEFAULT_ROLE_NAME;

            await create[1](req, res, next);

            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            );
            expect(res.send).toHaveBeenCalledWith({
                message: CONSTANTS.MESSAGES.ROLE_CREATION_DUPLICATE(undefined),
            });
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Some error';
            RoleService.createRole.mockRejectedValue(new Error(errorMessage));
            req.body.name = DEFAULT_ROLE_NAME;

            await create[1](req, res, next);

            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            );
            expect(res.send).toHaveBeenCalledWith({
                message: errorMessage || CONSTANTS.MESSAGES.ROLE_CREATION_ERROR,
            });
        });
    });

    describe('update', () => {
        it('should update a role successfully', async () => {
            RoleService.updateRole.mockResolvedValue(1);
            req.params.id = DEFAULT_ROLE_ID;
            req.body = {name: DEFAULT_ROLE_NAME};

            await update[1](req, res, next);

            expect(RoleService.updateRole).toHaveBeenCalledWith(1, {
                name: DEFAULT_ROLE_NAME,
            });
            expect(res.send).toHaveBeenCalledWith({
                message: CONSTANTS.MESSAGES.ROLE_UPDATE_SUCCESS,
            });
        });

        it('should return a message if the role is not found or data is unchanged', async () => {
            RoleService.updateRole.mockResolvedValue(0);
            req.params.id = DEFAULT_ROLE_ID;
            req.body = {name: DEFAULT_ROLE_NAME};

            await update[1](req, res, next);

            expect(RoleService.updateRole).toHaveBeenCalledWith(1, {
                name: DEFAULT_ROLE_NAME,
            });
            expect(res.send).toHaveBeenCalledWith({
                message:
                    CONSTANTS.MESSAGES.ROLE_UPDATE_NOT_FOUND(DEFAULT_ROLE_ID),
            });
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Some error';
            RoleService.updateRole.mockRejectedValue(new Error(errorMessage));
            req.params.id = DEFAULT_ROLE_ID;
            req.body = {name: DEFAULT_ROLE_NAME};

            await update[1](req, res, next);

            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            );
            expect(res.send).toHaveBeenCalledWith({
                message: CONSTANTS.MESSAGES.ROLE_UPDATE_ERROR(DEFAULT_ROLE_ID),
            });
        });
    });
});
