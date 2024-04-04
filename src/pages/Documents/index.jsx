import { useContext } from "react";
import { LocaleContext } from "../../contexts";
import { isAdmin } from "../../utils";
import DocumentsAdmin from "./DocumentsAdmin";
import DocumentsEmployee from "./DocumentsEmployee";

import "./index.css";

function Documents() {
  const { t } = useContext(LocaleContext);

  return (
    <div className="documents-wrapper">
      {isAdmin() ? <DocumentsAdmin t={t} /> : <DocumentsEmployee t={t} />}
    </div>
  );
}

export default Documents;
