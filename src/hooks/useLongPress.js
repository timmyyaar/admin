import { useCallback, useRef, useState } from "react";

const isTouchEvent = (event) => {
  return "touches" in event;
};

const preventDefault = (event) => {
  if (!isTouchEvent(event)) return;

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

const useLongPress = (
  onLongPress,
  onClick,
  { shouldPreventDefault = true, delay = 300 } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef();
  const target = useRef();

  const start = (event) => {
    timeout.current = window.setTimeout(() => {
      onLongPress(event);
      setLongPressTriggered(true);
    }, delay);
  };

  const clear = (event, shouldTriggerClick = true) => {
    timeout.current && window.clearTimeout(timeout.current);
    shouldTriggerClick && !longPressTriggered && onClick(event);
    setLongPressTriggered(false);
    if (shouldPreventDefault && target.current) {
      target.current.removeEventListener("touchend", preventDefault);
    }
  };

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e),
  };
};

export default useLongPress;
