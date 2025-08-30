const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');

// Send email notification
router.post('/email', async (req, res) => {
    try {
        const { recipient, subject, message, scheduledAt } = req.body;

        // Validate input
        if (!recipient || !message) {
            return res.status(400).json({ error: 'Recipient and message are required' });
        }

        // Create notification record
        const notification = new Notification({
            type: 'email',
            recipient,
            subject,
            message,
            scheduledAt: scheduledAt || new Date()
        });

        await notification.save();

        // Send email immediately if no scheduled time or if scheduled time is now
        if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
            const result = await sendEmail(recipient, subject, message);

            if (result.success) {
                notification.status = 'sent';
                notification.sentAt = new Date();
            } else {
                notification.status = 'failed';
                notification.error = result.error;
            }

            await notification.save();
        }

        res.json({
            message: 'Email notification processed',
            notificationId: notification._id,
            status: notification.status
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send SMS notification
router.post('/sms', async (req, res) => {
    try {
        const { recipient, message, scheduledAt } = req.body;

        // Validate input
        if (!recipient || !message) {
            return res.status(400).json({ error: 'Recipient and message are required' });
        }

        // Create notification record
        const notification = new Notification({
            type: 'sms',
            recipient,
            message,
            scheduledAt: scheduledAt || new Date()
        });

        await notification.save();

        // Send SMS immediately if no scheduled time or if scheduled time is now
        if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
            const result = await sendSMS(recipient, message);

            if (result.success) {
                notification.status = 'sent';
                notification.sentAt = new Date();
            } else {
                notification.status = 'failed';
                notification.error = result.error;
            }

            await notification.save();
        }

        res.json({
            message: 'SMS notification processed',
            notificationId: notification._id,
            status: notification.status
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get notification history
router.get('/history', async (req, res) => {
    try {
        const { page = 1, limit = 10, type } = req.query;

        const query = type ? { type } : {};

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Notification.countDocuments(query);

        res.json({
            notifications,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;