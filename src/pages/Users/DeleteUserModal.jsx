import { useState } from "react";
import { deleteUser } from "./action";
import Modal from "../../components/common/Modal";

const DeleteUserModal = ({ id, email, role, onClose, setUsers }) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const onDeleteUser = async () => {
    try {
      setIsDeleteLoading(true);

      await deleteUser(id);

      setUsers((users) => users.filter((user) => user.id !== id));
      onClose();
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isActionButtonDisabled={isDeleteLoading}
      isLoading={isDeleteLoading}
      onActionButtonClick={onDeleteUser}
      actionButtonText="Delete"
      isActionButtonDanger
    >
      <div>
        <h3>
          Are you sure you want to delete
          <span className="text-primary _ml-1">{email}</span> user ({role}{" "}
          role)?
        </h3>
        {deleteError && <div className="_mt-3 text-danger">{deleteError}</div>}
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
