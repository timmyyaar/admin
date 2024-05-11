import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import {
  getDatesBetween,
  getDateString,
  getTimeString,
  request,
} from "../../../utils";
import Modal from "../../../components/common/Modal";
import Period from "./Period";
import { AppContext } from "../../../contexts";
import { ROLES } from "../../../constants";

const getLastDateOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0);

const getPeriodString = (startTime, endTime) =>
  startTime && endTime
    ? `${getTimeString(startTime)} - ${getTimeString(endTime)}`
    : null;

const getIsFullPeriodSelected = (startTime, endTime) =>
  startTime &&
  endTime &&
  Number(getTimeString(endTime).split(":")[0]) -
    Number(getTimeString(startTime).split(":")[0]) ===
    FULL_PERIOD_DURATION_HOURS;

const FULL_PERIOD_DURATION_HOURS = 4;

const getMinimumDateAdmin = (currentMonth) => {
  const date = new Date();
  date.setFullYear(currentMonth.getFullYear());
  date.setMonth(currentMonth.getMonth());

  return date;
};

const getMinimumDate = (currentMonth) => {
  const date = new Date();

  date.setDate(new Date().getDate() + 4);
  date.setFullYear(currentMonth.getFullYear());
  date.setMonth(currentMonth.getMonth());

  return date;
};

