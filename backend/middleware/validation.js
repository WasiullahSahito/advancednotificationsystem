const { body, validationResult } = require('express-validator');

// Validation rules for email notification
const validateEmail = [
    body('recipient')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    body('subject')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Subject must be between 1 and 100 characters'),
    body('message')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Message must be between 1 and 1000 characters'),
    body('scheduledAt')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid date for scheduling'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Validation rules for SMS notification
const validateSMS = [
    body('recipient')
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('message')
        .trim()
        .isLength({ min: 1, max: 160 })
        .withMessage('SMS message must be between 1 and 160 characters'),
    body('scheduledAt')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid date for scheduling'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { validateEmail, validateSMS };