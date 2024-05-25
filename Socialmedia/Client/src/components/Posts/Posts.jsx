// import React, { useEffect } from "react";
// import { getTimelinePosts } from "../../actions/PostAction";
// import Post from "../Post/Post";
// import { useSelector, useDispatch } from "react-redux";
// import "./Posts.css";
// import { useParams } from "react-router-dom";

// const Posts = () => {
//   const params = useParams()
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.authReducer.authData);
//   let { posts, loading } = useSelector((state) => state.postReducer);

//   useEffect(() => {
//     dispatch(getTimelinePosts(user._id));
//   }, []);

//   if(!posts) return 'No Posts';
//   if(params.id) posts = posts.filter((post)=> post.userId===params.id)


//   return (
//     <div className="Posts">
//       {loading
//         ? "Fetching posts...."
//         : posts.map((post, id) => {
//             return <Post data={post} key={id} user={user}/>;
//           })}
//     </div>
//   );
// };

// export default Posts;


import React, { useEffect } from "react";
import { getTimelinePosts } from "../../actions/PostAction";
import Post from "../Post/Post";
import { useSelector, useDispatch } from "react-redux";
import "./Posts.css";
import { useParams } from "react-router-dom";

const Posts = ({ type }) => { // Modify Posts component to accept a 'type' prop
  const params = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  let { posts, loading } = useSelector((state) => state.postReducer);

  useEffect(() => {
    dispatch(getTimelinePosts(user._id));
  }, [type]); // Reload posts when type changes

  if (!posts) return 'No Posts';
  if (params.id) posts = posts.filter((post) => post.userId === params.id);

  let filteredPosts = posts;
  // console.log(type)
  // Filter the posts based on the type
  if (type === "images") {
    filteredPosts = posts.filter((post) => post.image);
    // console.log(filteredPosts)
  } else if (type === "videos") {
    filteredPosts = posts.filter((post) => post.video);
    // console.log(filteredPosts)
  }

  return (
    <div className="Posts">
      {loading
        ? "Fetching posts...."
        : filteredPosts.map((post, id) => {
            return <Post data={post} key={id} user={user} />;
          })}
    </div>
  );
};

export default Posts;
