import mongoose from "mongoose"

const Product = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: 'categories'
    },
    slug: {
        type: String,
        require: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },

}, { timestamps: true });
export default mongoose.model("products", Product);