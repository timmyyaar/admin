import { useState } from "react";
import Modal from "../../components/common/Modal";
import {request} from "../../utils";

const ChangePasswordModal = ({ id, onClose, setUsers }) => {
  const [newPassword, setNewPassword] = useState("");
  const [isChangePasswordLoading, setIsChangePasswordLoading] = useState(false);

  const onChangePassword = async () => {
    try {
      setIsChangePasswordLoading(true);

      const updatedUser = await request({
        url: `users/${id}/change-password`,
        method: "PATCH",
        body: { password: newPassword },
      });

      setUsers((users) =>
        users.map((user) => (user.id === id ? updatedUser : user))
      );
      onClose();
    } catch (error) {
    } finally {
      setIsChangePasswordLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isActionButtonDisabled={isChangePasswordLoading || !newPassword}
      isLoading={isChangePasswordLoading}
      onActionButtonClick={onChangePassword}
      actionButtonText="Change"
    >
      <div className="w-100">
        <label className="mb-2">New password:</label>
        <input
          className="form-control"
          value={newPassword}
          onChange={({ target: { value } }) => setNewPassword(value)}
        />
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
