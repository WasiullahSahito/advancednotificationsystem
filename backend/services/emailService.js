const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email templates
const templates = {
    welcome: {
        subject: 'Welcome to Our Service, {{name}}!',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Our Service, {{name}}!</h2>
        <p>Thank you for registering with us. We're excited to have you on board.</p>
        <p>Your account has been successfully created with username: <strong>{{username}}</strong></p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <br>
        <p>Best regards,<br>The Team</p>
      </div>
    `
    },
    orderUpdate: {
        subject: 'Update on Your Order #{{orderId}}',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Order Update</h2>
        <p>Hello {{name}},</p>
        <p>Your order <strong>#{{orderId}}</strong> has been updated to: <strong>{{status}}</strong></p>
        <p>Estimated delivery: {{deliveryDate}}</p>
        <p>If you have any questions about your order, please contact our support team.</p>
        <br>
        <p>Best regards,<br>The Team</p>
      </div>
    `
    }
};

// Replace template variables
const replaceVariables = (template, variables) => {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
};

// Send email function
const sendEmail = async (to, subject, htmlContent, variables = {}) => {
    try {
        // Replace variables in subject and content
        const processedSubject = replaceVariables(subject, variables);
        const processedHtml = replaceVariables(htmlContent, variables);

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject: processedSubject,
            html: processedHtml
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
};

// Send email using template
const sendTemplatedEmail = async (to, templateName, variables = {}) => {
    const template = templates[templateName];
    if (!template) {
        return { success: false, error: `Template ${templateName} not found` };
    }

    return sendEmail(to, template.subject, template.html, variables);
};

module.exports = { sendEmail, sendTemplatedEmail, templates };