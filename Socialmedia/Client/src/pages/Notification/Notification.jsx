import React from 'react';
import moment from 'moment'; // Import moment.js library
import './Notification.css';
import { getPost } from '../../api/Notification';

export default function Notification({ Notification, setNotifyPost }) {
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
    // console.log(Notification);

    const timeAgo = (timestamp) => {
        return moment(timestamp).fromNow(); // Calculate time difference using moment.js
    };    
 
    const handleNotificationClick = async (notificationId) => {
        try {
            const response = await getPost(notificationId);
            // Handle response data as needed
            setNotifyPost(response.data)
            // console.log(response.data);
        } catch (error) {
            console.error('Error fetching post data:', error);
        }
    };

    return (
        <>
            {Notification.length === 0 ? (
                <p>No Notification</p>
            ) : (
                <div className="notification" onClick={() => handleNotificationClick(Notification._id)}>
                    <div className='noti-contant'>
                        <img
                            src={Notification.userData.profilePicture
                                ? serverPublic + Notification.userData.profilePicture
                                : serverPublic + "defaultProfile.png"}
                            alt="Profile"
                            className="followerImage"
                            style={{ width: "50px", height: "50px" }}
                        />
                        <div className="name" style={{ fontSize: '0.8rem', marginLeft: '6px' }}>
                            <span>{Notification.userData.username}</span>
                            <p className='noti-msg'>{Notification.content}</p>
                        </div>
                    </div>   
                    <div className="timeStamp">{timeAgo(Notification.createdAt)}</div>
                </div> 
            )}
        </>
    );
}
