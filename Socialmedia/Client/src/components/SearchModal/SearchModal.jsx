import React, { useState, useEffect } from "react";
import './SearchModal.css';
import searchIcon from '../../img/search.png';
import { getAllUser } from "../../api/UserRequest";
import { Link } from "react-router-dom";
import { getAllPosts } from "../../api/PostRequest";
import HashtagPost from "../HashtagPost/HashtagPost";
import { useSelector } from "react-redux";

const SearchModal = ({ onClose }) => {
    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showUsers, setShowUsers] = useState(true);
    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useSelector((state) => state.authReducer.authData);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUser();
                setUsers(response.data);
            } catch (error) {
                console.log(error);
            } 
        };  
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        setSearchText(e.target.value);
    };

    // Function to filter users based on search text
     const filteredUsers = users.filter(otherUser =>
        otherUser.username.toLowerCase().includes(searchText.toLowerCase()) &&
        (!otherUser.blockedUsers || !otherUser.blockedUsers.includes(user._id))
    );

    
    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await getAllPosts();
                setSearchResults(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        getPosts();
    }, []);

    let filteredPosts = [];
    if (showUsers || searchText.startsWith('#')) {
        const hashtag = searchText.startsWith('#') ? searchText.substring(1) : searchText;
        filteredPosts = searchResults.filter(post =>
            post.desc.toLowerCase().includes(`#${hashtag.toLowerCase()}`)
        );
    }

    const handlePostClick = (post) => {
        setSelectedPost(post);
    };

    const closePostModal = () => {
        setSelectedPost(null);
    };

    const toggleView = (view) => {
        setShowUsers(view === 'users');
        if (view === 'posts') {
            setSearchText(searchText.startsWith('#') ? searchText : `#${searchText}`);
        } else {
            setSearchText(searchText.startsWith('#') ? searchText.substring(1) : searchText);
        }
    };

    return (
        <div className="search-modal-overlay" onClick={onClose}>
            <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>X</button>
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="search-input"
                            value={searchText}
                            onChange={handleInputChange}
                        />
                        {!searchText && <img src={searchIcon} alt="Search" className="search-input-icon" />}
                    </div>
                    {searchText && (
                        <div className="filter-btn">
                            <div className="posts-filter">
                                <button className="post-btn search-filter-btn" style={{ backgroundColor: showUsers ? '' : '#ededed' }} onClick={() => toggleView('posts')}>Posts</button>
                            </div>
                            <div className="peoples-filter">
                                <button className="people-btn search-filter-btn" style={{ backgroundColor: showUsers ? '#ededed' : '' }} onClick={() => toggleView('users')}>Peoples</button>
                            </div>
                        </div>
                    )}
                    {searchText && (
                        <>
                            {showUsers && (
                                <div className="user-list">
                                    {filteredUsers.slice(0, 5).map((user) => (
                                        <div className="user-card" key={user._id}>
                                            <img
                                                src={
                                                    user.profilePicture
                                                        ? serverPublic + user.profilePicture
                                                        : serverPublic + "defaultProfile.png"
                                                }
                                                alt="profile"
                                                className="followerImage"
                                            />
                                            <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                                <div className="name name-contain">
                                                    <span>{user.firstname} {user.lastname}</span>
                                                    <span>@{user.username}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                    {filteredUsers.length > 5 && (
                                        <button className="view-more-btn" onClick={() => toggleView('users')}>
                                            View More
                                        </button>
                                    )}
                                </div>
                            )}
                            {!showUsers && filteredPosts.length > 0 && (
                                <div className="post-list">
                                    {filteredPosts.slice(0, 5).map((post) => (
                                        <div key={post._id} className="activity-card col-m-4 col-s-4 col-xs-4" onClick={() => handlePostClick(post)}>
                                            <img className="activity-img" src={serverPublic + post.image} alt="Placeholder" />
                                        </div>
                                    ))}
                                    {filteredPosts.length > 5 && (
                                        <button className="view-more-btn" onClick={() => toggleView('posts')}>
                                            View More
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {selectedPost && (
                <HashtagPost selectedPost={selectedPost} closeModal={closePostModal} serverPublic={serverPublic} />
            )}
        </div>
    );
};

export default SearchModal;
