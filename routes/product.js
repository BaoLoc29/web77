import express from "express"
import { createProduct, editProduct, getByCategory, getPagingProduct } from '../controllers/product.js';
import authentication from "../middlewares/authentication.js";
const router = express.Router()
router.post("/create-product", createProduct)
router.put("/:id", authentication, editProduct)
router.get("/get-paging-product", getPagingProduct)
router.get('/get-by-category/:slug', getByCategory)
export default router