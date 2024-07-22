import Modal from "../../components/common/Modal";
import React, { useContext, useState } from "react";
import {
  CITIES_OPTIONS,
  EMAIL_REGEX,
  ROLES,
  ROLES_OPTIONS,
} from "../../constants";
import { request } from "../../utils";
import Select from "../../components/common/Select/Select";
import { AppContext } from "../../contexts";

const AddUserModal = ({ onClose, setUsers }) => {
  const {
    userData: { role: userRole },
  } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(ROLES.ADMIN);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [haveVacuumCleaner, setHaveVacuumCleaner] = useState(false);
  const [haveCar, setHaveCar] = useState(false);
  const [cities, setCities] = useState([]);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  const isCreateEnabled =
    email &&
    EMAIL_REGEX.test(email) &&
    password &&
    role &&
    firstName &&
    lastName &&
    cities.length > 0;

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
          cities,
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

  const citiesValue = cities.map((city) => ({ value: city, label: city }));
  const roleValue = ROLES_OPTIONS.find(({ value }) => role === value);

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
        <Select
          options={
            userRole === ROLES.SUPERVISOR
              ? ROLES_OPTIONS
              : ROLES_OPTIONS.filter(({ value }) => value !== ROLES.SUPERVISOR)
          }
          value={roleValue}
          onChange={(option) => setRole(option.value)}
          menuPortalTarget={document.body}
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
