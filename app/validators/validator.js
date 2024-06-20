const Joi = require('joi');

const USERNAME_MIN_LENGTH = 2;
const USERNAME_MAX_LENGTH = 100;
const EMAIL_MIN_LENGTH = 2;
const EMAIL_MAX_LENGTH = 100;
const PHONE_MIN_LENGTH = 2;
const PHONE_MAX_LENGTH = 50;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;

const USERNAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN =
    /^\+375\s?\(?25|29|33|44\)?\s?\d{3}([- ]?)\d{2}\1\d{2}$|^\+375\s?\(?25|29|33|44\)?\s?\d{7}$/;

const userRegistrationSchema = Joi.object({
    username: Joi.string()
        .pattern(USERNAME_PATTERN)
        .min(USERNAME_MIN_LENGTH)
        .max(USERNAME_MAX_LENGTH)
        .messages({
            'string.pattern.base':
                '"username" can only contain letters (A-Z, a-z), numbers (0-9), hyphens (-), and underscores (_)!',
            'string.min': `"username" should have a minimum length of ${USERNAME_MIN_LENGTH}`,
            'string.max': `"username" should have a maximum length of ${USERNAME_MAX_LENGTH}`,
        }),
    email: Joi.string()
        .pattern(EMAIL_PATTERN)
        .min(EMAIL_MIN_LENGTH)
        .max(EMAIL_MAX_LENGTH)
        .messages({
            'string.pattern.base': '"email" must be a valid email address!',
            'string.min': `"email" should have a minimum length of ${EMAIL_MIN_LENGTH}`,
            'string.max': `"email" should have a maximum length of ${EMAIL_MAX_LENGTH}`,
        }),
    phone: Joi.string()
        .pattern(PHONE_PATTERN)
        .min(PHONE_MIN_LENGTH)
        .max(PHONE_MAX_LENGTH)
        .messages({
            'string.pattern.base':
                '"phone" must be a valid Belarusian phone number!',
            'string.min': `"phone" should have a minimum length of ${PHONE_MIN_LENGTH}`,
            'string.max': `"phone" should have a maximum length of ${PHONE_MAX_LENGTH}`,
        }),
    firstName: Joi.string()
        .min(NAME_MIN_LENGTH)
        .max(NAME_MAX_LENGTH)
        .messages({
            'string.min': `"firstName" should have a minimum length of ${NAME_MIN_LENGTH}`,
            'string.max': `"firstName" should have a maximum length of ${NAME_MAX_LENGTH}`,
        }),
    lastName: Joi.string()
        .min(NAME_MIN_LENGTH)
        .max(NAME_MAX_LENGTH)
        .messages({
            'string.min': `"lastName" should have a minimum length of ${NAME_MIN_LENGTH}`,
            'string.max': `"lastName" should have a maximum length of ${NAME_MAX_LENGTH}`,
        }),
});

const roleSchema = Joi.object({
    name: Joi.string()
        .min(NAME_MIN_LENGTH)
        .max(NAME_MAX_LENGTH)
        .required()
        .messages({
            'string.min': `"name" should have a minimum length of ${NAME_MIN_LENGTH}`,
            'string.max': `"name" should have a maximum length of ${NAME_MAX_LENGTH}`,
            'any.required': '"name" is a required field',
        }),
});

const validateUserRegistration = (req, res, next) => {
    const {error} = userRegistrationSchema.validate(req.body);
    if (error) {
        return res.status(400).send({message: error.details[0].message});
    }
    next();
};

const validateRole = (req, res, next) => {
    const {error} = roleSchema.validate(req.body);
    if (error) {
        return res.status(400).send({message: error.details[0].message});
    }
    next();
};

module.exports = {
    validateUserRegistration,
    validateRole,
};
