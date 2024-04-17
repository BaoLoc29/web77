import Category from "../models/category.js"
import joi from 'joi'
import toSlug from '../utils/toSlug.js'

export const getPagingCategory = async (req, res) => {
    const pageSize = req.query.pageSize
    const pageIndex = req.query.pageIndex
    const categories = await Category
        .find()
        .skip(pageSize * pageIndex - pageSize)
        .limit(pageSize)
    const countCategories = await Category.countDocuments()
    const totalPage = Math.ceil(countCategories / pageSize)

    return res.status(200).json({
        categories,
        totalPage
    })
}
export const createCategory = async (req, res) => {
    try {
        const name = req.body.name
        const slug = toSlug(name)
        const result = await Category.create({
            name: name,
            slug: slug
        })
        return res.status(200).json({
            result
        })

    } catch (error) {
        return res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng kiểm tra lại server" })
    }
}
export const editCategory = async (req, res) => {
    try {
        const id = req.params.id
        const name = req.body.name
        const slug = toSlug(name)

        const editSchema = joi.object({
            name: joi.string().max(32).required().messages({
                "string.max": "Name không được quá 32 kí tự",
                "any.required": "Vui lòng nhập Name"
            }),
            slug: joi.string().max(32).required().messages({
                "string.max": "Slug không được quá 32 kí tự",
                "any.required": "Vui lòng nhập slug"
            }),
        })
        const { error } = editSchema.validate({ name, slug })
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            })
        }
        const updateCategory = await Category.findByIdAndUpdate(id, {
            name: name,
            slug: slug
        }, { new: true })

        return res.status(200).json({
            message: "Update category thành công",
            category: updateCategory
        })
    } catch (error) {
        return res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng kiểm tra lại server" })
    }
}
export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.deleteOne({ _id: id })
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy danh mục này!" })
        }
        return res.status(200).json({ message: "Xóa danh mục thành công!" })
    } catch (error) {
        return res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng kiểm tra lại server" })
    }
}