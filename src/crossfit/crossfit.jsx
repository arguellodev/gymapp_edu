import { useState } from "react";
import { MdOutlineKeyboardBackspace, MdOutlineFitnessCenter, MdTimer, MdOutlineRepeat, MdOutlineHourglassEmpty } from "react-icons/md";
import './crossfit.css';
import WorkoutTimer from "./cronometro";
import Amrap from "./amrap";
import Tabata from "./tabata";
import ForTime from "./fortime";
import Emom from "./emom";
import Escalera from "./escalera";
import { Gi3dStairs } from "react-icons/gi";

const Crossfit = () => {
    // Estado para controlar qué componente mostrar
    const [activeComponent, setActiveComponent] = useState(null);

    // Función para volver a la página principal
    const handleGoBack = () => {
        setActiveComponent(null);
    };

    // Función para seleccionar un componente
    const handleSelectComponent = (component) => {
        setActiveComponent(component);
    };

    // Datos de los entrenamientos
    const workouts = [
        {
            id: 'amrap',
            name: 'AMRAP',
            description: 'As Many Rounds As Possible',
            icon: <MdOutlineRepeat className="workout-icon" />,
            className: "workout-card amrap"
        },
        {
            id: 'fortime',
            name: 'For Time',
            description: 'Complete el WOD lo más rápido posible',
            icon: <MdOutlineHourglassEmpty className="workout-icon" />,
            className: "workout-card fortime"
        },
        {
            id: 'emom',
            name: 'EMOM',
            description: 'Every Minute On the Minute',
            icon: <MdTimer className="workout-icon" />,
            className: "workout-card emom"
        },
        {
            id: 'tabata',
            name: 'Tabata',
            description: '20 segundos de trabajo, 10 de descanso',
            icon: <MdOutlineFitnessCenter className="workout-icon" />,
            className: "workout-card tabata"
        },
        {
            id: 'escalera',
            name: 'Escalera infinita',
            description: 'Por cada ronda, aumenta el número de repeticiones',
            icon:<Gi3dStairs className="workout-icon"/>,
            className: "workout-card escalera"
        }
    ];

    return (
        <div className="crossfit-section">
            
           
            {!activeComponent ? (
                
                <div className="crossfit-grid">
                    
                    {workouts.map((workout) => (
                        <div 
                            key={workout.id}
                            className={workout.className}
                            onClick={() => handleSelectComponent(workout.id)}
                        >
                            <div className="card-content">
                                {workout.icon}
                                <h3 className="workout-name">{workout.name}</h3>
                                <p className="workout-description">{workout.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="workout-detail-container">
                    <button 
                        className="back-button"
                        onClick={handleGoBack}
                    >
                        <MdOutlineKeyboardBackspace />
                    </button>
                    
                    {/* Renderizar el componente seleccionado */}
                    {activeComponent === 'amrap' && <Amrap />}
                    {activeComponent === 'fortime' && <ForTime />}
                    {activeComponent === 'emom' && <Emom />}
                    {activeComponent === 'tabata' && <Tabata />}
                    {activeComponent === 'escalera' && <Escalera />}
                </div>
            )}
        </div>
    );
};

export default Crossfit;