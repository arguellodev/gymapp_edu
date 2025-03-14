import React, { useState, useEffect, useRef } from "react";
import "./crearrutina.css";
import libreriaDatos from "../data/libreria.json";
import LottieAnimation from "../visualizador_lottie/visualizador";
import { RiRunLine } from "react-icons/ri";
import { IoFitness } from "react-icons/io5";
import { GrYoga } from "react-icons/gr";
import Libreria from "../libreria/libreria";

const CrearRutina = ({setCrearRutina}) => {
  
  const categorias = Object.keys(libreriaDatos);
  console.log(categorias);
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
  const [descripcionesDias, setDescripcionesDias] = useState({});

  // Tipos de bloques disponibles
  const bloques = ["Cardio", "Estiramiento", "Serie"];

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
      series:'', // Número de series para todo el bloque
      descansoEntreSeries:'', // Descanso entre series predeterminado (60 segundos)
      descansoEntreEjercicios:'' // Descanso entre ejercicios predeterminado (90 segundos)
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
      descanso: "",
      peso: "", 
      unidadPeso: "kg", // Agregar valor por defecto
      tiempo: "",
      unidadTiempo: "seg", // Agregar valor por defecto
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
        series: bloque.series || '',
        descansoEntreSeries: bloque.descansoEntreSeries || '',
        descansoEntreEjercicios: bloque.descansoEntreEjercicios || '',
        ejercicios: bloque.ejercicios.map((ejercicio) => ({
          nombre: ejercicio.nombre,
          repeticiones: ejercicio.repeticiones || "",
          descanso: ejercicio.descanso,
          peso: ejercicio.peso || "",
          unidadPeso: ejercicio.unidadPeso || "kg", // Agregar la unidad de peso
          tiempo: ejercicio.tiempo || "",
          unidadTiempo: ejercicio.unidadTiempo || "seg", // Agregar la unidad de tiempo
        })),
      }));
    });
  
    setRutinaCompleta(rutina);
    console.log(rutina);
    
    // Obtener las rutinas existentes
    let rutinas = JSON.parse(localStorage.getItem('rutinas')) || [];
  
    // Agregar la nueva rutina al arreglo
    rutinas.push(rutina);
  
    // Guardar el arreglo actualizado en localStorage
    localStorage.setItem('rutinas', JSON.stringify(rutinas));
  };

  // Función para validar si podemos avanzar al siguiente paso
  const puedeAvanzar = () => {
    // Si estamos en la pantalla inicial de creación de rutina
    if (menuRutina === 0) {
      return nombreRutina.trim().length >= 3 && dias.length > 0;
    }
    
    // Si estamos configurando días
    if (menuRutina > 0 && menuRutina <= dias.length) {
      const diaActual = dias[menuRutina - 1];
      const bloquesDiaActual = bloquesPorDia[diaActual] || [];
      
      // Verificar que hay al menos un bloque
      if (bloquesDiaActual.length === 0) {
        return false;
      }
      
      // Verificar que cada bloque tenga al menos un ejercicio 
      // Y que los bloques no estén vacíos
      const bloquesSinEjercicios = bloquesDiaActual.some(
        bloque => !bloque.ejercicios || bloque.ejercicios.length === 0
      );
      
      return !bloquesSinEjercicios;
    }
    
    // Para la pantalla final de resumen
    return true;
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
  const getGruposFiltrados = (categoriaFiltro) => {
    return Object.entries(libreriaDatos)
      .filter(([grupo, _]) => {
        // Filtrar por categoría
        if (categoriaFiltro === 'Cardio') {
          return grupo.includes('Cardio');
        } else if (categoriaFiltro === 'Estiramiento') {
          return grupo.includes('Estiramiento');
        } else if (categoriaFiltro === 'Serie') {
          return true; // Mostrar todos los grupos
        } else {
          return true; // Si no hay filtro o es inválido, mostrar todos
        }
      })
      .map(([grupo, ejercicios]) => {
        const ejerciciosFiltrados = ejercicios.filter(ejercicio => 
          ejercicio.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return { grupo, ejerciciosFiltrados };
      })
      .filter(({ ejerciciosFiltrados }) => ejerciciosFiltrados.length > 0);
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
                required
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
                      <input
                        type="checkbox"
                        id={`dia-${dia}`}
                        checked={dias.includes(dia)}
                        onChange={() => toggleDia(dia)}
                      />
                      <label htmlFor={`dia-${dia}`}></label>
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
                              <span className="bloque-tipo">{bloque.tipo}
                              {bloque.tipo === 'Cardio' ? <IoFitness />:
                                  bloque.tipo === 'Serie'? <RiRunLine/>:
                                  bloque.tipo === 'Estiramiento'? <GrYoga />
                          
                          :null}
                              </span>
                              <span className="bloque-ejercicios">
                                {bloque.ejercicios.length} Ejercicios
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
                                className="delete-btn"
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
                          {tipo} {tipo === 'Cardio' ? <IoFitness />:
                                  tipo === 'Serie'? <RiRunLine/>:
                                  tipo === 'Estiramiento'? <GrYoga />
                          
                          :null}
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
                      {bloqueActualData.tipo !== 'Cardio' && 
                      <>
                        <label>
                        Número de veces:
                        <input
                          type="number"
                          placeholder="Opcional"
                          value={bloqueActualData.series || ''}
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
                          placeholder="Opcional"
                          value={bloqueActualData.descansoEntreSeries || ''}
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
                          placeholder="Opcional"
                          value={bloqueActualData.descansoEntreEjercicios || ''}
                          onChange={(e) =>
                            actualizarBloque(
                              "descansoEntreEjercicios",
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </label>
                      </>
                      }
                      
                    </div>
                  </div>

                  <div className="ejercicios-bloque">
                    <h4>Ejercicios en este bloque</h4>
                    {ejerciciosBloque.length > 0 ? (
                      <div className="lista-ejercicios">
                       {ejerciciosBloque.map((ejercicio) => (
  <div key={ejercicio.id} className="ejercicio-item">
    <div className="ejercicio-nombre">
      {ejercicio.nombre}
      <LottieAnimation jsonPath={`./Ejerciciosall/${ejercicio.nombre}.json`} />
    </div>
    <div className="ejercicio-config">
      <button className="eliminar-btn" onClick={() => eliminarEjercicio(ejercicio.id)}>
        X
      </button>
      {bloqueActualData.tipo !== 'Cardio' && (
        <>
          <label>
            Repeticiones:
            <input
              type="number"
              placeholder="Opcional"
              value={ejercicio.repeticiones || ""}
              onChange={(e) =>
                actualizarEjercicio(ejercicio.id, "repeticiones", parseInt(e.target.value))
              }
            />
          </label>

          <div className="input-con-unidad">
            <label>
              Peso: (Opcional)
              <div className="input-unidad-container">
                <input
                className="input-peso"
                  type="number"
                  placeholder=""
                  value={ejercicio.peso || ""}
                  onChange={(e) =>
                    actualizarEjercicio(ejercicio.id, "peso", e.target.value)
                  }
                />
                <select 
                  value={ejercicio.unidadPeso || "kg"}
                  onChange={(e) =>
                    actualizarEjercicio(ejercicio.id, "unidadPeso", e.target.value)
                  }
                >
                  <option value="kg">kg</option>
                  <option value="lb">lb</option>
                </select>
              </div>
            </label>
          </div>
        </>
      )}
      
      <div className="input-con-unidad">
        <label>
          Tiempo: (Opcional)
          <div className="input-unidad-container">
            <input
              type="number"
              placeholder=""
              value={ejercicio.tiempo || ""}
              onChange={(e) =>
                actualizarEjercicio(ejercicio.id, "tiempo", e.target.value)
              }
            />
            <select 
              value={ejercicio.unidadTiempo || "seg"}
              onChange={(e) =>
                actualizarEjercicio(ejercicio.id, "unidadTiempo", e.target.value)
              }
            >
              <option value="seg">seg</option>
              <option value="min">min</option>
            </select>
          </div>
        </label>
      </div>
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
            <button className="guardar-rutina-btn" onClick={()=>{setCrearRutina(false); generarRutinaJSON()}}>
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
          {menuRutina < dias.length +1 ?
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
          {menuRutina > dias.length ? "Guardar Rutina" : "Siguiente"}
        </button>
          
          :null}
          
        </div>
      </div>

      {/* Modal mejorado para agregar ejercicios */}
      {ejercicioAbierto && (
  <div className="agregar-ejercicio-overlay" onClick={handleOutsideClick}>
    <div className="agregar-ejercicio-content" onClick={handleContentClick}>
      <Libreria
        type={'creador-rutina'}
        onEjercicioSeleccionado={agregarEjercicio} // Función para agregar ejercicios
        tipoBloque={bloqueActualData?.tipo} // Tipo de bloque actual (Cardio, Estiramiento, Serie)
        ejerciciosAgregados={ejerciciosBloque} // Lista de ejercicios ya agregados
      />
    </div>
  </div>
)}
    </>
  );
};

export default CrearRutina;