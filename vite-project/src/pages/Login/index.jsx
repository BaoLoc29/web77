import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { login } from "../../services/user";
import toast from "react-hot-toast";
import {
  saveTokenToLocalstorage,
  saveUserToLocalstorage,
} from "../../utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { login as loginAction } from "../../feature/user/userSlice";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const result = await login(values);
      dispatch(loginAction({ user: result.data.user }));
      saveTokenToLocalstorage(result.data.accessToken);
      saveUserToLocalstorage(result.data.user);
      toast.success("Đăng nhập thành công");
    } catch (error) {
      toast.error("Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Form
        name="basic"
        initialValues={{}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập email!",
            },
            {
              min: 6,
              message: "Email phải trên 6 ký tự",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập Password!",
            },
            // Removed max length validation for password
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button loading={loading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
