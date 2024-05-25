import React, { useState } from "react";
// import { useEffect } from "react";
// import { getAllUser } from "../../api/UserRequest";


const SendBox = ({ chatter, onSelect }) => {

    const [isSelected, setIsSelected] = useState(false);

    const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

    const handleSelect = (e) => {
        e.stopPropagation();
        setIsSelected(!isSelected); // Toggle the isSelected state when the user clicks on the div
        onSelect(chatter); // Pass the selected chatter to the parent component
    };

    return (
        <>
        <div className={` conversation ${isSelected ? "selected" : ""}`} onClick={handleSelect}>
            <div className="sharePost" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="chatter-info" style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src={chatter.profilePicture ? serverPublic + chatter.profilePicture : serverPublic + "defaultProfile.png"}
                        alt="Profile"
                        className="followerImage"
                        style={{ width: "50px", height: "50px" }}
                    />
                    <div className="chatter-name" style={{ fontSize: '0.8rem', fontWeight: '600', marginLeft: '10px' }}>
                        <span>{chatter.firstname} {chatter.lastname}</span>
                    </div>
                </div>
                {isSelected && <div className="checkmark">&#10003;</div>}
            </div>
        </div>
        <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
    );  
}
export default SendBox; 