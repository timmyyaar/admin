import { useState } from "react";
import { ROLES } from "../../constants";
import { updateUserRole } from "./action";
import Modal from "../../components/common/Modal";

const ROLES_OPTIONS = Object.values(ROLES);

const ChangeRoleModal = ({ id, currentRole, onClose, setUsers }) => {
  const [newRole, setNewRole] = useState(currentRole);
  const [isUpdateRoleLoading, setIsUpdateRoleLoading] = useState(false);

  const onUpdateRole = async () => {
    try {
      setIsUpdateRoleLoading(true);

      const updatedUser = await updateUserRole(id, { role: newRole });

      setUsers((users) =>
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      onClose();
    } catch (error) {
    } finally {
      setIsUpdateRoleLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isActionButtonDisabled={isUpdateRoleLoading || newRole === currentRole}
      isLoading={isUpdateRoleLoading}
      onActionButtonClick={onUpdateRole}
      actionButtonText="Update"
    >
      <div className="w-100">
        <label className="mb-2">New role:</label>
        <select
          className="form-select"
          onChange={({ target: { value } }) => setNewRole(value)}
        >
          {ROLES_OPTIONS.map((option) => (
            <option selected={option === newRole} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </Modal>
  );
};

export default ChangeRoleModal;
