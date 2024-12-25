import { useRef, useState } from "react";
import useClickOutside from "../../../hooks/useClickOutside";
import {
  NEGATIVE_POSITIVE_NUMBERS_EMPTY_REGEX,
  POSITIVE_NUMBER_EMPTY_REGEX,
} from "../../../constants";
import { request } from "../../../utils";

export const FIELDS = { TIME: "time", PRICE: "price" };

function EditFieldPopover({
  onClose,
  editingSubService,
  city,
  getPrices,
  updatingField,
  setSubServices,
}) {
  const [editingValue, setEditingValue] = useState(
    editingSubService[updatingField],
  );
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const isPriceUpdating = updatingField === FIELDS.PRICE;

  const ref = useRef();
  useClickOutside(ref, onClose);

  const isUpdatePriceDisabled =
    updatingField === FIELDS.TIME
      ? !editingValue || +editingValue === editingSubService.time
      : +editingValue === editingSubService.price ||
        !editingValue ||
        String(editingValue).endsWith(".");

  const updateValue = async (e) => {
    e.preventDefault();

    if (isUpdatePriceDisabled) {
      return;
    }

    try {
      setUpdateError("");
      setIsUpdateLoading(true);

      const body = isPriceUpdating
        ? {
            prices: [
              {
                key: editingSubService.key,
                price: +editingValue,
                city,
              },
            ],
          }
        : { time: +editingValue };

      const response = await request({
        url: isPriceUpdating
          ? "prices"
          : `sub-services/${editingSubService.id}/update-time`,
        method: isPriceUpdating ? "PUT" : "PATCH",
        body,
      });

      if (isPriceUpdating) {
        await getPrices();
      } else {
        setSubServices((prev) =>
          prev.map((subService) =>
            response.id === subService.id ? response : subService,
          ),
        );
      }
      onClose();
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const regexp = isPriceUpdating
    ? NEGATIVE_POSITIVE_NUMBERS_EMPTY_REGEX
    : POSITIVE_NUMBER_EMPTY_REGEX;

  return (
    <>
      <div
        className="_rounded-2xl _z-auto _absolute _top-full _w-max z-index-max"
        ref={ref}
      >
        <form className="input-group" onSubmit={updateValue}>
          <input
            type="text"
            className={`form-control _w-40 ${updateError ? "border-danger" : ""}`}
            autoFocus
            value={editingValue}
            onChange={({ target: { value } }) => {
              if (regexp.test(value)) {
                setEditingValue(value);
              }
            }}
          />
          <div className="input-group-append _bg-black">
            <button
              className={`btn btn-secondary _rounded-r-md _rounded-l-none ${
                isUpdateLoading ? "loading" : ""
              }`}
              disabled={isUpdateLoading || isUpdatePriceDisabled}
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditFieldPopover;
