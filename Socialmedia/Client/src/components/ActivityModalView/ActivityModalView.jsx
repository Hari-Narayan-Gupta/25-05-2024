import React, { useEffect, useState } from 'react';
import { getAllComments } from '../../api/PostRequest';
import { getAllUser } from '../../api/UserRequest';
import "./ActivityModalView.css";
import { Link } from "react-router-dom";


export default function ActivityModalView({ selectedImage, closeModal, postId }) {
    const [allComment, setAllComment] = useState([]);
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await getAllComments(postId); // Fetch comments for the given postId
                const commentsWithUsers = await getCommentsWithUsers(response.data);
                setAllComment(commentsWithUsers);
                // console.log(commentsWithUsers)
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        getComments();
    }, [postId]);

    const getCommentsWithUsers = async (comments) => {
        try {
            const response = await getAllUser(); // Fetch all users
            const allUsers = response.data;
            return comments.map(comment => {
                const user = allUsers.find(u => u._id === comment.postedBy);
                return {
                    _id: comment._id, // Add _id property
                    text: comment.text,
                    user: user || { username: "Unknown User" } // If user not found, set username to "Unknown User"
                };
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            return comments.map(comment => ({
                _id: comment._id, // Add _id property
                text: comment.text,
                user: { username: "Unknown User" } // Set username to "Unknown User" if there's an error fetching users
            }));
        }
    };

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content modalContent">
                    <div className=" modal-body">
                        <div className="modal-left">
                            <img className="activity-img" src={selectedImage} alt="Selected" />
                        </div>
                        <div className="allComments modal-right" style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
                            {allComment.length === 0 ? (
                                <div className="no-comments">No comments</div>
                            ) : (
                                allComment.map((comment, index) => (
                                    <div key={index} className="comment">
                                        <div className="image">
                                            <div className="userProfile commenter">
                                                <img className="postimage" src={serverPublic + comment.user.profilePicture} alt="Profile" />
                                                <Link to={`/profile/${comment.user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                    <div className="name"><span>{comment.user.username}</span></div>
                                                </Link>         
                                           </div>
                                        </div>
                                        <div className="comment-text">
                                            <p>{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className="close-btn" onClick={closeModal}>X</button>
                    </div>
                </div>
            </div>
        </>
    );
}
