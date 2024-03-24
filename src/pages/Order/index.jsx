import React, { useEffect, useState } from "react";

import "./index.css";

import { Louder } from "../../components/Louder";

import {
  getOrders,
  deleteOrder,
  assignOrder,
  fetchUsers,
  changeOrderStatus,
} from "./actions";
import { getUserId, isAdmin, isCleaner, isDryCleaner } from "../../utils";
import { ORDER_STATUS, ROLES } from "../../constants";
import Filters from "./Filters";
import AdminControls from "./AdminControls";
import AssignOnMe from "./AssignOnMe";
import CleanerControls from "./CleanerControls";

export const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUS);

export const OrderPage = ({ subscription = false }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isAssignLoading, setIsAssignOrderLoading] = useState([]);
  const [assignError, setAssignError] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [isStatusLoading, setIsStatusLoading] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

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

      const cleanersResponse = usersResponse.filter(({ role }) =>
        [ROLES.CLEANER, ROLES.CLEANER_DRY].includes(role)
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
      setAssignError([]);
      setIsAssignOrderLoading((prevLoading) => [...prevLoading, id]);

      const assignedOrder = await assignOrder(id, cleanerId);

      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.id === assignedOrder.id ? assignedOrder : prevOrder
        )
      );
    } catch (error) {
      setAssignError((prevErrors) => [
        ...prevErrors,
        { id, message: error.message },
      ]);
    } finally {
      setIsAssignOrderLoading((prevLoading) =>
        prevLoading.filter((item) => item !== id)
      );
    }
  };

  const onChangeOrderStatus = async (id, status) => {
    try {
      setIsStatusLoading((prevIsStatusLoading) => [...prevIsStatusLoading, id]);

      const updatedOrder = await changeOrderStatus(id, status);

      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.id === updatedOrder.id ? updatedOrder : prevOrder
        )
      );
    } finally {
      setIsStatusLoading((prevIsStatusLoading) =>
        prevIsStatusLoading.filter((item) => item !== id)
      );
    }
  };

  const filteredOrders = isAdmin()
    ? orders
        .filter(({ cleaner_id }) => {
          if (assigneeFilter === "All") {
            return true;
          }

          if (assigneeFilter === "Not assigned") {
            return !cleaner_id;
          }

          return cleaner_id === +assigneeFilter;
        })
        .filter(({ status, cleaner_id }) => {
          if (statusFilter === "All") {
            return true;
          }

          return status === statusFilter;
        })
    : orders
        .filter(({ title }) => {
          if (isDryCleaner()) {
            return ["Dry cleaning", "Ozonation"].includes(title);
          }

          if (isCleaner()) {
            return title !== "Dry cleaning" && title !== "Ozonation";
          }

          return false;
        })
        .filter(({ status, cleaner_id }) => {
          if (statusFilter === "All") {
            return !cleaner_id
              ? status === ORDER_STATUS.APPROVED.value
              : cleaner_id === getUserId();
          }

          if (statusFilter === ORDER_STATUS.APPROVED.value) {
            return !cleaner_id && status === ORDER_STATUS.APPROVED.value;
          }

          if (statusFilter === "all-my-orders") {
            return cleaner_id === getUserId();
          }

          if (statusFilter === "my-not-started-orders") {
            return (
              cleaner_id === getUserId() &&
              status === ORDER_STATUS.APPROVED.value
            );
          }

          return cleaner_id === getUserId() && status === statusFilter;
        });

  return (
    <div className="order-page">
      <Louder visible={loading || isUsersLoading} />
      <Filters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        cleaners={cleaners}
      />
      <div className="_mt-8">
        {filteredOrders.length > 0
          ? filteredOrders.map((el) => (
              <div className="card _mb-3" key={el.id}>
                <div className="card-header _gap-4 d-flex justify-content-between align-items-center order-header">
                  <h5 className="card-title mb-0 min-width-max-content _mr-2">
                    #️⃣️ {el.id}
                  </h5>
                  {isAdmin() && (
                    <AdminControls
                      order={el}
                      isAssignLoading={isAssignLoading}
                      isStatusLoading={isStatusLoading}
                      onAssignOrder={onAssignOrder}
                      cleaners={cleaners}
                      onChangeOrderStatus={onChangeOrderStatus}
                    />
                  )}
                  {!isAdmin() && !el.cleaner_id && (
                    <AssignOnMe
                      order={el}
                      assignError={assignError}
                      isAssignLoading={isAssignLoading}
                      onAssignOrder={onAssignOrder}
                    />
                  )}
                  {el.cleaner_id === getUserId() && (
                    <CleanerControls
                      order={el}
                      isStatusLoading={isStatusLoading}
                      onChangeOrderStatus={onChangeOrderStatus}
                    />
                  )}
                  {isAdmin() && (
                    <button
                      type="button"
                      className="btn btn-danger _ml-2"
                      onClick={() => onDeleteOrder(el.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="card-body">
                  <div>
                    <div>
                      <p className="card-text _flex _flex-col">🦄 {el.name}</p>
                      <p className="card-text _flex _flex-col">
                        📲 {el.number}
                      </p>
                      <p className="card-text _flex _flex-col">📩 {el.email}</p>
                      <p className="card-text _flex _flex-col">📆 {el.date}</p>
                      <p className="card-text _flex _flex-col">
                        📍 {el.address}
                      </p>
                      <p className="card-text">
                        💾 - {el.personaldata ? "✅" : "❌"}
                      </p>
                      {el.requestpreviouscleaner ? "🧹предыдущий клинер" : null}
                      <p className="card-text">
                        🔖 Price: {el.price} zl
                        {el.promo ? ` (${el.promo})` : null}
                        {el.price !== el.total_service_price &&
                          `, Total price: ${el.total_service_price} zl`}
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
            ))
          : !loading && <div className="text-warning">No orders found...</div>}
      </div>
    </div>
  );
};
