const Notification = require('../models/Notification');
const { sendEmail, sendTemplatedEmail } = require('../services/emailService');
const { sendSMS, sendTemplatedSMS } = require('../services/smsService');

// Process scheduled notifications
const processScheduledNotifications = async () => {
    try {
        const now = new Date();

        // Find pending notifications that are scheduled to be sent
        const pendingNotifications = await Notification.find({
            status: 'pending',
            scheduledAt: { $lte: now }
        });

        console.log(`Found ${pendingNotifications.length} scheduled notifications to process`);

        for (const notification of pendingNotifications) {
            try {
                let result;

                if (notification.type === 'email') {
                    if (notification.template) {
                        result = await sendTemplatedEmail(
                            notification.recipient,
                            notification.template,
                            notification.variables
                        );
                    } else {
                        result = await sendEmail(
                            notification.recipient,
                            notification.subject,
                            notification.message,
                            notification.variables
                        );
                    }
                } else if (notification.type === 'sms') {
                    if (notification.template) {
                        result = await sendTemplatedSMS(
                            notification.recipient,
                            notification.template,
                            notification.variables
                        );
                    } else {
                        result = await sendSMS(
                            notification.recipient,
                            notification.message,
                            notification.variables
                        );
                    }
                }

                if (result.success) {
                    notification.status = 'sent';
                    notification.sentAt = new Date();
                } else {
                    notification.status = 'failed';
                    notification.error = result.error;
                }

                await notification.save();
                console.log(`Processed notification ${notification._id} with status: ${notification.status}`);
            } catch (error) {
                console.error(`Error processing notification ${notification._id}:`, error);
                notification.status = 'failed';
                notification.error = error.message;
                await notification.save();
            }
        }
    } catch (error) {
        console.error('Error in scheduler:', error);
    }
};

module.exports = { processScheduledNotifications };