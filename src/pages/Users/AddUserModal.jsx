import Modal from "../../components/common/Modal";
import React, { useState } from "react";
import { EMAIL_REGEX, ROLES } from "../../constants";
import { request } from "../../utils";

const ROLES_OPTIONS = Object.values(ROLES);

const AddUserModal = ({ onClose, setUsers }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [haveVacuumCleaner, setHaveVacuumCleaner] = useState(false);
  const [haveCar, setHaveCar] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  const isEmailValid = EMAIL_REGEX.test(email);

  const onCreateUser = async () => {
    try {
      setIsCreateLoading(true);
      setCreateError(null);

      const newUser = await request({
        url: "users",
        method: "POST",
        body: { email, password, role, haveVacuumCleaner, haveCar },
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
      isActionButtonDisabled={
        !email || !password || !role || !isEmailValid || isCreateLoading
      }
      isLoading={isCreateLoading}
    >
      <div>
        <div className="w-100 mb-3">
          <label className="mb-2">Email:</label>
          <input
            className="form-control"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Password:</label>
          <input
            className="form-control"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />
        </div>
        <div className="w-100">
          <label className="mb-2">Role:</label>
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
        {[ROLES.CLEANER_DRY, ROLES.CLEANER].includes(role) && (
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
        )}
        {createError && <div className="mt-3 text-danger">{createError}</div>}
      </div>
    </Modal>
  );
};

export default AddUserModal;
