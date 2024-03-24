import React, { useEffect, useState } from "react";

import { Louder } from "../../components/Louder";

import { getOrders, deleteOrder, assignOrder, fetchUsers } from "./actions";
import { getUserId, isAdmin } from "../../utils";
import { ROLES } from "../../constants";

export const OrderPage = ({ subscription = false }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isAssignLoading, setIsAssignOrderLoading] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [cleaners, setCleaners] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [showOnlyMyOrders, setShowOnlyMyOrders] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState(null);

  const toggleForceUpdate = () => setForceUpdate((fU) => !fU);

  const onDeleteOrder = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the order permanently?"
    );

    if (confirmed) {
      setLoading(true);
      deleteOrder({ id }).then(() => {
        setLoading(false);
        toggleForceUpdate();
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    getOrders().then((data) => {
      setOrders(
        data.order.filter((el) => {
          if (subscription) return el.title === "Subscription";
          else return el.title !== "Subscription";
        })
      );
      setLoading(false);
    });
  }, [subscription, forceUpdate]);

  const getUsers = async () => {
    try {
      setIsUsersLoading(true);

      const usersResponse = await fetchUsers();

      const cleanersResponse = usersResponse.filter(
        ({ role }) => role === ROLES.CLEANER
      );

      setCleaners(cleanersResponse);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      getUsers();
    }
  }, []);

  const onAssignOrder = async (id, cleanerId) => {
    try {
      setIsAssignOrderLoading(true);

      const assignedOrder = await assignOrder(id, cleanerId);

      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.id === assignedOrder.id ? assignedOrder : prevOrder
        )
      );
    } catch (error) {
      setAssignError(error.message);
    } finally {
      setIsAssignOrderLoading(false);
    }
  };

  const filteredOrders = isAdmin()
    ? orders.filter(
        ({ cleaner_id }) => !+assigneeFilter || cleaner_id === +assigneeFilter
      )
    : showOnlyMyOrders
    ? orders.filter(({ cleaner_id }) => cleaner_id === getUserId())
    : orders.filter(
        ({ cleaner_id }) => !cleaner_id || cleaner_id === getUserId()
      );

  return (
    <div className="order-page">
      <Louder visible={loading || isUsersLoading} />
      {!isAdmin() && (
        <div className="form-check _mt-2">
          <input
            className="form-check-input _cursor-pointer"
            type="checkbox"
            checked={showOnlyMyOrders}
            id="my-orders-checkbox"
            onChange={() => setShowOnlyMyOrders(!showOnlyMyOrders)}
          />
          <label
            className="form-check-label _cursor-pointer"
            htmlFor="my-orders-checkbox"
          >
            Show only my orders
          </label>
        </div>
      )}
      {isAdmin() && (
        <div className="_w-1/3 d-flex align-items-center _mt-2 text-nowrap">
          Assignee filter:
          <select
            value={assigneeFilter}
            className="form-select _ml-2"
            onChange={({ target: { value } }) => setAssigneeFilter(value)}
          >
            <option value={0} selected={!assigneeFilter}>
              All
            </option>
            {cleaners.map((cleaner) => (
              <option
                selected={assigneeFilter === cleaner.id}
                value={cleaner.id}
              >
                {cleaner.email}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="_mt-8">
        {filteredOrders.map((el) => (
          <div className="card _mb-3" key={el.id}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">#️⃣️ {el.id}</h5>
              {isAdmin() ? (
                <div className="_w-1/3 d-flex align-items-center">
                  Assignee:
                  <select
                    disabled={isAssignLoading}
                    value={el.cleaner_id}
                    className="form-select _ml-2"
                    onChange={({ target: { value } }) =>
                      onAssignOrder(el.id, value)
                    }
                  >
                    <option value={0} selected={!el.cleaner_id}>
                      N/A
                    </option>
                    {cleaners.map((cleaner) => (
                      <option
                        selected={cleaner.id === el.cleaner_id}
                        value={cleaner.id}
                      >
                        {cleaner.email}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                !el.cleaner_id && (
                  <div className="d-flex align-items-center">
                    {assignError && (
                      <span className="text-danger _mr-2">{assignError}</span>
                    )}
                    <button
                      className={`btn btn-primary ${
                        isAssignLoading ? "loading" : ""
                      }`}
                      onClick={() => onAssignOrder(el.id, getUserId())}
                      disabled={isAssignLoading}
                    >
                      Assign this order on me
                    </button>
                  </div>
                )
              )}
              {el.cleaner_id === getUserId() && (
                <span className="text-success _font-semibold">My order</span>
              )}
              {isAdmin() && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => onDeleteOrder(el.id)}
                >
                  x
                </button>
              )}
            </div>
            <div className="card-body">
              <div>
                <div>
                  <p className="card-text _flex _flex-col">🦄 {el.name}</p>
                  <p className="card-text _flex _flex-col">📲 {el.number}</p>
                  <p className="card-text _flex _flex-col">📩 {el.email}</p>
                  <p className="card-text _flex _flex-col">📆 {el.date}</p>
                  <p className="card-text _flex _flex-col">📍 {el.address}</p>
                  <p className="card-text">
                    💾 - {el.personaldata ? "✅" : "❌"}
                  </p>
                  {el.requestpreviouscleaner ? "🧹предыдущий клинер" : null}
                  <p className="card-text">
                    🔖 {el.price} zl {el.promo ? `(${el.promo})` : null}
                  </p>
                  <p className="card-text">
                    💸 {el.onlinepayment ? "Online" : "Cash"}
                  </p>
                  <p className="card-text">⏳ {el.estimate}</p>
                  <br />
                </div>
                <div>
                  <p className="card-text">{el.title}:</p>
                  <p className="card-text">{el.counter}</p>
                  <p className="card-text">{el.subservice}</p>
                  {el.sectitle ? (
                    <div>
                      <p className="card-text">{el.sectitle}:</p>
                      <p className="card-text">{el.seccounter}</p>
                      <p className="card-text">{el.secsubservice}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
