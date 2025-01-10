import { request } from "../../utils";
import { useEffect, useState } from "react";

import DocumentItem from "./DocumentItem";
import UploadItem from "./UploadItem";

export const PDF_TYPE = "application/pdf";

const DEFAULT_DOCUMENTS = [
  { pathname: "Umowa dla partnerów.pdf", url: "/umowa.pdf" },
  { pathname: "Załącznik 1 (WZÓR).pdf", url: "/zalacznik1.pdf" },
  { pathname: "Załącznik 2 RODO (WZÓR).pdf", url: "/zalacznik2.pdf" },
];

function DocumentsEmployee({ t }) {
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);
  const [umowa, setUmowa] = useState(null);
  const [isUmowaLoading, setIsUmowaLoading] = useState(false);
  const [isUmowaError, setIsUmowaError] = useState(false);
  const [zalacznik1, setZalacznik1] = useState(null);
  const [isZal1Loading, setIsZal1Loading] = useState(false);
  const [isZal1Error, setIsZal1Error] = useState(false);
  const [zalacznik2, setZalacznik2] = useState(null);
  const [isZal2Loading, setIsZal2Loading] = useState(false);
  const [isZal2Error, setIsZal2Error] = useState(false);

  const getMethodsById = (id) => {
    if (id === "contract") {
      return {
        setError: setIsUmowaError,
        setLoading: setIsUmowaLoading,
        setDocument: setUmowa,
      };
    } else if (id === "attachmentOne") {
      return {
        setError: setIsZal1Error,
        setLoading: setIsZal1Loading,
        setDocument: setZalacznik1,
      };
    } else if (id === "attachmentTwo") {
      return {
        setError: setIsZal2Error,
        setLoading: setIsZal2Loading,
        setDocument: setZalacznik2,
      };
    }
  };

  const onChange = async ({ target: { files } }, id) => {
    const { setError, setLoading, setDocument } = getMethodsById(id);

    const file = files[0];

    if (!file) {
      return;
    }

    if (file.type !== PDF_TYPE) {
      setError(true);

      return;
    }

    try {
      const formData = new FormData();
      formData.append("documentName", id);
      formData.append("document", file);

      setLoading(true);

      const uploadedDocument = await request({
        url: "documents",
        method: "POST",
        body: formData,
      });

      setDocument(uploadedDocument);
    } finally {
      setLoading(false);
    }
  };

  const getUserDocuments = async () => {
    try {
      setIsDocumentsLoading(true);

      const documentsResponse = await request({ url: "documents" });

      const contract = documentsResponse.find(
        ({ name }) => name === "contract"
      );
      const attachmentOne = documentsResponse.find(
        ({ name }) => name === "attachmentOne"
      );
      const attachmentTwo = documentsResponse.find(
        ({ name }) => name === "attachmentTwo"
      );

      if (contract) {
        setUmowa({ url: contract.link, pathname: contract.file_name });
      }

      if (attachmentOne) {
        setZalacznik1({
          url: attachmentOne.link,
          pathname: attachmentOne.file_name,
        });
      }

      if (attachmentTwo) {
        setZalacznik2({
          url: attachmentTwo.link,
          pathname: attachmentTwo.file_name,
        });
      }
    } finally {
      setIsDocumentsLoading(false);
    }
  };

  useEffect(() => {
    getUserDocuments();
  }, []);

  return (
    <div className="mt-4">
      <span className="font-weight-semi-bold documents-title">
        {t("admin_documents_download_below")}
      </span>
      <div className="_grid document _gap-8 mt-2">
        {DEFAULT_DOCUMENTS.map((item) => (
          <DocumentItem item={item} />
        ))}
      </div>
      <div className="mt-4">
        <span className="font-weight-semi-bold documents-title">
          {t("admin_documents_upload_below")}
        </span>
        <div className="_grid document _gap-8 mt-2">
          {umowa ? (
            <DocumentItem
              item={umowa}
              isUploaded
              methods={getMethodsById("contract")}
              id="contract"
              isLoading={isUmowaLoading}
            />
          ) : (
            <UploadItem
              title={t("admin_documents_contract")}
              id="contract"
              onChange={onChange}
              isLoading={isUmowaLoading || isDocumentsLoading}
              isError={isUmowaError}
            />
          )}
          {zalacznik1 ? (
            <DocumentItem
              item={zalacznik1}
              isUploaded
              methods={getMethodsById("attachmentOne")}
              id="attachmentOne"
              isLoading={isZal1Loading}
            />
          ) : (
            <UploadItem
              title={`${t("admin_documents_attachment")} 1`}
              id="attachmentOne"
              onChange={onChange}
              isLoading={isZal1Loading || isDocumentsLoading}
              isError={isZal1Error}
            />
          )}
          {zalacznik2 ? (
            <DocumentItem
              item={zalacznik2}
              isUploaded
              methods={getMethodsById("attachmentTwo")}
              id="attachmentTwo"
              isLoading={isZal2Loading}
            />
          ) : (
            <UploadItem
              title={`${t("admin_documents_attachment")} 2`}
              id="attachmentTwo"
              onChange={onChange}
              isLoading={isZal2Loading || isDocumentsLoading}
              isError={isZal2Error}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentsEmployee;
