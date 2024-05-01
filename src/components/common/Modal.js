import React, { useContext, useEffect, useRef } from "react";
import "./Modal.scss";
import { LocaleContext } from "../../contexts";
import { createPortal } from "react-dom";
import useClickOutside from "../../hooks/useClickOutside";

function Modal({
  children,
  onClose,
  isActionButtonDisabled,
  actionButtonText,
  onActionButtonClick,
  errorMessage,
  isLoading,
  isActionButtonDanger,
  noOverflow = false,
  customFooter,
  showHeader = false,
  outsideClickClose = false,
  noFooter = false,
  minHeight = true,
}) {
  const { t } = useContext(LocaleContext);
  const ref = useRef();
  useClickOutside(ref, () => {
    if (outsideClickClose) {
      onClose();
    }
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return createPortal(
    <>
      <div
        className={`custom-modal bg-body border d-flex flex-column ${
          minHeight ? "min-height-50-vh" : ""
        }`}
        ref={ref}
      >
        {showHeader && (
          <div className="_p-2 border-bottom mobile-only">
            <button
              className="_ml-auto btn close-button btn-outline-secondary rounded-circle"
              onClick={onClose}
            >
              &#10005;
            </button>
          </div>
        )}
        <div
          className={`p-3 custom-scroll custom-modal-body ${
            !noOverflow ? "overflow-auto" : ""
          }`}
        >
          {children}
        </div>
        {!noFooter && (
          <div className="border-top p-3 _mt-auto d-flex align-items-center">
            {customFooter ? (
              customFooter
            ) : (
              <>
                {errorMessage && (
                  <span className="text-danger">{errorMessage}</span>
                )}
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
              </>
            )}
          </div>
        )}
      </div>
      <div className="modal-backdrop show" />
    </>,
    document.body
  );
}

export default Modal;
