import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/NotificationList.css';

const NotificationList = ({ userId, onNotificationRead }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, [userId]);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(
                `http://localhost:9090/api/notifications/user/${userId}`,
                { withCredentials: true }
            );
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(
                `http://localhost:9090/api/notifications/${notificationId}/read`,
                {},
                { withCredentials: true }
            );
            
            const updatedNotifications = notifications.map(notif => 
                notif.id === notificationId ? {...notif, isRead: true} : notif
            );
            setNotifications(updatedNotifications);
            
            const hasUnread = updatedNotifications.some(notif => !notif.isRead);
            if (!hasUnread) {
                onNotificationRead();
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const deleteNotification = async (notificationId, event) => {
        event.stopPropagation();
        try {
            await axios.delete(
                `http://localhost:9090/api/notifications/${notificationId}`,
                { withCredentials: true }
            );
            setNotifications(notifications.filter(notif => notif.id !== notificationId));
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const deleteAllNotifications = async () => {
        try {
            await axios.delete(
                `http://localhost:9090/api/notifications/user/${userId}`,
                { withCredentials: true }
            );
            setNotifications([]);
            onNotificationRead();
        } catch (error) {
            console.error('Failed to delete all notifications:', error);
        }
    };

    if (loading) return <div>Loading notifications...</div>;

    return (
        <div className="notifications-container">
            {notifications.length > 0 && (
                <div className="notifications-header">
                    <button 
                        className="clear-all-btn"
                        onClick={deleteAllNotifications}
                    >
                        Clear All
                    </button>
                </div>
            )}
            {notifications.length === 0 ? (
                <p>No notifications</p>
            ) : (
                notifications.map(notification => (
                    <div 
                        key={notification.id} 
                        className={`notification ${!notification.isRead ? 'unread' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                    >
                        <div className="notification-content">
                            <p className="notification-message">{notification.message}</p>
                            <small className="notification-time">
                                {new Date(notification.createdAt).toLocaleString()}
                            </small>
                        </div>
                        <button 
                            className="delete-notification-btn"
                            onClick={(e) => deleteNotification(notification.id, e)}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationList;