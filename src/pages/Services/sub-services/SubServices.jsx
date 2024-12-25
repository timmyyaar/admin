import React, { useState } from "react";
import EditFieldPopover from "./EditFieldPopover";
import EditConnectedMainServicesModal from "../EditConnectedMainServicesModal";
import { ReactComponent as InfoIcon } from "../../../assets/icons/info.svg";
import { request } from "../../../utils";

function SubServices({
  mainServices,
  subServices,
  setSubServices,
  selectedCity,
  currentCityPrices,
  getPrices,
}) {
  const [isSubServiceExpanded, setIsSubServiceExpanded] = useState(false);
  const [editSubServiceId, setEditSubServiceId] = useState(null);
  const [subServiceLoadingIds, setSubServiceLoadingIds] = useState([]);
  const [editingSubServicePrice, setEditingSubServicePrice] = useState(null);
  const [editingSubServiceTime, setEditingSubServiceTime] = useState(null);

  const onSubServiceCityToggle = async (id) => {
    try {
      setSubServiceLoadingIds((prev) => [...prev, id]);

      const response = await request({
        url: `sub-services/${id}/toggle-city/${selectedCity}`,
        method: "PATCH",
      });

      setSubServices((prev) =>
        prev.map((subService) =>
          subService.id === id ? response : subService,
        ),
      );
    } finally {
      setSubServiceLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const onToggleSubServiceBooleanField = async (id, fieldName) => {
    try {
      setSubServiceLoadingIds((prev) => [...prev, id]);

      const response = await request({
        url: `sub-services/${id}/toggle-boolean`,
        method: "PATCH",
        body: { fieldName },
      });

      setSubServices((prev) =>
        prev.map((subService) =>
          subService.id === id ? response : subService,
        ),
      );
    } finally {
      setSubServiceLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <>
      <div className="_py-4 border-bottom">
        <div
          className="_transition-all _flex _gap-1 _cursor-pointer _items-center hover:_text-blue-400 _w-max"
          onClick={() => setIsSubServiceExpanded((prev) => !prev)}
        >
          <small
            className={`_transition-transform ${isSubServiceExpanded ? "rotate-90" : ""}`}
          >
            ▶
          </small>
          <h5 className="_font-bold _m-0">Sub services</h5>
        </div>
        {isSubServiceExpanded && (
          <table className="table table-dark table-bordered _w-auto _mt-3">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price in city</th>
                <th>Included in city</th>
                <th>Connected main services</th>
                <th>Time</th>
                <th>
                  Is discount excluded{" "}
                  <InfoIcon
                    className="_w-4 _h-4"
                    title="If this switch is on - sub service price won't be calculated with discount"
                  />
                </th>
                <th>
                  Is standalone{" "}
                  <InfoIcon
                    className="_w-4 _h-4"
                    title="If this switch is on - sub service will be displayed as a standalone component in the bottom not with all other sub services"
                  />
                </th>
                <th>
                  Count in private house{" "}
                  <InfoIcon
                    className="_w-4 _h-4"
                    title="If this switch is on - sub service price will be calculated based on private house selection (currently * 1.3 if private house is selected)"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {subServices.map(
                ({
                  id,
                  key,
                  title,
                  time,
                  disabledCities,
                  mainServices: connectedMainServices,
                  isDiscountExcluded,
                  isStandalone,
                  countInPrivateHouse,
                }) => (
                  <tr key={id}>
                    <td className="_align-middle">{title}</td>
                    <td
                      align="center"
                      className="_align-middle _whitespace-nowrap hover:_text-yellow-400 _cursor-pointer _relative _font-semibold _transition-all"
                      onClick={() =>
                        setEditingSubServicePrice({
                          id,
                          key,
                          price: currentCityPrices[key],
                        })
                      }
                    >
                      {currentCityPrices[key]}
                      <span className="_absolute _text-xs _top-0.5 _right-0.5 visible-on-table-cell-hover">
                        ✏️
                      </span>
                      {editingSubServicePrice?.id === id && (
                        <EditFieldPopover
                          editingSubService={editingSubServicePrice}
                          onClose={() => setEditingSubServicePrice(null)}
                          city={selectedCity}
                          getPrices={getPrices}
                          updatingField="price"
                        />
                      )}
                    </td>
                    <td align="center" className="_align-middle">
                      <div className="form-switch width-max-content">
                        <input
                          type="checkbox"
                          role="switch"
                          className="form-check-input _cursor-pointer"
                          name={title}
                          id={title}
                          onChange={() => onSubServiceCityToggle(id)}
                          checked={!disabledCities.includes(selectedCity)}
                          disabled={subServiceLoadingIds.includes(id)}
                        />
                        <label
                          className="form-check-label _cursor-pointer"
                          htmlFor={title}
                        />
                      </div>
                    </td>
                    <td className="_align-middle">
                      <div className="_flex">
                        <div className="_flex _gap-2 _flex-wrap _items-center">
                          {mainServices
                            .filter((mainService) =>
                              connectedMainServices.includes(mainService.id),
                            )
                            .map((mainService) => (
                              <span className="badge bg-secondary">
                                {mainService.title}
                              </span>
                            ))}
                        </div>
                        <div className="_flex _items-center _ml-auto visible-on-table-cell-hover">
                          <button
                            className="btn btn-sm btn-primary _ml-4"
                            onClick={() => setEditSubServiceId(id)}
                          >
                            Edit
                          </button>
                          {editSubServiceId === id && (
                            <EditConnectedMainServicesModal
                              onClose={() => setEditSubServiceId(null)}
                              id={id}
                              title={title}
                              mainServices={mainServices}
                              connectedMainServices={connectedMainServices}
                              setSubServices={setSubServices}
                            />
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      align="center"
                      className="_align-middle _whitespace-nowrap hover:_text-yellow-400 _cursor-pointer _relative _font-semibold"
                      onClick={() => setEditingSubServiceTime({ id, time })}
                    >
                      {time}
                      <span className="_absolute _text-xs _top-0.5 _right-0.5 visible-on-table-cell-hover">
                        ✏️
                      </span>
                      {editingSubServiceTime?.id === id && (
                        <EditFieldPopover
                          editingSubService={editingSubServiceTime}
                          onClose={() => setEditingSubServiceTime(null)}
                          updatingField="time"
                          setSubServices={setSubServices}
                        />
                      )}
                    </td>
                    <td align="center" className="_align-middle">
                      <div className="form-switch width-max-content">
                        <input
                          type="checkbox"
                          role="switch"
                          className="form-check-input _cursor-pointer"
                          name={`discount_excluded_checkbox_${id}`}
                          id={`discount_excluded_checkbox_${id}`}
                          onChange={() =>
                            onToggleSubServiceBooleanField(
                              id,
                              "isDiscountExcluded",
                            )
                          }
                          checked={isDiscountExcluded}
                          disabled={subServiceLoadingIds.includes(id)}
                        />
                        <label
                          className="form-check-label _cursor-pointer"
                          htmlFor={`discount_excluded_checkbox_${id}`}
                        />
                      </div>
                    </td>
                    <td align="center" className="_align-middle">
                      <div className="form-switch width-max-content">
                        <input
                          type="checkbox"
                          role="switch"
                          className="form-check-input _cursor-pointer"
                          name={`standalone_checkbox_${id}`}
                          id={`standalone_excluded_checkbox_${id}`}
                          onChange={() =>
                            onToggleSubServiceBooleanField(id, "isStandalone")
                          }
                          checked={isStandalone}
                          disabled={subServiceLoadingIds.includes(id)}
                        />
                        <label
                          className="form-check-label _cursor-pointer"
                          htmlFor={`standalone_excluded_checkbox_${id}`}
                        />
                      </div>
                    </td>
                    <td align="center" className="_align-middle">
                      <div className="form-switch width-max-content">
                        <input
                          type="checkbox"
                          role="switch"
                          className="form-check-input _cursor-pointer"
                          name={`count_in_private_house_checkbox_${id}`}
                          id={`count_in_private_house_checkbox_${id}`}
                          onChange={() =>
                            onToggleSubServiceBooleanField(
                              id,
                              "countInPrivateHouse",
                            )
                          }
                          checked={countInPrivateHouse}
                          disabled={subServiceLoadingIds.includes(id)}
                        />
                        <label
                          className="form-check-label _cursor-pointer"
                          htmlFor={`count_in_private_house_checkbox_${id}`}
                        />
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}
      </div>
      {(editingSubServicePrice || editingSubServiceTime) && (
        <div className="modal-backdrop show" />
      )}
    </>
  );
}

export default SubServices;
