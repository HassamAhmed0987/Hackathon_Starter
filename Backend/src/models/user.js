import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        trim: true,
        default: "user"
    }
},
    {
        timestamps: true
    }
)


export default mongoose.model("User", userSchema)