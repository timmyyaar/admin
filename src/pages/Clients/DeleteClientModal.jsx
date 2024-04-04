import Modal from "../../components/common/Modal";
import React, { useState } from "react";
import { request } from "../../utils";

function DeleteClientModal({ deletingClient, onClose, setClients }) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const deleteClient = async () => {
    try {
      setIsDeleteLoading(true);

      await request({ url: `clients/${deletingClient.id}`, method: "DELETE" });

      setClients((prev) =>
        prev.filter((item) => item.id !== deletingClient.id)
      );

      onClose();
    } catch (e) {
      setDeleteError(e.message);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      actionButtonText="Delete"
      isActionButtonDanger
      isLoading={isDeleteLoading}
      isActionButtonDisabled={isDeleteLoading}
      errorMessage={deleteError}
      onActionButtonClick={deleteClient}
    >
      <h5 className="mb-4 text-center">
        Are you sure you want to delete client
        <span className="font-weight-semi-bold text-danger _ml-1">
          {deletingClient.name}
        </span>
        ?
      </h5>
    </Modal>
  );
}

export default DeleteClientModal;
