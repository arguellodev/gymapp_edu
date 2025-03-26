
import { useEffect } from 'react';
import './finalizar.css'
import LottieAnimation from '../visualizador_lottie/visualizador';
const Finalizar =({ type,time,intervalos, trabajo,descanso, targetRounds, contador, setComenzar,ejerciciosNumero, incompleto} )=>{


console.log(incompleto);
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

return(
    <>

    

     <div className="finalizar-overlay">
        {type === 'tabata' &&
        <div className="finalizar-container">
        <h2 className="titulo-finalizar">Felicidades, has finalizado tu Tabata</h2>
        <LottieAnimation jsonPath={`./trofeo.json`} />
        <p>Realizaste <span className='texto-negritas'>{intervalos}</span> intervalos con un tiempo total de <span className='texto-negritas'>{formatTime(intervalos*(descanso + trabajo))}</span> minutos.</p>
        <p>El tiempo de trabajo fueron {trabajo} segundos con {descanso} segundos de descanso.</p>
        <span className='registros-texto'>Tus resultados han quedado guardados</span>
        <button className="boton-volver-inicio" onClick={()=>setComenzar(false)}>Volver al inicio</button>
        </div>
        }
       
        { type === 'fortime' && !incompleto &&
        <div className="finalizar-container">
            
        <h2 className="titulo-finalizar">Felicidades, has finalizado tu ForTime</h2>
        <LottieAnimation jsonPath={`./trofeo.json`} />
        <p>Realizaste <span className='texto-negritas'>{contador}</span> rondas objetivo {ejerciciosNumero > 0 && `de ${ejerciciosNumero} ejercicios cada una `}en un tiempo de <span className='texto-negritas'>{formatTime(time)}</span> minutos </p>
        
        <span className='registros-texto'>Tus resultados han quedado guardados</span>
        <button className="boton-volver-inicio" onClick={()=>setComenzar(false)}>Volver al inicio</button>
        </div>

        }
        
        { type === 'fortime' && incompleto &&
        <div className="finalizar-container">
            
        <h2 className="titulo-finalizar">ForTime incompleto</h2>
        <LottieAnimation jsonPath={`./tiempo_fuera.json`} />
        <p>No lograste terminar el numero de rondas objetivo antes del tiempo límite </p>
        
        
        <button className="boton-volver-inicio" onClick={()=>setComenzar(false)}>Volver al inicio</button>
        </div>

        }
        
    </div>
    
    </>
   
)
}

export default Finalizar;