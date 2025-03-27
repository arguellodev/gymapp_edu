import React, { useState, useCallback } from 'react';
import './emom.css';
import WorkoutTimer from './cronometro';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import LottieAnimationPlaylist from '../visualizador_lottie/visualizador_playlist';
import Libreria from '../libreria/libreria';
import LottieAnimation from '../visualizador_lottie/visualizador';

const Emom = () => {
    const [comenzar, setComenzar] = useState(false);
    const [totalMinutes, setTotalMinutes] = useState(10);
    const [mostrarLibreria, setMostrarLibreria] = useState(false);
    const [playlistEjercicios, setPlaylistEjercicios] = useState([]);
    const [error, setError] = useState(null);

    // Función para ajustar el tiempo total
    const updateTotalTime = (changeType) => {
        setTotalMinutes(prev => 
            changeType === 'increase' ? prev + 1 : Math.max(1, prev - 1)
        );
    };

    // Función para abrir/cerrar la librería
    const toggleLibreria = useCallback(() => {
        setMostrarLibreria(prev => !prev);
    }, []);

    // Función para eliminar la playlist completa
    const eliminarPlaylist = useCallback(() => {
        setPlaylistEjercicios([]);
    }, []);

    // Función para agregar/remover ejercicio
    const agregarEjercicio = useCallback((ejercicio) => {
        setPlaylistEjercicios(prev => {
            const ejercicioIndex = prev.findIndex(e => e.nombre === ejercicio);
            
            if (ejercicioIndex !== -1) {
                // Si existe, lo eliminamos
                return prev.filter((_, index) => index !== ejercicioIndex);
            } else {
                // Si no existe, lo agregamos con repeticiones iniciales
                return [
                    ...prev, 
                    {
                        id: `ejercicio-${Date.now()}`,
                        nombre: ejercicio,
                        repeticiones: 10
                    }
                ];
            }
        });
    }, []);

    // Actualizar repeticiones de un ejercicio
    const updateRepeticiones = (newValue, nombreEjercicio) => {
        const repeticiones = parseInt(newValue);
        if (isNaN(repeticiones) || repeticiones < 1) return;
        
        setPlaylistEjercicios(prev => 
            prev.map(ejercicio => 
                ejercicio.nombre === nombreEjercicio 
                    ? { ...ejercicio, repeticiones } 
                    : ejercicio
            )
        );
    };

    // Ajustar repeticiones (incrementar/decrementar)
    const adjustRepeticiones = (nombreEjercicio, changeType) => {
        setPlaylistEjercicios(prev => 
            prev.map(ejercicio => {
                if (ejercicio.nombre === nombreEjercicio) {
                    return {
                        ...ejercicio,
                        repeticiones: changeType === 'increase' 
                            ? ejercicio.repeticiones + 1 
                            : Math.max(1, ejercicio.repeticiones - 1)
                    };
                }
                return ejercicio;
            })
        );
    };

    // Eliminar un ejercicio específico
    const eliminarEjercicio = (nombreEjercicio) => {
        setPlaylistEjercicios(prev => 
            prev.filter(ejercicio => ejercicio.nombre !== nombreEjercicio)
        );
    };

    // Preparar datos para el temporizador
    const prepareWorkoutData = () => {
        // Si no hay playlist, creamos minutos vacíos
        if (playlistEjercicios.length === 0) {
            return Array(totalMinutes).fill().map((_, i) => ({
                id: i + 1,
                time: 1,
                exercise: null,
                restTime: 0
            }));
        }
        
        // Si hay playlist, verificamos que coincida con los minutos
        if (playlistEjercicios.length !== totalMinutes) {
            return { error: "El número de ejercicios debe coincidir con los minutos" };
        }
        
        // Creamos los datos del workout
        return playlistEjercicios.map((ejercicio, index) => ({
            id: index + 1,
            time: 1,
            exercise: {
                id: ejercicio.id,
                name: ejercicio.nombre,
                reps: ejercicio.repeticiones
            },
            restTime: 0
        }));
    };

    // Iniciar el EMOM
    const iniciarEmom = () => {
        const workoutData = prepareWorkoutData();
        
        if (workoutData.error) {
            setError(workoutData.error);
            return;
        }
        
        setError(null);
        setComenzar(true);
    };

    // Verificar si se puede iniciar el EMOM
    const canStartEmom = () => {
        return playlistEjercicios.length === 0 || 
               playlistEjercicios.length === totalMinutes;
    };

    return (
        <>
            <div className="emom-container">
                <h1>Configuración EMOM</h1>
                
                {error && (
                    <div className="error-message">
                        {error}
                        <button onClick={() => setError(null)}>Cerrar</button>
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
                
                {/* Sección de Playlist */}
                <div className="playlist-section">
                    {playlistEjercicios.length > 0 ? (
                        <div className="playlist-controls">
                            <div className="playlist-info">
                                <p>Ejercicios: {playlistEjercicios.length}</p>
                                <p>Minutos: {totalMinutes}</p>
                                {playlistEjercicios.length !== totalMinutes && (
                                    <p className="warning-text">
                                        {playlistEjercicios.length > totalMinutes 
                                            ? `Elimina ${playlistEjercicios.length - totalMinutes} ejercicio(s) o añade ${totalMinutes - playlistEjercicios.length} minuto(s)`
                                            : `Añade ${totalMinutes - playlistEjercicios.length} ejercicio(s) o reduce ${playlistEjercicios.length} minuto(s)`}
                                    </p>
                                )}
                            </div>
                            <button 
                                className="playlist-btn edit-btn" 
                                onClick={toggleLibreria}
                            >
                                Editar lista
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
                            onClick={toggleLibreria}
                        >
                            Agregar lista de ejercicios
                        </button>
                    )}
                </div>
                
                {/* Lista de ejercicios */}
                {playlistEjercicios.length > 0 && (
                    <div className='container-lista-ejercicios'>
                        {playlistEjercicios.map(e => (
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
                                            value={e.repeticiones} 
                                            onChange={(e) => updateRepeticiones(e.target.value, e.nombre)} 
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
                        ))}
                    </div>
                )}
                
                {/* Botón para iniciar */}
                <button 
                    className={`boton-comenzar-emom ${!canStartEmom() ? 'disabled' : ''}`}
                    onClick={iniciarEmom}
                    disabled={!canStartEmom()}
                >
                    Comenzar EMOM
                </button>
            </div>
            
            {/* Timer */}
            {comenzar && (
                <WorkoutTimer 
                    workouts={prepareWorkoutData()}
                    type={'EMOM'}
                    setComenzar={setComenzar}
                    exercisesList={playlistEjercicios.length > 0 
                        ? playlistEjercicios.map(e => e.nombre) 
                        : null}
                />
            )}
            
            {/* Librería de ejercicios */}
            {mostrarLibreria && (
                <div className='libreria-overlay'>
                    <button className='cerrar-libreria' onClick={toggleLibreria}>
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