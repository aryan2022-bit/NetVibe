import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;
        
        // Fixed by AI: Added validation for required fields (prevents crash with missing data)
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Fixed by AI: Handle file upload - use uploaded file name if available, otherwise use provided picturePath
        let finalPicturePath = picturePath || "";
        if (req.file) {
            finalPicturePath = req.file.filename;
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: finalPicturePath,
            friends: friends || [],
            location: location || "",
            occupation: occupation || "",
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        
        const savedUser = await newUser.save();
        // Fixed by AI: Removed password from response for security (was exposing hashed password)
        const userWithoutPassword = savedUser.toObject();
        delete userWithoutPassword.password;
        res.status(201).json(userWithoutPassword);

    } catch (err){
        // Fixed by AI: Improved error handling for duplicate email (MongoDB unique constraint)
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: err.message });
    }
}

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email})
        if (!user) return res.status(400).json({ msg: 'User does not exists !'})

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials !'})

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET)
        // Fixed by AI: Convert Mongoose document to object and remove password before sending response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        // Fixed by AI: Added missing response (was not sending token and user back)
        res.status(200).json({ token, user: userWithoutPassword })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}