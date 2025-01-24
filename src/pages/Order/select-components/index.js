import { components } from "react-select";
import React from "react";

export const OptionWithIcon = (props) => (
  <components.Option {...props}>
    <div className="d-flex align-items-center">
      <img
        className="_mr-2"
        src={props.data.icon}
        alt={props.label}
        width="24"
        height="24"
      />
      {props.label}
    </div>
  </components.Option>
);

export const SingleValueWithIcon = (props) => (
  <components.SingleValue {...props}>
    <div className="d-flex align-items-center">
      <img
        className="_mr-2"
        src={props.data.icon}
        alt={props.data.label}
        width="24"
        height="24"
      />
      {props.data.label}
    </div>
  </components.SingleValue>
);
