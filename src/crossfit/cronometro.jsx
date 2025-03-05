import React, { useState, useEffect, useRef } from 'react';
import './cronometro.css';

const WorkoutTimer = ({ workouts, type, contador, setContador }) => {
  // Estado para manejar el entrenamiento actual
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(true); // Comenzar en descanso
  const intervalRef = useRef(null);

  // Convertir minutos a segundos
  const minutesToSeconds = (minutes) => Math.floor(minutes * 60);

  // Efecto para cargar el primer entrenamiento cuando se monta el componente
  useEffect(() => {
    if (workouts && workouts.length > 0) {
      // Comenzar con descanso si existe
      if (workouts[0].restTime > 0) {
        setTime(minutesToSeconds(workouts[0].restTime));
        setIsRestPhase(true);
      } else {
        // Si no hay descanso, comenzar directamente con el trabajo
        setTime(minutesToSeconds(workouts[0].time));
        setIsRestPhase(false);
      }
    }
  }, [workouts]);

  // Calcular minutos y segundos
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Calcular el porcentaje para el progreso circular
  const initialTime = isRestPhase 
    ? minutesToSeconds(workouts[currentWorkoutIndex].restTime)
    : minutesToSeconds(workouts[currentWorkoutIndex].time);
  const percentage = ((initialTime - time) / initialTime) * 100;

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            if (isRestPhase) {
              // El descanso terminó, comenzar la fase de trabajo
              setIsRestPhase(false);
              setTime(minutesToSeconds(workouts[currentWorkoutIndex].time));
            } else {
              // El trabajo terminó, pasar al siguiente ejercicio
              const nextIndex = currentWorkoutIndex + 1;
              if (nextIndex < workouts.length) {
                setCurrentWorkoutIndex(nextIndex);
                // Ver si hay tiempo de descanso para el siguiente ejercicio
                if (workouts[nextIndex].restTime > 0) {
                  setIsRestPhase(true);
                  setTime(minutesToSeconds(workouts[nextIndex].restTime));
                } else {
                  // No hay descanso, ir directamente al tiempo de trabajo
                  setIsRestPhase(false);
                  setTime(minutesToSeconds(workouts[nextIndex].time));
                }
              } else {
                // Todos los entrenamientos completados
                setIsActive(false);
                setIsPaused(false);
                return 0;
              }
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, isRestPhase, currentWorkoutIndex, workouts]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const resetTimer = () => {
    if (workouts && workouts.length > 0) {
        setContador(0);
      setCurrentWorkoutIndex(0);
      // Comenzar con descanso si existe
      if (workouts[0].restTime > 0) {
        setTime(minutesToSeconds(workouts[0].restTime));
        setIsRestPhase(true);
      } else {
        // Si no hay descanso, comenzar directamente con el trabajo
        setTime(minutesToSeconds(workouts[0].time));
        setIsRestPhase(false);
      }
      setIsActive(false);
      setIsPaused(false);
    }
  };

  // Si no hay entrenamientos, no renderizar nada
  if (!workouts || workouts.length === 0) {
    return null;
  }

  return (
    <div className="workout-timer">
      <div className="timer-container">
        <div className="progress-ring-container">
          <svg className="progress-ring" width="260" height="260">
            <circle
              className="progress-ring-circle-bg"
              stroke="#e6e6e6"
              strokeWidth="12"
              fill="transparent"
              r="120"
              cx="130"
              cy="130"
            />
            <circle
              className="progress-ring-circle"
              stroke={isRestPhase ? "#4CAF50" : "#ff5e3a"}
              strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - percentage / 100)}`}
              fill="transparent"
              r="120"
              cx="130"
              cy="130"
            />
          </svg>
          <div className="timer-display">
            <div className="time">{formattedTime}</div>
            <div className="timer-label">
              {isRestPhase 
                ? 'Descanso' 
                : `Ronda ${currentWorkoutIndex + 1}`}
            </div>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        {!isActive && !isPaused ? (
          <button className="timer-button start" onClick={startTimer}>
            <span className="button-icon">▶</span>
            <span className="button-text">Iniciar</span>
          </button>
        ) : isPaused ? (
          <button className="timer-button resume" onClick={resumeTimer}>
            <span className="button-icon">▶</span>
            <span className="button-text">Reanudar</span>
          </button>
        ) : (
          <button className="timer-button pause" onClick={pauseTimer}>
            <span className="button-icon">⏸</span>
            <span className="button-text">Pausa</span>
          </button>
        )}
        <button className="timer-button reset" onClick={resetTimer}>
          <span className="button-icon">↺</span>
          <span className="button-text">Resetear</span>
        </button>
      </div>
      {type === "AMRAP" && !isRestPhase && isActive ?
      <button className='boton-contador' onClick={()=>{setContador(contador + 1)}}>Contador de rondas: {contador}</button>
        :
        <p className='texto-contador-rondas'> Llevas {contador} rondas</p>
      }
      
    </div>
  );
};

export default WorkoutTimer;