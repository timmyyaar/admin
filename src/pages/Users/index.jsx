import React, { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";
import { getUserEmail, request } from "../../utils";
import { Louder } from "../../components/Louder";
import ChangeRoleModal from "./ChangeRoleModal";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteUserModal from "./DeleteUserModal";
import EditUserDetailsModal from "./EditUserDetailsModal";
import { ROLES } from "../../constants";
import { ReactComponent as StarIcon } from "../../assets/icons/star.svg";
import UserRatingPopover from "./UserRatingPopover/UserRatingPopover";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isAddNewModalOpened, setIsAddNewModalOpened] = useState(false);
  const [updatingPasswordUser, setUpdatingPasswordUser] = useState(null);
  const [updatingUserRole, setUpdatingUserRole] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [editingUserDetails, setEditingUserDetails] = useState(null);
  const [editingUserRating, setEditingUserRating] = useState(null);
  const [ratingIdsLoading, setRatingIdsLoading] = useState([]);

  const getUsers = async () => {
    try {
      setIsUsersLoading(true);

      const usersResponse = await request({ url: "users" });

      setUsers(usersResponse);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="mt-4">
      <Louder visible={isUsersLoading} />
      <button
        className="btn btn-primary mb-3"
        onClick={() => setIsAddNewModalOpened(true)}
      >
        Add new user
      </button>
      {isAddNewModalOpened && (
        <AddUserModal
          onClose={() => setIsAddNewModalOpened(false)}
          setUsers={setUsers}
        />
      )}
      {updatingUserRole && (
        <ChangeRoleModal
          onClose={() => setUpdatingUserRole(null)}
          setUsers={setUsers}
          currentRole={updatingUserRole.role}
          id={updatingUserRole.id}
        />
      )}
      {updatingPasswordUser && (
        <ChangePasswordModal
          onClose={() => setUpdatingPasswordUser(null)}
          setUsers={setUsers}
          id={updatingPasswordUser.id}
        />
      )}
      {editingUserDetails && (
        <EditUserDetailsModal
          user={editingUserDetails}
          setUsers={setUsers}
          onClose={() => setEditingUserDetails(null)}
        />
      )}
      {deletingUser && (
        <DeleteUserModal
          onClose={() => setDeletingUser(null)}
          setUsers={setUsers}
          {...deletingUser}
        />
      )}
      {users.map((user) => (
        <div className="card mb-3" key={user.id}>
          <div className="card-header d-flex align-items-center">
            <h5 className="card-title mb-0 d-flex justify-content-start align-items-center">
              ️{user.email}
            </h5>
            <div className="_ml-auto d-flex">
              {getUserEmail() !== user.email &&
                [ROLES.CLEANER, ROLES.CLEANER_DRY].includes(user.role) && (
                  <div className="position-relative">
                    <button
                      className={`btn btn-secondary icon-button ${
                        ratingIdsLoading.includes(user.id) ? "loading" : ""
                      }`}
                      onClick={() =>
                        setEditingUserRating(editingUserRating ? null : user)
                      }
                      disabled={ratingIdsLoading.includes(user.id)}
                    >
                      {!ratingIdsLoading.includes(user.id) && (
                        <StarIcon className="text-warning" />
                      )}
                    </button>
                    {editingUserRating?.id === user.id && (
                      <UserRatingPopover
                        onClose={() => setEditingUserRating(null)}
                        id={editingUserRating.id}
                        setUsers={setUsers}
                        ratingIdsLoading={ratingIdsLoading}
                        setRatingIdsLoading={setRatingIdsLoading}
                      />
                    )}
                  </div>
                )}
              {[ROLES.CLEANER, ROLES.CLEANER_DRY].includes(user.role) && (
                <button
                  className="btn btn-secondary _ml-3"
                  onClick={() => setEditingUserDetails(user)}
                >
                  Update details
                </button>
              )}
              {getUserEmail() !== user.email && (
                <button
                  className="btn btn-warning _ml-3"
                  onClick={() => setUpdatingPasswordUser(user)}
                >
                  Change password
                </button>
              )}
              {getUserEmail() !== user.email && (
                <button
                  className="btn btn-secondary _ml-3"
                  onClick={() => setUpdatingUserRole(user)}
                >
                  Change role
                </button>
              )}
              {getUserEmail() !== user.email && (
                <button
                  type="button"
                  title="Delete review"
                  className="btn btn-danger _ml-3"
                  onClick={() => setDeletingUser(user)}
                >
                  &#10005;
                </button>
              )}
            </div>
          </div>
          <div className="card-body">
            <p>
              Role:
              <span className="_font-bold _ml-2">{user.role}</span>
            </p>
            {[ROLES.CLEANER_DRY, ROLES.CLEANER].includes(user.role) && (
              <>
                <p>⭐ Rating: {user.rating}</p>
                <p>
                  👩🏻‍🦯 Have vacuum cleaner:{" "}
                  {user.have_vacuum_cleaner ? "Yes" : "No"}
                </p>
                <p>🚗 Have car: {user.have_car ? "Yes" : "No"}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Users;
