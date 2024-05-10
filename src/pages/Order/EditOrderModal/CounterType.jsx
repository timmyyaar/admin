import { COUNTER_TYPE } from "./CounterEdit";
import { capitalizeFirstLetter } from "../../../utils";

function CounterType({ counterType, setCounterType, setFields, t }) {
  const onSelectDefaultFlow = () => {
    setCounterType(COUNTER_TYPE.DEFAULT);
    setFields([
      { title: "regular_0_count_total", type: "counter", count: 1 },
      { title: "regular_1_count_total", type: "counter", count: 1 },
      { title: "Kitchenette", type: "switcher" },
    ]);
  };

  const onSelectSquareMetersFlow = () => {
    setCounterType(COUNTER_TYPE.SQUARE_METERS);
    setFields([{ title: "square_meters_total", type: "counter", count: 1 }]);
  };

  return (
    <div className="d-flex">
      <div className="form-check _mr-3">
        <input
          className="form-check-input _cursor-pointer"
          type="radio"
          id={COUNTER_TYPE.DEFAULT}
          checked={counterType === COUNTER_TYPE.DEFAULT}
          onChange={onSelectDefaultFlow}
        />
        <label
          className="form-check-label _cursor-pointer"
          htmlFor={COUNTER_TYPE.DEFAULT}
        >
          {capitalizeFirstLetter(t("default"))}
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input _cursor-pointer"
          type="radio"
          id={COUNTER_TYPE.SQUARE_METERS}
          checked={counterType === COUNTER_TYPE.SQUARE_METERS}
          onChange={onSelectSquareMetersFlow}
        />
        <label
          className="form-check-label _cursor-pointer"
          htmlFor={COUNTER_TYPE.SQUARE_METERS}
        >
          {capitalizeFirstLetter(t("square_meters"))}
        </label>
      </div>
    </div>
  );
}

export default CounterType;
