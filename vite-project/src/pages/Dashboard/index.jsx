import React, { useEffect, useState } from "react";
import { Table, Button, Form, Popconfirm } from "antd";
import { Pagination } from "antd";
import { MdDelete } from "react-icons/md";

import {
  createUser,
  deleteUser,
  editUser,
  getPagingUser,
} from "../../services/user";
import ModalCreateUser from "./components/ModalCreateUser";
import { toast } from "react-hot-toast";
import { FaEdit, FaFileImage } from "react-icons/fa";
import ModalUploadUserAvatar from "./components/ModalUploadUserAvatar";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoc, setTotalDoc] = useState(0);
  const [modalCreateUser, setModalCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);
  const [modalUploadUserAvatar, setModalUploadUserAvatar] = useState(false);

  const handelOpenUploadUserAvatarModal = (userId) => {
    setModalUploadUserAvatar(true);
    setSelectedUser(userId);
  };

  const handelCloseUploadUserAvatarModal = () => {
    setModalUploadUserAvatar(false);
    setSelectedUser(null);
  };

  //
  const handleOpenEditModal = (userId) => {
    setModalCreateUser(true);
    setSelectedUser(userId);
  };

  const handelCloseModal = () => {
    setModalCreateUser(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      const result = await deleteUser(userId);
      setUsers(users.filter((user) => user._id != userId));
      toast.success("Xóa người dùng thành công");
    } catch (error) {
      console.log(error);
      toast.error("Xóa người dùng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quyền hạn",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Hành động",
      key: "action",
      render: (row) => {
        return (
          <div className="flex gap-2">
            <FaEdit
              cursor={"pointer"}
              onClick={() => handleOpenEditModal(row._id)}
            />
            <Popconfirm
              title="Xóa người dùng"
              description="Bạn có chắc chắn xóa người dùng này"
              onConfirm={() => handleDeleteUser(row._id)}
              okText="Đồng ý"
              cancelText="Hủy"
              style={{ cursor: "pointer" }}
            >
              <MdDelete cursor={"pointer"} />
            </Popconfirm>
            <FaFileImage cursor={"pointer"} />
          </div>
        );
      },
    },
  ];
  const [form] = Form.useForm();
  const getUsers = async () => {
    try {
      setLoading(true);
      const result = await getPagingUser({ pageSize, pageIndex });
      setUsers(result.data.users);
      setTotalPages(result.data.totalPage);
      setTotalDoc(result.data.count);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (value) => {
    try {
      setLoading(true);
      if (!selectedUser) {
        const result = await createUser(value);
        let newUser = users;
        newUser.pop();
        // pop là bỏ đi phần tử cuối cùng trong mảng
        setUsers([result.data.result, ...users]);
        toast.success("Tạo tài khoản người dùng thành công");
      } else {
        const result = await editUser(selectedUser, value);
        setUsers(
          users.map((user) => {
            if (user._id === selectedUser) {
              return result.data.user;
              // ket qua sau khi update
            }
            return user;
          })
        );
        toast.success("Cập nhật tài khoản người dùng thành công");
        setSelectedUser(null);
      }
      setModalCreateUser(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
      toast.error(
        selectedUser
          ? "Cập nhật tài khoản người dùng thất bại"
          : "Tạo tài khoản người dùng thất bại"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUsers();
  }, [pageSize, pageIndex]);

  return (
    <>
      <Button type="primary" onClick={() => setModalCreateUser(true)}>
        Thêm người dùng
      </Button>
      <Table
        loading={loading}
        columns={columns}
        dataSource={users}
        pagination={false}
      />
      <Pagination
        defaultCurrent={1}
        current={pageIndex}
        total={totalDoc}
        pageSize={pageSize}
        showSizeChanger
        onChange={(pageIndex, pageSize) => {
          setPageSize(pageSize);
          setPageIndex(pageIndex);
        }}
      />
      <ModalCreateUser
        form={form}
        loading={loading}
        title={
          selectedUser
            ? "Sửa thông tin người dùng"
            : "Thêm thông tin người dùng"
        }
        isModalOpen={modalCreateUser}
        handleCancel={handelCloseModal}
        handleOk={handleCreateUser}
        selectedUser={selectedUser}
      />
      <ModalUploadUserAvatar
        isModalOpen={handelOpenUploadUserAvatarModal}
        handleCancel={handelCloseUploadUserAvatarModal}
      />
    </>
  );
};
export default Dashboard;
