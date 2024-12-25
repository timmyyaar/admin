import React, { useEffect, useState } from "react";
import { request } from "../../utils";
import { Louder } from "../../components/Louder";
import { CITIES_OPTIONS } from "../../constants";
import MainServices from "./main-services/MainServices";
import SubServices from "./sub-services/SubServices";

function Services() {
  const [selectedCity, setSelectedCity] = useState(CITIES_OPTIONS[0].value);
  const [mainServices, setMainServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [isMainServicesLoading, setIsMainServicesLoading] = useState(false);
  const [isSubServicesLoading, setIsSubServicesLoading] = useState(false);
  const [arePricesLoading, setArePricesLoading] = useState(false);
  const [prices, setPrices] = useState([]);

  const getMainServices = async () => {
    try {
      setIsMainServicesLoading(true);

      const response = await request({ url: "main-services" });

      setMainServices(response);
    } finally {
      setIsMainServicesLoading(false);
    }
  };

  const getSubServices = async () => {
    try {
      setIsSubServicesLoading(true);

      const response = await request({ url: "sub-services" });

      setSubServices(response);
    } finally {
      setIsSubServicesLoading(false);
    }
  };

  const getPrices = async () => {
    const pricesResponse = await request({ url: "prices" });

    setPrices(pricesResponse);
  };

  const getPricesGeneral = async () => {
    setArePricesLoading(true);

    await getPrices();

    setArePricesLoading(false);
  };

  useEffect(() => {
    getMainServices();
    getSubServices();
    getPricesGeneral();

    // eslint-disable-next-line
  }, []);

  const currentCityPrices = prices
    .filter(({ city }) => city === selectedCity)
    .reduce((result, { key, price }) => ({ ...result, [key]: price }), {});

  return (
    <>
      <Louder
        visible={
          isMainServicesLoading || isSubServicesLoading || arePricesLoading
        }
      />
      <div className="_mb-4 _mt-4">
        <ul className="nav nav-tabs _mb-4">
          {CITIES_OPTIONS.map(({ value, label }) => (
            <li className="nav-item">
              <button
                className={`nav-link ${value === selectedCity ? "active" : ""}`}
                onClick={() => setSelectedCity(value)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
        <MainServices
          mainServices={mainServices}
          setMainServices={setMainServices}
          selectedCity={selectedCity}
          prices={prices}
          getPrices={getPrices}
        />
        <SubServices
          mainServices={mainServices}
          subServices={subServices}
          setSubServices={setSubServices}
          selectedCity={selectedCity}
          currentCityPrices={currentCityPrices}
          getPrices={getPrices}
        />
      </div>
    </>
  );
}

export default Services;
