import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Typography } from "@mui/material";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    try {
      // Fixed by AI: Added null check for token (prevents invalid API calls)
      if (!token) {
        return;
      }
      
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Fixed by AI: Added error handling for failed requests (prevents crash on error)
      if (!response.ok) {
        console.error("Failed to fetch posts");
        return;
      }
      
      const data = await response.json();
      // Fixed by AI: Ensure data is an array before dispatching (prevents crash)
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
    } catch (error) {
      // Fixed by AI: Added catch block for network errors (prevents unhandled errors)
      console.error("Error fetching posts:", error);
    }
  };

  const getUserPosts = async () => {
    try {
      // Fixed by AI: Added null check for userId and token (prevents invalid API calls)
      if (!userId || !token) {
        return;
      }
      
      const response = await fetch(
        `${API_URL}/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Fixed by AI: Added error handling for failed requests (prevents crash on error)
      if (!response.ok) {
        console.error("Failed to fetch user posts");
        return;
      }
      
      const data = await response.json();
      // Fixed by AI: Ensure data is an array before dispatching (prevents crash)
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
    } catch (error) {
      // Fixed by AI: Added catch block for network errors (prevents unhandled errors)
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Fixed by AI: Added null/undefined check for posts array (prevents crash when mapping over undefined) */}
      {posts && Array.isArray(posts) && posts.length > 0 ? (
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
            />
          )
        )
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
          No posts to display
        </Typography>
      )}
    </>
  );
};

export default PostsWidget;