import React from 'react'
import "./Activity.css";
import ActivityCard from "../../components/Activity/ActivityCard";
import RightSide from "../../components/RightSide/RightSide";

export default function Activity() {
    return (
        <>
            <div className="activity-container">
                <ActivityCard />
                <RightSide />
            </div>
        </>
    )
}
