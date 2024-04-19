import Modal from "../../components/common/Modal";
import React, { useState } from "react";
import { EMAIL_REGEX, ROLES } from "../../constants";
import { request } from "../../utils";

const ROLES_OPTIONS = Object.values(ROLES);

const AddUserModal = ({ onClose, setUsers }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [haveVacuumCleaner, setHaveVacuumCleaner] = useState(false);
  const [haveCar, setHaveCar] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  const isCreateEnabled =
    email &&
    EMAIL_REGEX.test(email) &&
    password &&
    role &&
    firstName &&
    lastName;

  const showCheckboxes = [ROLES.CLEANER_DRY, ROLES.CLEANER].includes(role);

  const onCreateUser = async () => {
    if (!isCreateEnabled) {
      return;
    }

    try {
      setIsCreateLoading(true);
      setCreateError(null);

      const newUser = await request({
        url: "users",
        method: "POST",
        body: {
          email,
          password,
          role,
          firstName,
          lastName,
          ...(showCheckboxes && { haveVacuumCleaner, haveCar }),
        },
      });

      setUsers((users) => [...users, newUser]);
      onClose();
    } catch (error) {
      if (error.code === 422) {
        setCreateError(error.message);
      }
    } finally {
      setIsCreateLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      actionButtonText="Create user"
      onActionButtonClick={onCreateUser}
      isActionButtonDisabled={!isCreateEnabled || isCreateLoading}
      isLoading={isCreateLoading}
    >
      <div className="_inline-grid _gap-4 _w-full grid-two-columns-max-auto align-items-center">
        <label className="_mr-2">Email:</label>
        <input
          className="form-control"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
        />
        <label className="_mr-2">Password:</label>
        <input
          className="form-control"
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
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
        <label className="_mr-2">Role:</label>
        <select
          className="form-select"
          onChange={({ target: { value } }) => setRole(value)}
        >
          {ROLES_OPTIONS.map((option) => (
            <option selected={option === role} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {showCheckboxes && (
        <>
          <div className="form-check mt-4">
            <input
              id="vacuum-cleaner"
              className="form-check-input _cursor-pointer"
              type="checkbox"
              checked={haveVacuumCleaner}
              onClick={() => setHaveVacuumCleaner(!haveVacuumCleaner)}
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
              checked={haveCar}
              onClick={() => setHaveCar(!haveCar)}
            />
            <label htmlFor="car" className="form-check-label _cursor-pointer">
              Cleaner has a car
            </label>
          </div>
        </>
      )}
      {createError && <div className="mt-3 text-danger">{createError}</div>}
    </Modal>
  );
};

export default AddUserModal;
