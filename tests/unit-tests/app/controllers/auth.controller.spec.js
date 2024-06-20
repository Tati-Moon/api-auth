const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
    registration,
    signin,
} = require('../../../../app/controllers/auth.controller');
const RoleService = require('../../../../app/services/role.service');
const UserService = require('../../../../app/services/user.service');

const CONSTANTS = require('../utils/constants');
const UserBuilder = require('../utils/userBuilder');
const RoleBuilder = require('../utils/roleBuilder');

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('../../../../app/services/role.service');
jest.mock('../../../../app/services/user.service');

describe('Auth Controller', () => {
    describe('registration', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                body: new UserBuilder().withRoles(['user']).build(),
            };
            res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            next = jest.fn();
        });

        it('should register a user successfully', async () => {
            const mockUser = new UserBuilder().build();
            const mockRoles = ['user'];

            UserService.createUser.mockResolvedValue(mockUser);
            RoleService.getRolesByName.mockResolvedValue(mockRoles);
            mockUser.setRoles = jest.fn().mockResolvedValue();

            await registration[1](req, res, next);

            expect(UserService.createUser).toHaveBeenCalledWith(req.body);
            expect(RoleService.getRolesByName).toHaveBeenCalledWith(
                req.body.roles,
            );
            expect(mockUser.setRoles).toHaveBeenCalledWith(mockRoles);
            expect(res.send).toHaveBeenCalledWith({
                message: CONSTANTS.MESSAGES.USER_REGISTERED,
            });
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Some error';
            UserService.createUser.mockRejectedValue(new Error(errorMessage));

            await registration[1](req, res, next);

            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            );
            expect(res.send).toHaveBeenCalledWith({message: errorMessage});
        });
    });

    describe('signin', () => {
        let req, res, next;

        beforeEach(() => {
            req = {
                body: {
                    username: CONSTANTS.DEFAULT_USER.username,
                    password: CONSTANTS.DEFAULT_USER.password,
                },
            };
            res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            next = jest.fn();
        });

        it('should sign in a user successfully', async () => {
            const user = new UserBuilder()
                .withHashedPassword(CONSTANTS.DEFAULT_USER.hashedPassword)
                .build();
            user.getRoles = jest
                .fn()
                .mockResolvedValue([
                    new RoleBuilder().withName('user').build(),
                ]);
            user.save = jest.fn();
            UserService.getUserByUsername.mockResolvedValue(user);
            bcrypt.compareSync.mockReturnValue(true);
            jwt.sign.mockReturnValue(CONSTANTS.DEFAULT_USER.accessToken);

            await signin(req, res, next);

            expect(UserService.getUserByUsername).toHaveBeenCalledWith(
                req.body.username,
            );
            expect(bcrypt.compareSync).toHaveBeenCalledWith(
                req.body.password,
                user.password,
            );
            expect(user.loginAttemptsCount).toBe(0);
            expect(user.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(CONSTANTS.HTTP_STATUS.OK);
            expect(res.send).toHaveBeenCalledWith({
                id: user.id,
                username: user.username,
                email: user.email,
                roles: ['ROLE_USER'],
                accessToken: CONSTANTS.DEFAULT_USER.accessToken,
            });
        });

        it('should return 404 if user not found', async () => {
            UserService.getUserByUsername.mockResolvedValue(null);

            await signin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.NOT_FOUND,
            );
            expect(res.send).toHaveBeenCalledWith({
                message: CONSTANTS.MESSAGES.USER_NOT_FOUND,
            });
        });

        it('should return 403 if user is deactivated', async () => {
            const user = new UserBuilder().withIsActive(false).build();
            UserService.getUserByUsername.mockResolvedValue(user);

            await signin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.FORBIDDEN,
            );
            expect(res.send).toHaveBeenCalledWith({
                message: CONSTANTS.MESSAGES.ACCESS_DENIED,
            });
        });

        it('should return 401 if password is invalid', async () => {
            const user = new UserBuilder()
                .withHashedPassword(CONSTANTS.DEFAULT_USER.hashedPassword)
                .build();
            user.save = jest.fn();
            UserService.getUserByUsername.mockResolvedValue(user);
            bcrypt.compareSync.mockReturnValue(false);

            await signin(req, res, next);

            expect(user.loginAttemptsCount).toBe(1);
            expect(user.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
            );
            expect(res.send).toHaveBeenCalledWith({
                accessToken: null,
                message: CONSTANTS.MESSAGES.INVALID_PASSWORD,
                loginAttemptsCount: 1,
            });
        });

        it('should return 401 if maximum login attempts are exceeded', async () => {
            const user = new UserBuilder()
                .withHashedPassword(CONSTANTS.DEFAULT_USER.hashedPassword)
                .withLoginAttemptsCount(CONSTANTS.LOGIN_ATTEMPTS_LIMIT)
                .build();
            user.save = jest.fn();
            UserService.getUserByUsername.mockResolvedValue(user);
            bcrypt.compareSync.mockReturnValue(false);

            await signin(req, res, next);

            expect(user.loginAttemptsCount).toBe(
                CONSTANTS.LOGIN_ATTEMPTS_LIMIT + 1,
            );
            expect(user.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.UNAUTHORIZED,
            );
            expect(res.send).toHaveBeenCalledWith({
                message: CONSTANTS.MESSAGES.EXCEEDED_LOGIN_ATTEMPTS,
            });
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Some error';
            UserService.getUserByUsername.mockRejectedValue(
                new Error(errorMessage),
            );

            await signin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(
                CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR,
            );
            expect(res.send).toHaveBeenCalledWith({message: errorMessage});
        });
    });
});
