import React, { useState } from "react";
import { request } from "../../../utils";
import EditPricesModal from "./EditPricesModal";

function MainServices({
  mainServices,
  setMainServices,
  selectedCity,
  prices,
  getPrices,
}) {
  const [isMainServiceExpanded, setIsMainServiceExpanded] = useState(false);
  const [mainServiceLoadingIds, setMainServiceLoadingIds] = useState([]);
  const [editingMainService, setEditingMainService] = useState(null);

  const onMainServiceCityToggle = async (id) => {
    try {
      setMainServiceLoadingIds((prev) => [...prev, id]);

      const response = await request({
        url: `main-services/${id}/toggle-city/${selectedCity}`,
        method: "PATCH",
      });

      setMainServices((prev) =>
        prev.map((mainService) =>
          mainService.id === id ? response : mainService,
        ),
      );
    } finally {
      setMainServiceLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="_pb-4 border-bottom">
      <div
        className="_transition-all _flex _gap-1 _cursor-pointer _items-center hover:_text-blue-400 _w-max"
        onClick={() => setIsMainServiceExpanded((prev) => !prev)}
      >
        <small
          className={`_transition-transform ${isMainServiceExpanded ? "rotate-90" : ""}`}
        >
          ▶
        </small>
        <h5 className="_font-bold _m-0">Main services</h5>
      </div>
      {isMainServiceExpanded && (
        <table className="table table-dark table-bordered _w-auto _mt-3">
          <thead>
            <tr>
              <th>Title</th>
              <th>Included in city</th>
            </tr>
          </thead>
          <tbody>
            {mainServices.map(({ id, key, title, disabledCities }) => (
              <tr key={id}>
                <td>
                  <div className="_flex _justify-between _items-center">
                    {title}
                    <button
                      className="btn btn-primary btn-sm _ml-3 visible-on-table-cell-hover _whitespace-nowrap"
                      onClick={() => setEditingMainService({ id, key, title })}
                    >
                      Manage prices
                    </button>
                  </div>
                </td>
                <td align="center" className="_align-middle">
                  <div className="form-switch width-max-content">
                    <input
                      type="checkbox"
                      role="switch"
                      className="form-check-input _cursor-pointer"
                      name={title}
                      id={title}
                      onChange={() => onMainServiceCityToggle(id)}
                      checked={!disabledCities.includes(selectedCity)}
                      disabled={mainServiceLoadingIds.includes(id)}
                    />
                    <label
                      className="form-check-label _cursor-pointer"
                      htmlFor={title}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editingMainService && (
        <EditPricesModal
          onClose={() => setEditingMainService(null)}
          editingMainService={editingMainService}
          prices={prices}
          getPrices={getPrices}
          selectedCity={selectedCity}
        />
      )}
    </div>
  );
}

export default MainServices;
