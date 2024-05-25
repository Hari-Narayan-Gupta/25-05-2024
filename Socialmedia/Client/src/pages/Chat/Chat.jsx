
import React, { useRef, useState } from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Conversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
// import NavIcons from "../../components/NavIcons/NavIcons";
import "./Chat.css";
import { useEffect } from "react";
import { createChat, userChats } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { getAllUser } from "../../api/UserRequest";
import TrendCard from "../../components/TrendCard/TrendCard";
import { unreadMessages } from "../../api/MessageRequests";


const Chat = () => {
  const dispatch = useDispatch();
  const socket = useRef();
  const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState([]);
  // const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [occurClicked, setOccurClicked] = useState(false); // New state to track occur click
  const [unreadMessagesCount, setUnreadMessagesCount] = useState({}); // State for unread message counts
  const [searchResult, setSearchResult] = useState(null); 

  // Define occur function to createChatId  
  const occur = async (follower) => {
    try {  
      let followerId = follower._id
      const existingChat = chats.find(chat =>
        chat.members.includes(user._id) && chat.members.includes(followerId)
      );
      if (existingChat) {     
        // If a chat exists, return its ID
        setCurrentChat(existingChat);
      }
      else {
        const chatData = {
          userId: user._id, 
          otherUserIds: followerId
        };
        // console.log(chatData);
        const response = await createChat(chatData);
        //  console.log(response.data);
        setCurrentChat(response.data) 
      }
      setOccurClicked(true); // Set occurClicked to trigger useEffect
    } catch (error) {
      console.log(error);
    }
  };


  // for createChatId 
  // useEffect(() => {
  //   const createChatsWithFollowers = async () => {
  //     try {
  //       // Iterate over each follower
  //       // for (const follower of followers) {
  //       const chatData = {
  //         userId: user._id,
  //         otherUserIds: followers
  //       };
  //       console.log(chatData)
  //       const response = await createChat(chatData);
  //       // console.log(response); 
  //       // }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   if (occurClicked) {
  //     createChatsWithFollowers();
  //     setOccurClicked(false); // Reset occurClicked state after useEffect runs
  //   }
  // }, [followers, user._id, occurClicked])


  // for getting Followers 

  useEffect(() => {
    const fetchAllUsers = async () => {

      try {
        const response = await getAllUser();
        const userFollowersIds = user.followers.map(follower => follower._id);
        // console.log(userFollowersIds)
        const usersWithFollowers = response.data.filter(user =>
          userFollowersIds.includes(user._id)
        );
        // console.log(usersWithFollowers);
        setFollowers(usersWithFollowers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchAllUsers();
  }, [user._id]);



  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        // console.log(data)
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user._id]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("http://localhost:5000");
    // socket.current = io("http://newplex.searchsping.com");
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      // setOnlineUsers(users);
      // socket.current.on("recieve-notifications", (values) => {
      //   console.log("Received notification values:", values);
      // })
    });
  }, [user]);



  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);


  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      // console.log(data)
      setReceivedMessage(data);
    }

    );
  }, []);



  useEffect(() => {
    const fetchUnreadMessages = async () => {
      const unreadCounts = {};
      try {
        const { data } = await unreadMessages(user._id);
        // console.log(data); // Log the received data for debugging
        data.forEach(message => {
          const chatId = message.chatId;
          unreadCounts[chatId] = (unreadCounts[chatId] || 0) + 1;
        });
      } catch (error) {
        // console.error(`Error fetching unread messages:`, error);
      }
      setUnreadMessagesCount(unreadCounts);
      // console.log(unreadCounts); // Log the unreadCounts after setting state
    };
    fetchUnreadMessages();
  }, [occur]);


  const handleSearchResult = (result) => {
    setSearchResult(result);
    // console.log(result)

  };

    // Reorder the followers array based on searchResult
    const orderedFollowers = [...followers];
    if (searchResult) {
      orderedFollowers.sort((a, b) => {
        if (a.username === searchResult) return -1;
        if (b.username === searchResult) return 1;
        return 0;
      });
    }

  return (
    <>
      <div className="head">
        <div className="searcbox">
          <LogoSearch onSearchResult={handleSearchResult} />
          {/* <NavIcons /> */}
        </div>
        {/* <div className="icons">
          <NavIcons /> */}
        {/* <NavIcons unreadMessagesSize={Object.keys(unreadMessagesCount).length} /> */}
        {/* </div> */}
      </div>
      <div className="Chat">
        {/* Left Side */}
        <div className="Left-side-chat">
          {/* <LogoSearch /> */}

          <div className="Chat-container">
            <h2 className="chats">Chats</h2>
            <div className="Chat-list">

              {orderedFollowers.map((follower, index) => (
                <div onClick={() => { occur(follower); }}>
                  <Conversation
                    // data={chat}
                    follower={follower}
                    currentUser={user._id}
                    receivedMessage={receivedMessage}
                    unreadMessagesCount={unreadMessagesCount}
                    chatsId={chats}
                    user={user}
                    chat={currentChat}
                  />
                </div>
              )
              )}


            </div>
          </div>
        </div>

        {/* Right Side */}

        <div className="Right-side-chat">
          <div style={{ width: "20rem", alignSelf: "flex-end" }}>
            {/* <NavIcons /> */}
          </div>
          <ChatBox
            chat={currentChat}
            currentUser={user._id}
            setSendMessage={setSendMessage}
            receivedMessage={receivedMessage}
          />  
        </div>

        <div className="trends">
          {/* <NavIcons /> */}
          <TrendCard />
        </div>
      </div>
    </>
  );
};

export default Chat;


