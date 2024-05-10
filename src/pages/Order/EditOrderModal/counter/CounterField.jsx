import { POSITIVE_NUMBER_EMPTY_REGEX } from "../../../../constants";
import { NON_ZERO_COUNTER_MAIN_SERVICES } from "../CounterEdit";

function CounterField({ field, t, setFields, title }) {
  const minimumCounterValue = NON_ZERO_COUNTER_MAIN_SERVICES.includes(title)
    ? 1
    : 0;

  const onMinusClick = ({ count, title }) => {
    if (count === minimumCounterValue) {
      return;
    }

    setFields((fields) =>
      fields.map((field) =>
        title === field.title ? { ...field, count: field.count - 1 } : field
      )
    );
  };

  const onPlusClick = ({ title }) => {
    setFields((fields) =>
      fields.map((field) =>
        title === field.title ? { ...field, count: field.count + 1 } : field
      )
    );
  };

  const onFieldCountChange = (title, value) => {
    setFields((fields) =>
      fields.map((field) =>
        title === field.title ? { ...field, count: +value } : field
      )
    );
  };

  return (
    <h4 className="d-flex align-items-center">
      <button
        className="btn btn-sm btn-secondary font-weight-bold _mr-2 rounded-circle icon-button-small"
        disabled={field.count === minimumCounterValue}
        onClick={() => onMinusClick(field)}
      >
        &ndash;
      </button>
      <span className="badge bg-secondary">
        {t(field.title)}
        <input
          className="counter-input"
          value={field.count}
          onChange={({ target: { value } }) => {
            if (POSITIVE_NUMBER_EMPTY_REGEX.test(value)) {
              onFieldCountChange(
                field.title,
                !value ? minimumCounterValue : value
              );
            }
          }}
          style={{ width: `${field.count.toString().length}ch` }}
        />
      </span>
      <button
        className="btn btn-sm btn-secondary font-weight-bold _ml-2 rounded-circle icon-button-small"
        onClick={() => onPlusClick(field)}
      >
        +
      </button>
    </h4>
  );
}

export default CounterField;
