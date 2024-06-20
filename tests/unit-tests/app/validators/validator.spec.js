const {
    validateUserRegistration,
    validateRole,
} = require('../../../../app/validators/validator');
const CONSTANTS = require('../utils/constants');
const UserBuilder = require('../utils/userBuilder');

describe('Validators', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    describe('validateUserRegistration', () => {
        it('should pass validation with valid data', () => {
            const validUser = new UserBuilder().build();
            req.body = {
                username: validUser.username,
                email: validUser.email,
                phone: validUser.phone,
                firstName: validUser.firstName,
                lastName: validUser.lastName,
            };

            validateUserRegistration(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return error for invalid username', () => {
            const invalidUser = new UserBuilder()
                .withUsername('invalid user!')
                .build();
            req.body = {
                username: invalidUser.username,
                email: invalidUser.email,
                phone: invalidUser.phone,
                firstName: invalidUser.firstName,
                lastName: invalidUser.lastName,
            };

            validateUserRegistration(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message:
                    '"username" can only contain letters (A-Z, a-z), numbers (0-9), hyphens (-), and underscores (_)!',
            });
        });

        it('should return error for invalid email', () => {
            const invalidUser = new UserBuilder()
                .withEmail('invalid.email')
                .build();
            req.body = {
                username: invalidUser.username,
                email: invalidUser.email,
                phone: invalidUser.phone,
                firstName: invalidUser.firstName,
                lastName: invalidUser.lastName,
            };

            validateUserRegistration(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: '"email" must be a valid email address!',
            });
        });

        it('should return error for invalid phone', () => {
            const invalidUser = new UserBuilder().withPhone('12345').build();
            req.body = {
                username: invalidUser.username,
                email: invalidUser.email,
                phone: invalidUser.phone,
                firstName: invalidUser.firstName,
                lastName: invalidUser.lastName,
            };

            validateUserRegistration(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: '"phone" must be a valid Belarusian phone number!',
            });
        });

        it('should return error for short first name', () => {
            const invalidUser = new UserBuilder().withFirstName('J').build();
            req.body = {
                username: invalidUser.username,
                email: invalidUser.email,
                phone: invalidUser.phone,
                firstName: invalidUser.firstName,
                lastName: invalidUser.lastName,
            };

            validateUserRegistration(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: `"firstName" should have a minimum length of ${CONSTANTS.NAME_MIN_LENGTH}`,
            });
        });

        it('should return error for long last name', () => {
            const invalidUser = new UserBuilder()
                .withLastName('D'.repeat(CONSTANTS.NAME_MAX_LENGTH + 1))
                .build();
            req.body = {
                username: invalidUser.username,
                email: invalidUser.email,
                phone: invalidUser.phone,
                firstName: invalidUser.firstName,
                lastName: invalidUser.lastName,
            };

            validateUserRegistration(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: `"lastName" should have a maximum length of ${CONSTANTS.NAME_MAX_LENGTH}`,
            });
        });
    });

    describe('validateRole', () => {
        it('should pass validation with valid data', () => {
            req.body = {
                name: 'admin',
            };

            validateRole(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return error for missing name', () => {
            req.body = {};

            validateRole(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: '"name" is a required field',
            });
        });

        it('should return error for short name', () => {
            req.body = {
                name: 'a',
            };

            validateRole(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: `"name" should have a minimum length of ${CONSTANTS.NAME_MIN_LENGTH}`,
            });
        });

        it('should return error for long name', () => {
            req.body = {
                name: 'a'.repeat(CONSTANTS.NAME_MAX_LENGTH + 1),
            };

            validateRole(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: `"name" should have a maximum length of ${CONSTANTS.NAME_MAX_LENGTH}`,
            });
        });
    });
});
