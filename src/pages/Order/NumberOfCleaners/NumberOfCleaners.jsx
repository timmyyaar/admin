import React from "react";

function NumberOfCleaners({ t, cleaners_count, cleaner_id }) {
  return (
    cleaners_count > 1 && (
      <div className="font-weight-semi-bold d-flex text-info _mt-4">
        <span className="_mr-1">{t("admin_order_cleaners_count")}:</span>
        {cleaner_id.length || 0}/{cleaners_count}
      </div>
    )
  );
}

export default NumberOfCleaners;
