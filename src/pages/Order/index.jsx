import React, { useContext, useEffect, useState } from "react";
import reactStringReplace from "react-string-replace";

import "./index.css";

import { Louder } from "../../components/Louder";

import {
  getDateTimeObjectFromString,
  getTimeRemaining,
  getUserId,
  isAdmin,
  isCleaner,
  isDryCleaner,
  request,
} from "../../utils";
import { ORDER_STATUS, ROLES } from "../../constants";
import Filters from "./Filters";
import AdminControls from "./AdminControls";
import CleanerControls from "./CleanerControls";
import { LocaleContext } from "../../contexts";
import Price from "./Price";
import AdminButtons from "./AdminButtons";
import NewClientMessage from "./NewClientMessage";
import NumberOfCleaners from "./NumberOfCleaners/NumberOfCleaners";
import Note from "./Note";
import CheckListModal from "./CleckListModal";
import {
  getSubServiceWithBalcony,
  getSubServiceWithCarpet,
  getTranslatedServices,
} from "./utils";
import Payment from "./Payment";

export const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUS);

const SHOW_VACUUM_CLEANER_TITLES = [
  "Regular",
  "Deep",
  "Eco cleaning",
  "Custom",
  "Office",
  "Move in/out",
  "Deep kitchen",
  "After party",
  "Airbnb",
  "In a last minute",
];

const getSubServiceWithoutVacuumCleaner = (subService) => {
  return subService.replace("Vacuum_cleaner_sub_service_summery (1)", "");
};

