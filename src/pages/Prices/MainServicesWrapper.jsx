import Select from "../../components/common/Select/Select";
import { MAIN_SERVICES_OPTIONS } from "./constants";
import MainServices from "./MainServices";
import { useState } from "react";

function MainServicesWrapper({ prices, getPrices, t }) {
  const [mainService, setMainService] = useState(null);

  return (
    <>
      <div className="d-flex align-items-center">
        <span className="white-space-nowrap _mr-2">
          {t("select_main_service")}:
        </span>
        <Select
          placeholder={`${t("select_main_service")}...`}
          options={MAIN_SERVICES_OPTIONS.map(({ value, label }) => ({
            value,
            label: t(label),
          }))}
          value={mainService}
          onChange={(option) => setMainService(option)}
        />
      </div>
      {mainService?.value && (
        <MainServices
          mainService={mainService}
          setMainService={setMainService}
          prices={prices}
          getPrices={getPrices}
          t={t}
        />
      )}
    </>
  );
}

export default MainServicesWrapper;
