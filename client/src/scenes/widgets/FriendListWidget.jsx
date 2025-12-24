import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    try {
      // Fixed by AI: Added null check for userId and token (prevents invalid API calls)
      if (!userId || !token) {
        return;
      }
      
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Fixed by AI: Added error handling for failed requests (prevents crash on error)
      if (!response.ok) {
        console.error("Failed to fetch friends");
        return;
      }
      
      const data = await response.json();
      // Fixed by AI: Ensure data is an array before dispatching (prevents crash)
      dispatch(setFriends({ friends: Array.isArray(data) ? data : [] }));
    } catch (error) {
      // Fixed by AI: Added catch block for network errors (prevents unhandled errors)
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {/* Fixed by AI: Added null/undefined check for friends array (prevents crash when mapping over undefined) */}
        {friends && Array.isArray(friends) && friends.length > 0 ? (
          friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
            />
          ))
        ) : (
          <Typography color={palette.neutral.medium}>
            No friends to display
          </Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;