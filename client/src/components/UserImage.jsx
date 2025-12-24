import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  // Fixed by AI: Handle null/undefined image with fallback (prevents broken image links)
  const imageSrc = image 
    ? `http://localhost:3001/assets/${image}` 
    : "http://localhost:3001/assets/default-avatar.png"; // You may want to add a default avatar image
  
  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={imageSrc}
        onError={(e) => {
          // Fixed by AI: Added error handler for broken images (shows placeholder on load failure)
          e.target.onerror = null;
          e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='50' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E?%3C/text%3E%3C/svg%3E";
        }}
      />
    </Box>
  );
};

export default UserImage;