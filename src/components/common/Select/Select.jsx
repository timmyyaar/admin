import ReactSelect from "react-select";

export const DARK_SELECT_STYLES = {
  option: (provided, state) => ({
    ...provided,
    color: state.isDisabled ? "#495057" : "#dee2e6",
    backgroundColor: state.isDisabled
      ? "#212529"
      : state.isSelected
      ? "#495057"
      : provided.backgroundColor,
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#ced4da",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    color: "#dee2e6",
    ":hover": {
      color: "#dee2e6",
    },
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#dee2e6",
    ":hover": {
      color: "#dee2e6",
    },
  }),
  multiValue: (provided, { selectProps }) => {
    const hideItems = selectProps.isMulti && selectProps.hideMultiItems;

    return {
      ...provided,
      backgroundColor: "#495057",
      ...(hideItems && {
        "&:not(:nth-child(-n+2))": {
          display: "none",
        },
      }),
    };
  },
  valueContainer: (provided, { selectProps }) => {
    const moreItemsQuantity = Array.isArray(selectProps.value)
      ? selectProps.value.length - 2
      : 0;
    const hideItems = selectProps.isMulti && selectProps.hideMultiItems;

    return {
      ...provided,
      ...(hideItems && {
        flexWrap: "nowrap",
        width: "auto",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        '& [class*="Input"]': {
          display: "flex",
          "&::before": {
            display: "flex",
            marginRight: "auto",
            content: moreItemsQuantity > 0 ? `"+ ${moreItemsQuantity}"` : '""',
            alignItems: "center",
          },
        },
      }),
    };
  },
  input: (provided) => ({
    ...provided,
    color: "#dee2e6",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    borderRadius: 0,
    color: "#dee2e6",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#dee2e6",
  }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled ? "#343a40" : "#212529",
    borderColor: "#495057",
    borderRadius: "0.375rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#6c757d",
    },
    ...(state.selectProps.isInvalid && {
      borderColor: "red",
      "&:hover": {
        borderColor: "red",
      },
      boxShadow: state.isFocused ? `0 0 0 1px red;` : "none",
    }),
  }),
};

function Select(props) {
  return (
    <ReactSelect
      className="w-100"
      styles={DARK_SELECT_STYLES}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          neutral0: "#212529",
          neutral5: "#495057",
          neutral10: "#495057",
          primary: "#41464b",
          primary25: "#495057",
          primary50: "#495057",
        },
      })}
      {...props}
    />
  );
}

export default Select;
