import React, { useContext, useEffect } from "react";
import "./Modal.css";
import { LocaleContext } from "../../contexts";

function Modal({
  children,
  onClose,
  isActionButtonDisabled,
  actionButtonText,
  onActionButtonClick,
  errorMessage,
  isLoading,
  isActionButtonDanger,
}) {
  const { t } = useContext(LocaleContext);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <>
      <div className="custom-modal bg-body border d-flex flex-column">
        <div className="p-3 custom-modal-body">{children}</div>
        <div className="border-top p-3 _mt-auto d-flex align-items-center">
          {errorMessage && <span className="text-danger">{errorMessage}</span>}
          <div className="d-flex justify-content-end _ml-auto">
            <button className="btn btn-secondary _mr-3" onClick={onClose}>
              {t("admin_cancel")}
            </button>
            <button
              className={`d-flex align-items-center btn ${
                isActionButtonDanger ? "btn-danger" : "btn-primary"
              } ${isLoading ? "loading" : ""}`}
              disabled={isActionButtonDisabled}
              onClick={onActionButtonClick}
            >
              {actionButtonText || t("admin_add")}
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
}

export default Modal;
