import React from "react";
import "./Followers.css";
import { Link } from "react-router-dom";

const Followers = ({ follower }) => {

    const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <>
            <div>
                <img
                    src={
                        follower.profilePicture
                            ? publicFolder + follower.profilePicture
                            : publicFolder + "defaultProfile.png"
                    }
                    alt="profile"
                    className="followerImage"
                />
                <Link to={`/profile/${follower._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="name">
                        <span>{follower.firstname} {follower.lastname}</span>
                        <span>@{follower.username}</span>
                    </div>
                </Link>
            </div>
        </>
    );
}

export default Followers;