import { request } from "../../utils";
import {useContext, useState} from "react";
import Modal from "../../components/common/Modal";
import {LocaleContext} from "../../contexts";

function DocumentItem({
  id,
  item,
  isUploaded,
  isLoading,
  methods,
  deleteConfirmation,
  userId,
}) {
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  const { t } = useContext(LocaleContext);

  const deleteDocument = async (id, url) => {
    const { setError, setLoading, setDocument } = methods;

    try {
      setLoading(true);

      await request({
        url: "documents",
        method: "DELETE",
        body: {
          name: id,
          url,
          ...(Boolean(userId) && { id: userId }),
        },
      });

      setDocument(null);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {deleteModalOpened && (
        <Modal
          onClose={() => setDeleteModalOpened(false)}
          isActionButtonDisabled={isLoading}
          isLoading={isLoading}
          isActionButtonDanger
          onActionButtonClick={() => deleteDocument(id, item.url)}
          actionButtonText="Delete"
        >
          {t('admin_documents_delete_confirmation')} ({item.pathname})
        </Modal>
      )}
      <div className="d-flex flex-column bg-white text-black pdf-preview py-2 px-3 justify-content-center">
        <div className="d-flex align-items-center">
          <div className="font-weight-semi-bold p-2 pdf-text">
            {item.pathname}
          </div>
          <div className="d-flex _ml-auto _gap-2">
            <a
              className="btn btn-sm btn-outline-secondary icon-button"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>👁️‍</span>
            </a>
            {isUploaded ? (
              <button
                className={`btn btn-sm btn-outline-secondary icon-button ${
                  isLoading ? "loading-dark" : ""
                }`}
                onClick={() => {
                  if (deleteConfirmation) {
                    setDeleteModalOpened(true);
                  } else {
                    deleteDocument(id, item.url);
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? "" : "❌"}
              </button>
            ) : (
              <a
                className="btn btn-sm btn-outline-secondary icon-button"
                href={item.url}
                download={item.pathname}
              >
                <span>💾</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DocumentItem;
