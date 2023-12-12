import React, { useState, useEffect } from 'react';
import NotificationService from "../../service/NotificationService";

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const notificationData = await NotificationService.getListNotification();
                setNotifications(notificationData.content);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchData();
    }, []);


    return (
        <section className="container projects section" id="projects" style={{marginTop:"60px"}}>
            <h2 className="section__title section__title-gradient projects__line">
                THÔNG TIN HƯỚNG DẪN
            </h2>
            <div className="row">
                <div className="col-md-8 mx-auto">
                    {notifications.map(notification => (
                        <div key={notification.notificationId} className={`alert ${notification.status ? 'alert-success' : 'alert-info'}`} role="alert">
                            <h4 className="alert-heading">{notification.timeNotification} {notification.status ? '' : <span className="badge badge-danger align-top">Mới</span>}</h4>
                            <p>{notification.content}</p>
                            <p>
                                <a href={notification.url} className="btn btn-primary" target="_blank">Xem chi tiết</a>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
         </section>
    );
};

export default NotificationList;
