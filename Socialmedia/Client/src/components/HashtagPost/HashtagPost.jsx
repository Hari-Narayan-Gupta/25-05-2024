import React from 'react';
import { useSelector } from "react-redux";


const HashtagPost = ({ selectedPost, closeModal, serverPublic }) => {
    const { image, comments } = selectedPost;
    // console.log(selectedPost.comments)
    const { user } = useSelector((state) => state.authReducer.authData);


    return (
        <div className="modal-overlay">
            <div className="modal-content modalContent">
                <div className="modal-body">
                    <div className="modal-left">
                        <img className="activity-img" src={serverPublic + image} alt="Selected" />
                    </div>
                    <div className="allComments modal-right" style={{ maxHeight: "300px", overflowY: "auto", marginTop: "10px" }}>
                        {comments.length === 0 ? (
                            <div className="no-comments">No comments</div>
                        ) : (
                            comments.map((comment, index) => (
                                <div key={index} className="comment">
                                    <div className="image">
                                        <div className="userProfile commenter">
                                            <img className="postimage" src={serverPublic + user.profilePicture} alt="Profile" />
                                            <div className="name">
                                                <span>{user.username}</span>
                                            </div>
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
    );
};

export default HashtagPost;
