import Product from "../models/product.js"
import joi from "joi"
import toSlug from "../utils/toSlug.js"
import categoryModel from "../models/category.js"
export const getByCategory = async (req, res) => {
    try {
        const categorySlug = req.params.slug
        const category = await categoryModel.findOne({
            slug: categorySlug
        })

        const products = await Product.find({
            categoryId: category._id
        })
        return res.status(200).json({ products })
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi, vui lòng kiểm tra lại server")
    }
}

export const createProduct = async (req, res) => {
    const user = req.user
    const category = req.body.categoryId
    const product_name = req.body.product_name
    const product_price = req.body.product_price
    const slug = toSlug(product_name)
    try {
        const result = await Product.create({
            product_name: product_name,
            product_price: product_price,
            createdBy: user._id,
            categoryId: category,
            slug
        })

        return res.status(200).json({ product: result })
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}
export const getPagingProduct = async (req, res) => {
    try {
        const pageSize = req.query.pageSize
        const pageIndex = req.query.pageIndex
        // .limit() để giới hạn số lượng sản phẩm trả về cho mỗi trang.
        const products = await Product
            .find()
            .skip(pageSize * pageIndex - pageSize)
            .limit(pageSize)
            .populate({ path: "createdBy", select: "name" }).select("-product_price")

        // const products = await Product
        //     .find()
        //     .skip(pageSize * pageIndex - pageSize)
        //     .limit(pageSize)
        //     .populate("createdBy").select("-product_price")

        const countProducts = await Product.countDocuments()
        // Sau đó, nó tính toán tổng số trang bằng cách chia tổng số sản phẩm cho kích thước trang và làm tròn lên với Math.ceil()
        const totalPage = Math.ceil(countProducts / pageSize)
        return res.status(200).json({ products, totalPage })
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product_name = req.body.product_name
        const product_price = req.body.product_price

        const editSchema = joi.object({
            product_name: joi.string().max(200).min(5).required().messages({
                "string.max": "Tên sản phẩm không được vượt quá 200 kí tự",
                "string.min": "Tên sản phẩm không được ngắn hơn 5 kí tự",
                "any.required": "Tên sản phẩm không được bỏ trống"
            }),
            product_price: joi.number().integer().positive().required().messages({
                "number.integer": 'Giá phải là số nguyên',
                "number.positive": "Giá phải là số dương",
                "any.required": "Bạn chưa nhập giá của sản phẩm"
            })
        })

        const { error } = editSchema.validate({ product_name, product_price })
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        const result = await Product.findByIdAndUpdate(id, {
            product_name: product_name,
            product_price: product_price
        }, { new: true })

        return res.status(200).json({
            message: "Update thành công",
            product: result
        });
    } catch (error) {
        return res.status(500).json({ error })
    }
}