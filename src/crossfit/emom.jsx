import React, { useState, useCallback } from 'react';
import './emom.css';
import WorkoutTimer from './cronometro';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import LottieAnimationPlaylist from '../visualizador_lottie/visualizador_playlist';
import Libreria from '../libreria/libreria';
import LottieAnimation from '../visualizador_lottie/visualizador';

const Emom = ({setIndiceAtras}) => {
    const [comenzar, setComenzar] = useState(false);
    const [contador, setContador] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(10);
    const [exercises, setExercises] = useState([
        { id: 1, name: "Ejercicio 1", reps: 10 }
    ]);
    
    // Nuevos estados para manejar la playlist de ejercicios
    const [mostrarLibreria, setMostrarLibreria] = useState(false);
    const [playlistEjercicios, setPlaylistEjercicios] = useState([]);
    const [error, setError] = useState(null);

    // Función para ajustar el tiempo total del EMOM
    const updateTotalTime = (changeType) => {
        setTotalMinutes(prev => 
            changeType === 'increase' ? prev + 1 : Math.max(1, prev - 1)
        );
    };

    // Función para agregar un nuevo ejercicio
    const addExercise = () => {
        const newExerciseId = exercises.length + 1;
        setExercises([
            ...exercises,
            {
                id: newExerciseId,
                name: `Ejercicio ${newExerciseId}`,
                reps: 10
            }
        ]);
    };

    // Función para actualizar el nombre del ejercicio
    const updateExerciseName = (id, newName) => {
        const updatedExercises = exercises.map(exercise => {
            if (exercise.id === id) {
                return { ...exercise, name: newName };
            }
            return exercise;
        });
        setExercises(updatedExercises);
    };

    // Función para abrir la librería de ejercicios
    const abrirLibreria = useCallback(() => {
        setMostrarLibreria(true);
    }, []);

    // Función para eliminar la playlist completa
    const eliminarPlaylist = useCallback(() => {
        setPlaylistEjercicios([]);
    }, []);

    // Función para ver los ejercicios seleccionados
    const abrirVisualizadorEjercicios = useCallback(() => {
        setVerEjercicios(true);
    }, []);

    // FUNCIÓN MEJORADA: Agregar ejercicio a la playlist con inicialización de repeticiones
    const agregarEjercicio = useCallback((ejercicio) => {
        // Verificar si el ejercicio ya existe en la playlist
        const ejercicioIndex = playlistEjercicios.findIndex(e => e.nombre === ejercicio);
        
        let nuevaPlaylist;
        if (ejercicioIndex !== -1) {
            // Si el ejercicio existe, lo eliminamos
            nuevaPlaylist = [...playlistEjercicios];
            nuevaPlaylist.splice(ejercicioIndex, 1);
        } else {
            // Si no existe, lo agregamos con repeticiones inicializadas en 10
            const nuevoEjercicio = {
                id: `ejercicio-${Date.now()}`,
                nombre: ejercicio,
                repeticiones: 10 // Inicializamos las repeticiones en 10
            };
            nuevaPlaylist = [...playlistEjercicios, nuevoEjercicio];
        }
        setPlaylistEjercicios(nuevaPlaylist);
    }, [playlistEjercicios]);

    // NUEVA FUNCIÓN: Actualizar las repeticiones de un ejercicio
    const updateRepeticiones = (newValue, nombreEjercicio) => {
        // Validamos que sea un número válido
        const repeticiones = parseInt(newValue);
        if (isNaN(repeticiones) || repeticiones < 1) return;
        
        // Actualizamos el ejercicio en la playlist
        const nuevaPlaylist = playlistEjercicios.map(ejercicio => {
            if (ejercicio.nombre === nombreEjercicio) {
                return { ...ejercicio, repeticiones: repeticiones };
            }
            return ejercicio;
        });
        
        setPlaylistEjercicios(nuevaPlaylist);
    };

    // NUEVA FUNCIÓN: Incrementar o decrementar repeticiones
    const adjustRepeticiones = (nombreEjercicio, changeType) => {
        const nuevaPlaylist = playlistEjercicios.map(ejercicio => {
            if (ejercicio.nombre === nombreEjercicio) {
                const nuevasReps = changeType === 'increase' 
                    ? ejercicio.repeticiones + 1 
                    : Math.max(1, ejercicio.repeticiones - 1);
                return { ...ejercicio, repeticiones: nuevasReps };
            }
            return ejercicio;
        });
        
        setPlaylistEjercicios(nuevaPlaylist);
    };

    // NUEVA FUNCIÓN: Eliminar un ejercicio específico de la playlist
    const eliminarEjercicio = (nombreEjercicio) => {
        const nuevaPlaylist = playlistEjercicios.filter(
            ejercicio => ejercicio.nombre !== nombreEjercicio
        );
        setPlaylistEjercicios(nuevaPlaylist);
    };

    // Preparar los datos para el temporizador
    const prepareWorkoutData = () => {
        // Para EMOM necesitamos crear un array donde cada elemento represente 1 minuto
        // con el ejercicio correspondiente
        let workoutData = [];
        
        // Verificar si tenemos ejercicios en la playlist
        if (playlistEjercicios.length !== totalMinutes) {
            setError("El tiempo en minutos y el número de ejercicios deben coincidir");
            return null;
        }
        
        for (let i = 0; i < totalMinutes; i++) {
            const exerciseIndex = i % playlistEjercicios.length;
            const currentExercise = playlistEjercicios[exerciseIndex];
            
            workoutData.push({
                id: i + 1,
                time: 1, // Cada ronda es de 1 minuto
                exercise: {
                    id: currentExercise.id,
                    name: currentExercise.nombre,
                    reps: currentExercise.repeticiones
                },
                restTime: 0 // No hay descanso explícito en EMOM
            });
        }
        
        return workoutData;
    };

    // Preparar los ejercicios para el temporizador si hay una playlist
    const prepareExercisesForTimer = () => {
        if (playlistEjercicios.length > 0) {
            return playlistEjercicios.map(e => e.nombre);
        }
        return null;
    };

    // Función para iniciar el EMOM
    const iniciarEmom = () => {
        // Verificamos que tengamos ejercicios
        if (playlistEjercicios.length !== totalMinutes) {
            setError("El número de minutos y de ejercicios deben coincidir");
            return;
        }
        
        setError(null);
        setComenzar(true);
    };

    return (
        <>
            <div className="emom-container">
                <h1>Configuración EMOM</h1>
                
                {/* Mensaje de error si existe */}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}
                
                {/* Total de minutos */}
                <div className="total-time-card">
                    <h3>Duración Total (minutos)</h3>
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
                            value={totalMinutes}
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
                                      
                
                {/* Sección de Playlist de Ejercicios */}
                <div className="playlist-section">
                    
                    
                    {playlistEjercicios.length > 0 ? (
                        <div className="playlist-controls">
                            <div className="playlist-info">
                                <p>Ejercicios: {playlistEjercicios.length}</p>
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
                <div className='container-lista-ejercicios'>
                    {playlistEjercicios.map(e => 
                        <div key={e.id} className='item-playlist-ejercicios'>
                            <p className='ejercicio-nombre-emom'>{e.nombre}</p>
                            <div className='lottie-emom-container'>
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
                                        onChange={(event) => updateRepeticiones(event.target.value, e.nombre)} 
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
                    className='boton-comenzar-emom' 
                    onClick={iniciarEmom}
                    disabled={playlistEjercicios.length === 0}
                >
                    Comenzar EMOM
                </button>
            </div>
            
            {comenzar &&
                <WorkoutTimer 
                    workouts={prepareWorkoutData()}
                    type={'EMOM'}
                    contador={contador}
                    setContador={setContador}
                    setComenzar={setComenzar}
                    exercisesList={prepareExercisesForTimer()}
                />
            }
            
            {/* Modal de Librería de Ejercicios */}
            {mostrarLibreria && (
                <div className='libreria-overlay'>
                    <button className='cerrar-libreria' onClick={() => setMostrarLibreria(false)}>
                        <MdOutlineKeyboardBackspace />
                    </button>
                    <Libreria
                        maxEjercicios={totalMinutes}
                        type={'creador-rutina'}
                        onEjercicioSeleccionado={agregarEjercicio}
                        ejerciciosAgregados={playlistEjercicios}
                    />
                </div>
            )}
            
           
        </>
    );
};

export default Emom;