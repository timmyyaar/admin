import { useContext } from "react";
import { AppContext, LocaleContext } from "../../contexts";
import DocumentsAdmin from "./DocumentsAdmin";
import DocumentsEmployee from "./DocumentsEmployee";

import "./index.css";
import { ROLES } from "../../constants";

function Documents() {
  const {
    userData: { role },
  } = useContext(AppContext);
  const isAdmin = [ROLES.ADMIN, ROLES.SUPERVISOR].includes(role);

  const { t } = useContext(LocaleContext);

  return (
    <div className="documents-wrapper">
      {isAdmin ? <DocumentsAdmin t={t} /> : <DocumentsEmployee t={t} />}
    </div>
  );
}

export default Documents;
