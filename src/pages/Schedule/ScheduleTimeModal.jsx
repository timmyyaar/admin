import Modal from "../../components/common/Modal";
import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import { LocaleContext } from "../../contexts";

const getMinOrMaxTime = (time) => {
  const splittedTime = time.split(":");

  const minOrMaxTime = new Date();
  minOrMaxTime.setHours(splittedTime[0]);
  minOrMaxTime.setMinutes(splittedTime[1]);
  minOrMaxTime.setSeconds(0);

  return minOrMaxTime;
};

const getTimeWithMinuteDifference = (time, symbol = "plus") => {
  const newTime = new Date(time);

  const minutes = time.getMinutes();

  newTime.setMinutes(symbol === "plus" ? minutes + 1 : minutes - 1);

  return newTime;
};

const getFormattedTime = (date) => {
  const hours = date.getHours();
  const twoDigitsHours = hours < 10 ? `0${hours}` : hours;
  const minutes = date.getMinutes();
  const twoDigitsMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${twoDigitsHours}:${twoDigitsMinutes}`;
};

function ScheduleTimeModal({
  onClose,
  minTime,
  maxTime,
  addOrEditSchedule,
  periodName,
  isLoading,
}) {
  const { t } = useContext(LocaleContext);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const editUnavailableTime = async () => {
    const timeRange = `${getFormattedTime(startTime)} - ${getFormattedTime(
      endTime
    )}`;

    await addOrEditSchedule(`${periodName}Additional`, timeRange);

    onClose();
  };

  const isEnabled = startTime && endTime;

  return (
    <Modal
      onClose={onClose}
      actionButtonText={t("admin_schedule_edit_time")}
      isActionButtonDisabled={!isEnabled || isLoading}
      isLoading={isLoading}
      onActionButtonClick={editUnavailableTime}
    >
      <h5 className="mb-4 text-center select-none">
        {t("admin_schedule_choose_range")}
      </h5>
      <div className="_inline-grid _gap-4 _w-full grid-two-columns-max-auto align-items-center select-none">
        <label>{t("admin_schedule_start_time")}:</label>
        <div>
          <DatePicker
            selected={startTime}
            onChange={(date) => setStartTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={60}
            timeCaption={t("Time")}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            minTime={getMinOrMaxTime(minTime)}
            maxTime={
              endTime
                ? getTimeWithMinuteDifference(endTime, "minus")
                : getTimeWithMinuteDifference(getMinOrMaxTime(maxTime), "minus")
            }
          />
        </div>
        <label>{t("admin_schedule_end_time")}:</label>
        <div>
          <DatePicker
            selected={endTime}
            onChange={(date) => setEndTime(date)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={60}
            timeCaption={t("Time")}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            minTime={
              startTime
                ? getTimeWithMinuteDifference(startTime)
                : getTimeWithMinuteDifference(getMinOrMaxTime(minTime))
            }
            maxTime={getMinOrMaxTime(maxTime)}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ScheduleTimeModal;
