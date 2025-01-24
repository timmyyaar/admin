import spicAndSpanIcon from "../../assets/icons/aggregators/spic-and-span.svg";

export const AGGREGATORS = {
  SPIC_AND_SPAN: "Spic and Span",
};

export const AGGREGATOR_OPTIONS = [
  {
    label: AGGREGATORS.SPIC_AND_SPAN,
    value: AGGREGATORS.SPIC_AND_SPAN,
    icon: spicAndSpanIcon,
    color: "#f0d218",
  },
];

export const SORTING = {
  DATE_OLD_TO_NEW: {
    translation: "order_filter_date_oldest_to_newest",
    value: "Date (the oldest to the newest)",
  },
  DATE_NEW_TO_OLD: {
    translation: "order_filter_date_newest_to_oldest",
    value: "Date (the newest to the oldest)",
  },
};
