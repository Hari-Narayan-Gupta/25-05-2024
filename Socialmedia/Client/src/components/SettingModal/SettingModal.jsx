import React, { useState } from 'react';
import "./SettingModal.css";
import ProfileModal from "../ProfileModal/ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/AuthAction";
import Activity from "../../img/activity.png";
import Blocked from "../../img/blocked.png";
import Insurance from "../../img/insurance.png";
import User from "../../img/user.png";
import { Link } from "react-router-dom";
import BlockUser from '../BlockUserModal/BlockUser';

export default function SettingModal({ onClose }) {
  const [modalOpened, setModalOpened] = useState(false);
  const [blockUserModalOpened, setBlockUserModalOpened] = useState(false);
  const { user } = useSelector((state) => state.authReducer.authData);
  const [isPrivateProfile, setIsPrivateProfile] = useState(false); // Track privacy status
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false); // Track visibility of privacy dropdown

  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logout());
  }

  const togglePrivacy = () => {
    setIsPrivateProfile(!isPrivateProfile); // Toggle privacy status
  }

  const togglePrivacyDropdown = () => {
    setShowPrivacyDropdown(!showPrivacyDropdown); // Toggle visibility of privacy dropdown
  }

  return (
    <div className="setting-modal">
      <div className="setting-modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Setting</h2> <hr />
        <ProfileModal
          modalOpened={modalOpened}
          setModalOpened={setModalOpened}
          data={user}
        />
        <BlockUser
          modalOpened={blockUserModalOpened}
          setModalOpened={setBlockUserModalOpened}
        />  
        <div className="setting">
          <div className="setting-head" onClick={() => setModalOpened(true)}>
            <div className="icon">
              <img className='activity' src={User} alt="activity" />
            </div>
            <div className="setting-contant">
              <p>Edit Profile</p>
            </div>
          </div><hr />
          <div className="setting-head">
            <div className="icon">
              <img className='activity' src={Activity} alt="activity" />
            </div>
            <Link className='setting-link' to="../activity">
              <div className="setting-contant">
                <p>Activity</p>
              </div>
            </Link>
          </div><hr />
          <div className="setting-head" onClick={() => setBlockUserModalOpened(true)}>
            <div className="icon">
              <img className='activity' src={Blocked} alt="Blocked" />
            </div>
            <div className="setting-contant">
              <p>Block Users</p>
            </div>
          </div><hr />
          <div className="setting-head" onClick={togglePrivacyDropdown}>
            <div className="icon">
              <img className='activity' src={Insurance} alt="activity" />
            </div>
            <div className="setting-contant">
              <p>Privacy</p>
            </div>
          </div>
          {showPrivacyDropdown && (
            <div className="dropdown">
              <span className="profile-label">{isPrivateProfile ? 'Private Profile' : 'Public Profile'}</span>
              <label className="switch">
                <input type="checkbox" checked={isPrivateProfile} onChange={togglePrivacy} />
                <span className="slider"></span>
              </label>
            </div>
          )}
          <hr />
          <div className="logout-btn">
            <button className="button logout-button" onClick={handleLogOut}>Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}
