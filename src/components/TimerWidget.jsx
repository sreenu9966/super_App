import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown, BellOff } from "lucide-react";

const TimerWidget = () => {
  const [targetHours, setTargetHours] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(0);
  const [targetSeconds, setTargetSeconds] = useState(0);

  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isRinging, setIsRinging] = useState(false);

  const countdownIntervalRef = useRef(null);
  const audioIntervalRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    if (!isRunning && !isRinging && totalDuration === 0) {
      const seconds = targetHours * 3600 + targetMinutes * 60 + targetSeconds;
      setTimeLeft(seconds);
    }
  }, [targetHours, targetMinutes, targetSeconds, isRunning, isRinging, totalDuration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRinging(true);
            setIsRunning(false);
            setTotalDuration(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(countdownIntervalRef.current);
    }

    return () => clearInterval(countdownIntervalRef.current);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRinging) {
      playBeepInstance();
      audioIntervalRef.current = setInterval(() => {
        playBeepInstance();
      }, 1500);
    } else {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch((e) => console.log(e));
        audioContextRef.current = null;
      }
    }

    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, [isRinging]);

  const playBeepInstance = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const audioCtx = audioContextRef.current;
      
      const playBeep = (startTime, frequency = 880) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startTime);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.4);
      };

      const now = audioCtx.currentTime;
      playBeep(now, 987.77);
      playBeep(now + 0.25, 1318.51);
      playBeep(now + 0.5, 1567.98);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleStartPause = () => {
    if (timeLeft <= 0 || isRinging) return;

    if (!isRunning) {
      if (totalDuration === 0) {
        setTotalDuration(timeLeft);
      }
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsRinging(false);
    clearInterval(countdownIntervalRef.current);
    setTotalDuration(0);
    const initialSeconds = targetHours * 3600 + targetMinutes * 60 + targetSeconds;
    setTimeLeft(initialSeconds);
  };

  const handleDismissAlarm = () => {
    setIsRinging(false);
    setTotalDuration(0);
    const initialSeconds = targetHours * 3600 + targetMinutes * 60 + targetSeconds;
    setTimeLeft(initialSeconds);
  };

  const adjustUnit = (unit, change) => {
    if (isRunning || isRinging) return;

    if (unit === "hours") {
      setTargetHours((prev) => Math.max(0, Math.min(23, prev + change)));
    } else if (unit === "minutes") {
      setTargetMinutes((prev) => {
        const next = prev + change;
        if (next > 59) return 0;
        if (next < 0) return 59;
        return next;
      });
    } else if (unit === "seconds") {
      setTargetSeconds((prev) => {
        const next = prev + change;
        if (next > 59) return 0;
        if (next < 0) return 59;
        return next;
      });
    }
  };

  const formatTimeParts = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (num) => (num < 10 ? "0" + num : num);
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalDuration > 0 ? timeLeft / totalDuration : 1;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className={`dashboard-widget timer-widget glass-panel ${isRinging ? "ringing" : ""}`}>
      <div className="timer-display-column">
        <div className="timer-svg-container">
          <svg className="timer-svg" width="160" height="160">
            <circle
              className="timer-circle-bg"
              cx="80"
              cy="80"
              r={radius}
              strokeWidth="10"
            />
            <circle
              className="timer-circle-progress"
              cx="80"
              cy="80"
              r={radius}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div className="timer-digital-readout">
            <span className="digital-time">{formatTimeParts(timeLeft)}</span>
            <span className="digital-status">
              {isRinging ? "Alarming!" : timeLeft === 0 ? "Expired" : isRunning ? "Counting" : "Paused"}
            </span>
          </div>
        </div>
      </div>

      <div className="timer-control-column">
        <div className="timer-setters-row">
          <div className="timer-setter-item">
            <span className="setter-label">Hours</span>
            <button onClick={() => adjustUnit("hours", 1)} disabled={isRunning || isRinging} className="setter-arrow-btn">
              <ChevronUp size={16} />
            </button>
            <span className="setter-value">
              {targetHours < 10 ? "0" + targetHours : targetHours}
            </span>
            <button onClick={() => adjustUnit("hours", -1)} disabled={isRunning || isRinging} className="setter-arrow-btn">
              <ChevronDown size={16} />
            </button>
          </div>

          <span className="setter-divider">:</span>

          <div className="timer-setter-item">
            <span className="setter-label">Minutes</span>
            <button onClick={() => adjustUnit("minutes", 1)} disabled={isRunning || isRinging} className="setter-arrow-btn">
              <ChevronUp size={16} />
            </button>
            <span className="setter-value">
              {targetMinutes < 10 ? "0" + targetMinutes : targetMinutes}
            </span>
            <button onClick={() => adjustUnit("minutes", -1)} disabled={isRunning || isRinging} className="setter-arrow-btn">
              <ChevronDown size={16} />
            </button>
          </div>

          <span className="setter-divider">:</span>

          <div className="timer-setter-item">
            <span className="setter-label">Seconds</span>
            <button onClick={() => adjustUnit("seconds", 1)} disabled={isRunning || isRinging} className="setter-arrow-btn">
              <ChevronUp size={16} />
            </button>
            <span className="setter-value">
              {targetSeconds < 10 ? "0" + targetSeconds : targetSeconds}
            </span>
            <button onClick={() => adjustUnit("seconds", -1)} disabled={isRunning || isRinging} className="setter-arrow-btn">
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="timer-buttons-row">
          {isRinging ? (
            <button 
              onClick={handleDismissAlarm} 
              className="btn btn-primary dismiss-alarm-btn"
              style={{ width: "100%", padding: "0.85rem", gap: "0.5rem" }}
            >
              <BellOff size={16} /> DISMISS ALARM
            </button>
          ) : (
            <>
              <button 
                onClick={handleStartPause} 
                disabled={timeLeft <= 0}
                className={`btn ${isRunning ? "btn-secondary" : "btn-primary"} timer-action-btn`}
              >
                {isRunning ? (
                  <>
                    <Pause size={16} style={{ marginRight: "0.5rem" }} /> Pause
                  </>
                ) : (
                  <>
                    <Play size={16} style={{ marginRight: "0.5rem" }} /> Start
                  </>
                )}
              </button>
              
              <button 
                onClick={handleReset}
                className="btn btn-secondary timer-action-btn"
              >
                <RotateCcw size={16} style={{ marginRight: "0.5rem" }} /> Reset
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimerWidget;
