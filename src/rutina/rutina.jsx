import React, { useState, useEffect } from 'react';
import Ejercicio from './ejercicio';
import './rutina.css';

// Importamos directamente el archivo JSON
import rutinaData from '../data/rutina.json';

const Rutina = ({ data = null }) => {
  // Estados
  const [rutina, setRutina] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState(null);
  const [ejercicioActual, setEjercicioActual] = useState(null);
  const [serieActual, setSerieActual] = useState(0);
  const [bloquesCompletados, setBloquesCompletados] = useState({});
  const [cargando, setCargando] = useState(true);
  const [mostrarProgreso, setMostrarProgreso] = useState(false);
  
  // Cargar datos de rutina
  useEffect(() => {
    const cargarRutina = async () => {
      setCargando(true);
      try {
        // Usar datos de props o del JSON importado
        const datosRutina = data || rutinaData;
        setRutina(datosRutina);
        
        // Recuperar progreso del localStorage si existe
        const progresoGuardado = localStorage.getItem('rutina-progreso');
        if (progresoGuardado) {
          setBloquesCompletados(JSON.parse(progresoGuardado));
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
    if (Object.keys(bloquesCompletados).length > 0) {
      localStorage.setItem('rutina-progreso', JSON.stringify(bloquesCompletados));
    }
  }, [bloquesCompletados]);

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
    // Marcar bloque como completado
    const bloqueId = `${diaSeleccionado.dia}-${bloqueSeleccionado.nombre}`;
    setBloquesCompletados({
      ...bloquesCompletados,
      [bloqueId]: true
    });
    
    // Mostrar mensaje de felicitación
    mostrarNotificacion('¡Bloque completado! 💪', 2000);
    
    // Volver a la vista de bloques
    setEjercicioActual(null);
    setSerieActual(0);
  };

  // Salir del ejercicio actual
  const salirEjercicio = () => {
    if (ejercicioActual !== null) {
      // Preguntar confirmación solo si hay un ejercicio en progreso
      if (window.confirm('¿Seguro que quieres salir? Perderás el progreso de este bloque.')) {
        setEjercicioActual(null);
        setSerieActual(0);
      }
    } else {
      setEjercicioActual(null);
      setSerieActual(0);
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
      localStorage.removeItem('rutina-progreso');
      mostrarNotificacion('Progreso reiniciado', 1500);
    }
  };

  // Renderizar vista de días
  const renderizarDias = () => {
    if (!rutina || !rutina.rutina) return <div className="loading-container">Cargando rutina...</div>;
    
    const progreso = calcularProgreso();
    
    return (
      <div className="vista-principal">
        <div className="progreso-container">
          <div className="progreso-info" onClick={() => setMostrarProgreso(!mostrarProgreso)}>
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
          
          {mostrarProgreso && (
            <div className="progreso-detalles">
              <p>Has completado {progreso.completados} de {progreso.total} bloques</p>
              <button className="btn btn-outline btn-sm" onClick={reiniciarProgreso}>
                Reiniciar progreso
              </button>
            </div>
          )}
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
                    <span className="dia-completado">Completado</span>
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
        <div className="bloques-header">
          <button 
            onClick={() => setDiaSeleccionado(null)} 
            className="back-button"
            aria-label="Volver a días"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="bloques-titulo">{diaSeleccionado.dia} - {diaSeleccionado.descripcion}</h2>
        </div>

        <div className="bloques-lista">
          {diaSeleccionado.bloques.map((bloque, index) => {
            const completado = esBloqueCompletado(diaSeleccionado.dia, bloque);
            const enProgreso = bloqueSeleccionado?.nombre === bloque.nombre && ejercicioActual !== null;
            
            return (
              <div 
                key={index}
                className={`bloque-item ${completado ? 'completado' : ''} ${enProgreso ? 'en-progreso' : ''}`}
              >
                <div className="bloque-header">
                  <h3 className="bloque-titulo">
                    {bloque.nombre}
                    {bloque.tipo === 'cardio' && (
                      <span className="bloque-tipo-badge cardio">Cardio</span>
                    )}
                    {bloque.tipo === 'fuerza' && (
                      <span className="bloque-tipo-badge fuerza">Fuerza</span>
                    )}
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
                  {bloque.tipo === 'cardio' && (
                    <div className="bloque-detalle">
                      <span className="bloque-icono">⏱️</span>
                      <span>{bloque.duracion} {bloque.unidadDuracion}</span>
                    </div>
                  )}
                  
                  <div className="bloque-ejercicios">
                    <h4 className="ejercicios-titulo">Ejercicios:</h4>
                    <ul className="ejercicios-lista">
                      {bloque.ejercicios.map((ejercicio, idx) => (
                        <li key={idx} className="ejercicio-item">
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
    const progresoActual = ((ejercicioActual / totalEjercicios) + (serieActual / bloque.repeticionesSerie / totalEjercicios)) * 100;

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
            <h2 className="ejercicio-titulo">{bloque.nombre}</h2>
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

  // Si la rutina no se pudo cargar
  if (!rutina) {
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
      
      {ejercicioActual !== null ? (
        renderizarEjercicioActual()
      ) : diaSeleccionado ? (
        renderizarBloques()
      ) : (
        renderizarDias()
      )}
    </div>
  );
};

export default Rutina;