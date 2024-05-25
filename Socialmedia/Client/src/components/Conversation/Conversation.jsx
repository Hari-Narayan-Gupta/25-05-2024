import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { getUser } from "../../api/UserRequest";
import { readMessages } from "../../api/MessageRequests";

const Conversation = ({ chatsId, follower, unreadMessagesCount, user, chat }) => {

  // const [userData, setUserData] = useState(null)
  const [online, setOnline] = useState(false)

  const dispatch = useDispatch()
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
  // const serverPublic = "https://newserver-4.onrender.com/images/";

  useEffect(() => {
    // Check if is_online is "0" (offline) or not
    if (follower.is_online === "1") {
      setOnline(true);
    } else {
      setOnline(false)
    }  

  }, [follower.is_online]);

  const isPartOfChat = chatsId.some(chat => chat.members.includes(follower._id));
  const unreadCount = unreadMessagesCount[chatsId.find(chat => chat.members.includes(follower._id))?._id] || 0;

  const markAsRead = () => {
    const senderId = follower._id; // Provide senderId here
    const receiverId = user._id; // ReceiverId is follower's _id

    readMessages(senderId, receiverId)
      .then(response => {
        console.log('Message marked as read:', response.data);
      })
      .catch(error => {
        console.error('Error marking message as read:', error);
      });
  };

  return (
    <>
      <div className="follower conversation" onClick={markAsRead}>
        <div>
          {online && <div className="online-dot"></div>}
          <img
            src={follower.profilePicture
              ? serverPublic + follower.profilePicture
              : serverPublic + "defaultProfile.png"}
            alt="Profile"
            className="followerImage"
            style={{ width: "50px", height: "50px" }}
          />
          {/* {isPartOfChat && <div className="unread-count"><span className="count">{unreadCount}</span></div>} */}
          {Object.keys(unreadMessagesCount).length > 0 && isPartOfChat && (
            unreadCount !== 0 ?
              <div className="unread-count">
                <span className="count">{unreadCount}</span>
              </div>
              : ""
          )}

          <div className="name" style={{ fontSize: '0.8rem' }}>
            <span>{follower.firstname} {follower.lastname}</span>
            <span style={{ color: online ? "#51e200" : "" }}>{online ? "Online" : "Offline"}</span>
          </div>
        </div>
        {/* {isPartOfChat && <div className="unread-count"><span className="count">{unreadCount}</span></div>} */}
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>  
  );
};

export default Conversation;