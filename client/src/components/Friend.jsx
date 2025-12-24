import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user?.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  // Fixed by AI: Added null/undefined check for friends array (prevents crash when calling .find() on undefined)
  const isFriend = friends && Array.isArray(friends) ? friends.find((friend) => friend?._id === friendId) : false;

  const patchFriend = async () => {
    try {
      // Fixed by AI: Added null check for _id, friendId, and token (prevents invalid API calls)
      if (!_id || !friendId || !token) {
        alert("Unable to update friend status. Please try again.");
        return;
      }
      
      const response = await fetch(
        `http://localhost:3001/users/${_id}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Fixed by AI: Added error handling for failed requests (prevents crash on error)
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update friend status. Please try again.");
        return;
      }
      
      const data = await response.json();
      // Fixed by AI: Ensure data is an array before dispatching (prevents crash)
      dispatch(setFriends({ friends: Array.isArray(data) ? data : [] }));
    } catch (error) {
      // Fixed by AI: Added catch block for network errors (prevents unhandled errors)
      console.error("Error updating friend status:", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            // Fixed by AI: Removed navigate(0) which was causing unnecessary page reload
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default Friend;