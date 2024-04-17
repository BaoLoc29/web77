import mongoose from "mongoose"

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        require: true,
        default: "customer"
    },
    age: {
        type: Number,
    }
}, { timestamps: true });
// "users là tên của một colection"
export default mongoose.model("users", User)