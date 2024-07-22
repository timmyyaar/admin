import { ORDER_STATUS, ORDER_TYPE, ROLES } from "../../constants";
import React, { useContext, useState } from "react";
import { getDateString, request } from "../../utils";
import AssignOnMe from "./AssignOnMe";
import { getTimeRemaining } from "../../utils";
import { AppContext, LocaleContext } from "../../contexts";
import Modal from "../../components/common/Modal";

const CleanerControls = ({
  order,
  isStatusLoading,
  onChangeOrderStatus,
  setOrders,
  onCheckListOpen,
  onCheckListEditOpen,
}) => {
  const {
    userData: { role, id: myUserId },
  } = useContext(AppContext);
  const isAdmin = [ROLES.ADMIN, ROLES.SUPERVISOR].includes(role);

  const { t } = useContext(LocaleContext);

  const notAllCleanersJoined = order.cleaner_id.length < order.cleaners_count;
  const [isRefuseLoading, setIsRefuseLoading] = useState(false);
  const [isRefuseError, setIsRefuseError] = useState(false);
  const [showProgressConfirmation, setShowProgressConfirmation] =
    useState(false);

  const refuseOrder = async () => {
    try {
      setIsRefuseLoading(true);

      const updatedOrder = await request({
        url: `order/refuse/${order.id}`,
        method: "PATCH",
      });

      setOrders((prev) =>
        prev.map((prevOrder) =>
          prevOrder.id === order.id ? updatedOrder : prevOrder
        )
      );
    } catch (error) {
      setIsRefuseError(true);
    } finally {
      setIsRefuseLoading(false);
    }
  };

  const isDryCleaningOrOzonation = [
    ORDER_TYPE.DRY,
    ORDER_TYPE.OZONATION,
  ].includes(order.title);

  const canRefuseOrder = getTimeRemaining(order.date).days > 4;

  const onStartProgress = () => {
    const needToShowProgressConfirmation =
      getDateString(new Date()) !== order.date.split(" ")[0];

    if (needToShowProgressConfirmation) {
      setShowProgressConfirmation(true);
    } else if (!notAllCleanersJoined) {
      onChangeOrderStatus(order.id, ORDER_STATUS.IN_PROGRESS.value);
    }
  };

  return (
    <>
      {showProgressConfirmation && (
        <Modal
          onClose={() => setShowProgressConfirmation(false)}
          actionButtonText={t("start_progress")}
          onActionButtonClick={async () => {
            await onChangeOrderStatus(order.id, ORDER_STATUS.IN_PROGRESS.value);

            setShowProgressConfirmation(false);
          }}
          isLoading={isStatusLoading.includes(order.id)}
          isActionButtonDisabled={isStatusLoading.includes(order.id)}
          minHeight={false}
        >
          <h5 className="text-center">{t("this_order_date_is_not_today")}</h5>
        </Modal>
      )}
      <div className="_w-full">
        {!isAdmin &&
          order.cleaner_id.length < order.cleaners_count &&
          !order.cleaner_id.includes(myUserId) && (
            <AssignOnMe order={order} setOrders={setOrders} />
          )}
        {order.cleaner_id.includes(myUserId) && (
          <>
            <div className="cleaner-controls d-flex align-items-center cleaner-controls">
              {order.status === ORDER_STATUS.DONE.value && (
                <span className="text-success _font-semibold _mr-2">
                  {t("admin_completed_order")}
                </span>
              )}
              {isRefuseError && (
                <div className="text-danger text-center _mr-2 refuse-error">
                  {t("admin_refuse_error")}
                </div>
              )}
              {order.check_list && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  title={t("check_list")}
                  onClick={() => onCheckListOpen(order.id)}
                >
                  🔍
                </button>
              )}
              <div className="d-flex align-items-center">
                {order.status === ORDER_STATUS.APPROVED.value && (
                  <>
                    {canRefuseOrder && (
                      <button
                        className={`btn btn-sm btn-danger _ml-3 ${
                          isRefuseLoading ? "loading" : ""
                        }`}
                        disabled={isRefuseLoading}
                        onClick={refuseOrder}
                      >
                        {t("admin_refuse")}
                      </button>
                    )}
                    <button
                      className={`btn btn-sm btn-warning width-max-content whitespace-nowrap _ml-3 ${
                        isStatusLoading.includes(order.id) ? "loading" : ""
                      }`}
                      disabled={
                        isStatusLoading.includes(order.id) ||
                        notAllCleanersJoined
                      }
                      onClick={onStartProgress}
                    >
                      {t("admin_start_progress")}
                    </button>
                  </>
                )}
                {order.status === ORDER_STATUS.IN_PROGRESS.value && (
                  <button
                    className={`btn btn-sm btn-success _ml-3 ${
                      isStatusLoading.includes(order.id) ? "loading" : ""
                    }`}
                    disabled={isStatusLoading.includes(order.id)}
                    onClick={() => {
                      if (isDryCleaningOrOzonation) {
                        onChangeOrderStatus(order.id, ORDER_STATUS.DONE.value);
                      } else {
                        onCheckListEditOpen(order.id);
                      }
                    }}
                  >
                    {t("admin_finish_order")}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CleanerControls;
