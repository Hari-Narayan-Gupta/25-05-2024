import React, { useEffect, useState, useRef } from 'react';
import './NotificationModal.css';
import Notification from '../../pages/Notification/Notification';
// import { getNotification } from '../../api/Notification';
import { useSelector } from "react-redux";
import { getReact } from '../../api/Notification';
import { getUser } from '../../api/UserRequest';
import CommentModal from '../CommentModal/CommentModal';

export default function NotificationModal({ onClose }) {
    const { user } = useSelector((state) => state.authReducer.authData);
    const [notificationData, setNotificationData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal open/close
    const [notfyPost, setNotifyPost] = useState();
    const componentIsMounted = useRef(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getReact(user._id);
                const notificationsData = response.data.notifications;
                if (notificationsData && Array.isArray(notificationsData)) {
                    const updatedNotifications = [];
                    for (const notification of notificationsData) {
                        // console.log(notification)
                        const userDataResponse = await getUser(notification.userId);
                        const userData = userDataResponse.data; // Assuming the user data is in response.data
                        const mergedData = { ...notification, userData };
                        updatedNotifications.push(mergedData);
                        // setNotificationData(updatedNotifications)
                        // console.log(mergedData)
                    }
                    updatedNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setNotificationData(updatedNotifications);
                    console.log(updatedNotifications)
                } else {
                    console.error('Invalid notifications data:', notificationsData);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchData();
        return () => {
            componentIsMounted.current = false; // Update ref to indicate component unmount
        };
    }, [user._id]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            <div className="notification-modal">
                <div className="notification-content">
                    <button className='noti-btn' onClick={onClose}>X</button>
                    <h2>Notifications</h2> <hr />
                    <div className="notifications">
                        {notificationData.map(noti => (
                            <div key={noti._id} className="notification" onClick={openModal}>
                                <Notification Notification={noti} setNotifyPost={setNotifyPost}/>
                            </div>
                        ))}
                        {/* <Notification/> */}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <>
                <CommentModal notfyPost={notfyPost} onClose={closeModal} />
                </> 
            )}
        </>
    );
}
