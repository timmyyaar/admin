import { useState } from "react";
import { request } from "../../utils";
import Modal from "../../components/common/Modal";

function DeleteModal({ onClose, id, setBlogs }) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const deleteBlog = async () => {
    try {
      setIsDeleteLoading(true);

      await request({ url: `blogs/${id}`, method: "DELETE" });

      setBlogs((prev) => prev.filter((item) => item.id !== id));
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
      errorMessage={deleteError}
      onActionButtonClick={deleteBlog}
      isActionButtonDanger
      isLoading={isDeleteLoading}
      isActionButtonDisabled={isDeleteLoading}
    >
      <h5 className="mb-4 text-center">
        Are you sure you want to delete blog?
      </h5>
    </Modal>
  );
}

export default DeleteModal;
