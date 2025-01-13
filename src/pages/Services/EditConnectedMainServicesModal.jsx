import Select from "../../components/common/Select/Select";
import React, { useState } from "react";
import Modal from "../../components/common/Modal";
import { request } from "../../utils";

function EditConnectedMainServicesModal({
  onClose,
  id,
  title,
  mainServices,
  connectedMainServices,
  setSubServices,
}) {
  const [isConnectMainServicesLoading, setIsConnectMainServicesLoading] =
    useState(false);
  const [connectedMainServicesValue, setConnectedMainServicesValue] = useState(
    mainServices
      .filter((mainService) => connectedMainServices.includes(mainService.id))
      .map(({ id, title }) => ({
        value: id,
        label: title,
      })),
  );

  const onUpdateConnectedMainServices = async (options) => {
    try {
      setIsConnectMainServicesLoading(true);

      const updatedSubService = await request({
        url: `sub-services/${id}/update-main-services`,
        method: "PATCH",
        body: { mainServices: options.map((option) => option.value) },
      });

      setSubServices((prev) =>
        prev.map((subService) =>
          subService.id === id ? updatedSubService : subService,
        ),
      );

      onClose()
    } finally {
      setIsConnectMainServicesLoading(false);
    }
  };

  const connectedMainServicesOptions = mainServices.map(({ id, title }) => ({
    value: id,
    label: title,
  }));

  return (
    <Modal
      onClose={onClose}
      isLoading={isConnectMainServicesLoading}
      isActionButtonDisabled={isConnectMainServicesLoading}
      onActionButtonClick={() =>
        onUpdateConnectedMainServices(connectedMainServicesValue)
      }
      actionButtonText="Edit"
    >
      <h6 className="_mb-3">
        Select main services you want to show this sub service (
        <span className="text-info">{title}</span>) for
      </h6>
      <Select
        isMulti
        options={connectedMainServicesOptions}
        value={connectedMainServicesValue}
        onChange={(options) => setConnectedMainServicesValue(options)}
        menuPlacement="auto"
        menuPortalTarget={document.body}
        closeMenuOnSelect={false}
      />
    </Modal>
  );
}

export default EditConnectedMainServicesModal;
