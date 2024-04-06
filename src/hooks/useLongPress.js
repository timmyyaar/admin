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

  const start = useCallback(
    (event) => {
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener("touchend", preventDefault);
        target.current = event.target;
      }
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
  };
};

export default useLongPress;
