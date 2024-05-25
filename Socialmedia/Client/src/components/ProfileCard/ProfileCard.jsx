import React, { useEffect, useState } from "react";
import "./ProfileCard.css";
import instagram from "../../img/instagram-icon.png";
import facebook from "../../img/facebook-icon.png";
import twitter from "../../img/X-icon.png";
import youtube from "../../img/youtube-icon.png";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as UserApi from "../../api/UserRequest";
import ProfileFollowerModal from "../ProfileFollowerModal/ProfileFollowerModal";
import ProfileFollowingModal from "../ProfileFollowingModal/ProfileFollowingModal";
import { followUser, unfollowUser } from "../../actions/userAction";
import { blockUser, unblockUser } from "../../actions/userAction";
// import { getUser } from "../../api/UserRequest";

const ProfileCard = ({ location }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.postReducer.posts);
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
  const [profileUser, setProfileUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const profileUserId = params.id;
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const isCurrentUser = user._id === profileUserId;

  useEffect(() => {
    const getProfileDetails = async () => {
      try {
        setIsLoading(true);
        const response = await UserApi.getUser(profileUserId);
        setProfileUser(response.data);
        setIsFollowing(user.following && user.following.includes(profileUserId));
        setIsBlocked(user.blockedUsers && user.blockedUsers.includes(profileUserId));
        // console.log(user)
        console.log("isBlocked: " + (user.blockedUsers && user.blockedUsers.includes(profileUserId)));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching profile details:", error);
        setIsLoading(false);
      }
    };
    getProfileDetails();
  }, [profileUserId, user]);


  useEffect(() => {
    if (!isLoading) {
      setIsBlocked(user.blockedUsers && user.blockedUsers.includes(profileUserId));
    }
  }, [user.blockedUsers, profileUserId, isLoading]);


  const toggleFollowerModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsFollowingModalOpen(false);
  };

  const toggleFollowingModal = () => {
    setIsFollowingModalOpen(!isFollowingModalOpen);
    setIsModalOpen(false);
  };

  const handleFollow = async () => {
    try {
      if (!isBlocked) {
        if (isFollowing) {
          console.log("Unfollow")
          await dispatch(unfollowUser(profileUserId, user));
          setIsFollowing(false);
        } else {
          console.log("follow")
          await dispatch(followUser(profileUserId, user));
          setIsFollowing(true);
        }
      }
    } catch (error) {
      console.error("Error handling follow/unfollow:", error);
    }
  };

  const handleCopyProfileURL = () => {
    const profileURL = `${window.location.origin}/profile/${profileUserId}`;
    navigator.clipboard
      .writeText(profileURL)
      .then(() => {
        alert("Profile URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy profile URL: ", err);
      });
  };




  const handleBlock = async () => {
    try {
      await dispatch(blockUser(profileUserId, user._id));
      setIsBlocked(true);
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };


  const handleUnBlock = async () => {
    try {
      await dispatch(unblockUser(profileUserId, user._id));
      setIsBlocked(false);
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };



  return (
    <div className="ProfileCard">
      <div className="ProfileImages">
        <img
          src={
            profileUser.coverPicture
              ? serverPublic + profileUser.coverPicture
              : serverPublic + "defaultCover.jpg"
          }
          alt="CoverImage"
        />
        <img
          src={
            profileUser.profilePicture
              ? serverPublic + profileUser.profilePicture
              : serverPublic + "defaultProfile.png"
          }
          alt="ProfileImage"
        />
      </div>
      <div className="ProfileName">
        <span>{profileUser.firstname} {profileUser.lastname}</span>
        <span>{profileUser.workAt ? "Working at " + profileUser.workAt : 'Write about yourself'}</span>
      </div>

      <div className="ProfileCard">
        {(user._id !== profileUserId && !isCurrentUser) && (
          <>
            {isBlocked ? (
              <div className="follow-btn">
                <button
                  className="button fc-button UnfollowButton"
                  style={{ width: '80%' }}
                  onClick={handleUnBlock}
                >
                  Unblock
                </button>
              </div>
            ) : (
              <div className="follow-btn">
                {isFollowing ? (
                  <button
                    className="button fc-button UnfollowButton"
                    style={{ width: '80%' }}
                    onClick={handleFollow}
                  >
                    Unfollow
                  </button>
                ) : (
                  <button
                    className="button fc-button FollowButton"
                    style={{ width: '80%' }}
                    onClick={handleFollow}
                  >
                    Follow
                  </button>
                )}
                <div className="dots-dropdown">
                  <div className="dots"></div>
                  <div className="dots"></div>
                  <div className="dots"></div>
                  <div className="dropdown-content">
                    <button onClick={handleBlock}>Block</button>
                    <button onClick={handleCopyProfileURL}>Profile URL</button>
                    <button>Share Profile</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="socialLinkHead">
        <div className="socialMeadiaLink">
          <Link to={`https://www.facebook.com/${profileUser.facebook}`} className="socialLink" target="_blank">
            <div className="facebook-logo logo">
              <img className="facebook" src={facebook} alt="facebook" />
            </div>
          </Link>
          <Link to={`https://www.instagram.com/${profileUser.instagram}`} className="socialLink" target="_blank">
            <div className="instagram-logo logo">
              <img className="instagram" src={instagram} alt="instagram" />
            </div>
          </Link>
          <Link to={`https://twitter.com/${profileUser.twitter}`} className="socialLink" target="_blank" >
            <div className="twitter-logo logo">
              <img className="twitter" src={twitter} alt="twitter" />
            </div>
          </Link>
          <Link to={`${profileUser.youtube}`} className="socialLink" target="_blank" >
            <div className="youtube-logo logo">
              <img className="youtube" src={youtube} alt="youtube" />
            </div>
          </Link>
        </div>
      </div>

      <div className="followStatus">
        <hr />
        <div>
          <div className="follow" onClick={toggleFollowerModal}>
            <span>{profileUser.followers ? profileUser.followers.length : 0}</span>
            <span>Followers</span>
          </div>
          <div className="vl"></div>
          <div className="follow" onClick={toggleFollowingModal}>
            <span>{profileUser.following ? profileUser.following.length : 0}</span>
            <span>Following</span>
          </div>
          {location === "profilePage" && (
            <>
              <div className="vl"></div>
              <div className="follow">
                <span>{posts.filter((post) => post.userId[0] === profileUserId).length}</span>
                <span>Posts</span>
              </div>
            </>
          )}
        </div>
        <hr />
      </div>

      {location === "profilePage" ? (
        ""
      ) : (
        <span>
          <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            My Profile
          </Link>
        </span>
      )}

      {isModalOpen && (
        <ProfileFollowerModal onClose={toggleFollowerModal} profileUser={profileUser} />
      )}

      {isFollowingModalOpen && (
        <ProfileFollowingModal onClose={toggleFollowingModal} profileUser={profileUser} />
      )}
    </div>
  );
};

export default ProfileCard;
