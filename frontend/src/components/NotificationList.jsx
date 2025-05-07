import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationList.css';

const NotificationList = ({ userId }) => {
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
            setNotifications(notifications.map(notif => 
                notif.id === notificationId ? {...notif, isRead: true} : notif
            ));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    if (loading) return <div>Loading notifications...</div>;

    return (
        <div className="notifications-container">
            {notifications.length === 0 ? (
                <p>No notifications</p>
            ) : (
                notifications.map(notification => (
                    <div 
                        key={notification.id} 
                        className={`notification ${!notification.isRead ? 'unread' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                    >
                        <p>{notification.message}</p>
                        <small>{new Date(notification.createdAt).toLocaleString()}</small>
                    </div>
                ))
            )}
        </div>
    );
};

export default NotificationList;