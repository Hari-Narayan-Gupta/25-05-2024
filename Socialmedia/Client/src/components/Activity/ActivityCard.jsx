import React, { useEffect, useState } from 'react';
import './ActivityCard.css'; // Import CSS file for styling
import ActivityModalView from '../ActivityModalView/ActivityModalView';
import { getAllActivityPost } from '../../api/PostRequest';
import { useSelector } from "react-redux";


export default function Activity() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [postId, setPostId] = useState();
  const { user } = useSelector((state) => state.authReducer.authData);
  const [allActivityPosts, setAllActivityPosts] = useState();
  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;


  useEffect(() => {
    const AllActivityPost = async () => {
      try {
        const respose = await getAllActivityPost(user._id);
        // console.log(respose.data);
        setAllActivityPosts(respose.data);
      } catch (error) {
        console.log(error);
      }
    }
    AllActivityPost();
  }, [])

  const openModal = (imageSrc, postId) => {
    setSelectedImage(imageSrc);
    setPostId(postId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="card-container">
      <div className="activity-heading">
        <h2>Your Activities</h2>
      </div>
      <div className="post-container">
        {allActivityPosts && allActivityPosts.map((post, index) => {
          return (
            <div key={index} className="activity-card col-l-3 col-m-4 col-s-4 col-xs-4" onClick={() => openModal(serverPublic + post.image, post._id)}>
              <img className="activity-img" src={serverPublic + post.image} alt="Placeholder" />
            </div>
          );
        })}
      </div>      

      {modalOpen && (
        <ActivityModalView selectedImage={selectedImage} closeModal={closeModal} postId={postId} />
      )}
    </div>
  );
}

