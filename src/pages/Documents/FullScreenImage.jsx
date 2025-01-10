import React, { useContext } from "react";
import { LocaleContext } from "../../contexts";

function FullScreenImage({ image, onClose }) {
  const { t } = useContext(LocaleContext);

  return (
    <div
      className="_fixed _top-0 _left-0 _w-screen _h-screen _z-10 _p-10 _flex _items-center _justify-center _select-none"
      onClick={onClose}
    >
      <div className="_h-full _relative _z-max">
        <div className="_text-center _text-xl _absolute _top-2 _inset-x-0 _py-1 _px-2 _mx-auto _w-max _rounded-xl background-shadow">
          {t("admin_documents_exit_fullscreen")}
        </div>
        <img
          src={image}
          alt=""
          className="_w-full _h-full _object-contain _rounded-xl"
        />
      </div>
      <div
        className="modal-backdrop show"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}

export default FullScreenImage;
