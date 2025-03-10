import React, { useState } from 'react';
import './fortime.css';
import WorkoutTimer from './cronometro';

const ForTime = ({setIndiceAtras}) => {
    const [comenzar, setComenzar] = useState(false);
    const [contador, setContador] = useState(0);
    const [totalTime, setTotalTime] = useState(10); // Tiempo objetivo total en minutos
    const [tiempoIlimitado, setTiempoIlimitado] = useState(false); // Estado para el switch de tiempo ilimitado
    const [ejercicios, setEjercicios] = useState([
        { id: 1, name: "Ejercicio 1", reps: 10 }
    ]);

    const addEjercicio = () => {
        const newId = ejercicios.length + 1;
        setEjercicios([
            ...ejercicios,
            {
                id: newId,
                name: `Ejercicio ${newId}`,
                reps: 10
            }
        ]);
    };

    const updateEjercicioName = (id, newName) => {
        const updatedEjercicios = ejercicios.map(ejercicio => {
            if (ejercicio.id === id) {
                return { ...ejercicio, name: newName };
            }
            return ejercicio;
        });
        setEjercicios(updatedEjercicios);
    };

    const updateReps = (id, changeType) => {
        const updatedEjercicios = ejercicios.map(ejercicio => {
            if (ejercicio.id === id) {
                const newReps = changeType === 'increase' 
                    ? ejercicio.reps + 1 
                    : Math.max(1, ejercicio.reps - 1);
                return { ...ejercicio, reps: newReps };
            }
            return ejercicio;
        });
        setEjercicios(updatedEjercicios);
    };

    const updateTotalTime = (changeType) => {
        if (changeType === 'increase') {
            setTotalTime(totalTime + 1);
        } else {
            setTotalTime(Math.max(1, totalTime - 1));
        }
    };

    const removeEjercicio = (id) => {
        // Filtrar el ejercicio a eliminar
        const filteredEjercicios = ejercicios.filter(ejercicio => ejercicio.id !== id);
        
        // Actualizar los IDs para que sean consecutivos
        const updatedEjercicios = filteredEjercicios.map((ejercicio, index) => ({
            ...ejercicio,
            id: index + 1
        }));
        
        setEjercicios(updatedEjercicios);
    };
    
    // Función para manejar el cambio del switch
    const handleSwitchChange = () => {
        setTiempoIlimitado(!tiempoIlimitado);
    };

    return (
        <>
            <div className="fortime-container">
                <h1>Configuración For Time</h1>
                
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
                
                <button 
                    className="add-round-btn" 
                    onClick={addEjercicio}
                >
                    + Agregar Ejercicio
                </button>
                
                <button 
                    className="boton-comenzar-fortime" 
                    onClick={()=>{setComenzar(true)}}
                > 
                    Comenzar For Time
                </button>
            </div>
            
            {comenzar &&
                <WorkoutTimer 
                    contador={contador}
                    setContador={setContador}
                    workouts={ejercicios} 
                    type={'fortime'} 
                    timeLimit={tiempoIlimitado ? 'ilimitado' : totalTime} 
                    setComenzar={setComenzar}
                />
            }
        </>
    );
};

export default ForTime;