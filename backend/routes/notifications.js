const express = require('express');
const router = express.Router();
const {
    sendEmailNotification,
    sendSMSNotification,
    getNotificationHistory,
    getTemplates,
    sendBatchNotifications
} = require('../controllers/notificationController');
const { validateEmail, validateSMS } = require('../middleware/validation');

// Remove auth middleware from these routes temporarily
router.post('/email', validateEmail, sendEmailNotification);
router.post('/sms', validateSMS, sendSMSNotification);
router.post('/batch', sendBatchNotifications);
router.get('/history', getNotificationHistory);
router.get('/templates', getTemplates);

module.exports = router;