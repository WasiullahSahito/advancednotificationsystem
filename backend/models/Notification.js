const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['email', 'sms', 'push'],
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    subject: String,
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    },
    scheduledAt: {
        type: Date,
        default: Date.now
    },
    sentAt: Date,
    error: String,
    template: String,
    variables: Map
}, {
    timestamps: true
});

// Index for better query performance
notificationSchema.index({ type: 1, status: 1, scheduledAt: 1 });

module.exports = mongoose.model('Notification', notificationSchema);