export const OrderPage = ({ subscription = false }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cleaners, setCleaners] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [isStatusLoading, setIsStatusLoading] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [orderTypeFilter, setOrderTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState({
    fromDate: null,
    toDate: null,
  });
  const [showCheckListId, setShowCheckListId] = useState(null);
  const [showCheckListEditId, setShowCheckListEditId] = useState(null);
  const [isScheduleLoading, setIsScheduleLoading] = useState(false);
  const [schedule, setSchedule] = useState([]);

  const { t } = useContext(LocaleContext);

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

  const getSchedule = async () => {
    try {
      setIsScheduleLoading(true);

      const scheduleResponse = await request({ url: "schedule" });

      setSchedule(scheduleResponse);
    } finally {
      setIsScheduleLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      getUsers();
      getSchedule();
    } else {
      setIsUsersLoading(false);
    }
  }, []);

  const onChangeOrderStatus = async (id, status, checkList) => {
    try {
      setIsStatusLoading((prevIsStatusLoading) => [...prevIsStatusLoading, id]);

      const updatedOrder = await request({
        url: `order/${id}/update-status/${status}`,
        method: "PATCH",
        ...(checkList && { body: { checkList } }),
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

  const filteredOrdersByDate = filteredOrders.filter(({ date }) => {
    const dateObject = getDateTimeObjectFromString(date);

    if (dateFilter.fromDate && dateFilter.toDate) {
      return (
        dateObject >= dateFilter.fromDate && dateObject <= dateFilter.toDate
      );
    }

    if (dateFilter.fromDate) {
      return dateObject >= dateFilter.fromDate;
    }

    if (dateFilter.toDate) {
      return dateObject <= dateFilter.toDate;
    }

    return true;
  });

  return (
    <div className="order-page">
      <Louder visible={loading || isUsersLoading || isScheduleLoading} />
      <Filters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        cleaners={cleaners}
        orderTypeFilter={orderTypeFilter}
        setOrderTypeFilter={setOrderTypeFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
      <div className="_mt-8">
        {filteredOrdersByDate.length > 0
          ? filteredOrdersByDate.map((el) => (
              <div className="card _mb-3" key={el.id}>
                {el.id === showCheckListId && (
                  <CheckListModal
                    order={el}
                    onClose={() => setShowCheckListId(null)}
                    t={t}
                    isPlain
                    isFinished={el.status === ORDER_STATUS.DONE.value}
                  />
                )}
                {el.id === showCheckListEditId && (
                  <CheckListModal
                    order={el}
                    onClose={() => setShowCheckListEditId(null)}
                    t={t}
                    onChangeOrderStatus={onChangeOrderStatus}
                  />
                )}
                <div
                  className={`card-header _gap-4 d-flex justify-content-between align-items-center ${
                    isAdmin() ? "order-header" : ""
                  }`}
                >
                  <h5 className="card-title mb-0 min-width-max-content _mr-2 d-flex align-items-center justify-content-between order-title">
                    <div>#️⃣️ {el.id}</div>
                    {isAdmin() && (
                      <div className="mobile-only">
                        <AdminButtons
                          t={t}
                          setOrders={setOrders}
                          order={el}
                          onCheckListOpen={(id) => setShowCheckListId(id)}
                        />
                      </div>
                    )}
                  </h5>
                  {isAdmin() && !isUsersLoading && (
                    <AdminControls
                      order={el}
                      isStatusLoading={isStatusLoading}
                      cleaners={cleaners}
                      onChangeOrderStatus={onChangeOrderStatus}
                      setOrders={setOrders}
                      setShowCheckListEditId={setShowCheckListEditId}
                      schedule={schedule}
                    />
                  )}
                  <CleanerControls
                    order={el}
                    isStatusLoading={isStatusLoading}
                    onChangeOrderStatus={onChangeOrderStatus}
                    setOrders={setOrders}
                    onCheckListOpen={(id) => setShowCheckListId(id)}
                    onCheckListEditOpen={(id) => setShowCheckListEditId(id)}
                  />
                  {isAdmin() && (
                    <div className="mobile-none">
                      <AdminButtons
                        t={t}
                        setOrders={setOrders}
                        order={el}
                        onCheckListOpen={(id) => setShowCheckListId(id)}
                      />
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
                      {(el.is_new_client || el.note) && (
                        <div className="mb-3 mobile-only">
                          {el.is_new_client && <NewClientMessage t={t} />}
                          {el.note && (
                            <div
                              className={`${el.is_new_client ? "_mt-3" : ""}`}
                            >
                              <Note t={t} note={el.note} />
                            </div>
                          )}
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
                      <p className="d-flex">
                        <span className="_mr-3">📆 {el.date}</span>
                        {el.creation_date && isAdmin() && (
                          <span>
                            ✍🏼 {t("admin_order_created")} {el.creation_date}
                          </span>
                        )}
                      </p>
                      <p
                        className={`${
                          el.transportation_price > 0 ? "mb-0" : "mb-3"
                        }`}
                      >
                        <span className="_mr-1">📍</span>
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
                        💰 {t("admin_order_your_reward")}:
                        <span className="_ml-1">
                          {el.reward || el.reward_original} zl
                        </span>
                        {isAdmin() && Boolean(el.reward) && (
                          <span className="_ml-1">
                            <span className="_mr-1">
                              ({t("admin_order_original_reward")}:
                            </span>
                            {el.reward_original} zl)
                          </span>
                        )}
                      </p>
                      <Payment t={t} order={el} setOrders={setOrders} />
                      <p className="card-text font-weight-semi-bold">
                        ⏳ {t("admin_order_estimate")}: {el.estimate}
                      </p>
                      {SHOW_VACUUM_CLEANER_TITLES.includes(el.title) && (
                        <p className="card-text _ml-2 font-weight-semi-bold">
                          <span className="_mr-1">🔌</span>
                          {el.subservice.includes(
                            "Vacuum_cleaner_sub_service_summery "
                          )
                            ? t("admin_order_need_vacuum_cleaner")
                            : t("admin_order_have_vacuum_cleaner")}
                        </p>
                      )}
                      <br />
                    </div>
                    <div>
                      <p className="card-text">{t(el.title)}:</p>
                      <p className="card-text">
                        {getTranslatedServices(t, el.counter, el.title)}
                      </p>
                      <p className="card-text">
                        {reactStringReplace(
                          getTranslatedServices(
                            t,
                            getSubServiceWithCarpet(
                              getSubServiceWithBalcony(
                                getSubServiceWithoutVacuumCleaner(el.subservice)
                              )
                            )
                          ),
                          "m2",
                          () => (
                            <>
                              m<sup>2</sup>
                            </>
                          )
                        )}
                      </p>
                      {el.additional_information && (
                        <p className="card-text font-weight-semi-bold">
                          💬 {t("admin_order_additional_information")}:
                          <span className="_ml-1">
                            {el.additional_information}
                          </span>
                        </p>
                      )}
                      {el.status === ORDER_STATUS.DONE.value &&
                        el.feedback &&
                        el.feedback !== "-" && (
                          <p className="card-text font-weight-semi-bold">
                            📝 {t("feedback")}:
                            <span className="_ml-1">{el.feedback}</span>
                          </p>
                        )}
                      <NumberOfCleaners t={t} {...el} />
                    </div>
                  </div>
                  {(el.is_new_client || el.note) && (
                    <div className="mobile-none">
                      {el.is_new_client && <NewClientMessage t={t} />}
                      {el.note && (
                        <div className={`${el.is_new_client ? "_mt-3" : ""}`}>
                          <Note t={t} note={el.note} />
                        </div>
                      )}
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
