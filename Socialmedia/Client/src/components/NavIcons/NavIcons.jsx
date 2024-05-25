import React, { useEffect, useState } from "react";
import './NavIcons.css';
import Home from "../../img/home.png";
import Noti from "../../img/noti.png";
import Comment from "../../img/messenger.png";
import { UilSetting } from "@iconscout/react-unicons";
import { Link } from "react-router-dom";
import { unreadMessages } from "../../api/MessageRequests";
import { useSelector } from "react-redux";
import NotificationModal from "../NotificationModal/NotificationModal";
import { getUnreadNotificationCount, markNotificationAsRead } from "../../api/Notification";
import SettingModal from "../SettingModal/SettingModal";
import SearchModal from "../SearchModal/SearchModal"; // Import the new SearchModal component
import search from '../../img/search.png';

const NavIcons = () => {
  const [unreadMessagesCount, setUnreadMessagesCount] = useState({});
  const [unreadNotificationCount, setUnreadNotificationCount] = useState({});
  const { user } = useSelector((state) => state.authReducer.authData);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false); // State for search modal

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    const fetchUnreadNotification = async () => {
      try {
        const response = await getUnreadNotificationCount(user._id);
        if (isMounted) {
          setUnreadNotificationCount(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUnreadNotification();

    return () => {
      isMounted = false; // Component is unmounted, update flag
    };  
  }, [user._id]);

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    const fetchUnreadMessages = async () => {
      const unreadCounts = {};
      try {
        const { data } = await unreadMessages(user._id);
        data.forEach(message => {
          const chatId = message.chatId;
          unreadCounts[chatId] = (unreadCounts[chatId] || 0) + 1;
        });
      } catch (error) {
      }
      if (isMounted) {
        setUnreadMessagesCount(unreadCounts);
      }
    };
       
    fetchUnreadMessages();

    return () => {
      isMounted = false; // Component is unmounted, update flag
    };
  }, [user._id]);

  const unreadMessagesSize = Object.keys(unreadMessagesCount).length;

  const markNotificationAsReadHandler = async () => {
    try {
      const response = await markNotificationAsRead(user._id);
      // console.log(response);
      setUnreadNotificationCount(0);
    } catch (error) {
      console.log(error);
    }
  }; 

  return (
    <div className="navIcons">
      <Link to="../home">
        <img src={Home} alt="" title="Home" />
      </Link>
      <UilSetting style={{ cursor: 'pointer' }} onClick={() => setShowSettingModal(true)} />

      <div className="search-icon-container" onClick={() => setShowSearchModal(true)}>
        <img src={search} alt="" title="search" className="search-icon" />
      </div>

      <div className="notification-icon-container" onClick={markNotificationAsReadHandler}>
        <img src={Noti} alt="" title="Notification" className="notification-icon" onClick={() => setShowNotificationModal(true)} />
        {unreadNotificationCount.unreadNotificationsCount > 0 && (
          <div className="unread-notification-count-nav noti">
            <span className="unreadCount">{unreadNotificationCount.unreadNotificationsCount}</span>
          </div>
        )}
      </div>

      <Link to="../chat">
        {unreadMessagesSize > 0 && (
          <div className="unread-count-nav msg-noti"><span className="unreadCount">{unreadMessagesSize}</span></div>
        )}
        <img src={Comment} alt="" title="Messenger" />
      </Link>

      {showNotificationModal && <NotificationModal onClose={() => setShowNotificationModal(false)} />}
      {showSettingModal && <SettingModal onClose={() => setShowSettingModal(false)} />}
      {showSearchModal && <SearchModal onClose={() => setShowSearchModal(false)} />} {/* Render SearchModal */}
        
    </div>
  );
};

export default NavIcons;
