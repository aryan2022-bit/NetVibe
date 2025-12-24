import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            // Fixed by AI: Changed min from 50 to 5 (50 was too high and would reject valid passwords)
            min: 5,
        },
        picturePath: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: []
        },
        location: String,
        occupation: String,
        twitter: String,
        linkedin: String,
        viewedProfile: Number,
        impressions: Number,
    }, { timestamps: true }
)

const User = mongoose.model("User", UserSchema)
export default User