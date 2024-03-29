import DatePicker from "react-datepicker";
import Modal from "../../components/common/Modal";
import React, { useState } from "react";
import { request } from "../../utils";
import { NEGATIVE_POSITIVE_NUMBERS_EMPTY_REGEX } from "../../constants";

const getDateObjectFromString = (string) => {
  const dateArray = string.split("/");

  const day = dateArray[0];
  const month = dateArray[1];
  const year = dateArray[2];

  return new Date(`${year}-${month}-${day}`);
};

function AddOrEditDiscountModal({ onClose, setDiscounts, editingDiscount }) {
  const [date, setDate] = useState(
    editingDiscount ? getDateObjectFromString(editingDiscount.date) : new Date()
  );
  const [value, setValue] = useState(
    editingDiscount ? editingDiscount.value : ""
  );
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const isAddDiscountEnabled = date && value && value < 100 && value > -100;

  const createOrEditDiscount = async () => {
    if (!isAddDiscountEnabled) {
      return;
    }

    try {
      setIsCreateLoading(true);

      const newDiscount = await request({
        url: `discounts${editingDiscount ? `/${editingDiscount.id}` : ""}`,
        method: editingDiscount ? "PUT" : "POST",
        body: {
          date: `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`,
          value: +value,
        },
      });

      setDiscounts((prev) =>
        editingDiscount
          ? prev.map((item) =>
              item.id === editingDiscount.id ? newDiscount : item
            )
          : [...prev, newDiscount]
      );
      onClose();
    } catch (error) {
      setCreateError(error.message);
    } finally {
      setIsCreateLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isActionButtonDisabled={isCreateLoading || !isAddDiscountEnabled}
      isLoading={isCreateLoading}
      onActionButtonClick={createOrEditDiscount}
      errorMessage={createError}
    >
      <h5 className="mb-4">Add new discount</h5>
      <div className="w-100 mb-3 d-flex align-items-center">
        <label className="_mr-2">Date:</label>
        <DatePicker
          selected={date}
          onChange={(newDate) => setDate(newDate)}
          dateFormat="d/MM/yyyy"
          minDate={new Date()}
        />
      </div>
      <div className="w-100 mb-3 d-flex align-items-center">
        <label className="_mr-2">Value:</label>
        <input
          className="form-control"
          value={value}
          onChange={({ target: { value: newValue } }) => {
            if (NEGATIVE_POSITIVE_NUMBERS_EMPTY_REGEX.test(newValue)) {
              setValue(newValue);
            }
          }}
        />
      </div>
    </Modal>
  );
}

export default AddOrEditDiscountModal;
