import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, IconButton } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import EditProfileDialog from "components/EditProfileDialog";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  // Check if this is the logged-in user's profile
  const isOwnProfile = userId === loggedInUserId;

  const getUser = async () => {
    try {
      // Fixed by AI: Added null check for userId and token (prevents invalid API calls)
      if (!userId || !token) {
        return;
      }
      
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Fixed by AI: Added error handling for failed requests (prevents crash on error)
      if (!response.ok) {
        console.error("Failed to fetch user");
        return;
      }
      
      const data = await response.json();
      setUser(data);
    } catch (error) {
      // Fixed by AI: Added catch block for network errors (prevents unhandled errors)
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    twitter,
    linkedin,
  } = user;

  return (
    <WidgetWrapper>
      {/* Edit Profile Dialog */}
      {isOwnProfile && (
        <EditProfileDialog 
          open={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
          user={user}
        />
      )}
      
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
      >
        <FlexBetween gap="1rem" onClick={() => navigate(`/profile/${userId}`)} sx={{ cursor: "pointer" }}>
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            {/* Fixed by AI: Added null check for friends array (prevents crash when accessing .length on undefined) */}
            <Typography color={medium}>{friends?.length || 0} friends</Typography>
          </Box>
        </FlexBetween>
        {isOwnProfile && (
          <IconButton onClick={() => setIsEditOpen(true)} title="Edit Profile">
            <ManageAccountsOutlined />
          </IconButton>
        )}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="http://localhost:3001/assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>
                {twitter || "Not connected"}
              </Typography>
            </Box>
          </FlexBetween>
          {isOwnProfile && (
            <IconButton onClick={() => setIsEditOpen(true)} size="small" title="Edit Social Profiles">
              <EditOutlined sx={{ color: main }} />
            </IconButton>
          )}
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="http://localhost:3001/assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>
                {linkedin || "Not connected"}
              </Typography>
            </Box>
          </FlexBetween>
          {isOwnProfile && (
            <IconButton onClick={() => setIsEditOpen(true)} size="small" title="Edit Social Profiles">
              <EditOutlined sx={{ color: main }} />
            </IconButton>
          )}
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;