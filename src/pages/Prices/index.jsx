import { useContext, useEffect, useState } from "react";
import { request } from "../../utils";
import { Louder } from "../../components/Louder";
import SubServices from "./SubServices";
import { LocaleContext } from "../../contexts";
import MainServicesWrapper from "./MainServicesWrapper";

const RADIO_VALUES = {
  MAIN_SERVICE: "Main service",
  SUB_SERVICE: "Sub service",
};

function Prices() {
  const { t } = useContext(LocaleContext);
  const [prices, setPrices] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [radioValue, setRadioValue] = useState(RADIO_VALUES.MAIN_SERVICE);

  const getPrices = async () => {
    const pricesResponse = await request({ url: "prices" });

    setPrices(
      pricesResponse.reduce(
        (result, item) => ({
          ...result,
          [item.key]: item.price,
        }),
        {}
      )
    );
  };

  const getPricesGeneral = async () => {
    setIsLoading(true);

    await getPrices();

    setIsLoading(false);
  };

  useEffect(() => {
    getPricesGeneral();

    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <Louder visible={isLoading} />
      <div className="_mb-4 _mt-4">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input _cursor-pointer"
            type="radio"
            name={RADIO_VALUES.MAIN_SERVICE}
            id={RADIO_VALUES.MAIN_SERVICE}
            checked={radioValue === RADIO_VALUES.MAIN_SERVICE}
            onChange={() => setRadioValue(RADIO_VALUES.MAIN_SERVICE)}
          />
          <label
            className="form-check-label _cursor-pointer"
            htmlFor={RADIO_VALUES.MAIN_SERVICE}
          >
            {t("main_service")}
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input _cursor-pointer"
            type="radio"
            name={RADIO_VALUES.SUB_SERVICE}
            id={RADIO_VALUES.SUB_SERVICE}
            checked={radioValue === RADIO_VALUES.SUB_SERVICE}
            onChange={() => setRadioValue(RADIO_VALUES.SUB_SERVICE)}
          />
          <label
            className="form-check-label _cursor-pointer"
            htmlFor={RADIO_VALUES.SUB_SERVICE}
          >
            {t("sub_service")}
          </label>
        </div>
      </div>
      {radioValue === RADIO_VALUES.MAIN_SERVICE && (
        <MainServicesWrapper prices={prices} getPrices={getPrices} t={t} />
      )}
      {radioValue === RADIO_VALUES.SUB_SERVICE && (
        <SubServices prices={prices} getPrices={getPrices} t={t} />
      )}
    </div>
  );
}

export default Prices;
