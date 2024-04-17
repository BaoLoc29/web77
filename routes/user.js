import express from "express"
import { signUp, createUser, getPagingUser, login, editUser, changePassword, deleteUser, getUserById } from "../controllers/user.js"
import authentication from "../middlewares/authentication.js"
import authorization from "../middlewares/authorization.js"

const router = express.Router()

router.post("/create-user", authentication, createUser)
router.get("/get-paging-user", authentication, getPagingUser)
router.get("/:id", authentication, getUserById)
router.post("/signup", signUp)
router.post("/login", login)
router.put("/:id", authentication, editUser)
router.put("/change-password/:id", authentication, changePassword)
router.delete("/:id", authentication, deleteUser)
export default router