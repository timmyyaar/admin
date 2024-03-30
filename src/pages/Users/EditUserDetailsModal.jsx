import React, { useState } from "react";
import Modal from "../../components/common/Modal";
import { request } from "../../utils";

const EditUserDetailsModal = ({ onClose, setUsers, user }) => {
  const [haveVacuumCleaner, setHaveVacuumCleaner] = useState(
    user.have_vacuum_cleaner
  );
  const [haveCar, setHaveCar] = useState(user.have_car);
  const [isUpdateUserLoading, setIsUpdateUserLoading] = useState(false);
  const [updateError, setUpdateError] = useState(false);

  const onUpdateUser = async () => {
    try {
      setIsUpdateUserLoading(true);

      const updatedUser = await request({
        url: `users/${user.id}/update-details`,
        method: "PATCH",
        body: { haveVacuumCleaner, haveCar },
      });

      setUsers((users) =>
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      onClose();
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setIsUpdateUserLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isActionButtonDisabled={
        isUpdateUserLoading ||
        (haveVacuumCleaner === user.have_vacuum_cleaner &&
          haveCar === user.have_car)
      }
      isLoading={isUpdateUserLoading}
      onActionButtonClick={onUpdateUser}
      errorMessage={updateError}
      actionButtonText="Update"
    >
      <>
        <div className="w-100 my-3">
          <input
            id="vacuum-cleaner"
            className="_cursor-pointer"
            type="checkbox"
            checked={haveVacuumCleaner}
            onClick={() => setHaveVacuumCleaner(!haveVacuumCleaner)}
          />
          <label htmlFor="vacuum-cleaner" className="ms-2 _cursor-pointer">
            Cleaner has a vacuum cleaner
          </label>
        </div>
        <div className="w-100 my-3">
          <input
            id="car"
            className="_cursor-pointer"
            type="checkbox"
            checked={haveCar}
            onClick={() => setHaveCar(!haveCar)}
          />
          <label htmlFor="car" className="ms-2 _cursor-pointer">
            Cleaner has a car
          </label>
        </div>
      </>
    </Modal>
  );
};

export default EditUserDetailsModal;
