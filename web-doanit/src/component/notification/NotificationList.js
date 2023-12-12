// NotificationList.js
import React, { useState, useEffect } from 'react';
import * as NotificationService from "../../service/NotificationService";
import Header from "../../parts/Header";
import Footer from "../../parts/Footer";
import './notification.css'
const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Truyền tham số id vào hàm getListNotification
                const notificationData = await NotificationService.getListNotification(0);
                setNotifications(notificationData.content);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>

            <section className="container projects section" id="projects">
                <h2 className="section__title section__title-gradient projects__line">
                    THÔNG TIN HƯỚNG DẪN
                </h2>
                <div className="row">
                    <div className="col-md-8 mx-auto">
                        {notifications && notifications.length > 0 ? (
                            notifications.map(notification => (
                                <div key={notification.notificationId} className={`alert ${notification.status ? 'alert-success' : 'alert-info'}`} role="alert">
                                    <h4 className="alert-heading">{notification.timeNotification} {notification.status ? '' : <span className="badge badge-danger align-top">Mới</span>}</h4>
                                    <p>{notification.content}</p>
                                    <p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={async () => {
                                                await NotificationService.seenNotification(notification.notificationId);
                                                // Chuyển hướng đến đường dẫn chi tiết
                                                window.open(notification.url, '_blank');
                                            }}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-warning" role="alert">
                                <p>No notifications available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

        </>
    );
};

export default NotificationList;
