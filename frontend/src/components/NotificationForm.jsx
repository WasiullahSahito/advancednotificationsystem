import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';

const NotificationForm = () => {
    const [type, setType] = useState('email');
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [status, setStatus] = useState('');
    const [templates, setTemplates] = useState({ email: [], sms: [] });
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [templateVariables, setTemplateVariables] = useState({});
    const [isBatch, setIsBatch] = useState(false);
    const [batchRecipients, setBatchRecipients] = useState('');

    useEffect(() => {
        fetchTemplates();
    }, []);

    useEffect(() => {
        if (selectedTemplate) {
            // Reset variables when template changes
            setTemplateVariables({});
        }
    }, [selectedTemplate]);

    const fetchTemplates = async () => {
        try {
            const response = await notificationAPI.getTemplates();
            setTemplates(response.data);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');

        try {
            if (isBatch) {
                // Handle batch notifications
                const recipients = batchRecipients.split('\n')
                    .map(r => r.trim())
                    .filter(r => r.length > 0);

                if (recipients.length === 0) {
                    setStatus({
                        type: 'error',
                        message: 'Please enter at least one recipient'
                    });
                    return;
                }

                const data = {
                    type,
                    recipients,
                    message,
                    scheduledAt: scheduledAt || undefined
                };

                if (type === 'email') {
                    data.subject = subject;
                }

                if (selectedTemplate) {
                    data.template = selectedTemplate;
                    data.variables = templateVariables;
                }

                const response = await notificationAPI.sendBatch(data);
                setStatus({
                    type: 'success',
                    message: `Batch notification sent! Processed ${response.data.results.length} recipients`
                });
            } else {
                // Handle single notification
                const data = {
                    recipient,
                    message,
                    scheduledAt: scheduledAt || undefined
                };

                if (type === 'email') {
                    data.subject = subject;
                }

                if (selectedTemplate) {
                    data.template = selectedTemplate;
                    data.variables = templateVariables;
                }

                const response = type === 'email'
                    ? await notificationAPI.sendEmail(data)
                    : await notificationAPI.sendSMS(data);

                setStatus({
                    type: 'success',
                    message: `Notification sent successfully! ID: ${response.data.notificationId}`
                });
            }

            // Reset form
            setRecipient('');
            setSubject('');
            setMessage('');
            setScheduledAt('');
            setSelectedTemplate('');
            setTemplateVariables({});
            setBatchRecipients('');
        } catch (error) {
            setStatus({
                type: 'error',
                message: `Error: ${error.response?.data?.error || error.message}`
            });
        }
    };

    const handleVariableChange = (key, value) => {
        setTemplateVariables(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const renderTemplateVariables = () => {
        if (!selectedTemplate) return null;

        // This would need to be more sophisticated in a real app
        // For now, we'll just show input fields for common variables
        const commonVars = ['name', 'username', 'orderId', 'status', 'deliveryDate', 'code'];

        return (
            <div className="template-variables">
                <h4>Template Variables</h4>
                {commonVars.map(variable => (
                    <div key={variable} className="variable-input">
                        <label htmlFor={variable}>
                            {variable}:
                        </label>
                        <input
                            type="text"
                            id={variable}
                            value={templateVariables[variable] || ''}
                            onChange={(e) => handleVariableChange(variable, e.target.value)}
                            placeholder={`Enter ${variable}`}
                        />
                    </div>
                ))}
            </div>
        );
    };

    const renderRecipientField = () => {
        if (isBatch) {
            return (
                <div className="form-group">
                    <label>Recipients (one per line):</label>
                    <textarea
                        value={batchRecipients}
                        onChange={(e) => setBatchRecipients(e.target.value)}
                        placeholder={type === 'email' ? 'email1@example.com\nemail2@example.com' : '+1234567890\n+0987654321'}
                        required
                        rows={4}
                    />
                </div>
            );
        } else {
            return (
                <div className="form-group">
                    <label>Recipient:</label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder={type === 'email' ? 'email@example.com' : '+1234567890'}
                        required
                    />
                </div>
            );
        }
    };

    return (
        <div>
            <h2>Send Notification</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Type:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={isBatch}
                            onChange={(e) => setIsBatch(e.target.checked)}
                        />
                        Send to multiple recipients
                    </label>
                </div>

                {renderRecipientField()}

                {type === 'email' && (
                    <div className="form-group">
                        <label>Subject:</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required={!selectedTemplate}
                            disabled={!!selectedTemplate}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>Template (optional):</label>
                    <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                    >
                        <option value="">Select a template</option>
                        {templates[type]?.map(template => (
                            <option key={template} value={template}>{template}</option>
                        ))}
                    </select>
                </div>

                {selectedTemplate && renderTemplateVariables()}

                <div className="form-group">
                    <label>Message:</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required={!selectedTemplate}
                        disabled={!!selectedTemplate}
                    />
                </div>

                <div className="form-group">
                    <label>Schedule (optional):</label>
                    <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                    />
                </div>

                <button type="submit">Send Notification</button>
            </form>

            {status && (
                <div className={`status-message ${status.type}`}>
                    {status.message}
                </div>
            )}
        </div>
    );
};

export default NotificationForm;