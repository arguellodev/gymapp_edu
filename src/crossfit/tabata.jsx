import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './tabata.css';
import WorkoutTimer from './cronometro';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import LottieAnimationPlaylist from '../visualizador_lottie/visualizador_playlist';
import LottieAnimation from '../visualizador_lottie/visualizador';
import Libreria from '../libreria/libreria';

// Import tabata data - this will be updated to handle an array of tabatas
import rutinasTabataData from '../data/rutinas_crossfit/tabata/tabata1';

const Tabata = ({ setIndiceAtras }) => {
    const [comenzar, setComenzar] = useState(false);
    const [contador, setContador] = useState(0);
    const [modo, setModo] = useState('Cronometro');
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
    const [rutinasDisponibles, setRutinasDisponibles] = useState([]);
    const [mostrarLibreria, setMostrarLibreria] = useState(false);
    const [verEjercicios, setVerEjercicios] = useState(false);
    const [tabataActual, setTabataActual] = useState(null);
    const [error, setError] = useState(null);
    const [ejerciciosSetlist, setEjerciciosSetlist] = useState(null);
    
    const [tabatas, setTabatas] = useState([
        { 
            id: 1, 
            intervals: 8,
            workTime: 20,
            restTime: 10,
            recoveryTime: 60,
            playlistEjercicios: []
        }
    ]);

    // Load tabata routines from JSON
    useEffect(() => {
        try {
            // Transform the imported data to match the expected structure
            const formattedRutinas = Array.isArray(rutinasTabataData) 
                ? rutinasTabataData.map(rutina => ({
                    rutina_tabata: {
                        nombre: rutina.nombre,
                        descripcion: rutina.descripcion,
                        Tipo: rutina.Tipo,
                        intervalos: rutina.intervalos,
                        descanso: rutina.descanso,
                        trabajo: rutina.trabajo,
                        ejercicios: rutina.ejercicios
                    }
                }))
                : [{ rutina_tabata: rutinasTabataData }];

            setRutinasDisponibles(formattedRutinas);
        } catch (error) {
            console.error("Error loading tabata routines:", error);
            setError("Error al cargar las rutinas de tabata.");
        }
    }, []);

    // Memoize calculations to improve performance
    const duracionTotal = useMemo(() => calcularDuracionTotal(tabatas), [tabatas]);
    
    const agregarEjercicio = useCallback((ejercicio) => {
        if (!tabataActual) return;
        
        setTabatas(prevTabatas => {
            return prevTabatas.map(tabata => {
                if (tabata.id === tabataActual) {
                    // Check if exercise already exists in playlist
                    const ejercicioIndex = tabata.playlistEjercicios.findIndex(e => e.nombre === ejercicio);
                    
                    let nuevaPlaylist;
                    if (ejercicioIndex !== -1) {
                        // If exercise exists, remove it
                        nuevaPlaylist = [...tabata.playlistEjercicios];
                        nuevaPlaylist.splice(ejercicioIndex, 1);
                    } else {
                        // If not, add it
                        const nuevoEjercicio = {
                            id: `ejercicio-${Date.now()}`,
                            nombre: ejercicio
                        };
                        nuevaPlaylist = [...tabata.playlistEjercicios, nuevoEjercicio];
                    }
                    return { ...tabata, playlistEjercicios: nuevaPlaylist };
                }
                return tabata;
            });
        });
    }, [tabataActual]);

    // Reset relevant states when changing mode
    useEffect(() => {
        if (modo === 'Cronometro') {
            setRutinaSeleccionada(null);
        }
        setError(null);
    }, [modo]);

    // Clear error message after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const addTabata = useCallback(() => {
        const newTabataId = tabatas.length + 1;
        setTabatas(prevTabatas => [
            ...prevTabatas,
            {
                id: newTabataId,
                intervals: 8,
                workTime: 20,
                restTime: 10,
                recoveryTime: 60,
                playlistEjercicios: []
            }
        ]);
    }, [tabatas.length]);

    const abrirLibreria = useCallback((tabataId) => {
        setTabataActual(tabataId);
        setMostrarLibreria(true);
    }, []);

    const eliminarPlaylist = useCallback((tabataId) => {
        setTabatas(prevTabatas => 
            prevTabatas.map(tabata => 
                tabata.id === tabataId 
                    ? { ...tabata, playlistEjercicios: [] } 
                    : tabata
            )
        );
    }, []);

    const abrirVisualizadorEjercicios = useCallback((tabataId) => {
        setTabataActual(tabataId);
        setVerEjercicios(true);
    }, []);

    const updateTabataParam = useCallback((id, paramType, changeType) => {
        const paramConfig = {
            intervals: { step: 1, min: 1 },
            workTime: { step: 5, min: 5 },
            restTime: { step: 5, min: 0 },
            recoveryTime: { step: 10, min: 0 }
        };

        const config = paramConfig[paramType];
        if (!config) return;

        setTabatas(prevTabatas => 
            prevTabatas.map(tabata => {
                if (tabata.id === id) {
                    const currentValue = tabata[paramType];
                    const newValue = changeType === 'increase' 
                        ? currentValue + config.step 
                        : Math.max(config.min, currentValue - config.step);
                    return { ...tabata, [paramType]: newValue };
                }
                return tabata;
            })
        );
    }, []);

    const removeTabata = useCallback((id) => {
        setTabatas(prevTabatas => {
            // First filter out the tabata to be removed
            const filteredTabatas = prevTabatas.filter(tabata => tabata.id !== id);
            
            // Then update IDs to be consecutive
            return filteredTabatas.map((tabata, index) => ({
                ...tabata,
                id: index + 1
            }));
        });
    }, []);

    // Validate that all tabatas have the correct number of exercises
    const validarEjercicios = useCallback(() => {
        // In Rutinas mode, we don't need to validate
        if (modo === 'Rutinas' && rutinaSeleccionada) {
            return true;
        }
        
        // Check each tabata
        for (const tabata of tabatas) {
            if (tabata.playlistEjercicios.length > 0 && tabata.playlistEjercicios.length !== tabata.intervals) {
                setError(`Tabata ${tabata.id}: Necesitas ${tabata.intervals} ejercicios, tienes ${tabata.playlistEjercicios.length}`);
                return false;
            }
        }
        return true;
    }, [modo, rutinaSeleccionada, tabatas]);

    // Handle starting tabata with validation
    const handleStartTabata = useCallback(() => {
        if (validarEjercicios()) {
            setError(null);
            setComenzar(true);
        }
    }, [validarEjercicios]);

    // Convert tabatas to workout format for timer
    const prepareWorkoutsForTimer = useCallback(() => {
        // If a routine is selected, use its configuration
        if (rutinaSeleccionada) {
            const rutina = rutinaSeleccionada.rutina_tabata;
            return Array(rutina.intervalos).fill().map((_, i) => ({
                id: i + 1,
                time: rutina.trabajo / 60, // Convert seconds to minutes
                restTime: rutina.descanso / 60, // Convert seconds to minutes
                isWork: true,
                interval: i + 1,
                tabataNumber: 1
            }));
        }
        
        // If no routine is selected, use manual tabata configuration
        let workouts = [];
        let currentId = 1;

        tabatas.forEach((tabata, tabataIndex) => {
            // Add work and rest intervals
            for (let i = 0; i < tabata.intervals; i++) {
                // Add work interval
                workouts.push({
                    id: currentId++,
                    time: tabata.workTime / 60, // Convert seconds to minutes
                    restTime: tabata.restTime / 60, // Convert seconds to minutes
                    isWork: true,
                    interval: i + 1,
                    tabataNumber: tabata.id
                });
            }

            // Add recovery time if not the last tabata
            if (tabataIndex < tabatas.length - 1 && tabata.recoveryTime > 0) {
                workouts.push({
                    id: currentId++,
                    time: tabata.recoveryTime / 60, // Convert seconds to minutes
                    restTime: 0,
                    isRecovery: true,
                    tabataNumber: tabata.id
                });
            }
        });
       
        return workouts;
    }, [rutinaSeleccionada, tabatas]);

    // Prepare exercise list for timer
    const prepareExercisesForTimer = useCallback(() => {
        if (rutinaSeleccionada) {
            return rutinaSeleccionada.rutina_tabata.ejercicios || [];
        }
    
        // If no routine is selected, return an array of exercise name arrays
        return tabatas.reduce((acc, tabata) => {
            const exercises = tabata.playlistEjercicios.map(e => e.nombre);
            return [...acc, ...exercises];
        }, []);
    }, [rutinaSeleccionada, tabatas]);
    
    const handleStartRutina = useCallback((rutina) => {
        setRutinaSeleccionada(rutina);
        setComenzar(true);
    }, []);

    // Calculate total duration of a tabata
    function calcularDuracionTabata(tabata) {
        return ((tabata.workTime + tabata.restTime) * tabata.intervals) / 60;
    }

    // Calculate total duration of all tabatas
    function calcularDuracionTotal(tabatasArray) {
        let duracionTotal = 0;
        tabatasArray.forEach((tabata, index) => {
            duracionTotal += calcularDuracionTabata(tabata);
            // Add recovery time if not the last tabata
            if (index < tabatasArray.length - 1) {
                duracionTotal += tabata.recoveryTime / 60;
            }
        });
        return duracionTotal.toFixed(2);
    }

    // Handler for showing exercise setlist
    const handleShowExercises = useCallback((exercisesList) => {
        setEjerciciosSetlist(exercisesList);
        setVerEjercicios(true);
    }, []);

    return (
        <>
            <div className="tabata-container">
                <h1>Configuración Tabata</h1>
                <div className='selector-modo'>
                    <button 
                        className={modo === 'Cronometro' ? 'boton-modo-activado': 'boton-modo'}
                        onClick={() => setModo('Cronometro')}
                    >
                        Cronometro 
                    </button>
                    <button 
                        className={modo === 'Rutinas' ? 'boton-modo-activado': 'boton-modo'}
                        onClick={() => {setModo('Rutinas'); setTabataActual(null)}}
                    >
                        Rutinas 
                    </button>
                </div>
                
                {/* Show error message if exists */}
                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}
                
                {modo === 'Cronometro' ? (
                    <div>
                        {tabatas.map((tabata) => (
                            <div key={tabata.id} className="tabata-card">
                                <div className="tabata-header">
                                    <h3>Tabata {tabata.id}</h3>
                                    {tabata.id > 1 && (
                                        <button 
                                            className="remove-tabata-btn" 
                                            onClick={() => removeTabata(tabata.id)}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                                <div className="tabata-inputs">
                                    <div className="input-group-tabata">
                                        <label htmlFor={`intervals-${tabata.id}`}>Intervalos:</label>
                                        <div className="input-with-buttons">
                                            <button 
                                                className="adjust-btn" 
                                                onClick={() => updateTabataParam(tabata.id, 'intervals', 'decrease')}
                                            >
                                                -
                                            </button>
                                            <input
                                                id={`intervals-${tabata.id}`}
                                                type="number"
                                                min="1"
                                                value={tabata.intervals}
                                                readOnly
                                                className="intervals-input"
                                            />
                                            <button 
                                                className="adjust-btn" 
                                                onClick={() => updateTabataParam(tabata.id, 'intervals', 'increase')}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="input-group-tabata">
                                        <label htmlFor={`work-${tabata.id}`}>Tiempo de trabajo:</label>
                                        <div className="input-with-buttons">
                                            <button 
                                                className="adjust-btn" 
                                                onClick={() => updateTabataParam(tabata.id, 'workTime', 'decrease')}
                                            >
                                                -
                                            </button>
                                            <input
                                                id={`work-${tabata.id}`}
                                                type="string"
                                                min="5"
                                                step="5"
                                                value={`${tabata.workTime}s`}
                                                readOnly
                                                className="work-input"
                                            />
                                            <button 
                                                className="adjust-btn"
                                                onClick={() => updateTabataParam(tabata.id, 'workTime', 'increase')}
                                            >
                                                +
                                            </button>
                                        </div>
                                        
                                    </div>
                                    <div className="input-group-tabata">
                                        <label htmlFor={`rest-${tabata.id}`}>Tiempo de descanso:</label>
                                        <div className="input-with-buttons">
                                            <button 
                                                className="adjust-btn" 
                                                onClick={() => updateTabataParam(tabata.id, 'restTime', 'decrease')}
                                            >
                                                -
                                            </button>
                                            <input
                                                id={`rest-${tabata.id}`}
                                                type="string"
                                                min="0"
                                                step="5"
                                                value={`${tabata.restTime}s`}
                                                readOnly
                                                className="rest-input"
                                            />
                                            <button 
                                                className="adjust-btn" 
                                                onClick={() => updateTabataParam(tabata.id, 'restTime', 'increase')}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    {tabata.id < tabatas.length && (
                                        <div className="input-group">
                                            <label htmlFor={`recovery-${tabata.id}`}>Tiempo de recuperación (segundos):</label>
                                            <div className="input-with-buttons">
                                                <button 
                                                    className="adjust-btn" 
                                                    onClick={() => updateTabataParam(tabata.id, 'recoveryTime', 'decrease')}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    id={`recovery-${tabata.id}`}
                                                    type="number"
                                                    min="0"
                                                    step="10"
                                                    value={tabata.recoveryTime}
                                                    readOnly
                                                    className="recovery-input"
                                                />
                                                <button 
                                                    className="adjust-btn" 
                                                    onClick={() => updateTabataParam(tabata.id, 'recoveryTime', 'increase')}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="tabata-summary">
                                    <p>Duración total: {calcularDuracionTabata(tabata)} minutos</p>
                                    <p className={tabata.playlistEjercicios.length === tabata.intervals ? "status-ok" : "status-warning"}>
                                        {tabata.playlistEjercicios.length > 0 && (
                                            `Ejercicios: ${tabata.playlistEjercicios.length}/${tabata.intervals}`
                                        )}
                                    </p>
                                </div>
                                {tabata.playlistEjercicios.length > 0 ? (
                                    <div className="playlist-controls">
                                        <button 
                                            className="playlist-btn view-btn" 
                                            onClick={() => abrirVisualizadorEjercicios(tabata.id)}
                                        >
                                            Ver ejercicios
                                        </button>
                                        <button 
                                            className="playlist-btn edit-btn" 
                                            onClick={() => abrirLibreria(tabata.id)}
                                        >
                                            Editar lista de ejercicios
                                        </button>
                                        <button 
                                            className="playlist-btn delete-btn" 
                                            onClick={() => eliminarPlaylist(tabata.id)}
                                        >
                                            Eliminar playlist
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        className="add-playlist-btn" 
                                        onClick={() => abrirLibreria(tabata.id)}
                                    >
                                        Agregar lista de ejercicios
                                    </button>
                                )}
                            </div>
                        ))}
                        
                        <button 
                            className="add-tabata-btn" 
                            onClick={addTabata}
                        >
                            + Agregar Tabata
                        </button>
                        
                        <button 
                            className='boton-comenzar-tabata' 
                            onClick={handleStartTabata}
                        > 
                            Comenzar Tabata
                        </button>
                    </div>
                ) : (
                    <div className="rutinas-tabata-section">
                        {rutinasDisponibles.map((rutina, index) => (
                            <div key={index} className='rutinas-tabata-container'>
                                <div className="rutinas-tabata-header">
                                    <h2>{rutina.rutina_tabata.nombre}</h2>
                                    <p className="rutinas-tabata-description">{rutina.rutina_tabata.descripcion}</p>
                                    <div className="rutinas-tabata-badge">{rutina.rutina_tabata.Tipo}</div>
                                </div>
                                
                                <div className="tabata-info">
                                    <div className="tabata-info-item">
                                        <span className="tabata-info-label">Intervalos:</span>
                                        <span className="tabata-info-value">{rutina.rutina_tabata.intervalos}</span>
                                    </div>
                                    <div className="tabata-info-item">
                                        <span className="tabata-info-label">Trabajo:</span>
                                        <span className="tabata-info-value">{rutina.rutina_tabata.trabajo}s</span>
                                    </div>
                                    <div className="tabata-info-item">
                                        <span className="tabata-info-label">Descanso:</span>
                                        <span className="tabata-info-value">{rutina.rutina_tabata.descanso}s</span>
                                    </div>
                                    <div className="tabata-info-item">
                                        <span className="tabata-info-label">Duración:</span>
                                        <span className="tabata-info-value">
                                            {((rutina.rutina_tabata.trabajo + rutina.rutina_tabata.descanso) * 
                                              rutina.rutina_tabata.intervalos / 60).toFixed(2)} min
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="tabata-exercises-container">
                                    <button 
                                        className='playlist-btn view-btn'
                                        onClick={() => handleShowExercises(rutina.rutina_tabata.ejercicios)}
                                    >
                                        Ver ejercicios
                                    </button>
                                    <button 
                                        className="boton-comenzar-tabata"
                                        onClick={() => handleStartRutina(rutina)}
                                    >
                                        Iniciar Rutina
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {comenzar && (
                <WorkoutTimer 
                    workouts={prepareWorkoutsForTimer()} 
                    type={'tabata'} 
                    contador={contador} 
                    setContador={setContador} 
                    setComenzar={setComenzar}
                    exercisesList={prepareExercisesForTimer()}
                />
            )}
            
            {mostrarLibreria && (
                <div className='libreria-overlay'>
                    <button className='cerrar-libreria' onClick={() => setMostrarLibreria(false)}>
                        <MdOutlineKeyboardBackspace />
                    </button>
                    <Libreria
                        maxEjercicios={tabataActual ? tabatas.find(t => t.id === tabataActual).intervals : 8}
                        type={'creador-rutina'}
                        onEjercicioSeleccionado={agregarEjercicio}
                        ejerciciosAgregados={tabataActual ? 
                            tabatas.find(t => t.id === tabataActual).playlistEjercicios : []}
                    />
                </div>
            )}
            
            {verEjercicios && (
                tabataActual ?
                <LottieAnimationPlaylist 
                    jsonPaths={tabatas.find(t => t.id === tabataActual).playlistEjercicios} 
                    setLottieVentana={setVerEjercicios}
                />
                : ejerciciosSetlist !== null && 
                <LottieAnimationPlaylist 
                    jsonPaths={ejerciciosSetlist.map((nombre, index) => ({
                        id: index + 1,
                        nombre: nombre
                    }))} 
                    setLottieVentana={setVerEjercicios}
                />
            )}
        </>
    );
};

export default Tabata;