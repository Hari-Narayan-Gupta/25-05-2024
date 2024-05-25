import React, { useEffect, useState } from 'react';
import "./BlockUser.css";
import { useSelector, useDispatch } from "react-redux";
// import profile from "../../img/profileImg.jpg";
import { getBlockUser, getUser } from '../../api/UserRequest';
import { unblockUser } from "../../actions/userAction";


export default function BlockUser({ modalOpened, setModalOpened }) {

    const { user } = useSelector((state) => state.authReducer.authData);
    // const [blockedUsersId, setBlockedUsersId] = useState([]);
    const dispatch = useDispatch();
    const [blockedUsers, setBlockedUsers] = useState([]);
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            if (modalOpened) {
                try {
                    const { data } = await getBlockUser(user._id);
                    // console.log(data); // List of blocked user IDs

                    // Fetch details for each blocked user
                    const blockedUsersDetails = await Promise.all(data.map(async (userId) => {
                        const userResponse = await getUser(userId);
                        return userResponse.data;
                    }));
                    // console.log(blockedUsersDetails);
                    setBlockedUsers(blockedUsersDetails);
                } catch (error) {
                    console.error("Error fetching blocked users:", error);
                }
            }
        };

        fetchBlockedUsers();
    }, [modalOpened, user._id]);

    const handleUnblockUser = async (profileUserId) => {
        // try {
        //     await unblockUser(userId, user._id);
        //     setBlockedUsers(blockedUsers.filter(user => user._id !== userId));
        // } catch (error) {
        //     console.error("Error unblocking user:", error);
        // }
        try {
            await dispatch(unblockUser(profileUserId, user._id));
            // setIsBlocked(false);
          } catch (error) {
            console.error("Error unblocking user:", error);
          }
    };

    return (
        <>
            {modalOpened && (
                <div className="block-user-modal">
                    <div className="block-user-modal-content">
                        <button className="close-btn BlockClose-btn" onClick={() => setModalOpened(false)}>X</button>
                        <h2>Block User</h2>
                        <div className="blocked-user">
                            {blockedUsers.map(blockedUser => (
                                <>
                                    <div className="follower block-user" key={blockedUser._id}>
                                        <div>
                                            <img
                                                src={blockedUser.profilePicture ? serverPublic + blockedUser.profilePicture : serverPublic + "defaultProfile.png"}
                                                alt="profile"
                                                className="followerImage"
                                            />
                                            <div className="name">
                                                <span>{blockedUser.firstname} {blockedUser.lastname}</span>
                                                <span>{blockedUser.username}</span>
                                            </div>
                                        </div>
                                        <button
                                            className="button fc-button UnfollowButton"
                                            onClick={() => handleUnblockUser(blockedUser._id)}
                                        >
                                            unblock
                                        </button>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
