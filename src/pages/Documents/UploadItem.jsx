import { useContext } from "react";
import { LocaleContext } from "../../contexts";

function UploadItem({ title, id, onChange, isError, isLoading }) {
  const { t } = useContext(LocaleContext);

  return (
    <div className="w-100">
      <label htmlFor={id} className={`w-100 ${isLoading ? "disabled" : ""}`}>
        <div
          className={`pdf-preview plf-upload d-flex flex-column bg-white py-2 px-3 justify-content-center ${
            isError ? "text-danger" : "text-black"
          }`}
        >
          <span
            className={`pdf-text font-weight-semi-bold ${
              isLoading ? "loading-dark" : ""
            }`}
          >
            {title} ({t("admin_documents_click_to_upload")})
          </span>
        </div>
      </label>
      <input
        type="file"
        onChange={(event) => onChange(event, id)}
        id={id}
        className="d-none"
      />
    </div>
  );
}

export default UploadItem;
