import User from "../models/user.js"
import bcrypt from "bcryptjs"
import joi from "joi"
import jwt from "jsonwebtoken"

const tokenSecret = 'secret'
export const login = async (req, res) => {
    const { compareSync } = bcrypt
    try {
        const email = req.body.email
        const password = req.body.password

        const loginSchema = joi.object({
            email: joi.string().email().min(3).max(32).required().messages({
                "string.email": "Email không đúng định dạng",
                "string.min": "Tối thiếu là 3 ký tự",
                "string.max": "Tối đa là là 32 ký tự"
            }),
            password: joi.string().min(6).max(32).required().messages({
                "string.password": "Mật khẩu không đúng định dạng",
                "string.min": "Tối thiếu là 6 ký tự",
                "string.max": "Tối đa là là 32 ký tự"
            }),
        })

        const validate = loginSchema.validate({ email, password })

        if (validate.error) {
            return res.status(400).json({
                error: validate.error.details[0].message
            })
        }
        const findUser = await User.findOne({ email }).lean()
        if (!findUser) {
            return res.status(401).json({
                error: "Không tìm thấy người dùng"
            })
        }

        const checkPassword = compareSync(password, findUser.password)
        // Tách find user thành 2 phần => phần thứ 1 password
        // Phần thứ 2 là phần còn lại của findUser gán vào biến ...returnUser
        // Điều này làm cho biến mất password, tránh để client thấy ở FE


        const accessToken = jwt.sign({
            id: findUser._id,
        }, process.env.SCRET_KEY, { expiresIn: '1d' })


        const {
            password: userPassword,
            ...returnUser
        } = findUser

        if (!checkPassword) {
            return res.status(401).json({
                error: "Sai mật khẩu"
            })
        }
        if (findUser) {
            return res.status(200).json({
                message: "Đăng nhập thành công",
                // hiện password: - user: findUser
                // ẩn password
                user: returnUser,
                accessToken
            })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const signUp = async (req, res) => {
    const { hashSync, genSaltSync } = bcrypt
    try {
        const { name, email, password, role } = req.body

        // schema joi
        const signupSchema = joi.object({
            name: joi.string().max(32).required().messages({
                "string.max": "Name không được quá 32 kí tự",
                "string.name": "Name không đúng định dạng"
            }),
            email: joi.string().email().max(32).required().messages({
                "string.email": "Email không đúng định dạng",
                "string.max": "Email tối đa là 32 ký tự"
            }),
            password: joi.string().min(6).max(32).required().messages({
                "string.min": "Password không được nhỏ hơn 6 kí tự",
                "string.max": "Password không được vượt quá 32 kí tự",
                "string.password": "Password không đúng định dạng"
            })
        })

        const { error } = signupSchema.validate({ name, email, password })
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            })
        }

        const findUser = await User.findOne({ email })

        if (findUser) {
            return res.status(409).json({
                message: "Người dùng đã tồn tại"
            })
        }

        const salt = genSaltSync()
        const hashPassword = hashSync(password, salt)

        const user = await User.create({
            email,
            password: hashPassword,
            name,
            role
        })

        // Loại bỏ trường password từ kết quả trả về
        const userWithoutPassword = user.toObject()
        delete userWithoutPassword.password

        return res.status(200).json({
            message: "Tạo người dùng thành công",
            user: userWithoutPassword
        })

    } catch (error) {
        return res.status(500).json({ error: "Đã xảy ra lỗi trong quá trình xử lý yêu cầu." })
    }
}
export const createUser = async (req, res) => {
    try {
        const data = req.body
        const result = await User.create(data)

        return res.status(201).json({
            result
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}
export const getPagingUser = async (req, res) => {
    try {
        const query = req.query
        // Skip là 0 sẽ lấy 3 phần từ đầu tiền
        // Limit sẽ là số phần tử mình lấy ra trang

        // pageSize là số lượng phần từ cho một trang
        // pageIndex là số trang hiện tại đang hiển thị ở UI
        const users = await User.find().skip(query.pageSize * query.pageIndex - query.pageSize).limit(query.pageSize).sort({ createdAt: "desc" })

        const countUsers = await User.countDocuments()
        const totalPage = Math.ceil(countUsers / query.pageSize) // Làm tròn giá trị từ 0.2 => 1

        return res.status(200).json({ users, totalPage, count: countUsers })
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const editUser = async (req, res) => {
    try {
        const id = req.params.id
        const name = req.body.name
        const email = req.body.email

        const editSchema = joi.object({
            name: joi.string().max(32).required().messages({
                "string.max": "Name không được quá 32 kí tự",
            }),
            email: joi.string().email().max(32).required().messages({
                "string.email": "Email không đúng định dạng",
                "string.max": "Email tối đa là 32 ký tự"
            }),
        })

        const { error } = editSchema.validate({ name, email })
        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            })
        }
        // select ("-password") => bỏ password trong object trả về
        const updateUser = await User.findByIdAndUpdate(id, {
            name: name,
            email: email
        }, { new: true }).select("-password")

        return res.status(200).json({
            message: "Update thành công",
            user: updateUser
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}
export const changePassword = async (req, res) => {
    const { compareSync, genSaltSync, hashSync } = bcrypt
    try {
        const id = req.params.id
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword

        const changePassSchema = joi.object({
            oldPassword: joi.string().min(6).max(32).required().messages({
                "string.min": "Mật khẩu cũ phải có ít nhất 6 ký tự",
                "string.max": "Mật khẩu cũ không được vượt quá 32 ký tự",
                "any.required": "Mật khẩu cũ là bắt buộc"
            }),
            newPassword: joi.string().min(6).max(32).required().messages({
                "string.min": "Mật khẩu mới phải có ít nhất 6 ký tự",
                "string.max": "Mật khẩu mới không được vượt quá 32 ký tự",
                "any.required": "Mật khẩu mới là bắt buộc"
            })
        });

        const { error } = changePassSchema.validate({ oldPassword, newPassword });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({
                error: "Không tìm thấy người dùng"
            })
        }
        const checkPassword = compareSync(oldPassword, user.password)

        if (!checkPassword) {
            return res.status(400).json({
                error: "Sai mật khẩu cũ"
            })
        }
        // Mã hóa mật khẩu
        const salt = genSaltSync()
        const hashPassword = hashSync(newPassword, salt)

        const updateUser = await User.findByIdAndUpdate(id, {
            password: hashPassword
        }).select("-password")

        return res.status(200).json({
            message: "Cập nhật mật khẩu thành công",
            user: updateUser
        })
    } catch (error) {
        return res.status(500).json({ error })
    }
}
export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.deleteOne({ _id: id })
        if (!user) {
            return res.status(400).json({
                message: "Không tìm thấy người dùng"
            })
        }
        return res.status(200).json({ message: "Xóa người dùng thành công" })
    } catch (error) {
        return res.status(500).json({ error })
    }
}
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        return res.status(200).json({ user })
    } catch (error) {
        return res.status(500).json({ error })
    }
}