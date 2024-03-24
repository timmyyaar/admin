import Modal from "../../components/common/Modal";
import { useState } from "react";
import { EMAIL_REGEX, ROLES } from "../../constants";
import { createUser } from "./action";

const ROLES_OPTIONS = Object.values(ROLES);

const AddUserModal = ({ onClose, setUsers }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  const isEmailValid = EMAIL_REGEX.test(email);

  const onCreateUser = async () => {
    try {
      setIsCreateLoading(true);
      setCreateError(null);

      const newUser = await createUser({ email, password, role });

      setUsers((users) => [...users, newUser]);
      onClose();
    } catch (error) {
      setCreateError(error.message);
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
        {createError && <div className="mt-3 text-danger">{createError}</div>}
      </div>
    </Modal>
  );
};

export default AddUserModal;
