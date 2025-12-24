import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { register } from './controllers/auth.js'
import { createPost } from './controllers/posts.js'
import { verifyToken } from './middleware/auth.js'
import User from './models/User.js'
import Post from './models/Post.js'
import { users, posts } from './data/index.js'

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })

/* ROUTES WITH FILES */
// Fixed by AI: Add error handling wrapper for Multer to return JSON errors instead of HTML
app.post('/auth/register', (req, res, next) => {
    upload.single('picture')(req, res, (err) => {
        // Fixed by AI: Handle Multer errors and return JSON instead of HTML error pages
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({ error: `Unexpected field. Expected field name: 'picture'. Check that the file field is named correctly.` });
                }
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ error: 'File too large. Maximum size is 30MB.' });
                }
                return res.status(400).json({ error: `File upload error: ${err.message}` });
            }
            return res.status(400).json({ error: err.message || 'File upload failed' });
        }
        next();
    });
}, register)
app.post('/posts', verifyToken, upload.single('picture'), createPost)

/* ROUTES */
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

// Fixed by AI: Global error handler to ensure all errors return JSON (prevents HTML error pages)
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    // Fixed by AI: Return JSON error response instead of HTML
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

/* MONGOOSE SETUP */
// Fixed by AI: Changed default port from 6001 to 3001 to match client API calls (was causing connection errors)
const PORT = process.env.PORT || 3001

// Fixed by AI: Start server even if MongoDB connection fails (allows server to run and show connection errors)
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected successfully")
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`))

        /* ADD DATA ONE TIME */
        // User.insertMany(users)
        // Post.insertMany(posts)
    })
    .catch((error) => {
        console.error(`MongoDB connection error: ${error.message}`)
        console.log("Starting server anyway...")
        // Fixed by AI: Start server even if MongoDB fails (allows testing and better error messages)
        app.listen(PORT, () => {
            console.log(`Server Port: ${PORT}`)
            console.warn("WARNING: Server running without MongoDB connection!")
        })
    })