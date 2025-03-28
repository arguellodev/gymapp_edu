import './finalizar.css'
import LottieAnimation from '../visualizador_lottie/visualizador';
import { useEffect } from 'react';
const Finalizar = ({ 
    type, 
    time, 
    intervalos, 
    trabajo, 
    descanso, 
    targetRounds, 
    contador, 
    setComenzar, 
    ejerciciosNumero, 
    incompleto,
    onSessionComplete,
    workouts,
    exercisesList
    
}) => {
    // Eliminar useEffect de incremento de sesiones

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    


    //Funcion para crear los registros

    function crearRegistro (){

        const fechaActual = new Date().toISOString().slice(0, 10);
        if (type === 'AMRAP'){

        
        const nuevoRegistro = {
            fecha: fechaActual,
            tipo: type,
            tiempo: formatTime(workouts[0].time*60),
            rondas: contador,
            listaEjercicios: exercisesList || 'Sin especificar'
            
        }
        return nuevoRegistro
        }
        else if (type === 'fortime' && incompleto === false){
            const nuevoRegistro = {
                fecha: fechaActual,
                tipo: 'For Time',
                tiempo: formatTime(time),
                rondas: contador,
                listaEjercicios: exercisesList || 'Sin especificar'
                
            }
            return nuevoRegistro }
        
            else if (type === 'tabata' ){

                const nuevoRegistro = {
                    fecha: fechaActual,
                    tipo: 'Tabata',
                    tiempo: formatTime(intervalos*(descanso + trabajo)),
                    rondas: intervalos,
                    descanso: descanso,
                    trabajo: trabajo,
                    listaEjercicios: exercisesList || 'Sin especificar'
                    
                }
                return nuevoRegistro }

                else if (type === 'EMOM' ){

                    const nuevoRegistro = {
                        fecha: fechaActual,
                        tipo: type,
                        tiempo: formatTime(intervalos * 60),
                        rondas: intervalos,
                        listaEjercicios: exercisesList || 'Sin especificar'
                        
                    }
                    return nuevoRegistro }

                    else if (type === 'escalera' ){

                        const nuevoRegistro = {
                            fecha: fechaActual,
                            tipo: 'Escalera Infinita',
                            tiempo: formatTime(workouts[0].time*60),
                            rondas: contador,
                            listaEjercicios: exercisesList || 'Sin especificar'
                            
                        }
                        return nuevoRegistro }


       
    }

 


    // Asegurarse de llamar a onSessionComplete cuando se renderiza
    useEffect(() => {
        if (onSessionComplete) {
            onSessionComplete();
            const nuevoRegistro = crearRegistro();
            console.log(nuevoRegistro);
            localStorage.setItem('ultimo-entrenamiento', `Crossfit - ${crearRegistro().tipo}`);
            
            // Obtener los registros existentes del localStorage
            let registrosExistentes = [];
            try {
                const registrosGuardados = localStorage.getItem('registros-crossfit');
                registrosExistentes = registrosGuardados ? JSON.parse(registrosGuardados) : [];
            } catch (error) {
                console.error("Error al parsear registros:", error);
                registrosExistentes = [];
            }
            
            // Añadir el nuevo registro al array
            const registrosActualizados = [...registrosExistentes, nuevoRegistro];
            
            // Guardar el array actualizado en localStorage
            localStorage.setItem('registros-crossfit', JSON.stringify(registrosActualizados));
        }
    }, [onSessionComplete]);

    return(
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
            
            {type === 'fortime' && !incompleto &&
            <div className="finalizar-container">
                <h2 className="titulo-finalizar">Felicidades, has finalizado tu ForTime</h2>
                <LottieAnimation jsonPath={`./trofeo.json`} />
                <p>Realizaste <span className='texto-negritas'>{contador}</span> rondas objetivo {ejerciciosNumero > 0 && `de ${ejerciciosNumero} ejercicios cada una `}en un tiempo de <span className='texto-negritas'>{formatTime(time)}</span> minutos </p>
                <span className='registros-texto'>Tus resultados han quedado guardados</span>
                <button className="boton-volver-inicio" onClick={()=>setComenzar(false)}>Volver al inicio</button>
            </div>
            }
            
            {type === 'fortime' && incompleto &&
            <div className="finalizar-container">
                <h2 className="titulo-finalizar">ForTime incompleto</h2>
                <LottieAnimation jsonPath={`./tiempo_fuera.json`} />
                <p>No lograste terminar el numero de rondas objetivo antes del tiempo límite </p>
                <button className="boton-volver-inicio" onClick={()=>setComenzar(false)}>Volver al inicio</button>
            </div>
            }

            {type === 'AMRAP' &&
            <div className="finalizar-container">
                <h2 className="titulo-finalizar">AMRAP Completado!</h2>
                <LottieAnimation jsonPath={`./trofeo.json`} />
                <p>Felicidades, has logrado terminar tu AMRAP con <span className='texto-negritas'>{contador}</span> rondas
                {ejerciciosNumero > 0 && ` de ${ejerciciosNumero} ejercicios cada una`} en un tiempo de <span className='texto-negritas'>{workouts[0].time}</span> minutos
                </p>
                <span className='registros-texto'>Tus resultados han quedado guardados</span>
                <button className="boton-volver-inicio" onClick={()=>setComenzar(false)}>Volver al inicio</button>
            </div>
            }

            {type === 'EMOM' &&
            <div className="finalizar-container">
                <h2 className="titulo-finalizar">EMOM Completado!</h2>
                <LottieAnimation jsonPath={`./trofeo.json`} />
                <p>Felicidades, has logrado terminar tu EMOM de <span className='texto-negritas'>{intervalos}</span> minutos</p>
                <span className='registros-texto'>Tus resultados han quedado guardados</span>
                <button className="boton-volver-inicio" onClick={()=>setComenzar(false)}>Volver al inicio</button>
            </div>
            }

            {type === 'escalera' &&
            <div className="finalizar-container">
                <h2 className="titulo-finalizar">Escalera Infinita completada!</h2>
                <LottieAnimation jsonPath={`./trofeo.json`} />
                <p>Felicidades, has logrado terminar tu Escalera infinita con <span className='texto-negritas'>{contador}</span> rondas
                {ejerciciosNumero > 0 && ` de ${ejerciciosNumero} ejercicios cada una`}
                </p>
                <span className='registros-texto'>Tus resultados han quedado guardados</span>
                <button className="boton-volver-inicio" onClick={()=>setComenzar(false)}>Volver al inicio</button>
            </div>
            }
        </div>
    )
}

export default Finalizar;