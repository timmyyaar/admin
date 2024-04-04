import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Modal from "../../components/common/Modal";
import {
  getDateTimeObjectFromString,
  getDateTimeString,
  request,
} from "../../utils";
import { EMAIL_REGEX } from "../../constants";

function AddOrEditClientModal({ editingClient, onClose, setClients }) {
  const [name, setName] = useState(editingClient?.name || "");
  const [phone, setPhone] = useState(editingClient?.phone || "");
  const [firstOrderDate, setFirstOrderDate] = useState(
    editingClient?.first_order_date
      ? getDateTimeObjectFromString(editingClient.first_order_date)
      : null
  );
  const [firstOrderCreationDate, setFirstOrderCreationDate] = useState(
    editingClient?.first_order_creation_date
      ? getDateTimeObjectFromString(editingClient.first_order_creation_date)
      : null
  );
  const [email, setEmail] = useState(editingClient?.email || "");
  const [address, setAddress] = useState(editingClient?.address || "");
  const [instagram, setInstagram] = useState(editingClient?.instagram || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email);

  const isEnabled =
    name &&
    phone &&
    firstOrderDate &&
    firstOrderCreationDate &&
    email &&
    isEmailValid &&
    address;

  const addOrEditClient = async () => {
    try {
      setIsLoading(true);

      const addedOrUpdatedClient = await request({
        url: `clients${editingClient ? `/${editingClient.id}` : ""}`,
        method: editingClient ? "PUT" : "POST",
        body: {
          name,
          phone,
          email,
          address,
          instagram,
          firstOrderCreationDate: getDateTimeString(firstOrderCreationDate),
          firstOrderDate: getDateTimeString(firstOrderDate),
        },
      });

      setClients((prev) =>
        editingClient
          ? prev.map((item) =>
              item.id === editingClient.id ? addedOrUpdatedClient : item
            )
          : [addedOrUpdatedClient, ...prev]
      );

      onClose()
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      actionButtonText={editingClient ? "Update" : "Create"}
      isActionButtonDisabled={!isEnabled || isLoading}
      isLoading={isLoading}
      onActionButtonClick={addOrEditClient}
      errorMessage={error}
    >
      <h5 className="mb-4 text-center">
        {editingClient ? "Edit client" : "Add new client"}
      </h5>
      <div className="_inline-grid _gap-4 _w-full grid-two-columns-min-auto align-items-center">
        <label>Name:</label>
        <input
          className="form-control"
          value={name}
          onChange={({ target: { value } }) => setName(value)}
        />
        <label>Phone:</label>
        <input
          className="form-control"
          value={phone}
          onChange={({ target: { value } }) => setPhone(value)}
        />
        <label>Email:</label>
        <input
          className="form-control"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
        />
        <label>Address:</label>
        <textarea
          className="form-control"
          value={address}
          onChange={({ target: { value } }) => setAddress(value)}
        />
        <label>Created:</label>
        <div>
          <DatePicker
            showTimeSelect
            selected={firstOrderCreationDate}
            onChange={(newDate) => setFirstOrderCreationDate(newDate)}
            dateFormat="d/MM/yyyy HH:mm"
            timeFormat="HH:mm"
          />
        </div>
        <label>First order date:</label>
        <div>
          <DatePicker
            showTimeSelect
            selected={firstOrderDate}
            onChange={(newDate) => setFirstOrderDate(newDate)}
            dateFormat="d/MM/yyyy HH:mm"
            timeFormat="HH:mm"
          />
        </div>
        <label>Instagram:</label>
        <input
          className="form-control"
          value={instagram}
          onChange={({ target: { value } }) => setInstagram(value)}
        />
      </div>
    </Modal>
  );
}

export default AddOrEditClientModal;
