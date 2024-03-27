import { useState } from "react";
import { ROLES } from "../../constants";
import Modal from "../../components/common/Modal";
import { request } from "../../utils";

const ROLES_OPTIONS = Object.values(ROLES);

const ChangeRoleModal = ({ id, currentRole, onClose, setUsers }) => {
  const [newRole, setNewRole] = useState(currentRole);
  const [isUpdateRoleLoading, setIsUpdateRoleLoading] = useState(false);
  const [roleError, setRoleError] = useState(false);

  const onUpdateRole = async () => {
    try {
      setIsUpdateRoleLoading(true);

      const updatedUser = await request({
        url: `users/${id}/update-role`,
        method: "PATCH",
        body: { role: newRole },
      });

      setUsers((users) =>
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      onClose();
    } catch (error) {
      if (error.code === 422) {
        setRoleError(true);
      }
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
        <label className="_mb-2">New role:</label>
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
        {roleError && (
          <div className="_mt-2 text-danger">User already have this role!</div>
        )}
      </div>
    </Modal>
  );
};

export default ChangeRoleModal;
