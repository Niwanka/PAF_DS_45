import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/NotificationList.css';

const NotificationList = ({ userId, onNotificationRead }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeletingNotification, setIsDeletingNotification] = useState(false);

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
                notif._id === notificationId ? {...notif, isRead: true} : notif
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
            toast.warn(
                <div>
                    Are you sure you want to delete this notification?
                    <div style={{ marginTop: '10px', textAlign: 'right' }}>
                        <button
                            onClick={() => {
                                toast.dismiss();
                                confirmDelete(notificationId);
                            }}
                            style={{
                                marginRight: '10px',
                                padding: '5px 10px',
                                background: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => toast.dismiss()}
                            style={{
                                padding: '5px 10px',
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>,
                {
                    position: "top-center",
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                    closeButton: false
                }
            );
        } catch (error) {
            console.error('Error in deleteNotification:', error);
            toast.error('Failed to initiate deletion');
        }
    };

    const confirmDelete = async (notificationId) => {
        if (isDeletingNotification) return;
        
        setIsDeletingNotification(true);
        try {
            const response = await axios.delete(
                `http://localhost:9090/api/notifications/${notificationId}`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                setNotifications(prevNotifications => 
                    prevNotifications.filter(notif => notif._id !== notificationId)
                );
                toast.dismiss();
                toast.success('Notification deleted successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
            toast.dismiss();
            toast.error('Failed to delete notification', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setIsDeletingNotification(false);
        }
    };

    const deleteAllNotifications = async () => {
        toast.warn(
            <div>
                Are you sure you want to delete all notifications?
                <div style={{ marginTop: '10px', textAlign: 'right' }}>
                    <button
                        onClick={() => confirmDeleteAll()}
                        style={{
                            marginRight: '10px',
                            padding: '5px 10px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Delete All
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        style={{
                            padding: '5px 10px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                closeButton: false
            }
        );
    };

    const confirmDeleteAll = async () => {
        try {
            await axios.delete(
                `http://localhost:9090/api/notifications/user/${userId}`,
                { withCredentials: true }
            );
            setNotifications([]);
            onNotificationRead();
            toast.dismiss();
            toast.success('All notifications deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Failed to delete all notifications:', error);
            toast.dismiss();
            toast.error('Failed to delete notifications', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg max-h-[500px] overflow-auto notifications-container">
            <div className="sticky top-0 bg-white px-4 py-3 border-b border-gray-100 flex justify-between items-center notifications-header">
                <h3 className="font-semibold text-gray-700">Notifications</h3>
                {notifications.length > 0 && (
                    <button 
                        className="clear-all-btn"
                        onClick={deleteAllNotifications}
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="divide-y divide-gray-100">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-gray-500">
                        <i className="far fa-bell-slash text-3xl mb-2"></i>
                        <p>No notifications</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <div 
                            key={notification._id}
                            className={`group flex items-start p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                                !notification.isRead ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markAsRead(notification._id)}
                        >
                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                !notification.isRead ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'
                            }`}>
                                <i className="fas fa-bell text-sm"></i>
                            </div>

                            <div className="flex-1 ml-4">
                                <p className={`text-sm ${!notification.isRead ? 'font-medium' : 'text-gray-600'}`}>
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <button 
                                className="shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-500"
                                onClick={(e) => deleteNotification(notification._id, e)}
                            >
                                <i className="fas fa-times text-sm"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationList;