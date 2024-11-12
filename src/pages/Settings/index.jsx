import React, { useEffect, useState } from "react";

import { Louder } from "../../components/Louder";

import { capitalizeFirstLetter, request } from "../../utils";

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoadingIds, setUpdateLoadingIds] = useState([]);
  const [updateError, setUpdateError] = useState(false);

  const getSettings = async () => {
    try {
      setLoading(true);

      const settingsResponse = await request({ url: "settings" });

      setSettings(settingsResponse);
    } finally {
      setLoading(false);
    }
  };

  const updateSettingValue = async (id, value) => {
    try {
      setUpdateLoadingIds((prevUpdateLoadingIds) => [
        ...prevUpdateLoadingIds,
        id,
      ]);

      const updatedSetting = await request({
        url: `settings/${id}`,
        method: "PATCH",
        body: { value },
      });

      setSettings((prevSettings) =>
        prevSettings.map((setting) =>
          setting.id === updatedSetting.id ? updatedSetting : setting,
        ),
      );
    } catch (e) {
      setUpdateError(true);
    } finally {
      setUpdateLoadingIds((prevUpdateLoadingIds) =>
        prevUpdateLoadingIds.filter((loadingId) => loadingId !== id),
      );
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div>
      <Louder visible={loading} />
      <div className="_grid _gap-4 mt-4 _pb-4 _items-center">
        {settings.map((setting) => (
          <div
            className="form-check form-switch d-flex _items-center _gap-4"
            key={setting.id}
          >
            <input
              className="form-check-input _cursor-pointer"
              type="checkbox"
              role="switch"
              id={`switch_${setting.id}`}
              checked={setting.value}
              onChange={({ target: { checked } }) =>
                updateSettingValue(setting.id, checked)
              }
              disabled={updateLoadingIds.includes(setting.id)}
            />
            <label
              className="form-check-label _cursor-pointer"
              htmlFor={`switch_${setting.id}`}
            >
              {capitalizeFirstLetter(setting.name.replaceAll("_", " "))}
            </label>
          </div>
        ))}
      </div>
      {updateError && (
        <span className="text-danger">
          Some error occurred, please try to update again
        </span>
      )}
    </div>
  );
};

export default Settings;
