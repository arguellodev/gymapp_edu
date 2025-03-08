import { useState } from "react";
import './crossfit.css';
import WorkoutTimer from "./cronometro";
import Amrap from "./amrap";
import Tabata from "./tabata";
import ForTime from "./fortime";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
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

    return (
        <>

            
            {/* Mostrar la selección de tipos de entrenamiento solo si no hay un componente activo */}
            {!activeComponent ? (
                <div className="crossfit-container">
                    <div 
                        className="amrap-link"
                        onClick={() => handleSelectComponent('amrap')}
                    >
                        <p>AMRAP</p>
                    </div>
                    <div 
                        className="fortime-link"
                        onClick={() => handleSelectComponent('fortime')}
                    >
                        <p>For Time</p>
                    </div>
                    <div 
                        className="emom-link"
                        onClick={() => handleSelectComponent('emom')}
                    >
                        <p>EMOM</p>
                    </div>
                    <div 
                        className="tabata-link"
                        onClick={() => handleSelectComponent('tabata')}
                    >
                        <p>Tabata</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Botón para volver atrás */}
                    <button 
                        className="back-button"
                        onClick={handleGoBack}
                    >
                        <MdOutlineKeyboardBackspace />
                    </button>
                    
                    {/* Renderizar el componente seleccionado */}
                    {activeComponent === 'amrap' && <Amrap />}
                    {activeComponent === 'fortime' && <ForTime />}
                    {activeComponent === 'emom' && <p>Componente EMOM (pendiente de implementar)</p>}
                    {activeComponent === 'tabata' && <Tabata />}
                </>
            )}
        </>
    );
};

export default Crossfit;