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
import { BRACKETS_REGEX, ORDER_STATUS, ROLES } from "../../constants";
import Filters from "./Filters";
import AdminControls from "./AdminControls";
import AssignOnMe from "./AssignOnMe";
import CleanerControls from "./CleanerControls";
import { LocaleContext } from "../../contexts";
import Price from "./Price";
import AdminButtons from "./AdminButtons";
import NewClientMessage from "./NewClientMessage";
import NumberOfCleaners from "./NumberOfCleaners/NumberOfCleaners";

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
  const [isAssignLoading, setIsAssignOrderLoading] = useState([]);
  const [assignError, setAssignError] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [isStatusLoading, setIsStatusLoading] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [orderTypeFilter, setOrderTypeFilter] = useState("All");

  const { t } = useContext(LocaleContext);

  const getTranslatedServices = (services) => {
    let transformedServicesString = services;

    services
      .split(BRACKETS_REGEX)
      .map((service) => service.trim())
      .forEach((service) => {
        transformedServicesString = transformedServicesString.replace(
          service,
          t(service)
        );
      });

    return transformedServicesString;
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
    } else {
      setIsUsersLoading(false);
    }
  }, []);

  const onAssignOrder = async (id, cleanerId) => {
    try {
      setAssignError([]);
      setIsAssignOrderLoading((prevLoading) => [...prevLoading, id]);

      const assignedOrder = await request({
        url: `order/${id}/assign`,
        body: { cleanerId },
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
        .filter(({ cleaner_id, cleaners_count }) => {
          if (assigneeFilter === "All") {
            return true;
          }

          if (assigneeFilter === "Not assigned") {
            return !cleaner_id || cleaner_id.length < cleaners_count;
          }

          return cleaner_id.includes(+assigneeFilter);
        })
        .filter(({ status }) => {
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
        .filter(({ id, status, cleaner_id, cleaners_count, date }) => {
          const leftTimeToOrder = getTimeRemaining(date).total;

          if (statusFilter === "All") {
            if (cleaner_id.length < cleaners_count) {
              console.log(
                status === ORDER_STATUS.APPROVED.value && leftTimeToOrder > 0
              );
            }
            return cleaner_id.length < cleaners_count
              ? status === ORDER_STATUS.APPROVED.value && leftTimeToOrder > 0
              : cleaner_id.includes(getUserId());
          }

          if (statusFilter === ORDER_STATUS.APPROVED.value) {
            return (
              cleaner_id.length < cleaners_count &&
              status === ORDER_STATUS.APPROVED.value &&
              leftTimeToOrder > 0
            );
          }

          if (statusFilter === "all-my-orders") {
            return cleaner_id.includes(getUserId());
          }

          if (statusFilter === "my-not-started-orders") {
            return (
              cleaner_id.includes(getUserId()) &&
              status === ORDER_STATUS.APPROVED.value
            );
          }

          return cleaner_id.includes(getUserId()) && status === statusFilter;
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
                <div
                  className={`card-header _gap-4 d-flex justify-content-between align-items-center ${
                    isAdmin() ? "order-header" : ""
                  }`}
                >
                  <h5 className="card-title mb-0 min-width-max-content _mr-2 d-flex align-items-center justify-content-between order-title">
                    <div>#️⃣️ {el.id}</div>
                    {isAdmin() && (
                      <div className="mobile-only">
                        <AdminButtons t={t} setOrders={setOrders} order={el} />
                      </div>
                    )}
                  </h5>
                  {isAdmin() && !isUsersLoading && (
                    <AdminControls
                      order={el}
                      isAssignLoading={isAssignLoading}
                      isStatusLoading={isStatusLoading}
                      onAssignOrder={onAssignOrder}
                      cleaners={cleaners}
                      onChangeOrderStatus={onChangeOrderStatus}
                    />
                  )}
                  <CleanerControls
                    order={el}
                    isStatusLoading={isStatusLoading}
                    onChangeOrderStatus={onChangeOrderStatus}
                    setOrders={setOrders}
                  />
                  {isAdmin() && (
                    <div className="mobile-none">
                      <AdminButtons t={t} setOrders={setOrders} order={el} />
                    </div>
                  )}
                </div>
                <div className="card-body d-flex position-relative order-wrapper">
                  <div
                    className={`position-relative ${
                      el.is_new_client ? "order-container" : "w-100"
                    }`}
                  >
                    <div>
                      {el.is_new_client && (
                        <div className="mb-3 mobile-only">
                          <NewClientMessage t={t} />
                        </div>
                      )}
                      {(isAdmin() ||
                        (el.cleaner_id.includes(getUserId()) &&
                          getTimeRemaining(el.date).days < 1)) && (
                        <>
                          <p>👤 {el.name}</p>
                          <p>📲 {el.number}</p>
                        </>
                      )}
                      {isAdmin() && <p>📩 {el.email}</p>}
                      <p>📆 {el.date}</p>
                      <p
                        className={`${
                          el.transportation_price > 0 ? "mb-0" : "mb-3"
                        }`}
                      >
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
                          .replace("Door phone", t("admin_order_door_phone"))}
                      </p>
                      {el.transportation_price > 0 && (
                        <p className="width-max-content p-2 mt-2 font-weight-semi-bold transportation-badge">
                          {t("summary_transportation_title")} ({el.city})
                          <span> +{el.transportation_price} zl</span>
                        </p>
                      )}
                      {el.requestpreviouscleaner ? (
                        <p className="card-text">
                          🧹 {t("admin_order_previous_cleaner")}
                        </p>
                      ) : null}
                      <Price t={t} {...el} />
                      <p className="card-text">
                        💰 {t("admin_order_your_reward")}: {el.price / 2} zl
                      </p>
                      <p className="card-text font-weight-semi-bold">
                        <span className="_mr-1">
                          {el.onlinepayment ? "💳" : "💲"}
                        </span>
                        <span className="_mr-1">
                          {t("admin_order_payment")}:
                        </span>
                        {el.onlinepayment
                          ? `${t("admin_order_online")}`
                          : `${t("admin_order_cash")}`}
                      </p>
                      <p className="card-text font-weight-semi-bold">
                        ⏳ {t("admin_order_estimate")}: {el.estimate}
                      </p>
                      <p className="card-text _ml-2 font-weight-semi-bold">
                        <span className="_mr-1">🔌</span>
                        {el.subservice.includes(
                          "Vacuum_cleaner_sub_service_summery "
                        )
                          ? t("admin_order_need_vacuum_cleaner")
                          : t("admin_order_have_vacuum_cleaner")}
                      </p>
                      <br />
                    </div>
                    <div>
                      <p className="card-text">{t(el.title)}:</p>
                      <p className="card-text">
                        {getTranslatedServices(el.counter)}
                      </p>
                      <p className="card-text">
                        {getTranslatedServices(el.subservice)}
                      </p>
                      {el.additional_information && (
                        <p className="card-text font-weight-semi-bold">
                          💬 {t("admin_order_additional_information")}:
                          <span className="_ml-1">
                            {el.additional_information}
                          </span>
                        </p>
                      )}
                      <NumberOfCleaners t={t} {...el} />
                    </div>
                  </div>
                  {el.is_new_client && (
                    <div className="mobile-none">
                      <NewClientMessage t={t} />
                    </div>
                  )}
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
