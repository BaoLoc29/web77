import React, { useState } from "react";
import { Button, Modal } from "antd";
const ModalUploadUserAvatar = ({ isModalOpen, handleCancel, handelOk }) => {
  const [file, setFile] = useState(null);

  return (
    <Modal
      title="Cập nhật hình đại diện người dùng"
      open={isModalOpen}
      onOk={handelOk}
      onCancel={handleCancel}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <Button type="primary">Upload</Button>
    </Modal>
  );
};

export default ModalUploadUserAvatar;
