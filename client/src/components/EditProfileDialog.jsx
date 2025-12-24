import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { setLogin } from "state";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const EditProfileDialog = ({ open, onClose, user }) => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    location: user?.location || "",
    occupation: user?.occupation || "",
    twitter: user?.twitter || "",
    linkedin: user?.linkedin || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update profile");
        return;
      }

      const updatedUser = await response.json();
      
      // Update Redux state with new user data
      dispatch(setLogin({ user: updatedUser, token }));
      
      alert("Profile updated successfully!");
      onClose();
      // Reload the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Edit Profile
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap="1rem" mt="1rem">
          <Box display="flex" gap="1rem">
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <TextField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., New York, USA"
          />
          <TextField
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., Software Engineer"
          />
          <TextField
            label="Twitter Username"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., @username"
          />
          <TextField
            label="LinkedIn Username"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            fullWidth
            placeholder="e.g., john-doe"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: "1rem 1.5rem" }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.firstName || !formData.lastName}
          sx={{
            backgroundColor: palette.primary.main,
            "&:hover": { backgroundColor: palette.primary.dark },
          }}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileDialog;
