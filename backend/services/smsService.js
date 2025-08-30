const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// SMS templates
const templates = {
    welcome: 'Welcome {{name}}! Your account has been created successfully. Username: {{username}}',
    orderUpdate: 'Hello {{name}}, your order #{{orderId}} status is now: {{status}}. Estimated delivery: {{deliveryDate}}',
    verification: 'Your verification code is: {{code}}. It will expire in 10 minutes.'
};

// Replace template variables
const replaceVariables = (template, variables) => {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
};

// Send SMS function
const sendSMS = async (to, message, variables = {}) => {
    try {
        // Replace variables in message
        const processedMessage = replaceVariables(message, variables);

        const result = await twilio.messages.create({
            body: processedMessage,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });

        return { success: true, messageId: result.sid };
    } catch (error) {
        console.error('SMS sending error:', error);
        return { success: false, error: error.message };
    }
};

// Send SMS using template
const sendTemplatedSMS = async (to, templateName, variables = {}) => {
    const template = templates[templateName];
    if (!template) {
        return { success: false, error: `Template ${templateName} not found` };
    }

    return sendSMS(to, template, variables);
};

module.exports = { sendSMS, sendTemplatedSMS, templates };