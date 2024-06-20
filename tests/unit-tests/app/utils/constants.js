const CONSTANTS = {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    USERNAME_MIN_LENGTH: 2,
    USERNAME_MAX_LENGTH: 100,
    EMAIL_MIN_LENGTH: 2,
    EMAIL_MAX_LENGTH: 100,
    PHONE_MIN_LENGTH: 2,
    PHONE_MAX_LENGTH: 50,
    MESSAGES: {
        USER_REGISTERED: 'User was registered successfully!',
        USER_NOT_FOUND: 'User Not found.',
        ACCESS_DENIED: 'Access denied, account is deactivated.',
        INVALID_PASSWORD: 'Invalid Password!',
        EXCEEDED_LOGIN_ATTEMPTS:
            'Exceeded maximum number of login attempts. Please reset your password.',
        ROLE_OCCURRED: 'Some error occurred while retrieving roles.',
        ROLE_NOT_FOUND: id => `Cannot find Role with id=${id}.`,
        ROLE_RETRIEVAL_ERROR: id => `Error retrieving Role with id=${id}`,
        ROLE_CREATION_ERROR: 'Some error occurred while creating the Role.',
        ROLE_CREATION_DUPLICATE: id => `Duplicate entry "${id}" for key`,
        ROLE_UPDATE_SUCCESS: 'Role was updated successfully.',
        ROLE_UPDATE_ERROR: id => `Error updating Role with id=${id}`,
        ROLE_UPDATE_NOT_FOUND: id =>
            `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty or provided data is the same as the existing data!`,
    },
    HTTP_STATUS: {
        OK: 200,
        BAD_REQUEST: 400,
        NOT_FOUND: 404,
        FORBIDDEN: 403,
        UNAUTHORIZED: 401,
        INTERNAL_SERVER_ERROR: 500,
    },
    LOGIN_ATTEMPTS_LIMIT: 5,
    TOKEN_EXPIRATION: 86400,
    DEFAULT_USER: {
        username: 'testuser',
        password: 'testpassword',
        hashedPassword: 'hashedpassword',
        accessToken: 'fakeToken',
    },
};

module.exports = CONSTANTS;
