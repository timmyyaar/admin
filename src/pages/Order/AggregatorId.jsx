import React from "react";
import { ReactComponent as TakeYourTimeIcon } from "../../assets/icons/aggregators/take-your-time.svg";
import { AGGREGATOR_OPTIONS } from "./constants";

function AggregatorId({ order }) {
  const aggregator = AGGREGATOR_OPTIONS.find(
    ({ value }) => value === order.aggregator
  );

  return (
    <div className="d-flex align-items-center">
      {order.aggregator && aggregator ? (
        <div className="_mr-2 d-flex align-items-center">
          <img
            src={aggregator.icon}
            alt=""
            width="24"
            height="24"
            className="_mr-1"
          />
          <div className="_text-xs" style={{ color: aggregator.color }}>
            Spic and Span
          </div>
        </div>
      ) : (
        <TakeYourTimeIcon width="24" height="24" className="_mr-2" />
      )}
      {order.id}
    </div>
  );
}

export default AggregatorId;
