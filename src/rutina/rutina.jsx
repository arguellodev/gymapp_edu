import React, { useState, useEffect, useRef } from 'react';
import Ejercicio from './ejercicio';
import './rutina.css';
import CrearRutina from '../crearRutina/crearRutina';
import LottieAnimation from '../visualizador_lottie/visualizador';
// Importamos directamente el archivo JSON
import rutinaData from '../data/rutina.json';
import rutinaData2 from '../data/rutina2.json';
import rutinaData3 from '../data/rutina3.json';
import rutinaIA from '../data/rutinaIA.json';
import rutinaIA1 from '../data/rutinaIA1.json';
import LottieAnimationVentana from '../visualizador_lottie/visualizardor_ventana';
import { GiCheckMark } from "react-icons/gi";

const Rutina = ({ data = null }) => {
  const [lottieVentana, setLottieVentana] = useState(false);
  const [ejercicioVentana,setEjercicioVentana] = useState(false);
  // Para recuperar
  const rutinasDisponibles =  [rutinaIA1];
  // Estados
  const [rutina, setRutina] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
  const [ejercicioActual, setEjercicioActual] = useState(null);
  const [serieActual, setSerieActual] = useState(0);
  const [bloquesCompletados, setBloquesCompletados] = useState({});
  const [cargando, setCargando] = useState(true);
  const [mostrarProgreso, setMostrarProgreso] = useState(false);
  const [mostrarSelectorRutinas, setMostrarSelectorRutinas] = useState(true);
  const [rutinaSeleccionadaIndex, setRutinaSeleccionadaIndex] = useState(null);
  const [mostrarCambioRutina, setMostrarCambioRutina] = useState(false);
  const [crearRutina,setCrearRutina] = useState(false);
  
  const diaCompletadoRef = useRef(false);

  const transformarRutina = (rutina) => {
    // Transform the new JSON structure to match the existing component's expectations
    const rutinaProcesada = {
      nombre: rutina.nombre,
      rutina: Object.entries(rutina.dias).map(([dia, bloques]) => ({
        dia: dia,
        descripcion: `Entrenamiento de ${dia}`,
        bloques: bloques.map((bloque, index) => ({
          nombre: `Bloque ${index + 1}`,
          tipo: bloque.tipo,
          repeticionesSerie: bloque.series,
          ejercicios: bloque.ejercicios.map(ejercicio => ({
            nombre: ejercicio.nombre,
            tiempo: ejercicio.tiempo,
            unidadPeso: ejercicio.unidadPeso,
            unidadTiempo: ejercicio.unidadTiempo,
            repeticiones: ejercicio.repeticiones,
            descanso: ejercicio.descanso,
            peso: ejercicio.peso,
            descansoEjercicio: bloque.descansoEntreEjercicios,
            descansoSerie: bloque.descansoEntreSeries
          
          }))
        }))
      }))
    };

    return rutinaProcesada;
  };

  // Guardar estado de navegación actual
  const guardarEstadoNavegacion = () => {
    const estadoNavegacion = {
      rutinaIndex: rutinaSeleccionadaIndex,
      diaSeleccionadoId: diaSeleccionado?.dia,
      bloqueSeleccionadoId: bloqueSeleccionado?.nombre,
      ejercicioActualIndex: ejercicioActual,
      serieActualIndex: serieActual
    };
    localStorage.setItem('rutina-navegacion', JSON.stringify(estadoNavegacion));
  };
  
  // Efecto para guardar estado de navegación cuando cambia
  useEffect(() => {
    if (rutinaSeleccionadaIndex !== null) {
      guardarEstadoNavegacion();
    }
  }, [rutinaSeleccionadaIndex, diaSeleccionado, bloqueSeleccionado, ejercicioActual, serieActual]);
  
  // Cargar datos de rutina y restaurar navegación
  useEffect(() => {
    const cargarRutina = async () => {
      setCargando(true);
      try {
        // Recuperar navegación guardada
        const navegacionGuardada = localStorage.getItem('rutina-navegacion');
        
        if (navegacionGuardada) {
          const estadoNavegacion = JSON.parse(navegacionGuardada);
          
          // Restaurar rutina seleccionada
          if (estadoNavegacion.rutinaIndex !== null && estadoNavegacion.rutinaIndex >= 0) {
            // Transformar los datos de la rutina
            const datosRutina = transformarRutina(rutinasDisponibles[estadoNavegacion.rutinaIndex]);
            
            setRutinaSeleccionadaIndex(estadoNavegacion.rutinaIndex);
            setRutina(datosRutina);
            setMostrarSelectorRutinas(false);
            
            // Recuperar progreso específico para esta rutina
            const progresoGuardado = localStorage.getItem(`rutina-progreso-${estadoNavegacion.rutinaIndex}`);
            if (progresoGuardado) {
              setBloquesCompletados(JSON.parse(progresoGuardado));
            }
            
            // Restaurar día seleccionado
            if (estadoNavegacion.diaSeleccionadoId && datosRutina.rutina) {
              const dia = datosRutina.rutina.find(d => d.dia === estadoNavegacion.diaSeleccionadoId);
              if (dia) {
                setDiaSeleccionado(dia);
                
                // Restaurar bloque seleccionado
                if (estadoNavegacion.bloqueSeleccionadoId) {
                  const bloque = dia.bloques.find(b => b.nombre === estadoNavegacion.bloqueSeleccionadoId);
                  if (bloque) {
                    setBloqueSeleccionado(bloque);
                    
                    // Restaurar ejercicio actual y serie actual
                    if (estadoNavegacion.ejercicioActualIndex !== null) {
                      setEjercicioActual(estadoNavegacion.ejercicioActualIndex);
                      setSerieActual(estadoNavegacion.serieActualIndex || 0);
                    }
                  }
                }
              }
            }
          } else {
            // Si no hay rutina guardada, mostrar selector
            setMostrarSelectorRutinas(true);
          }
        } else {
          // Si no hay navegación guardada, mostrar selector
          setMostrarSelectorRutinas(true);
        }
      } catch (error) {
        console.error('Error al cargar la rutina:', error);
      } finally {
        // Simular un tiempo de carga mínimo para mejorar UX
        setTimeout(() => setCargando(false), 600);
      }
    };
    
    cargarRutina();
  }, [data]);
  
  // Guardar progreso en localStorage cuando cambia
  useEffect(() => {
    if (Object.keys(bloquesCompletados).length > 0 && rutinaSeleccionadaIndex !== null) {
      localStorage.setItem(`rutina-progreso-${rutinaSeleccionadaIndex}`, JSON.stringify(bloquesCompletados));
    }
  }, [bloquesCompletados, rutinaSeleccionadaIndex]);

  useEffect(() => {
    if (Object.keys(bloquesCompletados).length > 0 && rutinaSeleccionadaIndex !== null) {
      localStorage.setItem(`rutina-progreso-actual`, JSON.stringify(calcularProgreso().porcentaje));
    }
  }, [bloquesCompletados, rutinaSeleccionadaIndex]);

  // Seleccionar una rutina
  const seleccionarRutina = (index) => {
    setCargando(true);
   
      localStorage.setItem('rutina-actual', 'rutina');
      
    // Simular carga
    setTimeout(() => {
      // Transformar los datos de la rutina seleccionada
      const datosRutina = transformarRutina(rutinasDisponibles[index]);
      console.log(datosRutina);
      localStorage.setItem('rutina-actual', JSON.stringify(datosRutina));
      setRutinaSeleccionadaIndex(index);
      setRutina(datosRutina);
      setMostrarSelectorRutinas(false);
      setDiaSeleccionado(null);
      setBloqueSeleccionado(null);
      setEjercicioActual(null);
      setSerieActual(0);
      
      // Cargar progreso específico para esta rutina
      const progresoGuardado = localStorage.getItem(`rutina-progreso-${index}`);
      if (progresoGuardado) {
        setBloquesCompletados(JSON.parse(progresoGuardado));
      } else {
        setBloquesCompletados({});
      }
      
      setCargando(false);
    }, 600);
  };
  
  // Cambiar rutina actual
  const cambiarRutina = () => {
    if (window.confirm('¿Estás seguro de cambiar de rutina? Perderás tu navegación actual, aunque el progreso quedará guardado.')) {
      setMostrarSelectorRutinas(true);
      setMostrarCambioRutina(false);
      setDiaSeleccionado(null);
      setBloqueSeleccionado(null);
      setEjercicioActual(null);
      setSerieActual(0);
    } else {
      setMostrarCambioRutina(false);
    }
  };

  // Seleccionar un día de la rutina
  const seleccionarDia = (dia) => {
    setDiaSeleccionado(dia);
    setBloqueSeleccionado(null);
    setEjercicioActual(null);
    setSerieActual(0);
  };

  // Iniciar un ejercicio
  const iniciarEjercicio = (bloque) => {
    setBloqueSeleccionado(bloque);
    setEjercicioActual(0);
    setSerieActual(0);
  };

  // Reanudar un ejercicio en progreso
  const reanudarEjercicio = (bloque) => {
    setBloqueSeleccionado(bloque);
  };

  // Ir al siguiente ejercicio
  const siguienteEjercicio = () => {
    const bloque = bloqueSeleccionado;
    
    if (ejercicioActual < bloque.ejercicios.length - 1) {
      // Siguiente ejercicio
      setEjercicioActual(ejercicioActual + 1);
    } else {
      // Último ejercicio, verificar series
      if (serieActual < bloque.repeticionesSerie - 1) {
        // Siguiente serie
        setSerieActual(serieActual + 1);
        setEjercicioActual(0);
        
        // Mostrar notificación de nueva serie
        mostrarNotificacion(`¡Serie ${serieActual + 1} completada! Comenzando serie ${serieActual + 2}`);
      } else {
        // Finalizar bloque
        finalizarBloque();
      }
    }
  };

  // Finalizar un bloque
  const finalizarBloque = () => {
    localStorage.setItem('ultimo-entrenamiento', `Rutina - ${diaSeleccionado.descripcion}`);
    
    // 1. Primero verificamos si ya estaba completado para evitar duplicados
    const bloqueId = `${diaSeleccionado.dia}-${bloqueSeleccionado.nombre}`;
    const yaEstabaCompletado = bloquesCompletados[bloqueId];
    
    // 2. Actualizamos el estado de bloques completados
    const nuevosBloquesCompletados = {
      ...bloquesCompletados,
      [bloqueId]: true
    };
    
    setBloquesCompletados(nuevosBloquesCompletados);
    
    // 3. Verificamos si todos los bloques están completados
    const todosBloquesCompletados = diaSeleccionado.bloques.every(bloque => 
      nuevosBloquesCompletados[`${diaSeleccionado.dia}-${bloque.nombre}`]
    );
    
    // 4. Solo incrementar días completados si no estaba ya completado
    if (todosBloquesCompletados && !diaCompletadoRef.current) {
      diaCompletadoRef.current = true; // "Bloqueamos" para que no se repita
      const diasCompletados = parseInt(localStorage.getItem('dias-completados') || 0);
      localStorage.setItem('dias-completados', (diasCompletados + 1).toString());
      mostrarNotificacion('¡Día completado! 🎉', 3000);
    } else if (!todosBloquesCompletados) {
      mostrarNotificacion('¡Bloque completado! 💪', 2000);
    }
    
    // 5. Resetear estado de ejercicio
    setEjercicioActual(null);
    setSerieActual(0);
    
    // 6. Actualizar navegación guardada
    const estadoNavegacion = {
      rutinaIndex: rutinaSeleccionadaIndex,
      diaSeleccionadoId: diaSeleccionado?.dia,
      bloqueSeleccionadoId: null,
      ejercicioActualIndex: null,
      serieActualIndex: 0
    };
    
    localStorage.setItem('rutina-navegacion', JSON.stringify(estadoNavegacion));
  };
  // Salir del ejercicio actual
  const salirEjercicio = () => {
    if (ejercicioActual !== null) {
      // Preguntar confirmación solo si hay un ejercicio en progreso
      if (window.confirm('¿Seguro que quieres salir? Perderás el progreso de este bloque.')) {
        setEjercicioActual(null);
        setSerieActual(0);
        
        // Actualizar navegación guardada
        const estadoNavegacion = {
          rutinaIndex: rutinaSeleccionadaIndex,
          diaSeleccionadoId: diaSeleccionado?.dia,
          bloqueSeleccionadoId: null,
          ejercicioActualIndex: null,
          serieActualIndex: 0
        };
        localStorage.setItem('rutina-navegacion', JSON.stringify(estadoNavegacion));
      }
    } else {
      setEjercicioActual(null);
      setSerieActual(0);
      
      // Actualizar navegación guardada
      const estadoNavegacion = {
        rutinaIndex: rutinaSeleccionadaIndex,
        diaSeleccionadoId: diaSeleccionado?.dia,
        bloqueSeleccionadoId: null,
        ejercicioActualIndex: null,
        serieActualIndex: 0
      };
      localStorage.setItem('rutina-navegacion', JSON.stringify(estadoNavegacion));
    }
  };

  // Verificar si un bloque está completado
  const esBloqueCompletado = (dia, bloque) => {
    return bloquesCompletados[`${dia}-${bloque.nombre}`] || false;
  };
  
  // Calcular progreso general
  const calcularProgreso = () => {
    if (!rutina || !rutina.rutina) return { porcentaje: 0, completados: 0, total: 0 };
    
    let totalBloques = 0;
    let bloquesTerminados = 0;
    
    rutina.rutina.forEach(dia => {
      totalBloques += dia.bloques.length;
      dia.bloques.forEach(bloque => {
        if (esBloqueCompletado(dia.dia, bloque)) {
          bloquesTerminados++;
        }
      });
    });
    
    const porcentaje = totalBloques > 0 ? Math.round((bloquesTerminados / totalBloques) * 100) : 0;
    
    return {
      porcentaje,
      completados: bloquesTerminados,
      total: totalBloques
    };
  };
  
  // Función para mostrar notificaciones temporales
  const mostrarNotificacion = (mensaje, duracion = 1500) => {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-flotante';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    // Hacer visible con animación
    setTimeout(() => {
      notificacion.classList.add('visible');
    }, 10);
    
    // Remover después de la duración
    setTimeout(() => {
      notificacion.classList.remove('visible');
      setTimeout(() => {
        document.body.removeChild(notificacion);
      }, 300);
    }, duracion);
  };
  
  // Reiniciar progreso
  const reiniciarProgreso = () => {
    if (window.confirm('¿Estás seguro de reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
      setBloquesCompletados({});
      localStorage.removeItem(`rutina-progreso-${rutinaSeleccionadaIndex}`);
      localStorage.removeItem('rutina-progreso-actual');
      // También limpiamos la navegación guardada
      localStorage.removeItem('rutina-navegacion');
      setDiaSeleccionado(null);
      setBloqueSeleccionado(null);
      setEjercicioActual(null);
      setSerieActual(0);
      
      mostrarNotificacion('Progreso reiniciado', 1500);
    }
  };

  // Función para descargar la rutina en formato JSON
const descargarRutinaJSON = (e, index) => {
  e.stopPropagation(); // Evitar que el clic se propague al div padre
  
  const rutinaParaDescargar = rutinasDisponibles[index];
  const nombreArchivo = `${rutinaParaDescargar.nombre || 'Rutina'}.json`;
  
  // Crear un objeto Blob con el JSON
  const blob = new Blob([JSON.stringify(rutinaParaDescargar, null, 2)], { type: 'application/json' });
  
  // Crear un enlace temporal para la descarga
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  
  // Simular clic en el enlace para iniciar la descarga
  document.body.appendChild(a);
  a.click();
  
  // Limpiar
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
  // Renderizar selector de rutinas
  const renderizarSelectorRutinas = () => {
    return (
      <div className="selector-rutinas">
        <div className='selector-rutinas-header'>
        <h2 className="selector-titulo">Selecciona tu rutina</h2>
        <div className='creador de rutina'>
          <button onClick={()=>{setCrearRutina(true)}}>Crear nueva rutina +</button>
        </div>
        </div>
       
        <div className="rutinas-grid">
        {rutinasDisponibles.map((rutinaItem, index) => (
  <div 
    key={index} 
    className="rutina-item"
   
  >
    <h3 className="rutina-item-titulo">{rutinaItem.nombre || `Rutina ${index + 1}`}</h3>
    <p className="rutina-item-descripcion">{rutinaItem.descripcion || "Plan de entrenamiento personalizado"}</p>
    <div className="rutina-item-info">
      <span className="rutina-item-dias">{rutinaItem.rutina ? rutinaItem.rutina.length : 0} días</span>
      <span className="rutina-item-nivel">
        {rutinaItem.nivel || (index === 0 ? "Principiante" : "Intermedio")}
      </span>
    </div>
    <div className="rutina-item-buttons">
      <button className="btn btn-primary rutina-item-btn"  onClick={() => seleccionarRutina(index)}>Seleccionar</button>
      <button 
        className="btn btn-secondary rutina-item-download-btn" 
        onClick={(e) => descargarRutinaJSON(e, index)}
        title="Descargar rutina en formato JSON"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
        </svg>
      </button>
    </div>
  </div>
))}
        </div>
        {crearRutina && <CrearRutina setCrearRutina={setCrearRutina}></CrearRutina>}
      </div>
    );
  };

  // Renderizar vista de días
  const renderizarDias = () => {
    if (!rutina || !rutina.rutina) return <div className="loading-container">Cargando rutina...</div>;
    
    const progreso = calcularProgreso();
    console.log(rutina);
    return (
      <div className="vista-principal">
        <div className="cabecera-rutina">
          <div className="progreso-container">
            <div className="progreso-info" onClick={() => setMostrarProgreso(!mostrarProgreso)}>
              <h2 className='titulo-rutina-progreso'>{rutina.nombre}</h2>
              <div className="progreso-circulo">
                <svg viewBox="0 0 36 36" className="progreso-svg">
                  <path
                    className="progreso-circulo-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="progreso-circulo-valor"
                    strokeDasharray={`${progreso.porcentaje}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="progreso-texto">{progreso.porcentaje}%</text>
                </svg>
              </div>
              <span className="progreso-label">Tu progreso</span>
            </div>
            
           
              <div className="progreso-detalles">
                <p>Has completado {progreso.completados} de {progreso.total} bloques</p>
                <div className="progreso-acciones">
                  <button className="boton-reiniciar-progreso" onClick={reiniciarProgreso}>
                    Reiniciar progreso
                  </button>
                  <button className="boton-cambiar-rutina" onClick={() => setMostrarCambioRutina(true)}>
                    Cambiar rutina
                  </button>
                </div>
              </div>
            
          </div>
        </div>
        
        <h2 className="seccion-titulo">Elige un día para entrenar</h2>
        
        <div className="dias-grid">
          {rutina.rutina.map((dia, index) => {
            // Calcular progreso del día
            const bloquesDia = dia.bloques.length;
            const completadosDia = dia.bloques.filter(bloque => 
              esBloqueCompletado(dia.dia, bloque)
            ).length;
            const porcentajeDia = Math.round((completadosDia / bloquesDia) * 100);
            
            return (
              <div 
                key={index} 
                onClick={() => seleccionarDia(dia)}
                className={`dia-item ${diaSeleccionado?.dia === dia.dia ? 'selected' : ''}`}
              >
                <div className="dia-progreso">
                  <div 
                    className="dia-progreso-barra" 
                    style={{width: `${porcentajeDia}%`}}
                  ></div>
                </div>
                <h3 className="dia-titulo">{dia.dia}</h3>
                <p className="dia-descripcion">{dia.descripcion}</p>
                <div className="dia-status">
                  {completadosDia === bloquesDia && bloquesDia > 0 ? (
                    <div className="dia-completado">
                      <p className='completado-texto'>Completado <GiCheckMark /></p>
                      
                      </div>
                  ) : (
                    <span className="dia-pendiente">{completadosDia}/{bloquesDia} completados</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar vista de bloques
  const renderizarBloques = () => {
    if (!diaSeleccionado) return null;

    return (
      <div className="bloques-container">
       {lottieVentana &&
       <LottieAnimationVentana jsonPath={`./Ejerciciosall/${ejercicioVentana}.json`} setLottieVentana={setLottieVentana}/>
       }
        <div className="bloques-header">
          <button 
            onClick={() => {
              setDiaSeleccionado(null);
              // Actualizar navegación guardada
              const estadoNavegacion = {
                rutinaIndex: rutinaSeleccionadaIndex,
                diaSeleccionadoId: null,
                bloqueSeleccionadoId: null,
                ejercicioActualIndex: null,
                serieActualIndex: 0
              };
              localStorage.setItem('rutina-navegacion', JSON.stringify(estadoNavegacion));
            }} 
            className="back-button"
            aria-label="Volver a días"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="bloques-titulo-rutinas">{diaSeleccionado.dia} - {diaSeleccionado.descripcion}</h2>
        </div>

        <div className="bloques-lista-rutina">
          {diaSeleccionado.bloques.map((bloque, index) => {
            const completado = esBloqueCompletado(diaSeleccionado.dia, bloque);
            const enProgreso = bloqueSeleccionado?.nombre === bloque.nombre && ejercicioActual !== null;
            
            return (
              <div 
                key={index}
                className={`bloque-item-rutina ${completado ? 'completado' : ''} ${enProgreso ? 'en-progreso' : ''}`}
              >
                <div className="bloque-header">
                  <h3 className="bloque-titulo">
                    {bloque.nombre}
                    
                      <span className={`bloque-tipo-badge ${bloque.tipo}`}>{bloque.tipo}</span>
                   
                   
                  </h3>
                  <div className="bloque-actions">
                    {completado ? (
                      <button
                        onClick={() => iniciarEjercicio(bloque)}
                        className="btn btn-secondary"
                      >
                        Repetir
                      </button>
                    ) : enProgreso ? (
                      <button
                        onClick={() => reanudarEjercicio(bloque)}
                        className="btn btn-primary btn-pulse"
                      >
                        Continuar
                      </button>
                    ) : (
                      <button
                        onClick={() => iniciarEjercicio(bloque)}
                        className="btn btn-primary"
                      >
                        Iniciar
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="bloque-info">
                  {bloque.tipo !== 'cardio' && (
                    <div className="bloque-detalle">
                      <span className="bloque-icono">🔄</span>
                      <span>{bloque.repeticionesSerie} {bloque.repeticionesSerie === 1 ? 'serie' : 'series'}</span>
                    </div>
                  )}
                  {/*bloque.tipo === 'cardio' && (
                    <div className="bloque-detalle">
                      <span className="bloque-icono">⏱️</span>
                      <span>{bloque.duracion} {bloque.unidadDuracion}</span>
                    </div>
                  )*/}
                  
                  <div className="bloque-ejercicios">
                    <h4 className="ejercicios-titulo">Ejercicios:</h4>
                    <ul className="ejercicios-lista">
                      {bloque.ejercicios.map((ejercicio, idx) => (
                        <li key={idx} className="ejercicio-item" onClick={()=>{setLottieVentana(true); setEjercicioVentana(ejercicio.nombre)}}>
                          <span className="ejercicio-numero">{idx + 1}</span>
                          <span className="ejercicio-nombre">{ejercicio.nombre}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Renderizar el ejercicio actual
  const renderizarEjercicioActual = () => {
    if (!bloqueSeleccionado || ejercicioActual === null) return null;

    const bloque = bloqueSeleccionado;
    const ejercicio = bloque.ejercicios[ejercicioActual];
    const esUltimoEjercicio = ejercicioActual === bloque.ejercicios.length - 1;
    const esUltimaSerie = serieActual === bloque.repeticionesSerie - 1;
    
    // Calcular progreso del ejercicio actual
    const totalEjercicios = bloque.ejercicios.length;
    const progresoActual = (1/(totalEjercicios*bloque.repeticionesSerie)*((totalEjercicios * serieActual)+(ejercicioActual))) * 100;
    
  
    return (
      <div className="ejercicio-container">
        <div className="ejercicio-header">
          <button 
            onClick={salirEjercicio} 
            className="back-button"
            aria-label="Salir del ejercicio"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="ejercicio-info">
            <h2 className="ejercicio-titulo-rutina">{bloque.nombre}</h2>
            <div className="ejercicio-progreso-info">
              <p className="ejercicio-subtitulo">
                {bloque.tipo !== 'cardio' ? 
                  `Serie ${serieActual + 1}/${bloque.repeticionesSerie} • Ejercicio ${ejercicioActual + 1}/${totalEjercicios}` : 
                  'Cardio'
                }
              </p>
              <div className="ejercicio-progreso-barra">
                <div 
                  className="ejercicio-progreso-valor" 
                  style={{width: `${progresoActual}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="ejercicio-actual">
          <div className="ejercicio-nombre-actual">{ejercicio.nombre}</div>
          
          <Ejercicio 
            ejercicio={ejercicio}
            esUltimoEjercicio={esUltimoEjercicio}
            esUltimaSerie={esUltimaSerie}
            onSiguiente={siguienteEjercicio}
            onFinalizar={finalizarBloque}
          />
        </div>
      </div>
    );
  };

  // Renderizar modal de cambio de rutina
  const renderizarModalCambioRutina = () => {
    if (!mostrarCambioRutina) return null;

    return (
      <div className="modal-cambio-rutina">
        <div className="modal-contenido">
          <h3 className="modal-titulo">Cambiar rutina</h3>
          <p className="modal-mensaje">¿Estás seguro de que quieres cambiar de rutina? Tu navegación actual se perderá, aunque el progreso quedará guardado.</p>
          <div className="modal-acciones">
            <button 
              className="btn btn-secondary" 
              onClick={() => setMostrarCambioRutina(false)}
            >
              Cancelar
            </button>
            <button 
              className="btn btn-primary" 
              onClick={cambiarRutina}
            >
              Cambiar rutina
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar pantalla de carga
  if (cargando) {
    return (
      <div className="rutina-container loading">
        <div className="loading-box">
          <div className="loader"></div>
          <p>Cargando tu rutina...</p>
        </div>
      </div>
    );
  }

  // Si la rutina no se pudo cargar y no estamos en el selector
  if (!rutina && !mostrarSelectorRutinas) {
    return (
      <div className="rutina-container error">
        <div className="error-box">
          <h2>No se pudo cargar la rutina</h2>
          <p>Ha ocurrido un error al intentar cargar tus datos.</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rutina-container">
     
      {mostrarSelectorRutinas ? (
        renderizarSelectorRutinas()
      ) : ejercicioActual !== null ? (
        renderizarEjercicioActual()
      ) : diaSeleccionado ? (
        renderizarBloques()
      ) : (
        renderizarDias()
      )}
      
      {renderizarModalCambioRutina()}
    </div>
  );
};

export default Rutina;