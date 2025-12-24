import Post from '../models/Post.js'
import User from '../models/User.js'
/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body
        // Fixed by AI: Added null check for userId (prevents crash)
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById(userId)
        // Fixed by AI: Added null check for user (prevents crash if user doesn't exist)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Fixed by AI: Handle file upload - use uploaded file name if available, otherwise use provided picturePath
        let finalPicturePath = picturePath || "";
        if (req.file) {
            finalPicturePath = req.file.filename;
        }
        
        // Fixed by AI: Changed newPost to new Post (was causing ReferenceError)
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location || "",
            description: description || "",
            userPicturePath: user.picturePath || "",
            picturePath: finalPicturePath,
            likes: {},
            comments: []
        })
        await newPost.save()

        // Fixed: Return posts sorted by newest first
        const post = await Post.find().sort({ createdAt: -1 })
        res.status(201).json(post)
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        // Fixed: Sort posts by newest first (better UX)
        const post = await Post.find().sort({ createdAt: -1 })
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params
        // Fixed: Sort posts by newest first (better UX)
        const post = await Post.find({ userId }).sort({ createdAt: -1 })
        res.status(200).json(post)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const { userId } = req.body
        // Fixed by AI: Added validation for userId (prevents crash)
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const post = await Post.findById(id)
        // Fixed by AI: Added null check for post (prevents crash if post doesn't exist)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Fixed by AI: Initialize likes Map if it doesn't exist (prevents crash when accessing Map methods)
        if (!post.likes) {
            post.likes = new Map();
        }
        const isLiked = post.likes.get(userId)

        if (isLiked) {
            post.likes.delete(userId)
        } else {
            post.likes.set(userId, true)
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes},
            { new: true }
        )

        res.status(200).json(updatedPost)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/* DELETE */
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        // Only allow the post owner to delete
        if (post.userId !== userId) {
            return res.status(403).json({ message: 'You can only delete your own posts' });
        }
        
        await Post.findByIdAndDelete(id);
        
        // Return updated posts list
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

/* ADD COMMENT */
export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, comment } = req.body;
        
        if (!userId || !comment) {
            return res.status(400).json({ message: 'User ID and comment are required' });
        }
        
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Create comment object with user info
        const newComment = {
            userId,
            userName: `${user.firstName} ${user.lastName}`,
            userPicturePath: user.picturePath || "",
            text: comment,
            createdAt: new Date().toISOString()
        };
        
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $push: { comments: newComment } },
            { new: true }
        );
        
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}