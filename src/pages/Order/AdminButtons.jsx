import EditOrderModal from "./EditOrderModal";
import React, { useState } from "react";
import { request } from "../../utils";

function AdminButtons({ t, setOrders, order }) {
  const [isEditModalOpened, setIsEditModalOpened] = useState(null);
  const [deletingOrderIds, setDeletingOrderIds] = useState([]);

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

  return (
    <div className="d-flex">
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
        className={`btn btn-danger d-flex align-items-center justify-content-center _ml-2 ${
          deletingOrderIds.includes(order.id) ? "loading" : ""
        }`}
        onClick={() => onDeleteOrder(order.id, order.email)}
        disabled={deletingOrderIds.includes(order.id)}
      >
        {t("admin_delete")}
      </button>
    </div>
  );
}

export default AdminButtons;
