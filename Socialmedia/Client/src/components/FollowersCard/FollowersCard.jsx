import React, { useEffect, useState } from "react";
import "./FollowersCard.css";
import FollowersModal from "../FollowersModal/FollowersModal";
import { getAllUser } from "../../api/UserRequest";
import User from "../User/User";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const FollowersCard = ({ location }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [persons, setPersons] = useState([]);
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch();
  const params = useParams();
  const profileUserId = params.id;

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUser();
        const filteredPersons = data.filter(person => {
          // Filter out persons who are in the user.following array or user.blockedUsers array
          return !user.following.some(followedUser => followedUser === person._id) &&
                 !user.blockedUsers.some(blockedUser => blockedUser === person._id) &&
                 (!person.blockedUsers || !person.blockedUsers.some(blockedUser => blockedUser === user._id));     
        });
        setPersons(filteredPersons);
      } catch (error) {
        console.error("Error fetching persons:", error);
      }
    };

    fetchPersons();
  }, [profileUserId, user.following, user.blockedUsers]);



  return (
    <div className="FollowersCard">
      <h3>People you may know</h3>

      {persons.map((person, id) => {
        if (person._id !== user._id) return <User person={person} key={id} />;
      })}
      {!location ? (
        <span onClick={() => setModalOpened(true)}>Show more</span>
      ) : (
        ""
      )}

      <FollowersModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
      />
    </div>
  );
};

export default FollowersCard;
