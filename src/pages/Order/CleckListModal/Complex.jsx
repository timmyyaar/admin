import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import { capitalizeFirstLetter } from "../../../utils";
import reactStringReplace from "react-string-replace";
import { FIGURE_BRACKETS_REGEX, ORDER_STATUS } from "../../../constants";

function Complex({ order, onClose, t, checkList, onChangeOrderStatus }) {
  const [checkListCopy, setCheckListCopy] = useState({ ...checkList });
  const [isFinishOrderLoading, setIsFinishOrderLoading] = useState(false);

  const checkListEntries = Object.entries(checkListCopy);

  const isCategoryChecked = (title) =>
    Object.values(checkListCopy[title]).every((value) => value);

  const toggleCategory = (title) => {
    setCheckListCopy((prev) => ({
      ...prev,
      [title]: Object.fromEntries(
        Object.entries(prev[title]).map(([key, value]) => [
          key,
          !isCategoryChecked(title),
        ])
      ),
    }));
  };

  const toggleItem = (title, key) => {
    setCheckListCopy((prev) => ({
      ...prev,
      [title]: { ...prev[title], [key]: !prev[title][key] },
    }));
  };

  const onFinishOrder = async () => {
    try {
      setIsFinishOrderLoading(true);

      await onChangeOrderStatus(
        order.id,
        ORDER_STATUS.DONE.value,
        checkListCopy
      );

      onClose();
    } finally {
      setIsFinishOrderLoading(false);
    }
  };

  return (
    <Modal
      showHeader
      outsideClickClose
      onClose={onClose}
      customFooter={
        <div className="complex-check-list-modal-button-wrapper justify-content-center w-100">
          <div className="d-flex text-danger warning-message">
            {t("check_list_warning")}
            <h3 className="m-0 d-flex align-items-center mobile-none-flex">
              &#8594;
            </h3>
          </div>
          <button
            className={`btn btn-primary check-list-modal-button border-semi-round ${
              isFinishOrderLoading ? "loading" : ""
            }`}
            onClick={onFinishOrder}
            disabled={isFinishOrderLoading}
          >
            Done
          </button>
        </div>
      }
    >
      <div className="_gap-6 d-flex flex-column">
        {checkListEntries.map(([title, fields]) =>
          Object.values(fields).length ? (
            <div>
              <div className="text-primary font-weight-semi-bold text-center _mb-3">
                {t(capitalizeFirstLetter(title))}
              </div>
              <div className="_mb-4 form-check width-max-content _ml-auto">
                <input
                  type="checkbox"
                  className="form-check-input _cursor-pointer"
                  name={title}
                  id={title}
                  onChange={() => {
                    toggleCategory(title);
                  }}
                  checked={isCategoryChecked(title)}
                />
                <label
                  className="form-check-label _cursor-pointer"
                  htmlFor={title}
                >
                  {t("mark_all")}
                </label>
              </div>
              <div className="_gap-3 d-flex flex-column">
                {Object.entries(fields).map(([key, value]) => (
                  <div className="form-check break-word">
                    <input
                      type="checkbox"
                      className="form-check-input _cursor-pointer"
                      name={`${title}-${key}`}
                      id={`${title}-${key}`}
                      checked={value}
                      onChange={() => toggleItem(title, key)}
                    />
                    <label
                      className="form-check-label _cursor-pointer"
                      htmlFor={`${title}-${key}`}
                    >
                      {reactStringReplace(
                        t(key),
                        FIGURE_BRACKETS_REGEX,
                        (match) => (
                          <b>{match}</b>
                        )
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </Modal>
  );
}

export default Complex;
