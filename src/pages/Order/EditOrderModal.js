import Modal from "../../components/common/Modal";
import React, { useContext, useState } from "react";
import {
  EMAIL_REGEX,
  NUMBER_FLOAT_EMPTY_REGEX,
  ORDER_TYPE_ADDITIONAL,
} from "../../constants";
import { getFloatOneDigit, request } from "../../utils";
import { LocaleContext } from "../../contexts";

const EditOrderModal = ({ onClose, order, setOrders }) => {
  const { t } = useContext(LocaleContext);

  const [name, setName] = useState(order.name);
  const [number, setNumber] = useState(order.number);
  const [email, setEmail] = useState(order.email);
  const [date, setDate] = useState(order.date);
  const [dateCreated, setDateCreated] = useState(order.creation_date);
  const [address, setAddress] = useState(order.address);
  const [price, setPrice] = useState(order.price);
  const [totalPrice, setTotalPrice] = useState(order.total_service_price);
  const [priceOriginal, setPriceOriginal] = useState(order.price_original);
  const [totalPriceOriginal, setTotalPriceOriginal] = useState(
    order.total_service_price_original
  );
  const [onlinePayment, setOnlinePayment] = useState(order.onlinepayment);
  const [estimate, setEstimate] = useState(order.estimate);
  const [counter, setCounter] = useState(order.counter);
  const [subService, setSubService] = useState(order.subservice);
  const [note, setNote] = useState(order.note || "");
  const [reward, setReward] = useState(order.reward || "");
  const [ownCheckList, setOwnCheckList] = useState(
    order.own_check_list || false
  );
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email);

  const onUpdateOrder = async () => {
    try {
      setIsUpdateLoading(true);

      const updatedOrders = await request({
        url: `order/${order.id}`,
        method: "PUT",
        body: {
          name,
          number,
          email,
          address,
          date,
          dateCreated,
          onlinePayment,
          price,
          estimate,
          title: order.title,
          counter,
          subService,
          note,
          total_service_price: totalPrice,
          total_service_price_original: totalPriceOriginal,
          price_original: priceOriginal,
          reward: reward ? +reward : null,
          ownCheckList,
        },
      });

      setOrders((prevOrders) =>
        prevOrders.map((prev) => {
          const updatedOrder = updatedOrders.find(
            (item) => item.id === prev.id
          );

          return updatedOrder || prev;
        })
      );
      onClose();
    } catch (error) {
      setUpdateError("Error!");
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const totalPriceDifference = getFloatOneDigit(
    order.total_service_price - order.price
  );
  const totalPriceOriginalDifference = getFloatOneDigit(
    order.total_service_price_original - order.price_original
  );

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
          <label className="mb-2">{t("admin_order_created")}:</label>
          <input
            className="form-control"
            value={dateCreated}
            onChange={({ target: { value } }) => setDateCreated(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">
            {t("admin_order_price_with_discount")}:
          </label>
          <input
            className="form-control"
            value={price}
            onChange={({ target: { value } }) => {
              if (order.price === order.total_service_price) {
                setTotalPrice(value);
              } else {
                setTotalPrice(getFloatOneDigit(totalPriceDifference + +value));
              }

              setPrice(value);
            }}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_price")}:</label>
          <input
            className="form-control"
            value={priceOriginal}
            onChange={({ target: { value } }) => {
              if (order.price_original === order.total_service_price_original) {
                setTotalPriceOriginal(value);
              } else {
                setTotalPriceOriginal(
                  getFloatOneDigit(totalPriceOriginalDifference + +value)
                );
              }

              setPriceOriginal(value);
            }}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">
            {t("admin_order_total_price_with_discount")}:
          </label>
          <input className="form-control" value={totalPrice} disabled />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_total_price")}:</label>
          <input className="form-control" value={totalPriceOriginal} disabled />
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
          <label className="mb-2">{t("admin_order_note")}:</label>
          <textarea
            className="form-control"
            value={note}
            onChange={({ target: { value } }) => setNote(value)}
          />
        </div>
        <div className="w-100 mb-3">
          <label className="mb-2">{t("admin_order_reward")}:</label>
          <input
            className="form-control"
            value={reward}
            onChange={({ target: { value } }) => {
              if (NUMBER_FLOAT_EMPTY_REGEX.test(value)) {
                setReward(value.trim());
              }
            }}
          />
        </div>
        <div className="w-100 mb-3">
          <div className="form-check">
            <input
              id="online-payment"
              className="form-check-input _cursor-pointer"
              type="checkbox"
              checked={onlinePayment}
              onClick={() => setOnlinePayment(!onlinePayment)}
            />
            <label
              htmlFor="online-payment"
              className="form-check-label _cursor-pointer"
            >
              {t("admin_order_edit_online_payment")}
            </label>
          </div>
        </div>
        {updateError && <div className="mt-3 text-danger">{updateError}</div>}
      </div>
      {order.title === ORDER_TYPE_ADDITIONAL.OFFICE && !order.is_confirmed && (
        <div className="w-100 mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input _cursor-pointer"
              id="own_check_list"
              name="own_check_list"
              checked={ownCheckList}
              onChange={() => setOwnCheckList((prev) => !prev)}
            />
            <label htmlFor="own_check_list">
              {t("we_provide_our_own_check_list")}
            </label>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EditOrderModal;
