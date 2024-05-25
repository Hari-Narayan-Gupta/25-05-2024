import React, { useState } from "react";
import "./Modal.css";
import InputEmoji from 'react-input-emoji'
import Share from "../../img/share.png";
import { commentNow } from '../../api/PostRequest'; // Specify the correct path
import { getAllComments } from "../../api/PostRequest";
import { getAllUser } from "../../api/UserRequest";
import { useEffect } from "react";
import { notification } from "../../api/Notification";
import { Link } from "react-router-dom";



const CommentModal = ({ onClose, imageData, videoData, postId, user, notfyPost }) => {

    // const serverPublic = "https://newserver-1-rfyh.onrender.com/images/";
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);

    // console.log(notfyPost)
    // Function to handle changes in the input field
    const handleChange = (text) => {
        setNewComment(text); // Update the comment text
    };

    // Function to handle sending the comment
    const handleSend = async () => {
        try {
            if (newComment.trim() !== "") {
                // Call the commentNow API to add a new comment
                await commentNow(postId, { text: newComment, postedBy: user._id });

                // Call the notification API to send a notification
                const response = await notification(user._id, {
                    userId: user._id,
                    postId: postId,
                    type: 'comment',
                    content: 'commented on your post',
                });
                console.log(response)
                setNewComment("");
                fetchComments();
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    // Function to fetch comments
    const fetchComments = async () => {
        try {
            const response = await getAllComments(postId); // Fetch comments for the given postId
            const commentsWithUsers = await getCommentsWithUsers(response.data); // Add user information to comments
            setComments(commentsWithUsers); // Set comments state with the fetched comments
            // console.log(commentsWithUsers)
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // Function to get comments with user information
    const getCommentsWithUsers = async (comments) => {
        try {
            const response = await getAllUser(); // Fetch all users
            const allUsers = response.data;
            return comments.map(comment => {
                const user = allUsers.find(u => u._id === comment.postedBy);
                return {
                    text: comment.text,
                    user: user || { username: "Unknown User" } // If user not found, set username to "Unknown User"
                };
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            return comments.map(comment => ({
                text: comment.text,
                user: { username: "Unknown User" } // Set username to "Unknown User" if there's an error fetching users
            }));
        }
    };

    // Fetch comments and users when component mounts
    useEffect(() => {
        fetchComments();
        getAllUser()
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }, []);


    useEffect(() => {
        // Fetch comments when component mounts
        fetchComments();
    }, []);

    return (
        <>
            {notfyPost === undefined ? (
                <div className="modal-overlay" onClick={onClose}>
                    <div className="modal-content" style={(imageData === undefined && videoData === undefined) ? { backgroundColor: "white", borderRadius: "8px", padding: "6px", maxWidth: "80%", width: "65%", maxHeight: "80%", overflow: "auto" } : null} onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={onClose}> X </button>
                        <div className="modal-body">
                            {/* Render image */}
                            {imageData === undefined && videoData === undefined && (
                                <div className="left" style={{ height: "200px", width: "200px" }}>
                                    {/* Add default content here */}
                                    <p>No media available</p>
                                </div>
                            )}

                            {imageData && (
                                <div className="left">
                                    <img className="postimage" src={serverPublic + imageData} alt="Post Image" />
                                </div>
                            )}

                            {videoData && (
                                <div className="left">
                                    <video className="postvideo" src={serverPublic + videoData} controls alt="Post Video" />
                                </div>
                            )}

                            {/* No content on the right side */}
                            <div className="right">
                                <div className="allComments" style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
                                    {comments.map((comment, index) => (
                                        <div key={index} className="comment">
                                            <div className="image">
                                                <div className="userProfile commenter">
                                                    {/* <img src={process.env.REACT_APP_PUBLIC_FOLDER + comment.user.profilePicture} alt="Profile" /> */}
                                                    <img src={comment.user.profilePicture ? serverPublic + comment.user.profilePicture : serverPublic + "defaultProfile.png"} alt="Profile" />

                                                    <Link to={`/profile/${comment.user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                        <div className="name"><span>{comment.user.username}</span></div>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="comment-text">
                                                <p>{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="chat-sender">
                                    <InputEmoji
                                        value={newComment}
                                        onChange={handleChange}
                                        placeholder="Add a Comment..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSend(e);
                                            }
                                        }}
                                    />
                                    <div className="send-button button" onClick={handleSend}>
                                        <img className="send" src={Share} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) :
                <div className="modal-overlay" onClick={onClose}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={onClose}> X </button>
                        <div className="modal-body">
                            {notfyPost.image === undefined && notfyPost.video === undefined && (
                                <div className="left" style={{ height: "200px", width: "200px" }}>
                                    {/* Add default content here */}
                                    <p>No media available</p>
                                </div>
                            )}
                            {notfyPost.image && (
                                <div className="left">
                                    <img className="postimage" src={serverPublic + notfyPost.image} alt="Post Image" />
                                </div>
                            )}
                            {notfyPost.video && (
                                <div className="left">
                                    <img className="postimage" src={serverPublic + notfyPost.video} alt="Post Image" />
                                </div>
                            )}


                            <div className="right">
                                <div className="allComments" style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
                                    {notfyPost.comments.map(comment => (
                                        <div key={comment._id} className="comment">
                                            <div className="image">
                                                <div className="userProfile commenter">
                                                    {/* <img src={process.env.REACT_APP_PUBLIC_FOLDER + notfyPost.userId[1].profilePicture} alt="Profile" /> */}
                                                    <img src={notfyPost.userId[1].profilePicture ? serverPublic + notfyPost.userId[1].profilePicture : serverPublic + "defaultProfile.png"} alt="Profile" />
                                                    <div className="name"><span>{notfyPost.userId[1].username}</span></div>
                                                </div>
                                            </div>
                                            <div className="comment-text">
                                                <p>{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <hr style={{ width: "100%" }} />

                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default CommentModal;
