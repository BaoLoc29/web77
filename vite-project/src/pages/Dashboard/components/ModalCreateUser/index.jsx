import React, { useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { getUserById } from "../../../../services/user";
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
const ModalCreateUser = ({
  form,
  loading,
  title,
  isModalOpen,
  handleCancel,
  handleOk,
  selectedUser,
}) => {
  const getUser = async () => {
    try {
      const result = await getUserById(selectedUser);
      form.setFieldValue("name", result.data.user.name);
      form.setFieldValue("email", result.data.user.email);
      form.setFieldValue("role", result.data.user.role);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (selectedUser) getUser();
  }, [selectedUser]);
  return (
    <Modal
      title={title}
      open={isModalOpen}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        {...formItemLayout}
        name="register"
        onFinish={handleOk}
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
          name="role"
          label="Role"
          rules={[
            {
              type: "text",
              message: "Vui lòng chọn quyền hạn",
            },
          ]}
        >
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="customer">Customer</Select.Option>
          </Select>
        </Form.Item>
        {!selectedUser && (
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
        )}

        {!selectedUser && (
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
        )}

        <Form.Item {...tailFormItemLayout}>
          <Button loading={loading} type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateUser;
