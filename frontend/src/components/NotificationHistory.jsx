import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';

const NotificationHistory = () => {
    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        type: '',
        status: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, [page, filters]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit: 10,
                ...(filters.type && { type: filters.type }),
                ...(filters.status && { status: filters.status })
            };

            const response = await notificationAPI.getHistory(params);
            setNotifications(response.data.notifications);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setPage(1); // Reset to first page when filters change
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div>
            <h2>Notification History</h2>

            <div className="filter-section">
                <div>
                    <label>Type: </label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                    </select>
                </div>

                <div>
                    <label>Status: </label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="sent">Sent</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Recipient</th>
                        <th>Subject/Message</th>
                        <th>Status</th>
                        <th>Scheduled At</th>
                        <th>Sent At</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.map(notification => (
                        <tr key={notification._id}>
                            <td>{notification.type}</td>
                            <td>{notification.recipient}</td>
                            <td>
                                {notification.type === 'email'
                                    ? notification.subject
                                    : notification.message.substring(0, 50) + (notification.message.length > 50 ? '...' : '')
                                }
                            </td>
                            <td>{notification.status}</td>
                            <td>{new Date(notification.scheduledAt).toLocaleString()}</td>
                            <td>{notification.sentAt ? new Date(notification.sentAt).toLocaleString() : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {notifications.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>No notifications found</p>
            )}

            <div className="pagination">
                <button
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={page === pageNum ? 'active' : ''}
                    >
                        {pageNum}
                    </button>
                ))}

                <button
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default NotificationHistory;