import React, { useState, useEffect } from 'react';
import './tabata.css';
import WorkoutTimer from './cronometro';
import rutina1 from '../data/rutinas_crossfit/tabata/tabata1';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import LottieAnimationPlaylist from '../visualizador_lottie/visualizador_playlist';
import LottieAnimation from '../visualizador_lottie/visualizador';
import Libreria from '../libreria/libreria';

const Tabata = ({ setIndiceAtras }) => {
    const [comenzar, setComenzar] = useState(false);
    const [contador, setContador] = useState(0);
    const [modo, setModo] = useState('Cronometro');
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
    const [rutinasDisponibles, setRutinasDisponibles] = useState([rutina1]);
    const [mostrarLibreria, setMostrarLibreria] = useState(false);
    const [verEjercicios, setVerEjercicios] = useState(false);
    const [tabataActual, setTabataActual] = useState(null);
    const [error, setError] = useState(null);
    
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

    const agregarEjercicio = (ejercicio) => {
        if (!tabataActual) return;
        
        setTabatas(prevTabatas => {
            return prevTabatas.map(tabata => {
                if (tabata.id === tabataActual) {
                    // Comprobamos si el ejercicio ya está en la playlist
                    const ejercicioIndex = tabata.playlistEjercicios.findIndex(e => e.nombre === ejercicio);
                    
                    let nuevaPlaylist;
                    if (ejercicioIndex !== -1) {
                        // Si el ejercicio ya está, lo eliminamos
                        nuevaPlaylist = [...tabata.playlistEjercicios];
                        nuevaPlaylist.splice(ejercicioIndex, 1);
                    } else {
                        // Si no está, lo agregamos
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
    };

    // Resetear estados relevantes al cambiar de modo
    useEffect(() => {
        if (modo === 'Cronometro') {
            setRutinaSeleccionada(null);
        }
        setError(null);
    }, [modo]);

    // Limpiar mensaje de error después de 5 segundos
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const addTabata = () => {
        const newTabataId = tabatas.length + 1;
        setTabatas([
            ...tabatas,
            {
                id: newTabataId,
                intervals: 8,
                workTime: 20,
                restTime: 10,
                recoveryTime: 60,
                playlistEjercicios: []
            }
        ]);
    };

    const abrirLibreria = (tabataId) => {
        setTabataActual(tabataId);
        setMostrarLibreria(true);
    };

    const eliminarPlaylist = (tabataId) => {
        setTabatas(prevTabatas => {
            return prevTabatas.map(tabata => {
                if (tabata.id === tabataId) {
                    return { ...tabata, playlistEjercicios: [] };
                }
                return tabata;
            });
        });
    };

    const abrirVisualizadorEjercicios = (tabataId) => {
        setTabataActual(tabataId);
        setVerEjercicios(true);
    };

    const updateIntervals = (id, changeType) => {
        const updatedTabatas = tabatas.map(tabata => {
            if (tabata.id === id) {
                const newIntervals = changeType === 'increase' 
                    ? tabata.intervals + 1 
                    : Math.max(1, tabata.intervals - 1);
                return { ...tabata, intervals: newIntervals };
            }
            return tabata;
        });
        setTabatas(updatedTabatas);
    };

    const updateWorkTime = (id, changeType) => {
        const updatedTabatas = tabatas.map(tabata => {
            if (tabata.id === id) {
                const newWorkTime = changeType === 'increase' 
                    ? tabata.workTime + 5 
                    : Math.max(5, tabata.workTime - 5);
                return { ...tabata, workTime: newWorkTime };
            }
            return tabata;
        });
        setTabatas(updatedTabatas);
    };

    const updateRestTime = (id, changeType) => {
        const updatedTabatas = tabatas.map(tabata => {
            if (tabata.id === id) {
                const newRestTime = changeType === 'increase' 
                    ? tabata.restTime + 5 
                    : Math.max(0, tabata.restTime - 5);
                return { ...tabata, restTime: newRestTime };
            }
            return tabata;
        });
        setTabatas(updatedTabatas);
    };

    const updateRecoveryTime = (id, changeType) => {
        const updatedTabatas = tabatas.map(tabata => {
            if (tabata.id === id) {
                const newRecoveryTime = changeType === 'increase' 
                    ? tabata.recoveryTime + 10 
                    : Math.max(0, tabata.recoveryTime - 10);
                return { ...tabata, recoveryTime: newRecoveryTime };
            }
            return tabata;
        });
        setTabatas(updatedTabatas);
    };

    const removeTabata = (id) => {
        // Primero filtrar el tabata que se va a eliminar
        const filteredTabatas = tabatas.filter(tabata => tabata.id !== id);
        
        // Luego actualizar los IDs para que sean consecutivos
        const updatedTabatas = filteredTabatas.map((tabata, index) => ({
            ...tabata,
            id: index + 1
        }));
        
        setTabatas(updatedTabatas);
    };

    // Validar que todos los tabatas tienen el número correcto de ejercicios
    const validarEjercicios = () => {
        // En modo Rutinas, no necesitamos validar
        if (modo === 'Rutinas' && rutinaSeleccionada) {
            return true;
        }
        
        // Verificar cada tabata
        for (const tabata of tabatas) {
            if (tabata.playlistEjercicios.length > 0 && tabata.playlistEjercicios.length !== tabata.intervals) {
                setError(`Tabata ${tabata.id}: Necesitas ${tabata.intervals} ejercicios, tienes ${tabata.playlistEjercicios.length}`);
                return false;
            }
        }
        return true;
    };

    // Manejar el inicio del tabata con validación
    const handleStartTabata = () => {
        if (validarEjercicios()) {
            setError(null);
            setComenzar(true);
        }
    };

    // Convertir tabatas a formato de workouts para el temporizador
    const prepareWorkoutsForTimer = () => {
        // Si hay una rutina seleccionada, usar su configuración
        if (rutinaSeleccionada) {
            const rutina = rutinaSeleccionada.rutina_tabata;
            return Array(rutina.intervalos).fill().map((_, i) => ({
                id: i + 1,
                time: rutina.trabajo / 60, // Convertir segundos a minutos
                restTime: rutina.descanso / 60, // Convertir segundos a minutos
                isWork: true,
                interval: i + 1,
                tabataNumber: 1
            }));
        }
        
        // Si no hay rutina seleccionada, usar la configuración manual de tabatas
        let workouts = [];
        let currentId = 1;

        tabatas.forEach((tabata, tabataIndex) => {
            // Agregar intervalos de trabajo y descanso
            for (let i = 0; i < tabata.intervals; i++) {
                // Agregar intervalo de trabajo
                workouts.push({
                    id: currentId++,
                    time: tabata.workTime / 60, // Convertir segundos a minutos
                    restTime: tabata.restTime / 60, // Convertir segundos a minutos
                    isWork: true,
                    interval: i + 1,
                    tabataNumber: tabata.id
                });
            }

            // Agregar tiempo de recuperación si no es el último tabata
            if (tabataIndex < tabatas.length - 1 && tabata.recoveryTime > 0) {
                workouts.push({
                    id: currentId++,
                    time: tabata.recoveryTime / 60, // Convertir segundos a minutos
                    restTime: 0,
                    isRecovery: true,
                    tabataNumber: tabata.id
                });
            }
        });
       
        return workouts;
    };

    // Preparar lista de ejercicios para pasar al temporizador
    const prepareExercisesForTimer = () => {
        if (rutinaSeleccionada) {
            return rutinaSeleccionada.rutina_tabata.ejercicios || [];
        }
    
        // Si no hay rutina seleccionada, devolver un array de arrays de nombres de ejercicios
        const exercisesByTabata = Object.values(
            tabatas.reduce((acc, tabata) => {
                acc[tabata.id] = tabata.playlistEjercicios.map(e => e.nombre);
                return acc;
            }, {})
        );
    
        return exercisesByTabata.flat();
    };
    
    const handleStartRutina = (rutina) => {
        setRutinaSeleccionada(rutina);
        setComenzar(true);
    };

    // Calcular la duración total de un tabata
    const calcularDuracionTabata = (tabata) => {
        return ((tabata.workTime + tabata.restTime) * tabata.intervals) / 60;
    };

    // Calcular la duración total de todos los tabatas
    const calcularDuracionTotal = () => {
        let duracionTotal = 0;
        tabatas.forEach((tabata, index) => {
            duracionTotal += calcularDuracionTabata(tabata);
            // Añadir tiempo de recuperación si no es el último tabata
            if (index < tabatas.length - 1) {
                duracionTotal += tabata.recoveryTime / 60;
            }
        });
        return duracionTotal.toFixed(2);
    };

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
                        onClick={() => setModo('Rutinas')}
                    >
                        Rutinas 
                    </button>
                </div>
                
                {/* Mostrar mensaje de error si existe */}
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
                                                onClick={() => updateIntervals(tabata.id, 'decrease')}
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
                                                onClick={() => updateIntervals(tabata.id, 'increase')}
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
                                                onClick={() => updateWorkTime(tabata.id, 'decrease')}
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
                                                onClick={() => updateWorkTime(tabata.id, 'increase')}
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
                                                onClick={() => updateRestTime(tabata.id, 'decrease')}
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
                                                onClick={() => updateRestTime(tabata.id, 'increase')}
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
                                                    onClick={() => updateRecoveryTime(tabata.id, 'decrease')}
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
                                                    onClick={() => updateRecoveryTime(tabata.id, 'increase')}
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
                                        <span className="tabata-info-label">Duración Total:</span>
                                        <span className="tabata-info-value">
                                            {((rutina.rutina_tabata.trabajo + rutina.rutina_tabata.descanso) * 
                                              rutina.rutina_tabata.intervalos / 60).toFixed(2)} min
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="tabata-exercises-container">
                                    <button 
                                        className="tabata-exercises-toggle" 
                                        onClick={(e) => {
                                            const exercisesList = e.currentTarget.nextElementSibling;
                                            exercisesList.classList.toggle('expanded');
                                            e.currentTarget.classList.toggle('active');
                                        }}
                                    >
                                        <span>Ver Ejercicios</span>
                                        <svg className="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path d="M7 10l5 5 5-5z" />
                                        </svg>
                                    </button>
                                    <button 
                                        className="boton-comenzar-rutina"
                                        onClick={() => handleStartRutina(rutina)}
                                    >
                                        Iniciar Rutina
                                    </button>
                                    <div className="tabata-exercises">
                                        <ul className="tabata-exercise-list">
                                            {rutina.rutina_tabata.ejercicios.map((ejercicio, idx) => (
                                                <li key={idx} className="tabata-exercise-item">
                                                    <span className="exercise-number">{idx + 1}</span>
                                                    <span className="exercise-name">{ejercicio}</span>
                                                    <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio}.json`}/>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
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
            
            {verEjercicios && tabataActual && (
                <LottieAnimationPlaylist 
                    jsonPaths={tabatas.find(t => t.id === tabataActual).playlistEjercicios} 
                    setLottieVentana={setVerEjercicios}
                />
            )}
        </>
    );
};

export default Tabata;