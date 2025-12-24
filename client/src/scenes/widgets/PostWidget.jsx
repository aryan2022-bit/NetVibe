import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlined,
  SendOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme, InputBase } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import UserImage from "components/UserImage";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, removePost } from "state";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const isLiked = likes && loggedInUserId ? Boolean(likes.get?.(loggedInUserId) || likes[loggedInUserId]) : false;
  const likeCount = likes ? (likes instanceof Map ? likes.size : Object.keys(likes).length) : 0;
  
  // Check if current user owns this post
  const isOwnPost = loggedInUserId === postUserId;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const primary = palette.primary.main;

  const patchLike = async () => {
    try {
      if (!postId || !loggedInUserId || !token) {
        alert("Unable to like post. Please try again.");
        return;
      }
      
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to like post. Please try again.");
        return;
      }
      
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error liking post:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete post.");
        return;
      }
      
      dispatch(removePost({ postId }));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Network error. Please try again.");
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: loggedInUserId,
          comment: newComment 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add comment.");
        return;
      }
      
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <FlexBetween>
        <Friend
          friendId={postUserId}
          name={name}
          subtitle={location}
          userPicturePath={userPicturePath}
        />
        {isOwnPost && (
          <IconButton onClick={handleDelete} title="Delete Post">
            <DeleteOutlined sx={{ color: palette.error?.main || "#f44336" }} />
          </IconButton>
        )}
      </FlexBetween>
      
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${API_URL}/assets/${picturePath}`}
        />
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments?.length || 0}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      
      {isComments && (
        <Box mt="0.5rem">
          {/* Comment Input */}
          <FlexBetween gap="1rem" mb="1rem">
            <InputBase
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleComment()}
              sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "0.5rem 1rem",
              }}
            />
            <IconButton 
              onClick={handleComment}
              disabled={!newComment.trim()}
              sx={{ 
                backgroundColor: primary,
                "&:hover": { backgroundColor: palette.primary.dark },
                "&:disabled": { backgroundColor: palette.neutral.light }
              }}
            >
              <SendOutlined sx={{ color: newComment.trim() ? "white" : medium }} />
            </IconButton>
          </FlexBetween>
          
          <Divider />
          
          {/* Comments List */}
          {comments && Array.isArray(comments) && comments.length > 0 ? (
            comments.map((comment, i) => (
              <Box key={`comment-${i}`}>
                {typeof comment === 'object' ? (
                  // New comment format with user info
                  <Box display="flex" gap="1rem" p="0.5rem 0">
                    <UserImage image={comment.userPicturePath} size="35px" />
                    <Box>
                      <Typography 
                        sx={{ color: main, fontWeight: "500", fontSize: "0.85rem" }}
                      >
                        {comment.userName}
                      </Typography>
                      <Typography sx={{ color: main, fontSize: "0.9rem" }}>
                        {comment.text}
                      </Typography>
                      <Typography sx={{ color: medium, fontSize: "0.7rem" }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  // Old comment format (just string)
                  <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                    {comment}
                  </Typography>
                )}
                <Divider />
              </Box>
            ))
          ) : (
            <Typography sx={{ color: medium, m: "0.5rem 0", pl: "1rem", fontStyle: "italic" }}>
              No comments yet. Be the first to comment!
            </Typography>
          )}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;