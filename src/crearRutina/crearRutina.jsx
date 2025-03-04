import React, { useState, useEffect, useRef } from "react";
import "./crearrutina.css";
import libreriaDatos from "../data/libreria.json";
import LottieAnimation from "../visualizador_lottie/visualizador";

const CrearRutina = () => {
  
  const categorias = Object.keys(libreriaDatos);
  console.log(categorias);
  const ejerciciosData = {
    Abdomen: [
      "Dumbbell Overhead Weighted Sit-Up 2",
      "Dumbbell Overhead Weighted Sit-Up 3",
      "Dumbbell Weighted Cocoons 2",
    ],
    Biceps: ["Alternating Dumbbell Bicep Curl 2", "Dumbbell Bicep Curl 2"],
  };
  const [ejercicioAbierto, setEjercicioAbierto] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const [menuRutina, setMenuRutina] = useState(0);
  const [dias, setDias] = useState([]);
  const [nombreRutina, setNombreRutina] = useState("");
  const [rutinaCompleta, setRutinaCompleta] = useState({});

  // Tipos de bloques disponibles
  const bloques = ["Serie", "Superserie", "Cardio"];

  // Estado para manejar los bloques por día
  const [bloquesPorDia, setBloquesPorDia] = useState({});

  // Estado para el bloque que se está editando actualmente
  const [bloqueActual, setBloqueActual] = useState(null);
  const [tipoBloque, setTipoBloque] = useState("");

  // Estado para manejar los ejercicios del bloque actual
  const [ejerciciosBloque, setEjerciciosBloque] = useState([]);

  // Estado para controlar la visibilidad del editor de ejercicios
  const [mostrarEditorEjercicios, setMostrarEditorEjercicios] = useState(false);

  // Inicializar categorías expandidas
  useEffect(() => {
    const expandidasInicial = Object.keys(libreriaDatos).reduce((acc, categoria) => {
      acc[categoria] = false;
      return acc;
    }, {});
    setCategoriasExpandidas(expandidasInicial);
  }, []);

  // Función para togglear una categoría
  const toggleCategoria = (categoria, e) => {
    e.stopPropagation(); // Evitar que el clic se propague al contenedor
    
    setCategoriasExpandidas(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  // Función para agregar o quitar un día de la lista de días seleccionados
  const toggleDia = (dia) => {
    setDias((prevDias) =>
      prevDias.includes(dia)
        ? prevDias.filter((d) => d !== dia)
        : [...prevDias, dia]
    );
  };

  // Inicializar los bloques para cada día cuando se seleccionan los días
  useEffect(() => {
    const bloquesPorDiaInicial = {};
    dias.forEach((dia) => {
      if (!bloquesPorDia[dia]) {
        bloquesPorDiaInicial[dia] = [];
      } else {
        bloquesPorDiaInicial[dia] = bloquesPorDia[dia];
      }
    });
    setBloquesPorDia(bloquesPorDiaInicial);
  }, [dias]);

  // Función para añadir un nuevo bloque al día actual
  const agregarBloque = (tipo) => {
    const diaActual = dias[menuRutina - 1];
    const nuevoBloque = {
      id: `bloque-${Date.now()}`,
      tipo,
      ejercicios: [],
      series: 3, // Número de series para todo el bloque
      descansoEntreSeries: 60, // Descanso entre series predeterminado (60 segundos)
      descansoEntreEjercicios: 90, // Descanso entre ejercicios predeterminado (90 segundos)
    };

    setBloquesPorDia({
      ...bloquesPorDia,
      [diaActual]: [...bloquesPorDia[diaActual], nuevoBloque],
    });
  };

  // Función para eliminar un bloque
  const eliminarBloque = (bloqueId) => {
    const diaActual = dias[menuRutina - 1];
    setBloquesPorDia({
      ...bloquesPorDia,
      [diaActual]: bloquesPorDia[diaActual].filter(
        (bloque) => bloque.id !== bloqueId
      ),
    });

    if (bloqueActual === bloqueId) {
      setBloqueActual(null);
      setTipoBloque("");
      setEjerciciosBloque([]);
      setMostrarEditorEjercicios(false);
    }
  };

  // Función para editar un bloque específico
  const editarBloque = (bloque) => {
    setBloqueActual(bloque.id);
    setTipoBloque(bloque.tipo);
    setEjerciciosBloque(bloque.ejercicios);
    setMostrarEditorEjercicios(true);
  };

  // Función para cerrar el editor de ejercicios
  const cerrarEditorEjercicios = () => {
    setBloqueActual(null);
    setTipoBloque("");
    setEjerciciosBloque([]);
    setMostrarEditorEjercicios(false);
  };

  // Función para guardar los cambios del bloque actual
  const guardarCambiosBloque = () => {
    setMostrarEditorEjercicios(false);
  };

  // Función para agregar un ejercicio al bloque actual
  const agregarEjercicio = (ejercicio) => {
    const diaActual = dias[menuRutina - 1];
    const nuevoEjercicio = {
      id: `ejercicio-${Date.now()}`,
      nombre: ejercicio,
      repeticiones: "",
      descanso: 60,
      peso: "", // Campo opcional para el peso
      tiempo: "", // Campo opcional para el tiempo
    };

    const bloqueActualIndex = bloquesPorDia[diaActual].findIndex(
      (bloque) => bloque.id === bloqueActual
    );

    if (bloqueActualIndex !== -1) {
      const bloquesCopia = [...bloquesPorDia[diaActual]];
      bloquesCopia[bloqueActualIndex] = {
        ...bloquesCopia[bloqueActualIndex],
        ejercicios: [
          ...bloquesCopia[bloqueActualIndex].ejercicios,
          nuevoEjercicio,
        ],
      };

      setBloquesPorDia({
        ...bloquesPorDia,
        [diaActual]: bloquesCopia,
      });

      setEjerciciosBloque([...ejerciciosBloque, nuevoEjercicio]);
    }
  };

  // Función para eliminar un ejercicio del bloque actual
  const eliminarEjercicio = (ejercicioId) => {
    const diaActual = dias[menuRutina - 1];
    const bloqueActualIndex = bloquesPorDia[diaActual].findIndex(
      (bloque) => bloque.id === bloqueActual
    );

    if (bloqueActualIndex !== -1) {
      const bloquesCopia = [...bloquesPorDia[diaActual]];
      bloquesCopia[bloqueActualIndex] = {
        ...bloquesCopia[bloqueActualIndex],
        ejercicios: bloquesCopia[bloqueActualIndex].ejercicios.filter(
          (ejercicio) => ejercicio.id !== ejercicioId
        ),
      };

      setBloquesPorDia({
        ...bloquesPorDia,
        [diaActual]: bloquesCopia,
      });

      setEjerciciosBloque(
        ejerciciosBloque.filter((ejercicio) => ejercicio.id !== ejercicioId)
      );
    }
  };

  // Función para actualizar los valores de un ejercicio
  const actualizarEjercicio = (ejercicioId, campo, valor) => {
    const diaActual = dias[menuRutina - 1];
    const bloqueActualIndex = bloquesPorDia[diaActual].findIndex(
      (bloque) => bloque.id === bloqueActual
    );

    if (bloqueActualIndex !== -1) {
      const bloquesCopia = [...bloquesPorDia[diaActual]];
      const ejercicioIndex = bloquesCopia[
        bloqueActualIndex
      ].ejercicios.findIndex((ejercicio) => ejercicio.id === ejercicioId);

      if (ejercicioIndex !== -1) {
        bloquesCopia[bloqueActualIndex].ejercicios[ejercicioIndex] = {
          ...bloquesCopia[bloqueActualIndex].ejercicios[ejercicioIndex],
          [campo]: valor,
        };

        setBloquesPorDia({
          ...bloquesPorDia,
          [diaActual]: bloquesCopia,
        });

        setEjerciciosBloque(
          ejerciciosBloque.map((ejercicio) =>
            ejercicio.id === ejercicioId
              ? { ...ejercicio, [campo]: valor }
              : ejercicio
          )
        );
      }
    }
  };

  // Función para actualizar los valores del bloque
  const actualizarBloque = (campo, valor) => {
    const diaActual = dias[menuRutina - 1];
    const bloqueActualIndex = bloquesPorDia[diaActual]?.findIndex(
      (bloque) => bloque.id === bloqueActual
    );
  
    if (bloqueActualIndex !== -1) {
      const bloquesCopia = [...bloquesPorDia[diaActual]];
      bloquesCopia[bloqueActualIndex] = {
        ...bloquesCopia[bloqueActualIndex],
        [campo]: valor ?? '', // Asegurar que el valor vacío se guarda correctamente
      };
  
      setBloquesPorDia((prev) => ({
        ...prev,
        [diaActual]: bloquesCopia,
      }));
    }
  };
  

  // Función para generar el JSON final de la rutina
  const generarRutinaJSON = () => {
    const rutina = {
      nombre: nombreRutina || "Mi Rutina",
      dias: {},
    };

    dias.forEach((dia) => {
      rutina.dias[dia] = bloquesPorDia[dia].map((bloque) => ({
        tipo: bloque.tipo,
        series: bloque.series || 3,
        descansoEntreSeries: bloque.descansoEntreSeries || 60,
        descansoEntreEjercicios: bloque.descansoEntreEjercicios || 90,
        ejercicios: bloque.ejercicios.map((ejercicio) => ({
          nombre: ejercicio.nombre,
          repeticiones: ejercicio.repeticiones,
          descanso: ejercicio.descanso,
          peso: ejercicio.peso || "",
          tiempo: ejercicio.tiempo || "",
        })),
      }));
    });

    setRutinaCompleta(rutina);
    console.log("Rutina creada:", JSON.stringify(rutina, null, 2));
    // Aquí podrías enviar el JSON a tu API o hacer lo que necesites con él
  };

  // Función para validar si podemos avanzar al siguiente paso
  const puedeAvanzar = () => {
    if (menuRutina === 0) {
      return dias.length > 0;
    } else {
      const diaActual = dias[menuRutina - 1];
      return bloquesPorDia[diaActual] && bloquesPorDia[diaActual].length > 0;
    }
  };

  // Determinar si estamos en el último día
  const esUltimoDia = menuRutina === dias.length;

  // Obtener el bloque actual completo
  const getBloqueActualData = () => {
    if (!bloqueActual) return null;

    const diaActual = dias[menuRutina - 1];
    return bloquesPorDia[diaActual]?.find(
      (bloque) => bloque.id === bloqueActual
    );
  };

  const bloqueActualData = getBloqueActualData();
  
  // Función para cerrar el modal cuando se hace clic fuera del contenido
  const handleOutsideClick = (e) => {
    if (e.target.className === "agregar-ejercicio-overlay") {
      setEjercicioAbierto(false);
    }
  };

  // Función para detener la propagación de clics dentro del contenido del modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Filtrar los grupos y ejercicios según el término de búsqueda
  const getGruposFiltrados = () => {
    return Object.entries(libreriaDatos).map(([grupo, ejercicios]) => {
      const ejerciciosFiltrados = ejercicios.filter(ejercicio => 
        ejercicio.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return { grupo, ejerciciosFiltrados };
    }).filter(({ ejerciciosFiltrados }) => ejerciciosFiltrados.length > 0);
  };

  return (
    <>
      
      <div className="menu-crear-rutinas">
        
        {menuRutina === 0 && (
          <div className="container-dias">
            <h2>Crea tu Rutina</h2>
            <div className="nombre-rutina">
              <label>Nombre de la rutina:</label>
              <input
                type="text"
                value={nombreRutina}
                onChange={(e) => setNombreRutina(e.target.value)}
                placeholder="Mi rutina de entrenamiento"
              />
            </div>
            <h3>Selecciona los días de entrenamiento</h3>
            <table>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Seleccionar</th>
                </tr>
              </thead>
              <tbody>
                {diasSemana.map((dia) => (
                  <tr key={dia}>
                    <td>{dia}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={dias.includes(dia)}
                          onChange={() => toggleDia(dia)}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {menuRutina > 0 && menuRutina <= dias.length && (
          <>
            <h2>Configura el día {dias[menuRutina - 1]}</h2>

            <div className="bloque-rutina-container">
              {/* Vista de lista de bloques (vista principal) */}
              {!mostrarEditorEjercicios && (
                <>
                  <div className="bloques-container">
                    <h3>Bloques de ejercicios</h3>
                    {bloquesPorDia[dias[menuRutina - 1]] &&
                    bloquesPorDia[dias[menuRutina - 1]].length > 0 ? (
                      <div className="bloques-lista">
                        {bloquesPorDia[dias[menuRutina - 1]].map((bloque) => (
                          <div key={bloque.id} className="bloque-item">
                            <div className="bloque-info">
                              <span className="bloque-tipo">{bloque.tipo}</span>
                              <span className="bloque-ejercicios">
                                {bloque.ejercicios.length} ejercicios
                              </span>
                            </div>
                            <div className="bloque-acciones">
                              <button
                                className="editar-btn"
                                onClick={() => editarBloque(bloque)}
                              >
                                Editar
                              </button>
                              <button
                                className="eliminar-btn"
                                onClick={() => eliminarBloque(bloque.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="sin-bloques">
                        <p>Aún no has agregado ningún bloque para este día.</p>
                      </div>
                    )}
                  </div>

                  <div className="agregar-bloque">
                    <h3>Añadir nuevo bloque</h3>
                    <div className="botones-bloques">
                      {bloques.map((tipo) => (
                        <button
                          key={tipo}
                          className="boton-bloque"
                          onClick={() => agregarBloque(tipo)}
                        >
                          {tipo}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Vista de editor de ejercicios (aparece al hacer clic en "Editar") */}
              {mostrarEditorEjercicios && bloqueActual && bloqueActualData && (
                <div className="editar-bloque">
                  <div className="editor-header">
                    <h3>Configurar bloque: {tipoBloque}</h3>
                    <div className="editor-botones">
                      <button
                        className="guardar-btn"
                        onClick={guardarCambiosBloque}
                      >
                        Guardar cambios
                      </button>
                     
                    </div>
                  </div>

                  <div className="configuracion-bloque">
                    <h4>Configuración del bloque</h4>
                    <div className="bloque-config">
                      {/* Configuración de series para todo el bloque */}
                      <label>
                        Número de series:
                        <input
                          type="number"
                          min="0"
                          value={bloqueActualData.series || 3}
                          onChange={(e) =>
                            actualizarBloque(
                              "series",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </label>
                      
                      <label>
                        Descanso entre series (seg):
                        <input
                          type="number"
                          min="0"
                          value={bloqueActualData.descansoEntreSeries || 60}
                          onChange={(e) =>
                            actualizarBloque(
                              "descansoEntreSeries",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </label>
                      <label>
                        Descanso entre ejercicios (seg):
                        <input
                          type="number"
                          min="0"
                          value={bloqueActualData.descansoEntreEjercicios || 90}
                          onChange={(e) =>
                            actualizarBloque(
                              "descansoEntreEjercicios",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="ejercicios-bloque">
                    <h4>Ejercicios en este bloque</h4>
                    {ejerciciosBloque.length > 0 ? (
                      <div className="lista-ejercicios">
                        {ejerciciosBloque.map((ejercicio) => (
                          <div key={ejercicio.id} className="ejercicio-item">
                            
                            <div className="ejercicio-nombre">{ejercicio.nombre}
                            <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio.nombre}.json`}/>
                            {console.log(ejercicio)}
                            </div>
                            <div className="ejercicio-config">
                            <button className="eliminar-btn" onClick={() => eliminarEjercicio(ejercicio.id)}>
                                X
                              </button>
                              <label>
                                Repeticiones:
                                <input
                                  type="number"
                                  min="1"
                                  value={ejercicio.repeticiones}
                                  onChange={(e) =>
                                    actualizarEjercicio(ejercicio.id, "repeticiones", parseInt(e.target.value))
                                  }
                                />
                              </label>
                              <label>
                                Peso (kg):
                                <input
                                  type="text"
                                  placeholder="Opcional"
                                  value={ejercicio.peso || ""}
                                  onChange={(e) =>
                                    actualizarEjercicio(ejercicio.id, "peso", e.target.value)
                                  }
                                />
                              </label>
                              <label>
                                Tiempo (seg):
                                <input
                                  type="text"
                                  placeholder="Opcional"
                                  value={ejercicio.tiempo || ""}
                                  onChange={(e) =>
                                    actualizarEjercicio(ejercicio.id, "tiempo", e.target.value)
                                  }
                                />
                              </label>
                              
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Aún no has añadido ejercicios a este bloque.</p>
                    )}

                    <button 
                      className="agregar-ejercicio-btn" 
                      onClick={() => setEjercicioAbierto(true)}
                    >
                      Agregar Ejercicio
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {menuRutina > dias.length && (
          <div className="resumen-rutina">
            <h2>¡Rutina completada!</h2>
            <p>Has configurado todos los días de tu rutina correctamente.</p>
            <h3>Resumen:</h3>
            <div className="resumen-dias">
              {dias.map((dia) => (
                <div key={dia} className="resumen-dia">
                  <h4>{dia}</h4>
                  <p>{bloquesPorDia[dia].length} bloques</p>
                  <p>
                    {bloquesPorDia[dia].reduce(
                      (total, bloque) => total + bloque.ejercicios.length,
                      0
                    )}{" "}
                    ejercicios
                  </p>
                </div>
              ))}
            </div>
            <button className="guardar-rutina-btn" onClick={generarRutinaJSON}>
              Guardar Rutina
            </button>

            {Object.keys(rutinaCompleta).length > 0 && (
              <div className="json-result">
                <h3>JSON de tu rutina:</h3>
                <pre>{JSON.stringify(rutinaCompleta, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        <div className="botones-avanzar-retroceder">
          {menuRutina > 0 && (
            <button
              className="next-button"
              onClick={() => {
                setMenuRutina(menuRutina - 1);
                setBloqueActual(null);
                setMostrarEditorEjercicios(false);
              }}
            >
              Atrás
            </button>
          )}

          <button
            className="next-button"
            disabled={!puedeAvanzar() && menuRutina <= dias.length}
            onClick={() => {
              if (menuRutina <= dias.length) {
                setMenuRutina(menuRutina + 1);
                setBloqueActual(null);
                setMostrarEditorEjercicios(false);
              }
            }}
          >
            {menuRutina > dias.length ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>

      {/* Modal mejorado para agregar ejercicios */}
      {ejercicioAbierto && (
        <div className="agregar-ejercicio-overlay" onClick={handleOutsideClick}>
          <div 
            className="agregar-ejercicio-content" 
            onClick={handleContentClick}
          >
            <div className="header-ejercicio">
              <h4>Añadir ejercicio</h4>
              <button
                className="cerrar-btn"
                onClick={() => setEjercicioAbierto(false)}
              >
                ×
              </button>
            </div>
            
            <div className="ejercicio-search">
              <input
                type="text"
                placeholder="Buscar ejercicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="categorias-container">
              {getGruposFiltrados().length > 0 ? (
                getGruposFiltrados().map(({ grupo, ejerciciosFiltrados }) => (
                  <div key={grupo} className="categoria-item">
                    <div 
                      className={`categoria-header ${categoriasExpandidas[grupo] ? 'expandido' : ''}`}
                      onClick={(e) => toggleCategoria(grupo, e)}
                    >
                      <h5>{grupo}</h5>
                      <span className="toggle-icon">
                        {categoriasExpandidas[grupo] ? '−' : '+'}
                      </span>
                    </div>
                    
                    {categoriasExpandidas[grupo] && (
                      <div className="lista-ejercicios-disponibles">
                        {ejerciciosFiltrados.map((ejercicio, index) => {
                          // Verificar si el ejercicio ya está en el bloque
                          const yaAgregado = ejerciciosBloque.some(e => e.nombre === ejercicio);
                          
                          return (
                            <div
                              key={index}
                              className={`ejercicio-disponible ${yaAgregado ? "selected" : ""}`}
                              onClick={() => {
                                if (!yaAgregado) {
                                  agregarEjercicio(ejercicio);
                                  // Opcional: mantener la categoría expandida para facilitar
                                  // la adición de más ejercicios de la misma categoría
                                }
                              }}
                            >
                              <div className="seleccionar-ejercicio-container">
                                <p>{ejercicio}</p>
                                <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio}.json`}/>
                              </div>
                             
                             
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-ejercicios">
                  No se encontraron ejercicios que coincidan con tu búsqueda.
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button onClick={() => setEjercicioAbierto(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CrearRutina;