import React, { useState, useEffect, useRef } from 'react';
import './cronometro.css';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import LottieAnimation from '../visualizador_lottie/visualizador';
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import Finalizar from './finalizar';
const WorkoutTimer = ({ workouts, type, setComenzar, timeLimit, exercisesList, targetRounds }) => {
  // Estado para manejar el entrenamiento actual
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(type !== 'tabata'); // Comenzar con trabajo si es tabata
  const [countUp, setCountUp] = useState(false); // Estado para determinar si contamos hacia arriba
  const [maxTime, setMaxTime] = useState(0); // Tiempo máximo para el modo fortime
  const intervalRef = useRef(null);
  const [indexAmrap, setIndexAmrap] = useState(0); 
  const [emomCompleted,setEmomCompleted] = useState(false)
  const [rutinaIncompleta, setRutinaIncompleta] = useState(false);
  
  // Nuevos estados para la cuenta regresiva inicial
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const countdownRef = useRef(null);
  const [contador,setContador] = useState(0);

  // Convertir minutos a segundos
  const minutesToSeconds = (minutes) => Math.floor(minutes * 60);


  const handleSessionComplete = () => {
    // Lógica para incrementar sesiones SOLO cuando se completa realmente
    if (
        (type === 'tabata' && formattedTime === '00:00' && currentWorkoutIndex === (workouts.length - 1)) ||
        (type === 'fortime' && (contador === targetRounds || formatRemainingTime() === '00:00')) ||
        (type === 'AMRAP' && formattedTime === '00:00') ||
        (type === 'escalera' && formattedTime === '00:00') ||
        (type === 'EMOM' && emomCompleted)
    ) {
        const sesiones = localStorage.getItem('sesiones-crossfit');
        const nuevasSesiones = sesiones ? parseInt(sesiones) + 1 : 1;
        localStorage.setItem('sesiones-crossfit', nuevasSesiones);
    }
};

  // Efecto para cargar el primer entrenamiento cuando se monta el componente
  useEffect(() => {
    if (workouts && workouts.length > 0) {
      if (type === 'tabata') {
        // Para tabata, comenzar directamente con tiempo de trabajo
        setTime(minutesToSeconds(workouts[0].time));
        setIsRestPhase(false);
        setCountUp(false);
      } else if (type === 'fortime' ) {
        // Para fortime, comenzar en cero y contar hacia arriba
        setTime(0);
        setIsRestPhase(false);
        setCountUp(true);
        setMaxTime(minutesToSeconds(workouts[0].time));
      } else if (type === 'EMOM') {
        setTime(60);
      setIsRestPhase(false);  // EMOM nunca tiene fase de descanso
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
  const initialTimeRef = useRef(null);

useEffect(() => {
  if (workouts && workouts.length > 0) {
    let initialTime;
    
    if (type === 'tabata') {
      initialTime = minutesToSeconds(workouts[0].time);
    } else if (type === 'fortime' ) {
      initialTime = 0;
    } else if (type === 'EMOM') {
      initialTime = 60;
    } else {
      initialTime = workouts[0].restTime > 0 
        ? minutesToSeconds(workouts[0].restTime)
        : minutesToSeconds(workouts[0].time);
    }
    
    // Guardar el tiempo inicial en la referencia
    initialTimeRef.current = initialTime;
    
    // Seguir estableciendo el tiempo como antes
    setTime(initialTime);
  }
}, [workouts, type]);
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
          // Lógica para contar hacia arriba (modo fortime/escalera)
          setTime((prevTime) => {
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
              const nextIndex = currentWorkoutIndex + 1;
              
              if (nextIndex >= workouts.length) {
                clearInterval(intervalRef.current);
                setIsActive(false);
                setIsPaused(true);
                setEmomCompleted(true);
                return 0;
              }
              
              // Usar una función de actualización para garantizar la última versión del estado
              setCurrentWorkoutIndex(prevIndex => nextIndex);
              return 60;
            }
            return prevTime - 1;
          });
        } 
       
        
        else {
          // Lógica para otros tipos (AMRAP, etc.)
          setTime((prevTime) => {
            if (prevTime <= 1) {
              if (isRestPhase) {
                // Terminó el descanso, ir al siguiente ejercicio
                const nextIndex = currentWorkoutIndex + 1;
                if (nextIndex < workouts.length) {
                  setCurrentWorkoutIndex(nextIndex);
                  setIsRestPhase(false);
                  return minutesToSeconds(workouts[nextIndex].time);
                } else {
                  // Todos los ejercicios completados
                  clearInterval(intervalRef.current);
                  setIsActive(false);
                  setIsPaused(true);
                  return 0;
                }
              } else {
                // Terminó el trabajo, ir a descanso si existe
                if (workouts[currentWorkoutIndex].restTime > 0) {
                  setIsRestPhase(true);
                  return minutesToSeconds(workouts[currentWorkoutIndex].restTime);
                } else {
                  // No hay descanso, ir al siguiente ejercicio
                  const nextIndex = currentWorkoutIndex + 1;
                  if (nextIndex < workouts.length) {
                    setCurrentWorkoutIndex(nextIndex);
                    return minutesToSeconds(workouts[nextIndex].time);
                  } else {
                    // Todos los ejercicios completados
                    clearInterval(intervalRef.current);
                    setIsActive(false);
                    setIsPaused(true);
                    return 0;
                  }
                }
              }
            }
            return prevTime - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
  
    return () => clearInterval(intervalRef.current);
  }, [
    isActive, 
    isPaused, 
    isRestPhase, 
    currentWorkoutIndex, 
    workouts, 
    countUp, 
    maxTime, 
    type
  ]);

  // Efecto para la cuenta regresiva inicial
  useEffect(() => {
    if (showCountdown) {
      countdownRef.current = setInterval(() => {
        setCountdownValue((prev) => {
          if (prev <= 1) {
            // Cuando la cuenta regresiva llega a 0, limpiar intervalo y comenzar el temporizador real
            clearInterval(countdownRef.current);
            setShowCountdown(false);
            setIsActive(true);
            setIsPaused(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [showCountdown]);

  const startTimer = () => {
    // En lugar de iniciar el temporizador, ahora iniciamos la cuenta regresiva
    setShowCountdown(true);
    setCountdownValue(3);
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
      } else if (type === 'fortime' || type === 'escalera') {
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
      setShowCountdown(false);
    }
  };

  // Si no hay entrenamientos, no renderizar nada
  if (!workouts || workouts.length === 0) {
    return null;
  }

  // Determinar el texto a mostrar en la etiqueta del temporizador
  const getTimerLabel = () => {
    if ((type === 'fortime' ) && timeLimit !== 'ilimitado') {
      return `Tiempo restante: ${formatRemainingTime()}`;
    } else if (type === 'EMOM'  && exercisesList !== null) {
      // Para EMOM, mostrar el ejercicio actual
      const currentExercise = workouts[currentWorkoutIndex].exercise;
      return `${currentExercise.reps} reps`;
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

    // Parar el reloj cuando se cumplan las condiciones de finalizacion: 

    useEffect(() => {
      if (type === 'fortime' && contador === targetRounds) {
        setIsActive(false);
        setIsPaused(true);
      }
    }, [type, contador, targetRounds])
  
    useEffect(() => {
      
      if (formatRemainingTime() === '00:00') {
        setIsActive(false);
        setIsPaused(true);
      }
    }, [formatRemainingTime()])
  

  return (
    <div className="workout-timer">
      <button className='back-button-timer' onClick={()=> setComenzar(false)}>
        <MdOutlineKeyboardBackspace />
      </button>
      <div className="timer-container">
        <h2 className='titulo-seleccion-crossfit'>{type}</h2>
       
        {exercisesList && exercisesList.length > 0 && type !== 'AMRAP' && type !== 'fortime' && type !== 'escalera' &&
        <div className='tabata-lottie-container' key={currentWorkoutIndex}>
          <div>
          <p className='numero'>{currentWorkoutIndex+1}</p>
          <p>{exercisesList[currentWorkoutIndex]}</p>
        </div>
         
          <LottieAnimation jsonPath={`./Ejerciciosall/${exercisesList[currentWorkoutIndex]}.json`} />
        </div>
       
        }
        {exercisesList && exercisesList.length > 0 && (type === 'fortime') &&
        <div className='amrap-lottie-container'>
        {indexAmrap > 0 &&
        <p className='manejador izquierda' onClick={()=>setIndexAmrap(indexAmrap-1)}><MdArrowBackIos /></p>
        }
      
       <div className='tabata-lottie-container' key={indexAmrap}>
        <div>
          <p className='numero'>{indexAmrap+1}</p>
          <p>{exercisesList[indexAmrap]}</p>
        </div>
        <div>
        <LottieAnimation jsonPath={`./Ejerciciosall/${exercisesList[indexAmrap]}.json`} />
        {type === 'escalera' ? 
         <p>{workouts[indexAmrap].reps + contador} reps</p>
        :
        <p>{workouts[indexAmrap].reps} reps</p>
        }
        
        </div>
        
      </div>
      {indexAmrap < exercisesList.length -1 && 
      <p className='manejador derecha' onClick={()=>setIndexAmrap(indexAmrap+1)}><MdArrowForwardIos /></p>
      
      }
      
      </div>
        
        }
        {exercisesList && exercisesList.length > 0 && (type === 'AMRAP' || type === 'escalera') &&
        
        <div className='amrap-lottie-container'>
          
          {indexAmrap > 0 &&
          <p className='manejador izquierda' onClick={()=>setIndexAmrap(indexAmrap-1)}><MdArrowBackIos /></p>
          }
        
         <div className='tabata-lottie-container' key={indexAmrap}>
          <div>
            <p className='numero'>{indexAmrap+1}</p>
            <p>{exercisesList[currentWorkoutIndex][indexAmrap]}</p>
          </div>
          <div>
          <LottieAnimation jsonPath={`./Ejerciciosall/${exercisesList[currentWorkoutIndex][indexAmrap]}.json`} />
          {type === 'AMRAP'?
          <p>{workouts[currentWorkoutIndex].exercises[indexAmrap].reps} reps</p>:
          <p>{workouts[currentWorkoutIndex].exercises[indexAmrap].reps + contador} reps</p>
          }
          
           </div>

         
        </div>
        {indexAmrap < exercisesList[currentWorkoutIndex].length -1 && 
        <p className='manejador derecha' onClick={()=>setIndexAmrap(indexAmrap+1)}><MdArrowForwardIos /></p>
        }
        
        </div>
       
       }
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
              stroke={isRestPhase ? "#4CAF50" : "#0b7dda"}
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
            {showCountdown ? (
              <div className="countdown-display">
                <div className="countdown-number" key={countdownValue}>
                  {countdownValue}
                </div>
              </div>
            ) : (
              <>
                <div className="time">{formattedTime}</div>
                <div className="timer-label">
                  {getTimerLabel()}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="timer-controls">
        {!isActive && !isPaused && !showCountdown ? (
          <button className="timer-button start" onClick={startTimer}>
            <span className="button-icon">▶</span>
            <span className="button-text">Iniciar</span>
          </button>
        ) : isPaused ? (
          <button className="timer-button resume" onClick={resumeTimer}>
            <span className="button-icon">▶</span>
            <span className="button-text">Reanudar</span>
          </button>
        ) : !showCountdown ? (
          <button className="timer-button pause" onClick={pauseTimer}>
            <span className="button-icon">II</span>
            <span className="button-text">Pausa</span>
          </button>
        ) : (
          <button className="timer-button" disabled>
            <span className="button-text">Preparando...</span>
          </button>
        )}
        <button className="timer-button reset" onClick={resetTimer} disabled={showCountdown}>
          <span className="button-icon">↺</span>
          <span className="button-text">Resetear</span>
        </button>
      </div>
      
      {/* Corregir la condición para mostrar el botón contador o el texto */}
      {((type === "AMRAP" || type === 'fortime' || type === 'escalera') && !isRestPhase && isActive && !isPaused && !showCountdown) ? (
        <button className='boton-contador' onClick={()=>{setContador(contador+1)}}>
          Contador de rondas: {contador}
        </button>
      ) : type === "EMOM" && !showCountdown ? (
        <p className='texto-contador-rondas'>
           Ejercicio {currentWorkoutIndex + 1} de {workouts.length}
        </p>
      ) : 
       type === "tabata" ? null
       
      :(
        <p className='texto-contador-rondas'>
          Llevas {contador} rondas
        </p>
      )}

      
      {type === 'tabata' && formattedTime === '00:00' && currentWorkoutIndex===( workouts.length -1)
      &&
      <Finalizar  onSessionComplete={handleSessionComplete} setComenzar={setComenzar} type={type} time={formattedTime} intervalos={workouts.length} descanso={workouts[0].restTime*60} trabajo={workouts[0].time*60}/>
      
      }

    {
      type === 'fortime' && ((contador === targetRounds) || (formatRemainingTime() === '00:00')) &&
      <>
      <Finalizar  onSessionComplete={handleSessionComplete} time={time} setComenzar={setComenzar} type={type} contador={contador} ejerciciosNumero={exercisesList ? exercisesList.length : 0} incompleto={formatRemainingTime() === '00:00'} />
      </>
      
    }
    {console.log(exercisesList)}
    
    {
      type === 'AMRAP' && formattedTime === '00:00' &&
      <>
      <Finalizar  onSessionComplete={handleSessionComplete} setComenzar={setComenzar} type={'AMRAP'} contador={contador} ejerciciosNumero={exercisesList ? exercisesList[0].length : 0}  />
      </>
      
    }

{
      type === 'escalera' && formattedTime === '00:00' &&
      <>
      <Finalizar  onSessionComplete={handleSessionComplete} setComenzar={setComenzar} type={'escalera'} contador={contador} ejerciciosNumero={exercisesList ? exercisesList[0].length : 0}  />
      </>
      
    }

{
      type === 'EMOM' && emomCompleted &&
      <>
      <Finalizar  onSessionComplete={handleSessionComplete} setComenzar={setComenzar} type={'EMOM'} contador={contador} ejerciciosNumero={exercisesList ? exercisesList.length : 0} intervalos={workouts.length} />
      </>
      
    }


    </div>
  );
};

export default WorkoutTimer;