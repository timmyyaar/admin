import React, { useContext, useState } from "react";
import { CITIES_OPTIONS, ROLES, ROLES_OPTIONS } from "../../constants";
import Select from "../../components/common/Select/Select";
import Modal from "../../components/common/Modal";
import { request } from "../../utils";
import { AppContext } from "../../contexts";

function EditUserModal({ onClose, user, setUsers }) {
  const {
    userData: { role: userRole },
  } = useContext(AppContext);

  const [role, setRole] = useState(user.role);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [hasVacuumCleaner, setHasVacuumCleaner] = useState(
    user.have_vacuum_cleaner,
  );
  const [hasCar, setHasCar] = useState(user.have_car);
  const [cities, setCities] = useState(user.cities.split(","));
  const [isEditUserLoading, setIsEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState("");

  const isEditUserEnabled = firstName && lastName && role && cities.length > 0;

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
          cities,
          ...(showCheckboxes && {
            haveVacuumCleaner: hasVacuumCleaner,
            haveCar: hasCar,
          }),
        },
      });

      setUsers((prev) =>
        prev.map((prevUser) =>
          prevUser.id === updatedUser.id ? updatedUser : prevUser,
        ),
      );
      onClose();
    } catch (error) {
      setEditUserError(error.message);
    } finally {
      setIsEditUserLoading(false);
    }
  };

  const citiesValue = cities.map((item) => ({ value: item, label: item }));

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
          options={
            userRole === ROLES.SUPERVISOR
              ? ROLES_OPTIONS
              : ROLES_OPTIONS.filter(({ value }) => value !== ROLES.SUPERVISOR)
          }
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
        <label className="_mr-2">Cities:</label>
        <Select
          isMulti
          options={CITIES_OPTIONS}
          value={citiesValue}
          onChange={(options) =>
            setCities(options?.map(({ value }) => value) || [])
          }
          menuPortalTarget={document.body}
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
