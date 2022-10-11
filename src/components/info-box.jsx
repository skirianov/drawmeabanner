import { useEffect, useState } from "react";
import { MAX_PAINTS } from "./board";

const TIMER = {
  minutes: 0,
  seconds: 30,
}

export const InfoBox = ({ paints, setPaints, setCanvasClass, paintsRef, setStupidUserCounter }) => {
  const [timer, setTimer] = useState(TIMER);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    const timer = JSON.parse(localStorage.getItem('timer'));
    const timestamp = JSON.parse(localStorage.getItem('timestamp'));

    if (timer && timestamp) {
      setPaints(0)
    }

    let localTimer = {
      minutes: 0,
      seconds: 0,
    }

    const timerInSeconds =  timer ? timer.minutes * 60 + timer.seconds : 0;
    
    if (timestamp) {
      const diff = Math.floor((Date.now() - timestamp) / 1000);

      if (diff < timerInSeconds) {
        localTimer.minutes = Math.floor((timerInSeconds - diff) / 60);
        localTimer.seconds = (timerInSeconds - diff) % 60;
      }

      setTimer(localTimer);
      setShowTimer(true);
      startInterval(localTimer);
    }

  }, []);

  useEffect(() => {
    if (paints === 0) {
      setCanvasClass('disabled');
      let localTimer = { ...timer };
      startInterval(localTimer);
    }
  }, [paints])

  const startInterval = (localTimer) => {
    setShowTimer(true);
    const interval = setInterval(() => {
      if (localTimer.seconds > 0) {
        setTimer({ minutes: localTimer.minutes, seconds: localTimer.seconds - 1 });
        localTimer = { minutes: localTimer.minutes, seconds: localTimer.seconds - 1 };
      }
      if (localTimer.seconds === 0) {
        if (localTimer.minutes === 0) {
          setTimer(TIMER);
          setPaints(MAX_PAINTS);
          setCanvasClass('');
          setStupidUserCounter(0);
          localStorage.removeItem('timer');
          localStorage.removeItem('timestamp');
          localStorage.removeItem('paints');
          paintsRef.current.className = 'paints';
          setShowTimer(false);
          clearInterval(interval);
        } else {
          setTimer({ minutes: localTimer.minutes - 1, seconds: 59 });
          localTimer = { minutes: localTimer.minutes - 1, seconds: 59 };
        }
      }

      localStorage.setItem('timer', JSON.stringify(localTimer));
      localStorage.setItem('timestamp', Date.now());
    }, 1000);
  }

  return (
    <div className="info-box">
      <div className="box" >
        <p>Next paint available in:</p>
        <div className="timer">
          {showTimer ? timer.minutes : '-'}
          <span>:</span>
          {showTimer ? timer.seconds < 10 ? `0${timer.seconds}` : timer.seconds : '--'}
        </div>
      </div>
      <div className="box paints">
        <p>Paints:</p>
        <div className="paints" ref={paintsRef}>
          {paints || 'WAIT FOR PAINTS TO RECHARGE'}
        </div>
      </div>
    </div>
  );
}