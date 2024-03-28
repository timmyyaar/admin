import React, { useContext, useEffect, useState } from "react";

import "./index.css";

import { Louder } from "../../components/Louder";

import {
  getUserId,
  isAdmin,
  isCleaner,
  isDryCleaner,
  request,
} from "../../utils";
import { ORDER_STATUS, ROLES } from "../../constants";
import Filters from "./Filters";
import AdminControls from "./AdminControls";
import AssignOnMe from "./AssignOnMe";
import CleanerControls from "./CleanerControls";
import EditOrderModal from "./EditOrderModal";
import { LocaleContext } from "../../contexts";

export const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUS);

const getTimeRemaining = (endTime) => {
  const dateString = endTime.match(/([^\s]+)/)[0];
  const timeString = endTime.slice(-5);

  const endTimeDay = dateString.match(/.+?(?=\/)/)[0];
  const endTimeMonth = dateString.slice(-7, -5);
  const endTimeYear = dateString.slice(-4);
  const endTimeHours = timeString.slice(-5, -3);
  const endTimeMinutes = timeString.slice(-2);

  const total =
    Date.parse(
      `${endTimeYear}-${endTimeMonth}-${endTimeDay} ${endTimeHours}:${endTimeMinutes}`
    ) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

export const OrderPage = ({ subscription = false }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingOrderIds, setDeletingOrderIds] = useState([]);
  const [isAssignLoading, setIsAssignOrderLoading] = useState([]);
  const [assignError, setAssignError] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [isStatusLoading, setIsStatusLoading] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [orderTypeFilter, setOrderTypeFilter] = useState("All");
  const [isEditModalOpened, setIsEditModalOpened] = useState(null);

  const { t } = useContext(LocaleContext);

  const onDeleteOrder = async (id, email) => {
    const confirmed = window.confirm(
      `${t("admin_order_delete_confirmation")} - ${id} (${email})?`
    );

    if (confirmed) {
      try {
        setDeletingOrderIds((prev) => [...prev, id]);

        await request({ url: `order/${id}`, method: "DELETE" });

        setOrders((prev) => prev.filter((order) => order.id !== id));
      } finally {
        setDeletingOrderIds((prev) => prev.filter((order) => order.id !== id));
      }
    }
  };

  const getOrders = async () => {
    try {
      setLoading(true);

      const ordersResponse = await request({ url: "order" });

      setOrders(
        ordersResponse.filter(({ title }) =>
          subscription ? title === "Subscription" : title !== "Subscription"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();

    // eslint-disable-next-line
  }, [subscription]);

  const getUsers = async () => {
    try {
      setIsUsersLoading(true);

      const usersResponse = await request({ url: "users" });

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

      const assignedOrder = await request({
        url: `order/${id}/${cleanerId}`,
        method: "PATCH",
      });

      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.id === assignedOrder.id ? assignedOrder : prevOrder
        )
      );
    } catch (error) {
      if (error.code === 422) {
        setAssignError((prevErrors) => [
          ...prevErrors,
          { id, message: error.message },
        ]);
      }
    } finally {
      setIsAssignOrderLoading((prevLoading) =>
        prevLoading.filter((item) => item !== id)
      );
    }
  };

  const onChangeOrderStatus = async (id, status) => {
    try {
      setIsStatusLoading((prevIsStatusLoading) => [...prevIsStatusLoading, id]);

      const updatedOrder = await request({
        url: `order/${id}/update-status/${status}`,
        method: "PATCH",
      });

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
        .filter(({ title }) => {
          if (orderTypeFilter === "All") {
            return true;
          }

          return title === orderTypeFilter;
        })
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
        .filter(({ id, status, cleaner_id, date }) => {
          const leftTimeToOrder = getTimeRemaining(date).total;

          if (statusFilter === "All") {
            return !cleaner_id
              ? status === ORDER_STATUS.APPROVED.value && leftTimeToOrder > 0
              : cleaner_id === getUserId();
          }

          if (statusFilter === ORDER_STATUS.APPROVED.value) {
            return (
              !cleaner_id &&
              status === ORDER_STATUS.APPROVED.value &&
              leftTimeToOrder > 0
            );
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
        orderTypeFilter={orderTypeFilter}
        setOrderTypeFilter={setOrderTypeFilter}
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
                      className={`btn btn-danger d-flex align-items-center justify-content-center _ml-2 ${
                        deletingOrderIds.includes(el.id) ? "loading" : ""
                      }`}
                      onClick={() => onDeleteOrder(el.id, el.email)}
                      disabled={deletingOrderIds.includes(el.id)}
                    >
                      {t("admin_delete")}
                    </button>
                  )}
                </div>
                <div className="card-body">
                  <div className="position-relative">
                    <div>
                      {(isAdmin() ||
                        (el.cleaner_id === getUserId() &&
                          getTimeRemaining(el.date).days < 1)) && (
                        <>
                          <p className="card-text _flex _flex-col">
                            👤 {el.name}
                          </p>
                          <p className="card-text _flex _flex-col">
                            📲 {el.number}
                          </p>
                        </>
                      )}
                      {isAdmin() && (
                        <p className="card-text _flex _flex-col">
                          📩 {el.email}
                        </p>
                      )}
                      <p className="card-text _flex _flex-col">📆 {el.date}</p>
                      <p className="card-text _flex _flex-col">
                        📍{" "}
                        {el.address
                          .replace("Street", t("admin_order_street"))
                          .replace("House", t("admin_order_house"))
                          .replace(
                            "Private house",
                            t("admin_order_private_house")
                          )
                          .replace("Apartment", t("admin_order_apartment"))
                          .replace("Postcode", t("admin_order_postcode"))
                          .replace("Entrance", t("admin_order_entrance"))
                          .replace("Door phone", t("admin_order_door_phone"))
                          .replace(
                            "Additional information",
                            t("admin_order_additional_information")
                          )}
                      </p>
                      {el.requestpreviouscleaner ? (
                        <p className="card-text">
                          🧹 {t("admin_order_previous_cleaner")}
                        </p>
                      ) : null}
                      <p className="card-text">
                        💵 {t("admin_order_price")}: {el.price_original} zl
                        {el.price_original !==
                          el.total_service_price_original &&
                          `, ${t("admin_order_total_price")}: ${
                            el.total_service_price_original
                          } zl`}
                      </p>
                      {el.price !== el.price_original && (
                        <p className="card-text">
                          💸 {t("admin_order_price_with_discount")}: {el.price}{" "}
                          zl
                          {el.promo ? ` (${el.promo})` : null}
                          {el.price !== el.total_service_price &&
                            `, ${t("admin_order_total_price_with_discount")}: ${
                              el.total_service_price
                            } zl`}
                        </p>
                      )}
                      <p className="card-text">
                        💰 {t("admin_order_your_reward")}: {el.price / 2} zl
                      </p>
                      <p className="card-text">
                        {el.onlinepayment
                          ? `💳 ${t("admin_order_online")}`
                          : `💲 ${t("admin_order_cash")}`}
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
                    {isAdmin() && (
                      <>
                        <button
                          className="btn btn-primary position-absolute edit-order-button"
                          onClick={() => setIsEditModalOpened(el.id)}
                        >
                          {t("admin_edit")}
                        </button>
                        {isEditModalOpened === el.id && (
                          <EditOrderModal
                            order={el}
                            onClose={() => setIsEditModalOpened(null)}
                            setOrders={setOrders}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <div className="text-warning">
                {t("admin_no_orders_found")}...
              </div>
            )}
      </div>
    </div>
  );
};
