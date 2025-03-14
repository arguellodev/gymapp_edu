import React, { useState } from 'react';
import './tabata.css';
import WorkoutTimer from './cronometro';
import rutina1 from '../data/rutinas_crossfit/tabata/tabata1';
import LottieAnimation from '../visualizador_lottie/visualizador';
const Tabata = ({ setIndiceAtras }) => {
    const [comenzar, setComenzar] = useState(false);
    const [contador, setContador] = useState(0);
    const [modo,setModo]= useState('Cronometro');
    const [tabatas, setTabatas] = useState([
        { 
            id: 1, 
            intervals: 8,
            workTime: 20,
            restTime: 10,
            recoveryTime: 60
        }
    ]);

    const addTabata = () => {
        const newTabataId = tabatas.length + 1;
        setTabatas([
            ...tabatas,
            {
                id: newTabataId,
                intervals: 8,
                workTime: 20,
                restTime: 10,
                recoveryTime: 60
            }
        ]);
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

    // Convertir tabatas a formato de workouts para el temporizador
    const prepareWorkoutsForTimer = () => {
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

    return (
        <>
            <div className="tabata-container">
                <h1>Configuración Tabata</h1>
                <div className='selector-modo'>
                    <button className={modo === 'Cronometro' ? 'boton-modo-activado': 'boton-modo'}
                    onClick={()=>setModo('Cronometro')}
                    >Cronometro </button>
                    <button className={modo === 'Rutinas' ? 'boton-modo-activado': 'boton-modo'}
                    onClick={()=>setModo('Rutinas')}
                    >Rutinas </button>
                </div>
                {modo === 'Cronometro' 
                ?
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
                            <div className="input-group">
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
                            <div className="input-group">
                                <label htmlFor={`work-${tabata.id}`}>Tiempo de trabajo (segundos):</label>
                                <div className="input-with-buttons">
                                    <button 
                                        className="adjust-btn" 
                                        onClick={() => updateWorkTime(tabata.id, 'decrease')}
                                    >
                                        -
                                    </button>
                                    <input
                                        id={`work-${tabata.id}`}
                                        type="number"
                                        min="5"
                                        step="5"
                                        value={tabata.workTime}
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
                            <div className="input-group">
                                <label htmlFor={`rest-${tabata.id}`}>Tiempo de descanso (segundos):</label>
                                <div className="input-with-buttons">
                                    <button 
                                        className="adjust-btn" 
                                        onClick={() => updateRestTime(tabata.id, 'decrease')}
                                    >
                                        -
                                    </button>
                                    <input
                                        id={`rest-${tabata.id}`}
                                        type="number"
                                        min="0"
                                        step="5"
                                        value={tabata.restTime}
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
                            <p>Duración total: {((tabata.workTime + tabata.restTime) * tabata.intervals) / 60} minutos</p>
                        </div>
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
                    onClick={() => {setComenzar(true)}}
                > 
                    Comenzar Tabata
                </button>
                </div>
                :
                <>
                
                <h1>Menu de rutinas de tabata:</h1>
                <div className='rutinas-tabata-container'>
  <div className="tabata-header">
    <h2>{rutina1.rutina_tabata.nombre}</h2>
    <p className="tabata-description">{rutina1.rutina_tabata.descripcion}</p>
    <div className="tabata-badge">{rutina1.rutina_tabata.Tipo}</div>
  </div>
  
  <div className="tabata-info">
    <div className="tabata-info-item">
      <span className="tabata-info-label">Intervalos:</span>
      <span className="tabata-info-value">{rutina1.rutina_tabata.intervalos}</span>
    </div>
    <div className="tabata-info-item">
      <span className="tabata-info-label">Trabajo:</span>
      <span className="tabata-info-value">{rutina1.rutina_tabata.trabajo}s</span>
    </div>
    <div className="tabata-info-item">
      <span className="tabata-info-label">Descanso:</span>
      <span className="tabata-info-value">{rutina1.rutina_tabata.descanso}s</span>
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
    
    <div className="tabata-exercises">
      <ul className="tabata-exercise-list">
        {rutina1.rutina_tabata.ejercicios.map((ejercicio, index) => (
          <li key={index} className="tabata-exercise-item">
            <span className="exercise-number">{index + 1}</span>
            <span className="exercise-name">{ejercicio}</span>
            <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio}.json`}/>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>
                </>
                
                }
            </div>
            {comenzar &&
             <WorkoutTimer 
                workouts={prepareWorkoutsForTimer()} 
                type={'tabata'} 
                contador={contador} 
                setContador={setContador} 
                setComenzar={setComenzar}
             />
            }
        </>
    );
};

export default Tabata;