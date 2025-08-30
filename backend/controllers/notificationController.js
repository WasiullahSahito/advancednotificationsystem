const Notification = require('../models/Notification');
const { sendEmail, sendTemplatedEmail } = require('../services/emailService');
const { sendSMS, sendTemplatedSMS } = require('../services/smsService');

// Send email notification
exports.sendEmailNotification = async (req, res) => {
    try {
        const { recipient, subject, message, scheduledAt, template, variables } = req.body;

        // Create notification record
        const notification = new Notification({
            type: 'email',
            recipient,
            subject,
            message,
            scheduledAt: scheduledAt || new Date(),
            template,
            variables
        });

        await notification.save();

        // Send immediately if no scheduled time or if scheduled time is now
        if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
            let result;

            if (template) {
                result = await sendTemplatedEmail(recipient, template, variables);
            } else {
                result = await sendEmail(recipient, subject, message, variables);
            }

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
        console.error('Email notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Send SMS notification
exports.sendSMSNotification = async (req, res) => {
    try {
        const { recipient, message, scheduledAt, template, variables } = req.body;

        // Create notification record
        const notification = new Notification({
            type: 'sms',
            recipient,
            message,
            scheduledAt: scheduledAt || new Date(),
            template,
            variables
        });

        await notification.save();

        // Send immediately if no scheduled time or if scheduled time is now
        if (!scheduledAt || new Date(scheduledAt) <= new Date()) {
            let result;

            if (template) {
                result = await sendTemplatedSMS(recipient, template, variables);
            } else {
                result = await sendSMS(recipient, message, variables);
            }

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
        console.error('SMS notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get notification history
exports.getNotificationHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, status } = req.query;

        // Build query
        const query = {};
        if (type) query.type = type;
        if (status) query.status = status;

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Notification.countDocuments(query);

        res.json({
            notifications,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            total: count
        });
    } catch (error) {
        console.error('Get notification history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get available templates
exports.getTemplates = async (req, res) => {
    try {
        const emailTemplates = require('../services/emailService').templates;
        const smsTemplates = require('../services/smsService').templates;

        res.json({
            email: Object.keys(emailTemplates),
            sms: Object.keys(smsTemplates)
        });
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Send batch notifications
exports.sendBatchNotifications = async (req, res) => {
    try {
        const { type, recipients, subject, message, template, variables } = req.body;

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ error: 'Recipients array is required' });
        }

        const results = [];

        for (const recipient of recipients) {
            try {
                let result;

                if (type === 'email') {
                    const notification = new Notification({
                        type: 'email',
                        recipient,
                        subject,
                        message,
                        template,
                        variables
                    });

                    await notification.save();

                    if (template) {
                        result = await sendTemplatedEmail(recipient, template, variables);
                    } else {
                        result = await sendEmail(recipient, subject, message, variables);
                    }

                    if (result.success) {
                        notification.status = 'sent';
                        notification.sentAt = new Date();
                    } else {
                        notification.status = 'failed';
                        notification.error = result.error;
                    }

                    await notification.save();
                    results.push({ recipient, status: 'success', notificationId: notification._id });
                } else if (type === 'sms') {
                    const notification = new Notification({
                        type: 'sms',
                        recipient,
                        message,
                        template,
                        variables
                    });

                    await notification.save();

                    if (template) {
                        result = await sendTemplatedSMS(recipient, template, variables);
                    } else {
                        result = await sendSMS(recipient, message, variables);
                    }

                    if (result.success) {
                        notification.status = 'sent';
                        notification.sentAt = new Date();
                    } else {
                        notification.status = 'failed';
                        notification.error = result.error;
                    }

                    await notification.save();
                    results.push({ recipient, status: 'success', notificationId: notification._id });
                }
            } catch (error) {
                results.push({ recipient, status: 'error', error: error.message });
            }
        }

        res.json({
            message: 'Batch notifications processed',
            results
        });
    } catch (error) {
        console.error('Batch notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};