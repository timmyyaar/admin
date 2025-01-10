import React, { useEffect, useState } from "react";
import { request } from "../../utils";
import { ROLES } from "../../constants";
import Select from "../../components/common/Select/Select";
import DocumentItem from "./DocumentItem";
import UploadImage from "./UploadImage";

function DocumentsAdmin({ t }) {
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [contractError, setContractError] = useState(false);
  const [contractLoading, setContractLoading] = useState(false);
  const [attachmentOne, setAttachmentOne] = useState(null);
  const [attachmentOneError, setAttachmentOneError] = useState(false);
  const [attachmentOneLoading, setAttachmentOneLoading] = useState(false);
  const [attachmentTwo, setAttachmentTwo] = useState(null);
  const [attachmentTwoError, setAttachmentTwoError] = useState(false);
  const [attachmentTwoLoading, setAttachmentTwoLoading] = useState(false);
  const [statement, setStatement] = useState(null);
  const [isStatementLoading, setIsStatementLoading] = useState(false);
  const [statementError, setStatementError] = useState(false);

  const [idCardFirstSide, setIdCardFirstSide] = useState(null);
  const [isIdCardFirstSideLoading, setIsIdCardFirstSideLoading] =
    useState(false);
  const [isIdCardFirstSideError, setIsIdCardFirstSideError] = useState(false);
  const [idCardSecondSide, setIdCardSecondSide] = useState(null);
  const [isIdCardSecondSideLoading, setIsIdCardSecondSideLoading] =
    useState(false);
  const [isIdCardSecondSideError, setIsIdCardSecondSideError] = useState(false);

  const getMethodsById = (id) => {
    if (id === "contract") {
      return {
        setError: setContractError,
        setLoading: setContractLoading,
        setDocument: setContract,
      };
    } else if (id === "attachmentOne") {
      return {
        setError: setAttachmentOneError,
        setLoading: setAttachmentOneLoading,
        setDocument: setAttachmentOne,
      };
    } else if (id === "attachmentTwo") {
      return {
        setError: setAttachmentTwoError,
        setLoading: setAttachmentTwoLoading,
        setDocument: setAttachmentTwo,
      };
    } else if (id === "statement") {
      return {
        setError: setStatementError,
        setLoading: setIsStatementLoading,
        setDocument: setStatement,
      };
    } else if (id === "idCardFirstSide") {
      return {
        setError: setIsIdCardFirstSideError,
        setLoading: setIsIdCardFirstSideLoading,
        setDocument: setIdCardFirstSide,
      };
    } else if (id === "idCardSecondSide") {
      return {
        setError: setIsIdCardSecondSideError,
        setLoading: setIsIdCardSecondSideLoading,
        setDocument: setIdCardSecondSide,
      };
    }
  };

  const getUsers = async () => {
    try {
      setIsUsersLoading(true);

      const usersResponse = await request({ url: "users" });

      setUsers(
        usersResponse
          .filter(({ role }) =>
            [ROLES.CLEANER_DRY, ROLES.CLEANER].includes(role),
          )
          .map(({ id, email }) => ({ value: id, label: email })),
      );
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUserDocuments = async (id) => {
    try {
      setIsDocumentsLoading(true);

      const documentsResponse = await request({
        url: `documents/${id}`,
      });

      const contract = documentsResponse.find(
        ({ name }) => name === "contract",
      );
      const attachmentOne = documentsResponse.find(
        ({ name }) => name === "attachmentOne",
      );
      const attachmentTwo = documentsResponse.find(
        ({ name }) => name === "attachmentTwo",
      );
      const statement = documentsResponse.find(
        ({ name }) => name === "statement",
      );
      const passportFirstSide = documentsResponse.find(
        ({ name }) => name === "idCardFirstSide",
      );
      const passportSecondSide = documentsResponse.find(
        ({ name }) => name === "idCardSecondSide",
      );

      if (contract) {
        setContract({ url: contract.link, pathname: contract.file_name });
      } else {
        setContract(null);
      }

      if (attachmentOne) {
        setAttachmentOne({
          url: attachmentOne.link,
          pathname: attachmentOne.file_name,
        });
      } else {
        setAttachmentOne(null);
      }

      if (attachmentTwo) {
        setAttachmentTwo({
          url: attachmentTwo.link,
          pathname: attachmentTwo.file_name,
        });
      } else {
        setAttachmentTwo(null);
      }

      if (statement) {
        setStatement({ url: statement.link, pathname: statement.file_name });
      } else {
        setStatement(null);
      }

      if (passportFirstSide) {
        setIdCardFirstSide({
          url: passportFirstSide.link,
          pathname: passportFirstSide.file_name,
        });
      } else {
        setIdCardFirstSide(null);
      }

      if (passportSecondSide) {
        setIdCardSecondSide({
          url: passportSecondSide.link,
          pathname: passportSecondSide.file_name,
        });
      } else {
        setIdCardSecondSide(null);
      }
    } finally {
      setIsDocumentsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUser?.value) {
      getUserDocuments(selectedUser.value);
    } else {
    }
  }, [selectedUser?.value]);

  return (
    <div className="pt-4">
      {contractError && <div className="mb-3 text-danger">{contractError}</div>}
      {attachmentOneError && (
        <div className="mb-3 text-danger">{attachmentOneError}</div>
      )}
      {attachmentTwoError && (
        <div className="mb-3 text-danger">{attachmentTwoError}</div>
      )}
      {statementError && (
        <div className="mb-3 text-danger">{statementError}</div>
      )}
      <div className="d-flex align-items-center mb-4">
        <label className="_mr-3">{t("user")}:</label>
        <Select
          placeholder={`${t("select_placeholder")}...`}
          options={users}
          value={selectedUser}
          onChange={(option) => setSelectedUser(option)}
          isLoading={isUsersLoading || isDocumentsLoading}
          isDisabled={isUsersLoading || isDocumentsLoading}
        />
      </div>
      <div className="_grid document _gap-8 mt-2">
        {Boolean(contract) ? (
          <DocumentItem
            item={contract}
            isUploaded
            methods={getMethodsById("contract")}
            id="contract"
            isLoading={contractLoading || isUsersLoading || isDocumentsLoading}
            deleteConfirmation
            userId={selectedUser?.value}
          />
        ) : (
          <div className="pdf-preview d-flex align-items-center justify-content-center font-weight-semi-bold text-danger py-2 px-3 bg-white">
            {t("admin_documents_no_document")} {t("admin_documents_contract")}
          </div>
        )}
        {Boolean(attachmentOne) ? (
          <DocumentItem
            item={attachmentOne}
            isUploaded
            methods={getMethodsById("attachmentOne")}
            id="attachmentOne"
            isLoading={
              attachmentOneLoading || isUsersLoading || isDocumentsLoading
            }
            deleteConfirmation
            userId={selectedUser?.value}
          />
        ) : (
          <div className="pdf-preview d-flex align-items-center justify-content-center font-weight-semi-bold text-danger py-2 px-3 bg-white">
            {t("admin_documents_no_document")} {t("admin_documents_attachment")}{" "}
            1
          </div>
        )}
        {Boolean(attachmentTwo) ? (
          <DocumentItem
            item={attachmentTwo}
            isUploaded
            methods={getMethodsById("attachmentTwo")}
            id="attachmentTwo"
            isLoading={
              attachmentTwoLoading || isUsersLoading || isDocumentsLoading
            }
            deleteConfirmation
            userId={selectedUser?.value}
          />
        ) : (
          <div className="pdf-preview d-flex align-items-center justify-content-center font-weight-semi-bold text-danger py-2 px-3 bg-white">
            {t("admin_documents_no_document")} {t("admin_documents_attachment")}{" "}
            2
          </div>
        )}
        {Boolean(statement) ? (
          <DocumentItem
            item={statement}
            isUploaded
            methods={getMethodsById("statement")}
            id="statement"
            isLoading={
              isStatementLoading || isUsersLoading || isDocumentsLoading
            }
            deleteConfirmation
            userId={selectedUser?.value}
          />
        ) : (
          <div className="pdf-preview d-flex align-items-center justify-content-center font-weight-semi-bold text-danger py-2 px-3 bg-white">
            {t("admin_documents_no_document")} {t("admin_documents_statement")}
          </div>
        )}
      </div>
      <div className="mt-4">
        <span className="font-weight-semi-bold documents-title">
          {t("admin_documents_id_card_description")}:
        </span>
        <div className="_flex lg:_flex-row _flex-col _gap-8 _my-2">
          <div className="_flex _flex-col _gap-2">
            {t('admin_documents_first_image')}
            <UploadImage
              id="idCardFirstSide"
              image={idCardFirstSide}
              isInitLoading={isDocumentsLoading}
              isLoading={isIdCardFirstSideLoading || isDocumentsLoading}
              isError={isIdCardFirstSideError}
              setIsError={setIsIdCardFirstSideError}
              isAdmin
            />
          </div>
          <div className="_flex _flex-col _gap-2">
            {t('admin_documents_second_image')}
            <UploadImage
              id="idCardSecondSide"
              image={idCardSecondSide}
              isInitLoading={isDocumentsLoading}
              isLoading={isIdCardSecondSideLoading || isDocumentsLoading}
              isError={isIdCardSecondSideError}
              setIsError={setIsIdCardSecondSideError}
              isAdmin
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentsAdmin;
