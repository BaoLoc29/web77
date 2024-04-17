import mongoose from "mongoose";

const Category = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    slug: {
        type: String,
        require: true
    }
}, { timestamps: true })


export default mongoose.model("categories", Category);