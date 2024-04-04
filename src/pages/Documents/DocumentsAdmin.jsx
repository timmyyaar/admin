import { useEffect, useState } from "react";
import { request } from "../../utils";
import { ROLES } from "../../constants";
import Select from "../../components/common/Select/Select";
import DocumentItem from "./DocumentItem";

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
    }
  };

  const getUsers = async () => {
    try {
      setIsUsersLoading(true);

      const usersResponse = await request({ url: "users" });

      setUsers(
        usersResponse
          .filter(({ role }) =>
            [ROLES.CLEANER_DRY, ROLES.CLEANER].includes(role)
          )
          .map(({ id, email }) => ({ value: id, label: email }))
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
        ({ name }) => name === "contract"
      );
      const attachmentOne = documentsResponse.find(
        ({ name }) => name === "attachmentOne"
      );
      const attachmentTwo = documentsResponse.find(
        ({ name }) => name === "attachmentTwo"
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
      <div className="d-flex align-items-center mb-4">
        <label className="_mr-3">User:</label>
        <Select
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
            No Umowa document!
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
            No Załącznik 1 document!
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
            No Załącznik 2 document!
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentsAdmin;
