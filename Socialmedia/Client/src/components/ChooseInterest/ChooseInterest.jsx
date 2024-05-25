import React, { useState } from 'react';
import './ChooseInterest.css';
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import Trending from "../../img/Trending.jpg";


export default function ChooseInterest({ onSelectInterest }) {
    const [selectedCard, setSelectedCard] = useState(null);

    // Function to handle card click and toggle the selected card
    const handleInterestClick = (interest) => {
        setSelectedCard(interest); // Update the selected card
        let type;
        if (interest === 0) {
            type = 'images';
        } else if (interest === 1) {
            type = 'videos';
        } else if (interest === 2) {
            type = 'trends'; // Or handle other interest types
        } else {
            type = null;
        }
        onSelectInterest(type); // Call the onSelectInterest function with the interest type
    };

    return (
        <>
            <div className="interest">
            <div className="card-row">
                <div
                    className={`card ${selectedCard === 0 ? 'selected' : ''} option`} style={{ color: "var(--photo)" }}

                    onClick={() => handleInterestClick(0)} // Pass the index of the card as the parameter
                >
                    <UilScenery/>
                    Images
                </div>
                <div
                    className={`card ${selectedCard === 1 ? 'selected' : ''} option` }  style={{ color: "var(--video)" }}
                    onClick={() => handleInterestClick(1)} // Pass the index of the card as the parameter
                >
                    <UilPlayCircle/>
                    Videos
                </div>
                <div
                    className={`card ${selectedCard === 2 ? 'selected' : ''} option`}  style={{ color: "var(--location)" }}
                    onClick={() => handleInterestClick(2)} // Pass the index of the card as the parameter
                >
                <img src={Trending} alt="" title="Trends" className='trend'/>
                    Trends
                </div>
                <div
                    className={`card ${selectedCard === 3 ? 'selected' : ''} option`}  style={{ color: "var(--video)" }}
                    onClick={() => handleInterestClick(3)} // Pass the index of the card as the parameter
                >
                    All
                </div>
            </div>
        </div>
        </>
    )
}
