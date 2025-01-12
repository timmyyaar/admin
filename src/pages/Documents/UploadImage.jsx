import React, { useContext, useState } from "react";
import { LocaleContext } from "../../contexts";
import { ReactComponent as UploadImageIcon } from "./icons/upload-image-icon.svg";
import FullScreenImage from "./FullScreenImage";

function UploadImage({
  image,
  id,
  onChange,
  isError,
  isInitLoading,
  isLoading,
  setIsError,
  isAdmin,
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { t } = useContext(LocaleContext);

  const downloadImage = async (image) => {
    const { url, pathname } = image;

    const imageResponse = await fetch(url, {
      method: "GET",
      headers: {},
    });
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const objectUrl = window.URL.createObjectURL(new Blob([imageArrayBuffer]));
    const link = document.createElement("a");

    link.href = objectUrl;
    link.setAttribute("download", pathname);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      <div className="_relative">
        <label
          htmlFor={id}
          className={`lg:_w-64 _w-full _group ${isLoading ? "disabled" : ""} ${isAdmin ? "" : "_cursor-pointer"}`}
        >
          {image ? (
            <div>
              <img
                src={image.url}
                alt=""
                className={`lg:_w-64 _w-full _h-52 _rounded-lg _transition-all _object-cover _border _border-solid
                 _border-white ${isAdmin ? "" : "group-hover:_opacity-70"}`}
              />
              {!isLoading && !isAdmin && (
                <div
                  className={`_hidden group-hover:_flex _flex-col _justify-center _items-center _gap-2
                 _absolute _top-0 _left-0 _w-full _h-full`}
                >
                  {t("admin_documents_click_here_to_update")}
                  <UploadImageIcon />
                </div>
              )}
            </div>
          ) : (
            <div
              className={`_flex _items-center _justify-center lg:_w-64 _w-full _h-52 _border _border-dashed
                    _border-white _rounded-lg group-hover:_opacity-70 _transition-all`}
            >
              {!isLoading && (
                <div className="_flex _flex-col _justify-center _items-center _gap-2">
                  {isAdmin ? (
                    t("admin_documents_no_image_uploaded")
                  ) : (
                    <>
                      {t("admin_documents_upload")}
                      <UploadImageIcon />
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </label>
        {isLoading && (
          <div className="_flex _flex-col _justify-center _items-center _gap-2 _absolute _top-0 _left-0 _w-full _h-full">
            {isInitLoading
              ? t("admin_documents_loading_your_image")
              : t("admin_documents_uploading_your_image")}
            <div className="loader _w-12 _h-12" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onChange(event, id, true)}
          id={id}
          className="d-none"
          onClick={() => setIsError(false)}
          disabled={isAdmin}
        />
      </div>
      {isError && (
        <div className="_text-red-400">
          {t("admin_documents_wrong_file_format")}
        </div>
      )}
      {image && (
        <div className="_flex _gap-2">
          <button
            className="btn btn-sm btn-outline-secondary _w-full"
            onClick={() => setIsFullScreen(true)}
          >
            {t("admin_documents_view_fullscreen")}
          </button>
          <button
            className="btn btn-sm btn-outline-secondary icon-button"
            onClick={() => downloadImage(image)}
            title={t("admin_documents_download")}
          >
            <span>💾</span>
          </button>
        </div>
      )}
      {isFullScreen && (
        <FullScreenImage
          image={image.url}
          onClose={() => setIsFullScreen(false)}
        />
      )}
    </>
  );
}

export default UploadImage;
