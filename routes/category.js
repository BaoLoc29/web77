import express from "express"
import { createCategory, deleteCategory, editCategory, getPagingCategory } from "../controllers/category.js";

const router = express.Router()
router.post("/create-category", createCategory)
router.put("/:id", editCategory)
router.get("/get-paging-category", getPagingCategory)
router.delete("/:id", deleteCategory)

export default router