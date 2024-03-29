import React from "react";

function NewClientMessage({ t }) {
  return (
    <div className="height-max-content order-additional-block">
      <div className="border border-rounded p-3 d-flex flex-column align-items-start _text-left">
        <label className="text-success _mb-3">
          {t("admin_order_new_client")}
        </label>
        {t("admin_order_new_client_description")}
      </div>
    </div>
  );
}

export default NewClientMessage;
