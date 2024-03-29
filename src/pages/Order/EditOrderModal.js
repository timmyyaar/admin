import Modal from "../../components/common/Modal";
import React, { useContext, useState } from "react";
import { EMAIL_REGEX, ORDER_TYPE } from "../../constants";
import { request } from "../../utils";
import { LocaleContext } from "../../contexts";

const ORDER_TYPE_OPTIONS = Object.values(ORDER_TYPE);

const EditOrderModal = ({ onClose, order, setOrders }) => {
  const { t } = useContext(LocaleContext);

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
      actionButtonText={t("admin_order_edit_update_order")}
      onActionButtonClick={onUpdateOrder}
      isActionButtonDisabled={!isEmailValid || isUpdateLoading}
      isLoading={isUpdateLoading}
    >
      <div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_name")}:</label>
          <input
            className="form-control"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_phone")}:</label>
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
          <label className="mb-2">{t("admin_order_edit_address")}:</label>
          <textarea
            className="form-control"
            value={address}
            onChange={({ target: { value } }) => setAddress(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_date")}:</label>
          <input
            className="form-control"
            value={date}
            onChange={({ target: { value } }) => setDate(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">
            {t("admin_order_price_with_discount")}:
          </label>
          <input
            className="form-control"
            value={price}
            onChange={({ target: { value } }) => setPrice(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_price")}:</label>
          <input
            className="form-control"
            value={priceOriginal}
            onChange={({ target: { value } }) => setPriceOriginal(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">
            {t("admin_order_total_price_with_discount")}:
          </label>
          <input
            className="form-control"
            value={totalPrice}
            onChange={({ target: { value } }) => setTotalPrice(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_total_price")}:</label>
          <input
            className="form-control"
            value={totalPriceOriginal}
            onChange={({ target: { value } }) => setTotalPriceOriginal(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_estimate")}:</label>
          <input
            className="form-control"
            value={estimate}
            onChange={({ target: { value } }) => setEstimate(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_title")}:</label>
          <select
            className="form-select"
            onChange={({ target: { value } }) => setTitle(value)}
          >
            {ORDER_TYPE_OPTIONS.map((option) => (
              <option selected={option === title} value={option}>
                {t(
                  `admin_order_type_${option
                    .toLowerCase()
                    .replaceAll(" ", "_")}_option`
                )}
              </option>
            ))}
          </select>
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_counter")}:</label>
          <textarea
            className="form-control"
            value={counter}
            onChange={({ target: { value } }) => setCounter(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_edit_services")}:</label>
          <textarea
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
            {t("admin_order_edit_online_payment")}
          </label>
        </div>
        {updateError && <div className="mt-3 text-danger">{updateError}</div>}
      </div>
    </Modal>
  );
};

export default EditOrderModal;
