import React from "react";
// import Posts from "../Posts/Posts";
import PostShare from "../PostShare/PostShare";
import "./PostSide.css";
import ProfilePosts from "../Posts/ProfilePosts";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";


const UserPost = () => {
  const params = useParams();
  const profileUserId = params.id;
  const { user } = useSelector((state) => state.authReducer.authData);

  return (
    <div className="PostSide">
      {profileUserId === user._id ? <PostShare/> : ""}
      {/* <Posts/> */}
      <ProfilePosts />
      
    </div>
  );
};

export default UserPost;