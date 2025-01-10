import React, { useContext, useState } from "react";
import Modal from "../../../components/common/Modal";
import { LocaleContext } from "../../../contexts";
import { capitalizeFirstLetter, request } from "../../../utils";
import MainService from "./MainService";

function EditPricesModal({
  editingMainService,
  prices,
  getPrices,
  onClose,
  selectedCity,
}) {
  const { t } = useContext(LocaleContext);

  const transformedPrices = prices.reduce(
    (result, item) => ({
      ...result,
      [item.key]: item.price,
    }),
    {},
  );

  const TITLES_BY_KEYS = {
    officeSquareMeter: `${t("Area")} (m<sup>2</sup>)`,
    window: t("Window"),
    windowBalconySquareMeter: `${t("Balcony")} (m<sup>2</sup>)`,
    ozonationSmallArea: `${t("small_area")} (<= 50m<sup>2</sup>)`,
    ozonationMediumArea: `${t("medium_area")} (> 50m<sup>2</sup> and <= 120m<sup>2</sup>)`,
    ozonationBigArea: `${t("big_area")} (> 120m<sup>2</sup>)`,
    postConstructionSquareMeter: `${t("Area")} (m<sup>2</sup>)`,
    postConstructionWindow: t("Window"),
  };

  const defaultKey = `default${capitalizeFirstLetter(editingMainService.key)}`;
  const minimalKey = `minimal${capitalizeFirstLetter(editingMainService.key)}`;

  const generalServicesPrices = [
    {
      key: defaultKey,
      price: transformedPrices[defaultKey],
      title: t("default_price"),
    },
    {
      key: minimalKey,
      price: transformedPrices[minimalKey],
      title: t("minimal_price"),
    },
  ];

  const currentCityPrices = prices.filter(
    (price) => selectedCity === price.city,
  );

  const mainServicePrices = [
    ...generalServicesPrices,
    ...prices
      .filter((price) => price.key.startsWith(editingMainService.key))
      .filter((price) =>
        currentCityPrices.some(
          (currentCityPrice) => currentCityPrice.key === price.key,
        )
          ? selectedCity === price.city
          : true,
      )
      .map((price) => ({
        ...price,
        title:
          TITLES_BY_KEYS[price.key] ||
          price.key.replace(editingMainService.key, ""),
      }))
      .sort((a, b) => {
        if (a.key < b.key) {
          return -1;
        }
        if (a.key > b.key) {
          return 1;
        }

        return 0;
      }),
  ];

  const [rows, setRows] = useState(mainServicePrices);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const isUpdateDisabled =
    rows.every(
      ({ price }, index) => mainServicePrices[index]?.price === price,
    ) ||
    rows.some(({ price }) => !price) ||
    rows.some(({ price }) => String(price).endsWith("."));

  const updatePrices = async () => {
    if (isUpdateDisabled) {
      return;
    }

    try {
      setUpdateError("");
      setIsUpdateLoading(true);

      await request({
        url: "prices",
        method: "PUT",
        body: {
          prices: rows.map(({ key, price }) => ({
            key,
            price: +price,
            city: selectedCity,
          })),
        },
      });

      await getPrices();

      onClose();
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isLoading={isUpdateLoading}
      isActionButtonDisabled={isUpdateLoading || isUpdateDisabled}
      onActionButtonClick={updatePrices}
      actionButtonText={capitalizeFirstLetter(t("update"))}
      minHeight={false}
    >
      <h5 className="_text-center">
        Edit <span className="text-info">{editingMainService.title}</span>{" "}
        prices in <span className="text-info">{selectedCity}</span>
      </h5>
      <MainService
        getPrices={getPrices}
        servicePrices={mainServicePrices}
        t={t}
        rows={rows}
        setRows={setRows}
      />
      {updateError && <div className="text-danger _mt-3">{updateError}</div>}
    </Modal>
  );
}

export default EditPricesModal;
