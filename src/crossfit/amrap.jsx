import React, { useState, useCallback } from 'react';
import './amrap.css';
import WorkoutTimer from './cronometro';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Libreria from '../libreria/libreria';
import LottieAnimation from '../visualizador_lottie/visualizador';

const Amrap = ({setIndiceAtras}) => {
    
    
    const [comenzar, setComenzar] = useState(false);
    const [rounds, setRounds] = useState([
        { id: 1, time: 10, restTime: 0, exercises: [] }
    ]);
    const [mostrarLibreria, setMostrarLibreria] = useState(false);
    const [currentRoundId, setCurrentRoundId] = useState(null);
    const [error, setError] = useState(null);

    // Función para agregar una nueva ronda
    const addRound = () => {
        const newRoundId = rounds.length + 1;
        setRounds([
            ...rounds, 
            { 
                id: newRoundId, 
                restTime: 2,
                time: 10,
                exercises: []
            }
        ]);
    };

    // Función para actualizar el tiempo de trabajo
    const updateRoundTime = (id, changeType) => {
        const updatedRounds = rounds.map(round => {
            if (round.id === id) {
                const newTime = changeType === 'increase' 
                    ? round.time + 1 
                    : Math.max(1, round.time - 1);
                return { ...round, time: newTime };
            }
            return round;
        });
        setRounds(updatedRounds);
    };

    // Función para actualizar el tiempo de descanso
    const updateRestTime = (id, changeType) => {
        const updatedRounds = rounds.map(round => {
            if (round.id === id) {
                const newRestTime = changeType === 'increase' 
                    ? round.restTime + 1 
                    : Math.max(0, round.restTime - 1);
                return { ...round, restTime: newRestTime };
            }
            return round;
        });
        setRounds(updatedRounds);
    };

    // Función para eliminar una ronda
    const removeRound = (id) => {
        // Primero filtrar la ronda que se va a eliminar
        const filteredRounds = rounds.filter(round => round.id !== id);
        
        // Luego actualizar los IDs para que sean consecutivos
        const updatedRounds = filteredRounds.map((round, index) => ({
            ...round,
            id: index + 1
        }));
        
        setRounds(updatedRounds);
    };

    // Función para abrir la librería de ejercicios para una ronda específica
    const abrirLibreriaParaRonda = (roundId) => {
        setCurrentRoundId(roundId);
        setMostrarLibreria(true);
    };

    // Función para agregar o quitar un ejercicio de la playlist de una ronda
    const agregarEjercicio = useCallback((ejercicio) => {
        if (!currentRoundId) return;
        
        setRounds(prevRounds => {
            return prevRounds.map(round => {
                if (round.id === currentRoundId) {
                    // Verificar si el ejercicio ya existe en la playlist
                    const ejercicioIndex = round.exercises.findIndex(e => e.nombre === ejercicio);
                    
                    let nuevaPlaylist;
                    if (ejercicioIndex !== -1) {
                        // Si el ejercicio existe, lo eliminamos
                        nuevaPlaylist = [...round.exercises];
                        nuevaPlaylist.splice(ejercicioIndex, 1);
                    } else {
                        // Si no existe, lo agregamos con repeticiones inicializadas en 10
                        const nuevoEjercicio = {
                            id: `ejercicio-${Date.now()}`,
                            nombre: ejercicio,
                            repeticiones: 10
                        };
                        nuevaPlaylist = [...round.exercises, nuevoEjercicio];
                    }
                    return { ...round, exercises: nuevaPlaylist };
                }
                return round;
            });
        });
    }, [currentRoundId]);

    // Función para actualizar las repeticiones de un ejercicio
    const updateRepeticiones = (roundId, nombreEjercicio, newValue) => {
        // Validamos que sea un número válido
        const repeticiones = parseInt(newValue);
        if (isNaN(repeticiones) || repeticiones < 1) return;
        
        setRounds(prevRounds => {
            return prevRounds.map(round => {
                if (round.id === roundId) {
                    const nuevaPlaylist = round.exercises.map(ejercicio => {
                        if (ejercicio.nombre === nombreEjercicio) {
                            return { ...ejercicio, repeticiones: repeticiones };
                        }
                        return ejercicio;
                    });
                    return { ...round, exercises: nuevaPlaylist };
                }
                return round;
            });
        });
    };

    // Función para incrementar o decrementar repeticiones
    const adjustRepeticiones = (roundId, nombreEjercicio, changeType) => {
        setRounds(prevRounds => {
            return prevRounds.map(round => {
                if (round.id === roundId) {
                    const nuevaPlaylist = round.exercises.map(ejercicio => {
                        if (ejercicio.nombre === nombreEjercicio) {
                            const nuevasReps = changeType === 'increase' 
                                ? ejercicio.repeticiones + 1 
                                : Math.max(1, ejercicio.repeticiones - 1);
                            return { ...ejercicio, repeticiones: nuevasReps };
                        }
                        return ejercicio;
                    });
                    return { ...round, exercises: nuevaPlaylist };
                }
                return round;
            });
        });
    };

    // Función para eliminar un ejercicio específico de la playlist
    const eliminarEjercicio = (roundId, nombreEjercicio) => {
        setRounds(prevRounds => {
            return prevRounds.map(round => {
                if (round.id === roundId) {
                    const nuevaPlaylist = round.exercises.filter(
                        ejercicio => ejercicio.nombre !== nombreEjercicio
                    );
                    return { ...round, exercises: nuevaPlaylist };
                }
                return round;
            });
        });
    };

    // Función para eliminar todos los ejercicios de una ronda
    const eliminarPlaylist = (roundId) => {
        setRounds(prevRounds => {
            return prevRounds.map(round => {
                if (round.id === roundId) {
                    return { ...round, exercises: [] };
                }
                return round;
            });
        });
    };

    // Preparar los datos para el temporizador
    const prepareWorkoutData = () => {
        // Verificar si todas las rondas tienen al menos un ejercicio
        const rondasVacias = rounds.filter(round => round.exercises.length === 0);
        if (rondasVacias.length > 0) {
            setError(`La ronda ${rondasVacias[0].id} no tiene ejercicios. Agrega al menos un ejercicio a cada ronda.`);
            return null;
        }
        
        // Preparamos los datos en formato adecuado para el temporizador
        const workoutData = rounds.map(round => {
            return {
                id: round.id,
                time: round.time,
                restTime: round.restTime,
                exercises: round.exercises.map(exercise => ({
                    id: exercise.id,
                    name: exercise.nombre,
                    reps: exercise.repeticiones
                }))
            };
        });
        
        return workoutData;
    };
    
    // Preparar la lista de ejercicios para el temporizador (array de arrays)
    const prepareExercisesForTimer = () => {
        // Creamos un array donde cada elemento es una lista de nombres de ejercicios para cada ronda
        return rounds.map(round => 
            round.exercises.map(exercise => exercise.nombre)
        );
    };

    // Función para iniciar el AMRAP
    const iniciarAmrap = () => {
        console.log(prepareExercisesForTimer());
        // Verificamos que todas las rondas tengan ejercicios
        const rondasVacias = rounds.filter(round => round.exercises.length === 0);
        if (rondasVacias.length > 0) {
            setError(`La ronda ${rondasVacias[0].id} no tiene ejercicios. Agrega al menos un ejercicio a cada ronda.`);
            return;
        }
        
        setError(null);
        setComenzar(true);
    };

    return (
      <>
        <div className="amrap-container">
            <h1>Configuración AMRAP</h1>
            
            {/* Mensaje de error si existe */}
            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}
            
            {rounds.map((round) => (
                <div key={round.id} className="round-card">
                    <div className="round-header">
                        <h3>Ronda {round.id}</h3>
                        {round.id > 1 && (
                            <button 
                                className="remove-round-btn" 
                                onClick={() => removeRound(round.id)}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <div className="round-inputs">
                        <div className="input-group">
                            <label htmlFor={`time-${round.id}`}>Tiempo de trabajo (Minutos):</label>
                            <div className="input-with-buttons">
                                <button 
                                    className="adjust-btn" 
                                    onClick={() => updateRoundTime(round.id, 'decrease')}
                                >
                                    -
                                </button>
                                <input
                                    id={`time-${round.id}`}
                                    type="number"
                                    min="1"
                                    value={round.time}
                                    readOnly
                                    className="time-input"
                                />
                                <button 
                                    className="adjust-btn" 
                                    onClick={() => updateRoundTime(round.id, 'increase')}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        {round.id > 1 && (
                            <div className="input-group">
                                <label htmlFor={`rest-${round.id}`}>Tiempo de descanso (Minutos):</label>
                                <div className="input-with-buttons">
                                    <button 
                                        className="adjust-btn" 
                                        onClick={() => updateRestTime(round.id, 'decrease')}
                                    >
                                        -
                                    </button>
                                    <input
                                        id={`rest-${round.id}`}
                                        type="number"
                                        min="0"
                                        value={round.restTime}
                                        readOnly
                                        className="rest-input"
                                    />
                                    <button 
                                        className="adjust-btn" 
                                        onClick={() => updateRestTime(round.id, 'increase')}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección de Playlist de Ejercicios para cada ronda */}
                    <div className="playlist-section">
                        <h4>Ejercicios de la Ronda {round.id}</h4>
                        
                        {round.exercises.length > 0 ? (
                            <div className="playlist-controls">
                                <div className="playlist-info">
                                    <p>Ejercicios: {round.exercises.length}</p>
                                </div>
                                
                                <button 
                                    className="playlist-btn edit-btn" 
                                    onClick={() => abrirLibreriaParaRonda(round.id)}
                                >
                                    Editar lista de ejercicios
                                </button>
                                <button 
                                    className="playlist-btn delete-btn" 
                                    onClick={() => eliminarPlaylist(round.id)}
                                >
                                    Eliminar playlist
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="add-playlist-btn" 
                                onClick={() => abrirLibreriaParaRonda(round.id)}
                            >
                                Agregar lista de ejercicios
                            </button>
                        )}
                    </div>

                    {/* Lista de ejercicios de la ronda */}
                    <div className='container-lista-ejercicios'>
                        {round.exercises.map(e => 
                            <div key={e.id} className='item-playlist-ejercicios'>
                                <p className='ejercicio-nombre-amrap'>{e.nombre}</p>
                                <div className='lottie-amrap-container'>
                                    <LottieAnimation jsonPath={`./Ejerciciosall/${e.nombre}.json`} />
                                </div>   
                                
                                <div className='container-repeticiones'>
                                    <label>Repeticiones</label>
                                    <div className='repeticiones-botones'>
                                        <button
                                            className='adjust-btn'
                                            onClick={() => adjustRepeticiones(round.id, e.nombre, 'decrease')}
                                        >
                                            -
                                        </button>
                                        <input 
                                            className='repeticiones-input'
                                            min='1' 
                                            value={e.repeticiones || 10} 
                                            onChange={(event) => updateRepeticiones(round.id, e.nombre, event.target.value)} 
                                        />
                                        <button
                                            className='adjust-btn'
                                            onClick={() => adjustRepeticiones(round.id, e.nombre, 'increase')}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    className="delete-exercise-btn"
                                    onClick={() => eliminarEjercicio(round.id, e.nombre)}
                                >
                                    X
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            <button 
                className="add-round-btn" 
                onClick={addRound}
            >
                + Agregar Ronda
            </button>
            
            <button 
                className='boton-comenzar-amrap' 
                onClick={iniciarAmrap}
                disabled={rounds.some(round => round.exercises.length === 0)}
            > 
                Comenzar AMRAP
            </button>
        </div>
        
        {comenzar &&
            <WorkoutTimer 
                workouts={prepareWorkoutData()}
                type={'AMRAP'} 
                setComenzar={setComenzar}
                exercisesList={prepareExercisesForTimer()} // Pasamos la lista de ejercicios por ronda
            />
        }
       
        {/* Modal de Librería de Ejercicios */}
        {mostrarLibreria && currentRoundId && (
            <div className='libreria-overlay'>
                <button className='cerrar-libreria' onClick={() => setMostrarLibreria(false)}>
                    <MdOutlineKeyboardBackspace />
                </button>
                <Libreria
                    maxEjercicios={20} // Puedes ajustar este valor según tus necesidades
                    type={'creador-rutina'}
                    onEjercicioSeleccionado={agregarEjercicio}
                    ejerciciosAgregados={rounds.find(r => r.id === currentRoundId)?.exercises || []}
                />
            </div>
        )}
      </>
    );
};

export default Amrap;