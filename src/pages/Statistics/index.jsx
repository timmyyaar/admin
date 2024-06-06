import { useContext, useEffect, useRef, useState } from "react";
import {
  getDateTimeObjectFromString,
  getFloatOneDigit,
  request,
} from "../../utils";
import {
  ORDER_STATUS,
  ORDER_TYPE,
  ORDER_TYPE_ADDITIONAL,
} from "../../constants";
import { Louder } from "../../components/Louder";
import Filters from "./Filters";
import { LocaleContext } from "../../contexts";

import "./style.scss";

const PHONE_BREAKPOINT = 1024;

const COLORS_BY_TYPE = {
  [ORDER_TYPE.REGULAR]: "#22c55e",
  [ORDER_TYPE.DRY]: "#eab308",
  [ORDER_TYPE.OZONATION]: "#3b82f6",
  [ORDER_TYPE_ADDITIONAL.POST_CONSTRUCTION]: "#C19A6B",
  [ORDER_TYPE_ADDITIONAL.AFTER_PARTY]: "#ef4444",
  [ORDER_TYPE_ADDITIONAL.AIRBNB]: "#d946ef",
  [ORDER_TYPE_ADDITIONAL.CUSTOM]: "#737373",
  [ORDER_TYPE_ADDITIONAL.DEEP]: "#020617",
  [ORDER_TYPE_ADDITIONAL.DEEP_KITCHEN]: "#84cc16",
  [ORDER_TYPE_ADDITIONAL.ECO]: "#14b8a6",
  [ORDER_TYPE_ADDITIONAL.LAST_MINUTE]: "#075985",
  [ORDER_TYPE_ADDITIONAL.MOVE]: "#ec4899",
  [ORDER_TYPE_ADDITIONAL.OFFICE]: "#7c2d12",
  [ORDER_TYPE_ADDITIONAL.WHILE_SICK]: "#065f46",
  [ORDER_TYPE_ADDITIONAL.WINDOW]: "#5b21b6",
};

function Statistics() {
  const { t } = useContext(LocaleContext);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [isOnlyCompleted, setIsOnlyCompleted] = useState(false);
  const canvasRef = useRef(null);

  const getOrders = async () => {
    try {
      setIsOrdersLoading(true);

      const ordersResponse = await request({ url: "order" });

      setOrders(ordersResponse);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  const currentPeriodOrders = orders
    .filter(({ date }) => {
      const dateObject = getDateTimeObjectFromString(date);

      if (dateFrom && dateTo) {
        return dateObject >= dateFrom && dateObject <= dateTo;
      }

      if (dateFrom) {
        return dateObject >= dateFrom;
      }

      if (dateTo) {
        return dateObject <= dateTo;
      }

      return true;
    })
    .filter(({ status }) =>
      isOnlyCompleted ? status === ORDER_STATUS.DONE.value : true
    );

  const ordersWithoutSubscription = currentPeriodOrders.filter(
    ({ title }) => title !== ORDER_TYPE_ADDITIONAL.SUBSCRIPTION
  );
  const ordersTypes = [
    ...new Set(ordersWithoutSubscription.map(({ title }) => title)),
  ];
  const chartData = ordersTypes.map((type) => {
    const ordersByType = ordersWithoutSubscription.filter(
      ({ title }) => title === type
    );

    return {
      type,
      percents: getFloatOneDigit(
        (ordersByType.length / ordersWithoutSubscription.length) * 100
      ),
    };
  });

  const renderChart = () => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let lastEnd = 0;

    const offset = 110;
    const width = canvas.width / 2;
    const height = canvas.height / 2;

    const totalPercents = chartData.reduce(
      (result, item) => result + item.percents,
      0
    );

    const radiusDividerForPercents =
      windowWidth > PHONE_BREAKPOINT ? 0.88 : 0.85;
    const fontSize = windowWidth > PHONE_BREAKPOINT ? 14 : 12;

    for (let i = 0; i < chartData.length; i++) {
      const item = chartData[i];

      ctx.fillStyle = COLORS_BY_TYPE[item.type];
      ctx.strokeStyle = "white";
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(width, height);
      const len = (item.percents / totalPercents) * 2 * Math.PI;
      const radius = height - offset / 2;
      ctx.arc(width, height, radius, lastEnd, lastEnd + len, false);
      ctx.lineTo(width, height);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "white";
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const mid = lastEnd + len / 2;
      ctx.fillText(
        `${item.percents}%`,
        width + Math.cos(mid) * (radius / radiusDividerForPercents),
        height + Math.sin(mid) * (radius / radiusDividerForPercents)
      );
      lastEnd += Math.PI * 2 * (item.percents / totalPercents);
    }
  };

  function handleWindowSizeChange() {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (chartData.length) {
      renderChart();
    }

    //eslint-disable-next-line
  }, [chartData, windowWidth]);

  return (
    <div className="statistics-page">
      <Louder visible={isOrdersLoading} />
      <Filters
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        isOnlyCompleted={isOnlyCompleted}
        setIsOnlyCompleted={setIsOnlyCompleted}
      />
      {chartData.length > 0 ? (
        <div className="_flex _flex-col lg:_flex-row _gap-8 _items-center lg:_items-start">
          <canvas
            ref={canvasRef}
            width={windowWidth > PHONE_BREAKPOINT ? 500 : 350}
            height={windowWidth > PHONE_BREAKPOINT ? 500 : 350}
          />
          <div className="_flex _flex-col _gap-4 _mb-6 lg:_mb-6">
            {chartData.map(({ type, percents }) => (
              <div
                className="_p-2 _w-full _border _border-solid _border-white _font-semibold _shadow-md"
                style={{ backgroundColor: COLORS_BY_TYPE[type] }}
              >
                {t(type)} - {percents}%
              </div>
            ))}
          </div>
        </div>
      ) : (
        !isOrdersLoading && (
          <span className="text-danger">
            There are no orders matching the selected filters.
          </span>
        )
      )}
    </div>
  );
}

export default Statistics;
