import React, { useState, useEffect } from 'react';
import './timer.css';

const Timer = ({ seconds, onComplete,esUltimoEjercicio }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [circumference, setCircumference] = useState(0);
  const radius = 150;

  useEffect(() => {
    const totalTime = seconds;
    const circle = 2 * Math.PI * radius;
    setCircumference(circle);

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          onComplete && onComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;
  const progress = circumference - (timeLeft / seconds) * circumference;

  const handleSkip = () => {
    // Llamar a onComplete para quitar el temporizador
    onComplete && onComplete();
  };

  return (
    <div className="timer-overlay">
      <h2>Toma tu descanso entre {esUltimoEjercicio ? 'series': 'ejercicios'}</h2>
      <div className="timer-container">
     
        <svg className="timer-svg" width="350" height="350" viewBox="0 0 350 350">
          <circle 
            cx="175" 
            cy="175" 
            r={radius} 
            fill="none" 
            stroke="#e0e0e0" 
            strokeWidth="20"
          />
          <circle 
            cx="175" 
            cy="175" 
            r={radius} 
            fill="none" 
            stroke="#4CAF50" 
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className="timer-progress"
          />
        </svg>
        <div className="timer-text">
          <div className="timer-time">
            {minutes.toString().padStart(2, '0')}:
            {remainingSeconds.toString().padStart(2, '0')}
          </div>
          <div className="timer-milliseconds">
            {timeLeft % 1 !== 0 && Math.floor((timeLeft % 1) * 1000)}
          </div>
        </div>
        <button className="timer-skip-button" onClick={handleSkip}>
          Saltar
        </button>
      </div>
    </div>
  );
};

export default Timer;