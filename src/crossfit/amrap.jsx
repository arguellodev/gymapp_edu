import React, { useState } from 'react';
import './amrap.css';
import WorkoutTimer from './cronometro';
const Amrap = ({setIndiceAtras}) => {
    
    const [contador, setContador] = useState(0);
    const [comenzar,setComenzar] = useState(false);
    const [rounds, setRounds] = useState([
        { id: 1, time: 10, restTime: 0 }
    ]);

    const addRound = () => {
        const newRoundId = rounds.length + 1;
        setRounds([
            ...rounds, 
            { 
                id: newRoundId, 
                restTime: 2,
                time: 10
            }
        ]);
    };

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

    return (
      <>
        <div className="amrap-container">
            <h1>Configuración AMRAP</h1>
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
                </div>
            ))}
            <button 
                className="add-round-btn" 
                onClick={addRound}
            >
                + Agregar Ronda
            </button>
            
            <button className='boton-comenzar-amrap' onClick={()=>{setComenzar(true)}}> Comenzar AMRAP</button>
        </div>
        {comenzar &&
         <WorkoutTimer workouts={rounds} type={'AMRAP'} contador={contador} setContador={setContador} setComenzar={setComenzar}></WorkoutTimer>
        }
       
      </>
    );
};

export default Amrap;