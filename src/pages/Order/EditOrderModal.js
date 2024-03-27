import Modal from "../../components/common/Modal";
import React, { useState } from "react";
import { EMAIL_REGEX, ORDER_TYPE } from "../../constants";
import { request } from "../../utils";

const ORDER_TYPE_OPTIONS = Object.values(ORDER_TYPE);

const EditOrderModal = ({ onClose, order, setOrders }) => {
  const [name, setName] = useState(order.name);
  const [number, setNumber] = useState(order.number);
  const [email, setEmail] = useState(order.email);
  const [date, setDate] = useState(order.date);
  const [address, setAddress] = useState(order.address);
  const [price, setPrice] = useState(order.price);
  const [totalPrice, setTotalPrice] = useState(order.total_service_price);
  const [priceOriginal, setPriceOriginal] = useState(order.price_original);
  const [totalPriceOriginal, setTotalPriceOriginal] = useState(
    order.total_service_price_original
  );
  const [onlinePayment, setOnlinePayment] = useState(order.onlinepayment);
  const [estimate, setEstimate] = useState(order.estimate);
  const [title, setTitle] = useState(order.title);
  const [counter, setCounter] = useState(order.counter);
  const [subService, setSubService] = useState(order.subservice);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email);

  const onUpdateOrder = async () => {
    try {
      setIsUpdateLoading(true);

      const updatedOrder = await request({
        url: `order/${order.id}`,
        method: "PUT",
        body: {
          name,
          number,
          email,
          address,
          date,
          onlinePayment,
          price,
          estimate,
          title,
          counter,
          subService,
          total_service_price: totalPrice,
          total_service_price_original: totalPriceOriginal,
          price_original: priceOriginal,
        },
      });

      setOrders((orders) =>
        orders.map((prev) =>
          prev.id === updatedOrder.id ? updatedOrder : prev
        )
      );
      onClose();
    } catch (error) {
      setUpdateError("Error!");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      actionButtonText="Update order"
      onActionButtonClick={onUpdateOrder}
      isActionButtonDisabled={!isEmailValid || isUpdateLoading}
      isLoading={isUpdateLoading}
    >
      <div>
        <div className="w-100 mb-3">
          <label className="mb-2">Name:</label>
          <input
            className="form-control"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Number:</label>
          <input
            className="form-control"
            value={number}
            onChange={({ target: { value } }) => setNumber(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Email:</label>
          <input
            className="form-control"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Address:</label>
          <input
            className="form-control"
            value={address}
            onChange={({ target: { value } }) => setAddress(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Date:</label>
          <input
            className="form-control"
            value={date}
            onChange={({ target: { value } }) => setDate(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Number:</label>
          <input
            className="form-control"
            value={number}
            onChange={({ target: { value } }) => setNumber(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Price:</label>
          <input
            className="form-control"
            value={price}
            onChange={({ target: { value } }) => setPrice(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Original price:</label>
          <input
            className="form-control"
            value={priceOriginal}
            onChange={({ target: { value } }) => setPriceOriginal(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Total price:</label>
          <input
            className="form-control"
            value={totalPrice}
            onChange={({ target: { value } }) => setTotalPrice(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Total price original:</label>
          <input
            className="form-control"
            value={totalPriceOriginal}
            onChange={({ target: { value } }) => setTotalPriceOriginal(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Estimate:</label>
          <input
            className="form-control"
            value={estimate}
            onChange={({ target: { value } }) => setEstimate(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Title:</label>
          <select
            className="form-select"
            onChange={({ target: { value } }) => setTitle(value)}
          >
            {ORDER_TYPE_OPTIONS.map((option) => (
              <option selected={option === title} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Counter:</label>
          <input
            className="form-control"
            value={counter}
            onChange={({ target: { value } }) => setCounter(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">Services:</label>
          <input
            className="form-control"
            value={subService}
            onChange={({ target: { value } }) => setSubService(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <input
            id="online-payment"
            className="_cursor-pointer"
            type="checkbox"
            checked={onlinePayment}
            onClick={() => setOnlinePayment(!onlinePayment)}
          />
          <label htmlFor="online-payment" className="ms-2 _cursor-pointer">
            Online payment
          </label>
        </div>
        {updateError && <div className="mt-3 text-danger">{updateError}</div>}
      </div>
    </Modal>
  );
};

export default EditOrderModal;
