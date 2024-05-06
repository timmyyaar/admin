import Modal from "../../components/common/Modal";
import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import { LocaleContext } from "../../contexts";
import { getTimeString } from "../../utils";
import { getMinOrMaxTime, getTimeWithMinuteDifference } from "./utils";

const FULL_PERIOD_DURATION_HOURS = 4;

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
    const startTimeString = getTimeString(startTime);
    const endTimeString = getTimeString(endTime);

    const timeRange = `${startTimeString} - ${endTimeString}`;

    const isFullPeriodSelected =
      Number(endTimeString.split(":")[0]) -
        Number(startTimeString.split(":")[0]) ===
      FULL_PERIOD_DURATION_HOURS;

    if (isFullPeriodSelected) {
      await addOrEditSchedule(periodName, false);
    } else {
      await addOrEditSchedule(`${periodName}Additional`, timeRange);
    }

    onClose();
  };

  const isEnabled = startTime && endTime;

  return (
    <Modal
      onClose={onClose}
      actionButtonText={t("admin_save")}
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
