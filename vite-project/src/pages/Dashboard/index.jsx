import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "antd";
import { Pagination } from "antd";
import { createUser, getPagingUser } from "../../services/user";
import ModalCreateUser from "./components/ModalCreateUser";
import { toast } from "react-hot-toast";

const columns = [
  {
    title: "Tên người dùng",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Tuổi",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Quyền hạn",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "Hành động",
    key: "action",
  },
];
const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDoc, setTotalDoc] = useState(0);
  const [modalCreateUser, setModalCreateUser] = useState(false);

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
      const result = await createUser(value);
      setModalCreateUser(false);
      let newUser = users;
      newUser.pop();
      // pop là bỏ đi phần tử cuối cùng trong mảng
      setUsers([result.data.result, ...users]);
      form.resetFields();
      toast.success("Tạo tài khoản người dùng thành công");
    } catch (error) {
      console.log(error);
      toast.error("Tạo tài khoản người dùng thất bại");
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
        title={"Thêm mới người dùng"}
        isModalOpen={modalCreateUser}
        handleCancel={() => setModalCreateUser(false)}
        handleOk={handleCreateUser}
      />
    </>
  );
};
export default Dashboard;
