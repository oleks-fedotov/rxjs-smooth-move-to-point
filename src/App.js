import React, { useRef, useEffect, useState, useCallback } from "react";
import { Subject, timer } from "rxjs";

import "./styles.css";
import { tap, throttle } from "rxjs/operators";

const ANIMATION_DURATION_MS = 2000;

const getAnimationStyleCss = ({ x, y }) => {
  return [
    `transition: transform ${ANIMATION_DURATION_MS}ms cubic-bezier(0.645, 0.045, 0.355, 1)`,
    `transform: translate3d(${x}px, ${y}px, 0)`
  ].join("; ");
};

export default function App() {
  const squareRef = useRef();
  const [clickStream] = useState(new Subject());
  const [animationCompleteStream] = useState(new Subject());
  const onClick = useCallback(
    event => {
      clickStream.next({
        x: event.clientX,
        y: event.clientY
      });
    },
    [clickStream]
  );

  const assignSquareStyle = useCallback(
    coords => {
      squareRef.current.style.cssText = getAnimationStyleCss(coords);
      setTimeout(() => animationCompleteStream.next(), ANIMATION_DURATION_MS);
    },
    [animationCompleteStream]
  );

  useEffect(() => {
    clickStream
      .pipe(throttle(() => animationCompleteStream))
      .pipe(tap(assignSquareStyle))
      .subscribe();
  }, [clickStream, assignSquareStyle, animationCompleteStream]);

  return (
    <div className="App" onMouseDown={onClick}>
      <div className="square" ref={squareRef} />
    </div>
  );
}
