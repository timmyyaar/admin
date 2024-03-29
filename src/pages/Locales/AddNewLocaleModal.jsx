import Modal from "../../components/common/Modal";
import React, { useState } from "react";
import { request } from "../../utils";

function AddNewLocaleModal({ onClose, setLocales }) {
  const [key, setKey] = useState("");
  const [english, setEnglish] = useState("");
  const [polish, setPolish] = useState("");
  const [russian, setRussian] = useState("");
  const [ukrainian, setUkrainian] = useState("");
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const isEnabled = key && english && polish && russian && ukrainian;

  const createLocale = async () => {
    if (!isEnabled) {
      return;
    }

    try {
      setIsCreateLoading(true);

      const newLocales = await request({
        url: "locales",
        method: "POST",
        body: { key, english, polish, russian, ukrainian },
      });

      setLocales((prev) => [...newLocales, ...prev]);
      onClose();
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setIsCreateLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isActionButtonDisabled={isCreateLoading || !isEnabled}
      isLoading={isCreateLoading}
      onActionButtonClick={createLocale}
      errorMessage={createError}
    >
      <h5 className="mb-4 text-center">Add new locale</h5>
      <div className="_inline-grid _gap-4 _w-full edit-locales-wrapper align-items-center">
        <label>Key:</label>
        <input
          className="form-control"
          value={key}
          onChange={({ target: { value } }) => setKey(value)}
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

export default AddNewLocaleModal;
