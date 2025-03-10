import React, { useState, useEffect, useRef } from 'react';
import './cronometro.css';
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const WorkoutTimer = ({ workouts, type, contador, setContador, setComenzar, timeLimit }) => {
  // Estado para manejar el entrenamiento actual
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(type !== 'tabata'); // Comenzar con trabajo si es tabata
  const [countUp, setCountUp] = useState(false); // Estado para determinar si contamos hacia arriba
  const [maxTime, setMaxTime] = useState(0); // Tiempo máximo para el modo fortime
  const intervalRef = useRef(null);

  // Convertir minutos a segundos
  const minutesToSeconds = (minutes) => Math.floor(minutes * 60);

  // Efecto para cargar el primer entrenamiento cuando se monta el componente
  useEffect(() => {
    if (workouts && workouts.length > 0) {
      if (type === 'tabata') {
        // Para tabata, comenzar directamente con tiempo de trabajo
        setTime(minutesToSeconds(workouts[0].time));
        setIsRestPhase(false);
        setCountUp(false);
      } else if (type === 'fortime') {
        // Para fortime, comenzar en cero y contar hacia arriba
        setTime(0);
        setIsRestPhase(false);
        setCountUp(true);
        setMaxTime(minutesToSeconds(workouts[0].time));
      } else if (type === 'EMOM') {
        // Para EMOM, iniciar con 60 segundos (1 minuto)
        setTime(60);
        setIsRestPhase(false);
        setCountUp(false);
      } else {
        // Para otros tipos, seguir la lógica original
        if (workouts[0].restTime > 0) {
          setTime(minutesToSeconds(workouts[0].restTime));
          setIsRestPhase(true);
        } else {
          setTime(minutesToSeconds(workouts[0].time));
          setIsRestPhase(false);
        }
        setCountUp(false);
      }
    }
  }, [workouts, type]);

  // Calcular minutos y segundos
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Calcular el porcentaje para el progreso circular
  const calculatePercentage = () => {
    if (countUp) {
      // Para fortime, el porcentaje se basa en cuánto hemos avanzado hacia el máximo
      return (time*1.666);
    } else if (type === 'EMOM') {
      // Para EMOM, el porcentaje es inverso (comienza en 100% y va disminuyendo)
      return ((60 - time) / 60) * 100;
    } else {
      // Para otros modos, seguir la lógica original
      const initialTime = isRestPhase 
        ? minutesToSeconds(workouts[currentWorkoutIndex].restTime)
        : minutesToSeconds(workouts[currentWorkoutIndex].time);
      return ((initialTime - time) / initialTime) * 100;
    }
  };
  
  const percentage = calculatePercentage();

  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (countUp) {
          // Lógica para contar hacia arriba (fortime)
          setTime((prevTime) => {
            // Si alcanzamos el tiempo máximo, detener el temporizador
            if (prevTime >= maxTime) {
              clearInterval(intervalRef.current);
              setIsActive(false);
              setIsPaused(false);
              return maxTime;
            }
            return prevTime + 1;
          });
        } else if (type === 'EMOM') {
          // Lógica específica para EMOM
          setTime((prevTime) => {
            if (prevTime <= 1) {
              // Cuando lleguemos a cero, reiniciar a 60 segundos y avanzar al siguiente ejercicio
              const nextIndex = (currentWorkoutIndex + 1) % workouts.length;
              setCurrentWorkoutIndex(nextIndex);
              
              // Si hemos completado una vuelta completa a todos los ejercicios, incrementar contador
              if (nextIndex === 0) {
                setContador(prev => prev + 1);
              }
              
              return 60; // Reiniciar a 60 segundos (1 minuto)
            }
            return prevTime - 1;
          });
        } else {
          // Lógica original para contar hacia abajo
          setTime((prevTime) => {
            if (prevTime <= 1) {
              if (isRestPhase) {
                // El descanso terminó, comenzar la fase de trabajo
                setIsRestPhase(false);
                setTime(minutesToSeconds(workouts[currentWorkoutIndex].time));
              } else {
                // El trabajo terminó
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
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, isRestPhase, currentWorkoutIndex, workouts, countUp, maxTime, type]);

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
      
      if (type === 'tabata') {
        // Para tabata, resetear directamente con tiempo de trabajo
        setTime(minutesToSeconds(workouts[0].time));
        setIsRestPhase(false);
        setCountUp(false);
      } else if (type === 'fortime') {
        // Para fortime, resetear a cero para contar hacia arriba
        setTime(0);
        setIsRestPhase(false);
        setCountUp(true);
        setMaxTime(minutesToSeconds(workouts[0].time));
      } else if (type === 'EMOM') {
        // Para EMOM, resetear a 60 segundos
        setTime(60);
        setIsRestPhase(false);
        setCountUp(false);
      } else {
        // Para otros tipos, seguir la lógica original
        if (workouts[0].restTime > 0) {
          setTime(minutesToSeconds(workouts[0].restTime));
          setIsRestPhase(true);
        } else {
          setTime(minutesToSeconds(workouts[0].time));
          setIsRestPhase(false);
        }
        setCountUp(false);
      }
      
      setIsActive(false);
      setIsPaused(false);
    }
  };

  // Si no hay entrenamientos, no renderizar nada
  if (!workouts || workouts.length === 0) {
    return null;
  }

  // Determinar el texto a mostrar en la etiqueta del temporizador
  const getTimerLabel = () => {
    if (type === 'fortime' && timeLimit !== 'ilimitado') {
      return `Tiempo restante: ${formatRemainingTime()}`;
    } else if (type === 'EMOM') {
      // Para EMOM, mostrar el ejercicio actual
      const currentExercise = workouts[currentWorkoutIndex].exercise;
      return `${currentExercise.name} - ${currentExercise.reps} reps`;
    } else {
      return isRestPhase ? 'Descanso' : `Ronda ${currentWorkoutIndex + 1}`;
    }
  };

  // Formatear el tiempo restante para el modo fortime
  const formatRemainingTime = () => {
    const remaining = timeLimit*60 - time;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Función para manejar el contador manual de EMOM
  const handleEmomCount = () => {
    setContador(contador + 1);
  };

  return (
    <div className="workout-timer">
      <button className='back-button-timer' onClick={()=> setComenzar(false)}>
        <MdOutlineKeyboardBackspace />
      </button>
      <div className="timer-container">
        <h2 className='titulo-seleccion-crossfit'>{type}</h2>
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
              {getTimerLabel()}
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
            <span className="button-icon">II</span>
            <span className="button-text">Pausa</span>
          </button>
        )}
        <button className="timer-button reset" onClick={resetTimer}>
          <span className="button-icon">↺</span>
          <span className="button-text">Resetear</span>
        </button>
      </div>
      
      {/* Corregir la condición para mostrar el botón contador o el texto */}
      {((type === "AMRAP" || type === 'fortime') && !isRestPhase && isActive && !isPaused) ? (
        <button className='boton-contador' onClick={()=>{setContador(contador + 1)}}>
          Contador de rondas: {contador}
        </button>
      ) : type === "EMOM" ? (
        <p className='texto-contador-rondas'>
          Ronda {contador + 1}, Ejercicio {currentWorkoutIndex + 1} de {workouts.length}
        </p>
      ) : (
        <p className='texto-contador-rondas'>
          Llevas {contador} rondas
        </p>
      )}
    </div>
  );
};

export default WorkoutTimer;