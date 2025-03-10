import React, { useState } from 'react';
import './emom.css';
import WorkoutTimer from './cronometro';

const Emom = ({setIndiceAtras}) => {
    const [comenzar, setComenzar] = useState(false);
    const [contador, setContador] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(10);
    const [exercises, setExercises] = useState([
        { id: 1, name: "Ejercicio 1", reps: 10 }
    ]);

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

    // Función para actualizar las repeticiones del ejercicio
    const updateExerciseReps = (id, changeType) => {
        const updatedExercises = exercises.map(exercise => {
            if (exercise.id === id) {
                const newReps = changeType === 'increase' 
                    ? exercise.reps + 1 
                    : Math.max(1, exercise.reps - 1);
                return { ...exercise, reps: newReps };
            }
            return exercise;
        });
        setExercises(updatedExercises);
    };

    // Función para eliminar un ejercicio
    const removeExercise = (id) => {
        // Solo permitir eliminar si hay más de un ejercicio
        if (exercises.length > 1) {
            // Filtrar el ejercicio a eliminar
            const filteredExercises = exercises.filter(exercise => exercise.id !== id);
            
            // Actualizar los IDs para que sean consecutivos
            const updatedExercises = filteredExercises.map((exercise, index) => ({
                ...exercise,
                id: index + 1,
                name: `Ejercicio ${index + 1}`
            }));
            
            setExercises(updatedExercises);
        }
    };

    // Preparar los datos para el temporizador
    const prepareWorkoutData = () => {
        // Para EMOM necesitamos crear un array donde cada elemento represente 1 minuto
        // con el ejercicio correspondiente
        let workoutData = [];
        
        for (let i = 0; i < totalMinutes; i++) {
            const exerciseIndex = i % exercises.length;
            workoutData.push({
                id: i + 1,
                time: 1, // Cada ronda es de 1 minuto
                exercise: exercises[exerciseIndex],
                restTime: 0 // No hay descanso explícito en EMOM
            });
        }
        
        return workoutData;
    };

    return (
        <>
            <div className="emom-container">
                <h1>Configuración EMOM</h1>
                
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
                
                {/* Ejercicios */}
                <div className="exercises-section">
                    <h3>Ejercicios (se alternarán cada minuto)</h3>
                    
                    {exercises.map((exercise) => (
                        <div key={exercise.id} className="exercise-card">
                            <div className="exercise-header">
                                <input
                                    type="text"
                                    value={exercise.name}
                                    onChange={(e) => updateExerciseName(exercise.id, e.target.value)}
                                    className="exercise-name-input"
                                />
                                {exercises.length > 1 && (
                                    <button 
                                        className="remove-exercise-btn" 
                                        onClick={() => removeExercise(exercise.id)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <div className="exercise-inputs">
                                <div className="input-group">
                                    <label htmlFor={`reps-${exercise.id}`}>Repeticiones:</label>
                                    <div className="input-with-buttons">
                                        <button 
                                            className="adjust-btn" 
                                            onClick={() => updateExerciseReps(exercise.id, 'decrease')}
                                        >
                                            -
                                        </button>
                                        <input
                                            id={`reps-${exercise.id}`}
                                            type="number"
                                            min="1"
                                            value={exercise.reps}
                                            readOnly
                                            className="reps-input"
                                        />
                                        <button 
                                            className="adjust-btn" 
                                            onClick={() => updateExerciseReps(exercise.id, 'increase')}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <button 
                        className="add-exercise-btn" 
                        onClick={addExercise}
                    >
                        + Agregar Ejercicio
                    </button>
                </div>
                
                
                
                <button 
                    className='boton-comenzar-emom' 
                    onClick={() => setComenzar(true)}
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
                ></WorkoutTimer>
            }
        </>
    );
};

export default Emom;