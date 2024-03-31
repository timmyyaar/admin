import Modal from "../../components/common/Modal";
import React, { useState } from "react";
import { request } from "../../utils";

function AddOrEditLocaleModal({ onClose, setLocales, locales }) {
  const [key, setKey] = useState(locales ? locales[0]?.key : "");
  const [english, setEnglish] = useState(
    locales ? locales.find((item) => item.locale === "en")?.value : ""
  );
  const [polish, setPolish] = useState(
    locales ? locales.find((item) => item.locale === "pl")?.value : ""
  );
  const [russian, setRussian] = useState(
    locales ? locales.find((item) => item.locale === "ru")?.value : ""
  );
  const [ukrainian, setUkrainian] = useState(
    locales ? locales.find((item) => item.locale === "uk")?.value : ""
  );
  const [isCreateOrEditLoading, setIsCreateOrEditLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const isEnabled = key && english && polish && russian && ukrainian;

  const createOrEditLocale = async () => {
    if (!isEnabled) {
      return;
    }

    try {
      setIsCreateOrEditLoading(true);

      const newLocales = await request({
        url: "locales",
        method: locales ? "PUT" : "POST",
        body: { key, english, polish, russian, ukrainian },
      });

      setLocales((prev) =>
        !locales
          ? [...newLocales, ...prev]
          : prev.map((item) => {
              if (item.key === key) {
                if (item.locale === "en") {
                  return { ...item, value: english };
                }

                if (item.locale === "pl") {
                  return { ...item, value: polish };
                }

                if (item.locale === "ru") {
                  return { ...item, value: russian };
                }

                if (item.locale === "uk") {
                  return { ...item, value: ukrainian };
                }
              }

              return item;
            })
      );
      onClose();
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setIsCreateOrEditLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isActionButtonDisabled={isCreateOrEditLoading || !isEnabled}
      isLoading={isCreateOrEditLoading}
      onActionButtonClick={createOrEditLocale}
      errorMessage={createError}
    >
      <h5 className="mb-4 text-center">
        {locales ? "Edit locale" : "Add new locale"}
      </h5>
      <div className="_inline-grid _gap-4 _w-full edit-locales-wrapper align-items-center">
        <label>Key:</label>
        <input
          className="form-control"
          value={key}
          onChange={({ target: { value } }) => setKey(value)}
          disabled={locales}
        />
        <label>English:</label>
        <textarea
          className="form-control"
          value={english}
          onChange={({ target: { value } }) => setEnglish(value)}
        />
        <label>Polish:</label>
        <textarea
          className="form-control"
          value={polish}
          onChange={({ target: { value } }) => setPolish(value)}
        />
        <label>Russian:</label>
        <textarea
          className="form-control"
          value={russian}
          onChange={({ target: { value } }) => setRussian(value)}
        />
        <label>Ukrainian:</label>
        <textarea
          className="form-control"
          value={ukrainian}
          onChange={({ target: { value } }) => setUkrainian(value)}
        />
      </div>
    </Modal>
  );
}

export default AddOrEditLocaleModal;
