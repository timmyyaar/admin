import React from "react";

function Note({ t, note }) {
  return (
    <div className="height-max-content order-additional-block">
      <div className="border border-rounded p-3 d-flex flex-column align-items-start _text-left">
        <label className="text-warning _mb-3">{t("admin_order_note")}</label>
        {note}
      </div>
    </div>
  );
}

export default Note;
