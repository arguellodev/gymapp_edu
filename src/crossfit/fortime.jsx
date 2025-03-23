import React, { useState, useCallback } from 'react';
import './fortime.css';
import WorkoutTimer from './cronometro';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Libreria from '../libreria/libreria';
import LottieAnimation from '../visualizador_lottie/visualizador';

const ForTime = ({setIndiceAtras}) => {
    const [comenzar, setComenzar] = useState(false);
    const [contador, setContador] = useState(0);
    const [totalTime, setTotalTime] = useState(10); // Tiempo objetivo total en minutos
    const [tiempoIlimitado, setTiempoIlimitado] = useState(false); // Estado para el switch de tiempo ilimitado
    const [targetRounds, setTargetRounds] = useState(1); // Número de rondas objetivo
    const [exercises, setExercises] = useState([]); // Lista de ejercicios
    const [mostrarLibreria, setMostrarLibreria] = useState(false); // Estado para mostrar la librería
    const [error, setError] = useState(null);

    const updateTotalTime = (changeType) => {
        if (changeType === 'increase') {
            setTotalTime(totalTime + 1);
        } else {
            setTotalTime(Math.max(1, totalTime - 1));
        }
    };

    const updateTargetRounds = (changeType) => {
        if (changeType === 'increase') {
            setTargetRounds(targetRounds + 1);
        } else {
            setTargetRounds(Math.max(1, targetRounds - 1));
        }
    };

    // Función para manejar el cambio del switch
    const handleSwitchChange = () => {
        setTiempoIlimitado(!tiempoIlimitado);
    };

    // Función para abrir la librería de ejercicios
    const abrirLibreria = () => {
        setMostrarLibreria(true);
    };

    // Función para agregar o quitar un ejercicio de la playlist
    const agregarEjercicio = useCallback((ejercicio) => {
        setExercises(prevExercises => {
            // Verificar si el ejercicio ya existe en la playlist
            const ejercicioIndex = prevExercises.findIndex(e => e.nombre === ejercicio);
            
            if (ejercicioIndex !== -1) {
                // Si el ejercicio existe, lo eliminamos
                const nuevaPlaylist = [...prevExercises];
                nuevaPlaylist.splice(ejercicioIndex, 1);
                return nuevaPlaylist;
            } else {
                // Si no existe, lo agregamos con repeticiones inicializadas en 10
                const nuevoEjercicio = {
                    id: `ejercicio-${Date.now()}`,
                    nombre: ejercicio,
                    repeticiones: 10
                };
                return [...prevExercises, nuevoEjercicio];
            }
        });
    }, []);

    // Función para actualizar las repeticiones de un ejercicio
    const updateRepeticiones = (nombreEjercicio, newValue) => {
        // Validamos que sea un número válido
        const repeticiones = parseInt(newValue);
        if (isNaN(repeticiones) || repeticiones < 1) return;
        
        setExercises(prevExercises => {
            return prevExercises.map(ejercicio => {
                if (ejercicio.nombre === nombreEjercicio) {
                    return { ...ejercicio, repeticiones };
                }
                return ejercicio;
            });
        });
    };

    // Función para incrementar o decrementar repeticiones
    const adjustRepeticiones = (nombreEjercicio, changeType) => {
        setExercises(prevExercises => {
            return prevExercises.map(ejercicio => {
                if (ejercicio.nombre === nombreEjercicio) {
                    const nuevasReps = changeType === 'increase' 
                        ? ejercicio.repeticiones + 1 
                        : Math.max(1, ejercicio.repeticiones - 1);
                    return { ...ejercicio, repeticiones: nuevasReps };
                }
                return ejercicio;
            });
        });
    };

    // Función para eliminar un ejercicio específico de la playlist
    const eliminarEjercicio = (nombreEjercicio) => {
        setExercises(prevExercises => {
            return prevExercises.filter(ejercicio => ejercicio.nombre !== nombreEjercicio);
        });
    };

    // Función para eliminar todos los ejercicios
    const eliminarPlaylist = () => {
        setExercises([]);
    };

    // Preparar los datos para el temporizador
    const prepareWorkoutData = () => {
        if (exercises.length === 0) {
            return [{ id: "placeholder", name: "Sin ejercicios", reps: 0 }];
        }
        
        return exercises.map(exercise => ({
            id: exercise.id,
            name: exercise.nombre,
            reps: exercise.repeticiones
        }));
    };

    // Preparar la lista de ejercicios para el temporizador
    const prepareExercisesForTimer = () => {
        if (exercises.length === 0) {
            return ["Sin ejercicios"]; // Placeholder para cuando no hay ejercicios
        }
        return exercises.map(exercise => exercise.nombre);
    };

    // Función para iniciar el ForTime
    const iniciarForTime = () => {
        console.log(prepareWorkoutData());
        setError(null);
        setComenzar(true);
    };

    // Verificar si hay ejercicios
    const hasExercises = () => {
        return exercises.length > 0;
    };

    return (
        <>
            <div className="fortime-container">
                <h1>Configuración For Time</h1>
                
                {/* Mensaje de error si existe */}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}
                
                <div className="time-limit-card">
                    <h3>Tiempo Objetivo</h3>
                    
                    {/* Switch para tiempo ilimitado */}
                    <div className="switch-container">
                        <label className="switch-label">
                            <input 
                                type="checkbox" 
                                checked={tiempoIlimitado}
                                onChange={handleSwitchChange}
                                className="switch-input"
                            />
                            <span className="switch-slider"></span>
                            Tiempo Ilimitado
                        </label>
                    </div>
                    
                    {/* Control de tiempo (visible solo si no está en modo ilimitado) */}
                    {!tiempoIlimitado && (
                        <div className="input-group">
                            <label>Completar en menos de (Minutos):</label>
                            <div className="input-with-buttons">
                                <button 
                                    className="adjust-btn" 
                                    onClick={() => updateTotalTime('decrease')}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min="1"
                                    value={totalTime}
                                    readOnly
                                    className="time-input"
                                />
                                <button 
                                    className="adjust-btn" 
                                    onClick={() => updateTotalTime('increase')}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Control de rondas objetivo */}
                <div className="time-limit-card">
                    <h3>Rondas Objetivo</h3>
                    <div className="input-group">
                        <label>Número de rondas a completar:</label>
                        <div className="input-with-buttons">
                            <button 
                                className="adjust-btn" 
                                onClick={() => updateTargetRounds('decrease')}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                min="1"
                                value={targetRounds}
                                readOnly
                                className="time-input"
                            />
                            <button 
                                className="adjust-btn" 
                                onClick={() => updateTargetRounds('increase')}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sección de Playlist de Ejercicios */}
                <div className="playlist-section">
                    <h3>Ejercicios</h3>
                    
                    {exercises.length > 0 ? (
                        <div className="playlist-controls">
                            <div className="playlist-info">
                                <p>Ejercicios: {exercises.length}</p>
                            </div>
                            
                            <button 
                                className="playlist-btn edit-btn" 
                                onClick={abrirLibreria}
                            >
                                Editar lista de ejercicios
                            </button>
                            <button 
                                className="playlist-btn delete-btn" 
                                onClick={eliminarPlaylist}
                            >
                                Eliminar playlist
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="add-playlist-btn" 
                            onClick={abrirLibreria}
                        >
                            Agregar lista de ejercicios
                        </button>
                    )}
                </div>

                {/* Lista de ejercicios */}
                <div className='container-lista-ejercicios'>
                    {exercises.map(e => 
                        <div key={e.id} className='item-playlist-ejercicios'>
                            <p className='ejercicio-nombre-fortime'>{e.nombre}</p>
                            <div className='lottie-fortime-container'>
                                <LottieAnimation jsonPath={`./Ejerciciosall/${e.nombre}.json`} />
                            </div>   
                            
                            <div className='container-repeticiones'>
                                <label>Repeticiones</label>
                                <div className='repeticiones-botones'>
                                    <button
                                        className='adjust-btn'
                                        onClick={() => adjustRepeticiones(e.nombre, 'decrease')}
                                    >
                                        -
                                    </button>
                                    <input 
                                        className='repeticiones-input'
                                        min='1' 
                                        value={e.repeticiones || 10} 
                                        onChange={(event) => updateRepeticiones(e.nombre, event.target.value)} 
                                    />
                                    <button
                                        className='adjust-btn'
                                        onClick={() => adjustRepeticiones(e.nombre, 'increase')}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                className="delete-exercise-btn"
                                onClick={() => eliminarEjercicio(e.nombre)}
                            >
                                X
                            </button>
                        </div>
                    )}
                </div>
                
                <button 
                    className="boton-comenzar-fortime" 
                    onClick={iniciarForTime}
                > 
                    Comenzar For Time
                </button>
            </div>
            
            {comenzar &&
                <WorkoutTimer 
                    contador={contador}
                    setContador={setContador}
                    workouts={prepareWorkoutData()} 
                    type={'fortime'} 
                    timeLimit={tiempoIlimitado ? 'ilimitado' : totalTime}
                    targetRounds={targetRounds}
                    setComenzar={setComenzar}
                    {... hasExercises() ? { exercisesList: prepareExercisesForTimer() } : {}}
                />
            }

            {/* Modal de Librería de Ejercicios */}
            {mostrarLibreria && (
                <div className='libreria-overlay'>
                    <button className='cerrar-libreria' onClick={() => setMostrarLibreria(false)}>
                        <MdOutlineKeyboardBackspace />
                    </button>
                    <Libreria
                        maxEjercicios={20}
                        type={'creador-rutina'}
                        onEjercicioSeleccionado={agregarEjercicio}
                        ejerciciosAgregados={exercises}
                    />
                </div>
            )}
        </>
    );
};

export default ForTime;