function BulkEditModal({
  onClose,
  employeeId,
  t,
  schedule,
  getSchedule,
  currentMonth,
}) {
  const {
    userData: { role },
  } = useContext(AppContext);
  const isAdmin = role === ROLES.ADMIN;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dateFrom, setDateFrom] = useState(
    isAdmin ? getMinimumDateAdmin(currentMonth) : getMinimumDate(currentMonth)
  );
  const [dateTo, setDateTo] = useState(null);
  const [isFirstPeriodOff, setIsFirstPeriodOff] = useState(false);
  const [firstPeriodStartTime, setFirstPeriodStartTime] = useState(null);
  const [firstPeriodEndTime, setFirstPeriodEndTime] = useState(null);
  const [isSecondPeriodOff, setIsSecondPeriodOff] = useState(false);
  const [secondPeriodStartTime, setSecondPeriodStartTime] = useState(null);
  const [secondPeriodEndTime, setSecondPeriodEndTime] = useState(null);
  const [isThirdPeriodOff, setIsThirdPeriodOff] = useState(false);
  const [thirdPeriodStartTime, setThirdPeriodStartTime] = useState(null);
  const [thirdPeriodEndTime, setThirdPeriodEndTime] = useState(null);
  const [isFourthPeriodOff, setIsFourthPeriodOff] = useState(false);
  const [fourthPeriodStartTime, setFourthPeriodStartTime] = useState(null);
  const [fourthPeriodEndTime, setFourthPeriodEndTime] = useState(null);

  const isBulkUpdateEnabled =
    dateFrom &&
    dateTo &&
    (isFirstPeriodOff
      ? (!firstPeriodStartTime && !firstPeriodEndTime) ||
        (firstPeriodStartTime && firstPeriodEndTime)
      : true) &&
    (isSecondPeriodOff
      ? (!secondPeriodStartTime && !secondPeriodEndTime) ||
        (secondPeriodStartTime && secondPeriodEndTime)
      : true) &&
    (isThirdPeriodOff
      ? (!thirdPeriodStartTime && !thirdPeriodEndTime) ||
        (thirdPeriodStartTime && thirdPeriodEndTime)
      : true) &&
    (isFourthPeriodOff
      ? (!fourthPeriodStartTime && !fourthPeriodEndTime) ||
        (fourthPeriodStartTime && fourthPeriodEndTime)
      : true);

  const editSchedule = async () => {
    if (!isBulkUpdateEnabled) {
      return;
    }

    try {
      setIsLoading(true);

      const dates = getDatesBetween(dateFrom, dateTo).map((date) =>
        getDateString(date)
      );

      const isFullFirstPeriodSelected = getIsFullPeriodSelected(
        firstPeriodStartTime,
        firstPeriodEndTime
      );
      const isFullSecondPeriodSelected = getIsFullPeriodSelected(
        secondPeriodStartTime,
        secondPeriodEndTime
      );
      const isFullThirdPeriodSelected = getIsFullPeriodSelected(
        thirdPeriodStartTime,
        thirdPeriodEndTime
      );
      const isFullFourthPeriodSelected = getIsFullPeriodSelected(
        fourthPeriodStartTime,
        fourthPeriodEndTime
      );

      const eachDateBody = {
        firstPeriod: !isFirstPeriodOff,
        secondPeriod: !isSecondPeriodOff,
        thirdPeriod: !isThirdPeriodOff,
        fourthPeriod: !isFourthPeriodOff,
        firstPeriodAdditional: isFullFirstPeriodSelected
          ? null
          : getPeriodString(firstPeriodStartTime, firstPeriodEndTime),
        secondPeriodAdditional: isFullSecondPeriodSelected
          ? null
          : getPeriodString(secondPeriodStartTime, secondPeriodEndTime),
        thirdPeriodAdditional: isFullThirdPeriodSelected
          ? null
          : getPeriodString(thirdPeriodStartTime, thirdPeriodEndTime),
        fourthPeriodAdditional: isFullFourthPeriodSelected
          ? null
          : getPeriodString(fourthPeriodStartTime, fourthPeriodEndTime),
      };

      await Promise.all(
        dates
          .filter((date) => {
            const existingSchedule = schedule.find(
              (item) =>
                item.date === date &&
                (employeeId ? item.employeeId === employeeId : true)
            );

            const isSomeOrderThisDate =
              existingSchedule &&
              (existingSchedule.isFirstPeriodOrder ||
                existingSchedule.isSecondPeriodOrder ||
                existingSchedule.isThirdPeriodOrder ||
                existingSchedule.isFourthPeriodOrder);

            return !isSomeOrderThisDate;
          })
          .map(async (date) => {
            const existingSchedule = schedule.find(
              (item) =>
                item.date === date &&
                (employeeId ? item.employeeId === employeeId : true)
            );

            return await request({
              url: `schedule${
                existingSchedule
                  ? `/${existingSchedule.id}`
                  : `${employeeId ? `/${employeeId}` : ""}`
              }`,
              method: existingSchedule ? "PUT" : "POST",
              body: existingSchedule
                ? {
                    ...existingSchedule,
                    ...eachDateBody,
                  }
                : {
                    date,
                    ...eachDateBody,
                  },
            });
          })
      );

      await getSchedule();

      onClose();
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      onClose={onClose}
      actionButtonText={t("admin_save")}
      onActionButtonClick={editSchedule}
      isActionButtonDisabled={isLoading || !isBulkUpdateEnabled}
      isLoading={isLoading}
      errorMessage={isError ? t("some_error_occurred") : ""}
      infoMessage={t("admin_schedule_order_notice")}
    >
      <h5 className="text-center mb-4">{t("admin_schedule_custom_period")}</h5>
      <div className="mb-4 d-flex">
        <div>
          <label>{t("admin_order_date_from_filter_title")}:</label>
          <div className="_mr-3">
            <DatePicker
              selectsStart
              selected={dateFrom}
              onChange={(newDate) => setDateFrom(newDate)}
              dateFormat="d/MM/yyyy"
              minDate={
                isAdmin
                  ? getMinimumDateAdmin(currentMonth)
                  : getMinimumDate(currentMonth)
              }
              maxDate={dateTo}
              startDate={dateFrom}
              endDate={dateTo}
            />
          </div>
        </div>
        <div>
          <label>{t("admin_order_date_to_filter_title")}:</label>
          <div>
            <DatePicker
              selectsEnd
              selected={dateTo}
              onChange={(newDate) => setDateTo(newDate)}
              dateFormat="d/MM/yyyy"
              minDate={dateFrom}
              maxDate={getLastDateOfMonth(currentMonth)}
              startDate={dateFrom}
              endDate={dateTo}
            />
          </div>
        </div>
      </div>
      <div>
        <Period
          title={t("first")}
          isOff={isFirstPeriodOff}
          setIsOff={setIsFirstPeriodOff}
          t={t}
          startTime={firstPeriodStartTime}
          setStartTime={setFirstPeriodStartTime}
          endTime={firstPeriodEndTime}
          setEndTime={setFirstPeriodEndTime}
          minTime="06:00"
          maxTime="10:00"
        />
        <Period
          title={t("second")}
          isOff={isSecondPeriodOff}
          setIsOff={setIsSecondPeriodOff}
          t={t}
          startTime={secondPeriodStartTime}
          setStartTime={setSecondPeriodStartTime}
          endTime={secondPeriodEndTime}
          setEndTime={setSecondPeriodEndTime}
          minTime="10:00"
          maxTime="14:00"
        />
        <Period
          title={t("third")}
          isOff={isThirdPeriodOff}
          setIsOff={setIsThirdPeriodOff}
          t={t}
          startTime={thirdPeriodStartTime}
          setStartTime={setThirdPeriodStartTime}
          endTime={thirdPeriodEndTime}
          setEndTime={setThirdPeriodEndTime}
          minTime="14:00"
          maxTime="18:00"
        />
        <Period
          title={t("fourth")}
          isOff={isFourthPeriodOff}
          setIsOff={setIsFourthPeriodOff}
          t={t}
          startTime={fourthPeriodStartTime}
          setStartTime={setFourthPeriodStartTime}
          endTime={fourthPeriodEndTime}
          setEndTime={setFourthPeriodEndTime}
          minTime="18:00"
          maxTime="22:00"
          isLast
        />
      </div>
    </Modal>
  );
}

export default BulkEditModal;
