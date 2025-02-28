import React, { useState, useEffect } from 'react';
import Ejercicio from './ejercicio';
import './rutina.css';

// Importamos directamente el archivo JSON
import rutinaData from '../data/rutina.json';
import rutinaData2 from '../data/rutina2.json';

const rutinasDisponibles = [rutinaData, rutinaData2];

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
  const [mostrarSelectorRutinas, setMostrarSelectorRutinas] = useState(true);
  const [rutinaSeleccionadaIndex, setRutinaSeleccionadaIndex] = useState(null);
  const [mostrarCambioRutina, setMostrarCambioRutina] = useState(false);
  
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
            setRutinaSeleccionadaIndex(estadoNavegacion.rutinaIndex);
            setMostrarSelectorRutinas(false);
            
            // Usar datos de la rutina guardada
            const datosRutina = rutinasDisponibles[estadoNavegacion.rutinaIndex];
            setRutina(datosRutina);
            
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

  // Seleccionar una rutina
  const seleccionarRutina = (index) => {
    setCargando(true);
    
    // Simular carga
    setTimeout(() => {
      setRutinaSeleccionadaIndex(index);
      setRutina(rutinasDisponibles[index]);
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
    
    // Actualizar navegación guardada
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
      
      // También limpiamos la navegación guardada
      localStorage.removeItem('rutina-navegacion');
      setDiaSeleccionado(null);
      setBloqueSeleccionado(null);
      setEjercicioActual(null);
      setSerieActual(0);
      
      mostrarNotificacion('Progreso reiniciado', 1500);
    }
  };

  // Renderizar selector de rutinas
  const renderizarSelectorRutinas = () => {
    return (
      <div className="selector-rutinas">
        <h2 className="selector-titulo">Selecciona tu rutina</h2>
        <div className="rutinas-grid">
          {rutinasDisponibles.map((rutinaItem, index) => (
            <div 
              key={index} 
              className="rutina-item"
              onClick={() => seleccionarRutina(index)}
            >
              <h3 className="rutina-item-titulo">{rutinaItem.nombre || `Rutina ${index + 1}`}</h3>
              <p className="rutina-item-descripcion">{rutinaItem.descripcion || "Plan de entrenamiento personalizado"}</p>
              <div className="rutina-item-info">
                <span className="rutina-item-dias">{rutinaItem.rutina ? rutinaItem.rutina.length : 0} días</span>
                <span className="rutina-item-nivel">
                  {rutinaItem.nivel || (index === 0 ? "Principiante" : "Intermedio")}
                </span>
              </div>
              <button className="btn btn-primary rutina-item-btn">Seleccionar</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar vista de días
  const renderizarDias = () => {
    if (!rutina || !rutina.rutina) return <div className="loading-container">Cargando rutina...</div>;
    
    const progreso = calcularProgreso();
    
    return (
      <div className="vista-principal">
        <div className="cabecera-rutina">
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
            
           
              <div className="progreso-detalles">
                <p>Has completado {progreso.completados} de {progreso.total} bloques</p>
                <div className="progreso-acciones">
                  <button className="btn btn-outline btn-sm" onClick={reiniciarProgreso}>
                    Reiniciar progreso
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => setMostrarCambioRutina(true)}>
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