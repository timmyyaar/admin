import Select from "../../components/common/Select/Select";
import { SUB_SERVICES } from "./constants";
import { useState } from "react";
import SubService from "./SubService";

function SubServices({ prices, getPrices, t }) {
  const [selectedSubService, setSelectedSubService] = useState(null);

  const subService = {
    key: selectedSubService?.value,
    price: prices[selectedSubService?.value],
    title: selectedSubService?.label,
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <span className="white-space-nowrap _mr-2">
          {t("select_sub_service")}:
        </span>
        <Select
          placeholder={`${t("select_sub_service")}...`}
          options={SUB_SERVICES.map(({ value, label }) => ({
            value,
            label: t(`${label}_summery`),
          }))}
          value={selectedSubService}
          onChange={(option) => {
            setSelectedSubService(option);
          }}
        />
      </div>
      {selectedSubService?.value && (
        <SubService subService={subService} getPrices={getPrices} t={t} />
      )}
    </div>
  );
}

export default SubServices;
