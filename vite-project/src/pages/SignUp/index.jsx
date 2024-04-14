import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button, Form, Input } from "antd";
import { signup } from "../../services/user";
import { Link, useNavigate } from "react-router-dom";
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const naviagate = useNavigate();
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const result = await signup(values);
      toast.success("Đăng ký thành công");
      naviagate("/")
    } catch (error) {
      toast.error("Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        style={{
          minWidth: 400,
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              type: "text",
              message: "Name không đúng định dạng",
            },
            {
              required: true,
              message: "Name không được bỏ trống",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "Email không đúng định dạng!",
            },
            {
              required: true,
              message: "Email không được bỏ trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Password không được bỏ trống!",
            },
            {
              max: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự!",
            },
            {
              type: "password",
              message: "Password không đúng định dạng",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Mật khẩu không khớp, vui lòng kiểm tra lại!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu không khớp, vui lòng kiểm tra lại!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item className="text-center">
          <p>
            Bạn đã có tài khoản?{" "}
            <Link to="/">
              <b>Đăng nhập</b>
            </Link>
          </p>
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button loading={loading} type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default SignUp;
