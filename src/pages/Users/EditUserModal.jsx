import React, { useState } from "react";
import { ROLES } from "../../constants";
import Select from "../../components/common/Select/Select";
import Modal from "../../components/common/Modal";
import { request } from "../../utils";

const ROLES_OPTIONS = Object.values(ROLES).map((item) => ({
  value: item,
  label: item,
}));

function EditUserModal({ onClose, user, setUsers }) {
  const [role, setRole] = useState(user.role);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [hasVacuumCleaner, setHasVacuumCleaner] = useState(
    user.have_vacuum_cleaner
  );
  const [hasCar, setHasCar] = useState(user.have_car);
  const [isEditUserLoading, setIsEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState("");

  const isEditUserEnabled = firstName && lastName && role;

  const showCheckboxes = [ROLES.CLEANER_DRY, ROLES.CLEANER].includes(role);

  const updateUser = async () => {
    if (!isEditUserEnabled) {
      return;
    }

    try {
      setIsEditUserLoading(true);

      const updatedUser = await request({
        url: `users/${user.id}`,
        method: "PUT",
        body: {
          role,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          ...(showCheckboxes && {
            haveVacuumCleaner: hasVacuumCleaner,
            haveCar: hasCar,
          }),
        },
      });

      setUsers((prev) =>
        prev.map((prevUser) =>
          prevUser.id === updatedUser.id ? updatedUser : prevUser
        )
      );
      onClose();
    } catch (error) {
      setEditUserError(error.message);
    } finally {
      setIsEditUserLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      actionButtonText="Edit user"
      noOverflow
      isActionButtonDisabled={!isEditUserEnabled || isEditUserLoading}
      isLoading={isEditUserLoading}
      errorMessage={editUserError}
      onActionButtonClick={updateUser}
    >
      <h5 className="mb-4 text-center">
        Edit user {user.first_name} {user.last_name}
      </h5>
      <div className="_inline-grid _gap-4 _w-full grid-two-columns-max-auto align-items-center">
        <label className="_mr-2">Role:</label>
        <Select
          options={ROLES_OPTIONS}
          placeholder="Select role..."
          value={ROLES_OPTIONS.find((item) => item.value === role)}
          onChange={(option) => setRole(option.value)}
        />
        <label className="_mr-2">First name:</label>
        <input
          className="form-control"
          value={firstName}
          onChange={({ target: { value } }) => setFirstName(value)}
        />
        <label className="_mr-2">Last name:</label>
        <input
          className="form-control"
          value={lastName}
          onChange={({ target: { value } }) => setLastName(value)}
        />
      </div>
      {showCheckboxes && (
        <>
          <div className="form-check mt-4">
            <input
              id="vacuum-cleaner"
              className="form-check-input _cursor-pointer"
              type="checkbox"
              checked={hasVacuumCleaner}
              onClick={() => setHasVacuumCleaner(!hasVacuumCleaner)}
            />
            <label
              htmlFor="vacuum-cleaner"
              className="form-check-label _cursor-pointer"
            >
              Cleaner has a vacuum cleaner
            </label>
          </div>
          <div className="form-check">
            <input
              id="car"
              className="form-check-input _cursor-pointer"
              type="checkbox"
              checked={hasCar}
              onClick={() => setHasCar(!hasCar)}
            />
            <label htmlFor="car" className="form-check-label _cursor-pointer">
              Cleaner has a car
            </label>
          </div>
        </>
      )}
    </Modal>
  );
}

export default EditUserModal;
