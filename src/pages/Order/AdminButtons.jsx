import EditOrderModal from "./EditOrderModal/EditOrderModal";
import React, { useState } from "react";
import { request } from "../../utils";
import DuplicateModal from "./DuplicateModal";

function AdminButtons({ t, setOrders, order, onCheckListOpen }) {
  const [isEditModalOpened, setIsEditModalOpened] = useState(null);
  const [deletingOrderIds, setDeletingOrderIds] = useState([]);
  const [isDuplicateModalOpened, setIsDuplicateModalOpened] = useState(false);

  const onDeleteOrder = async (id, email) => {
    const confirmed = window.confirm(
      `${t("admin_order_delete_confirmation")} - ${id} (${email})?`
    );

    if (confirmed) {
      try {
        setDeletingOrderIds((prev) => [...prev, id]);

        const deletedOrderIds = await request({
          url: `order/${id}`,
          method: "DELETE",
        });

        setOrders((prev) =>
          prev.filter((order) => !deletedOrderIds.includes(order.id))
        );
      } finally {
        setDeletingOrderIds((prev) => prev.filter((order) => order.id !== id));
      }
    }
  };

  return (
    <div className="d-flex _gap-2 admin-buttons">
      <div className="d-flex _gap-2">
        {order.check_list && (
          <button
            className="btn btn-outline-secondary"
            title={t("check_list")}
            onClick={() => onCheckListOpen(order.id)}
          >
            🔍
          </button>
        )}
        <button
          className="btn btn-outline-secondary"
          title={t("admin_order_duplicate")}
          onClick={() => setIsDuplicateModalOpened(true)}
        >
          📋
        </button>
        {isDuplicateModalOpened && (
          <DuplicateModal
            t={t}
            onClose={() => setIsDuplicateModalOpened(false)}
            order={order}
            setOrders={setOrders}
          />
        )}
      </div>
      <div className="d-flex _ml-auto _gap-2">
        <button
          className="btn btn-primary"
          onClick={() => setIsEditModalOpened(order.id)}
        >
          {t("admin_edit")}
        </button>
        {isEditModalOpened === order.id && (
          <EditOrderModal
            order={order}
            onClose={() => setIsEditModalOpened(null)}
            setOrders={setOrders}
          />
        )}
        <button
          type="button"
          className={`btn btn-danger d-flex align-items-center justify-content-center ${
            deletingOrderIds.includes(order.id) ? "loading" : ""
          }`}
          onClick={() => onDeleteOrder(order.id, order.email)}
          disabled={deletingOrderIds.includes(order.id)}
        >
          {t("admin_delete")}
        </button>
      </div>
    </div>
  );
}

export default AdminButtons;
