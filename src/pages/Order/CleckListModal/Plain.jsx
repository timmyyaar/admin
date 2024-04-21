import Modal from "../../../components/common/Modal";
import { capitalizeFirstLetter } from "../../../utils";
import reactStringReplace from "react-string-replace";
import React from "react";
import { FIGURE_BRACKETS_REGEX } from "../../../constants";

function Plain({ checkList, onClose, t, isFinished }) {
  const checkListEntries = Object.entries(checkList);

  return (
    <Modal
      onClose={onClose}
      customFooter={
        <div className="d-flex justify-content-center w-100">
          <button
            className="btn btn-secondary check-list-modal-button border-semi-round"
            onClick={onClose}
          >
            Okay
          </button>
        </div>
      }
    >
      <div className="_gap-6 d-flex flex-column">
        {checkListEntries.map(([title, fields]) =>
          Object.values(fields).length ? (
            <div className="_gap-3 d-flex flex-column">
              <div className="text-primary font-weight-semi-bold text-center">
                {t(capitalizeFirstLetter(title))}
              </div>
              {Object.entries(fields).map(([key, value]) => (
                <div
                  className={`d-flex break-word ${
                    isFinished && value
                      ? "check-list-item-checked"
                      : "check-list-item"
                  }`}
                >
                  <div>
                    {reactStringReplace(
                      t(key),
                      FIGURE_BRACKETS_REGEX,
                      (match) => (
                        <b>{match}</b>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null
        )}
      </div>
    </Modal>
  );
}

export default Plain;
