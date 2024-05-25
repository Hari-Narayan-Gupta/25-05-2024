// import React from "react";
// import Posts from "../Posts/Posts";
// import PostShare from "../PostShare/PostShare";
// import "./PostSide.css";
// import ChooseInterest from "../ChooseInterest/ChooseInterest";

// const PostSide = () => {
//   return (
//     <div className="PostSide">
//       <PostShare/>
//       <ChooseInterest/>
//       <Posts/>
//     </div>
//   );
// };

// export default PostSide;


import React, { useState } from "react";
import Posts from "../Posts/Posts";
import PostShare from "../PostShare/PostShare";
import "./PostSide.css";
import ChooseInterest from "../ChooseInterest/ChooseInterest";

const PostSide = () => {
  const [selectedInterest, setSelectedInterest] = useState(null);

  // Function to handle interest card click and set the selected interest
  const handleInterestClick = (interest) => {
    setSelectedInterest(interest);
  };

  return (
    <div className="PostSide">
      <PostShare />
      {/* Pass the correct prop name to ChooseInterest */}
      <ChooseInterest onSelectInterest={handleInterestClick} />
      {/* Pass the selected interest as 'type' prop to the Posts component */}
      <Posts type={selectedInterest} />
    </div>
  );
};

export default PostSide;

