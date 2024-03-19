import React from "react";
import "./Modal.css";

function Modal({
  children,
  onClose,
  isActionButtonDisabled,
  actionButtonText,
  onActionButtonClick,
  errorMessage,
}) {
  return (
    <>
      <div className="custom-modal bg-body border d-flex flex-column">
        <div className="p-3">{children}</div>
        <div className="border-top p-3 _mt-auto d-flex align-items-center">
          {errorMessage && <span className="text-danger">{errorMessage}</span>}
          <div className="d-flex justify-content-end _ml-auto">
            <button className="btn btn-secondary _mr-3" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={isActionButtonDisabled}
              onClick={onActionButtonClick}
            >
              {actionButtonText || "Add"}
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}

export default Modal;
