import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Fixed by AI: Exclude password field from response for security
        const user = await User.findById(id).select('-password');
        // Fixed by AI: Added null check for user (prevents sending null response)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        // Fixed by AI: Added null check for user (prevents crash if user doesn't exist)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Fixed by AI: Added null check for friends array (prevents crash if friends is undefined)
        if (!user.friends || !Array.isArray(user.friends)) {
            return res.status(200).json([]);
        }

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        // Fixed by AI: Filter out null friends (in case some friend IDs don't exist)
        const validFriends = friends.filter(friend => friend !== null);
        const formattedFriends = validFriends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE USER PROFILE */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, location, occupation, twitter, linkedin } = req.body;
        
        // Find and update user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Update only provided fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (location !== undefined) user.location = location;
        if (occupation !== undefined) user.occupation = occupation;
        if (twitter !== undefined) user.twitter = twitter;
        if (linkedin !== undefined) user.linkedin = linkedin;
        
        await user.save();
        
        // Return updated user without password
        const updatedUser = await User.findById(id).select('-password');
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        
        // Prevent adding yourself as friend
        if (id === friendId) {
            return res.status(400).json({ message: 'Cannot add yourself as a friend' });
        }
        
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }
        
        // Initialize friends array if it doesn't exist
        const userFriends = user.friends || [];
        
        const isFriend = userFriends.includes(friendId);
        
        if (isFriend) {
            // Remove friend - use atomic operations to avoid version conflicts
            await User.findByIdAndUpdate(id, { $pull: { friends: friendId } });
            await User.findByIdAndUpdate(friendId, { $pull: { friends: id } });
        } else {
            // Add friend - use atomic operations to avoid version conflicts
            await User.findByIdAndUpdate(id, { $addToSet: { friends: friendId } });
            await User.findByIdAndUpdate(friendId, { $addToSet: { friends: id } });
        }

        // Get updated user's friends list
        const updatedUser = await User.findById(id);
        const friends = await Promise.all(
            (updatedUser.friends || []).map((fid) => User.findById(fid))
        );
        
        const validFriends = friends.filter(friend => friend !== null);
        const formattedFriends = validFriends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
