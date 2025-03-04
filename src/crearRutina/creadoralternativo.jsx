
const CrearRutina = () => {
  
    const [categorias, setCategorias] = useState({});
    const [mostrarSelectorEjercicio, setMostrarSelectorEjercicio] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [cargando, setCargando] = useState(true);
    const [bloqueActual, setBloqueActual] = useState(null);
    const [ejercicioActual, setEjercicioActual] = useState(null);
    const [filtroEjercicios, setFiltroEjercicios] = useState("");
    
    // Estado principal de la rutina
    const [rutina, setRutina] = useState({
      dia: "",
      descripcion: "",
      bloques: []
    });
  
    // Cargar categorías del JSON
    useEffect(() => {
      try {
        setCategorias(libreriaDatos);
        setCargando(false);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setCargando(false);
      }
    }, []);
  
    // Manejadores para la rutina
    const actualizarRutina = (campo, valor) => {
      setRutina(prev => ({
        ...prev,
        [campo]: valor
      }));
    };
  
    // Agregar un nuevo bloque a la rutina
    const agregarBloque = (tipo) => {
      const nuevoBloque = {
        nombre: tipo === "serie" ? "Serie" : 
               tipo === "superserie" ? "Superserie" : "Cardio",
        tipo: tipo,
        repeticionesSerie: tipo === "cardio" ? 0 : 3,
        duracion: tipo === "cardio" ? 10 : 0,
        unidadDuracion: "minutos",
        ejercicios: [],
        descansoEntreSeries: 60,
        descansoEntreEjercicios: 30
      };
  
      setRutina(prev => ({
        ...prev,
        bloques: [...prev.bloques, nuevoBloque]
      }));
    };
  
    // Actualizar un bloque existente
    const actualizarBloque = (index, campo, valor) => {
      setRutina(prev => {
        const nuevaRutina = {...prev};
        nuevaRutina.bloques[index][campo] = valor;
        return nuevaRutina;
      });
    };
  
    // Eliminar un bloque
    const eliminarBloque = (index) => {
      // Mejora: confirmación antes de eliminar
      if (window.confirm("¿Estás seguro de eliminar este bloque?")) {
        setRutina(prev => {
          const nuevaRutina = {...prev};
          nuevaRutina.bloques.splice(index, 1);
          return nuevaRutina;
        });
      }
    };
  
    // Abrir selector de ejercicios
    const abrirSelectorEjercicio = (bloqueIndex, ejercicioIndex = null) => {
      setBloqueActual(bloqueIndex);
      setEjercicioActual(ejercicioIndex);
      setMostrarSelectorEjercicio(true);
      setCategoriaSeleccionada("");
      setFiltroEjercicios("");
    };
  
    // Seleccionar ejercicio - Solución para evitar duplicados
    const seleccionarEjercicio = (nombre) => {
      setRutina(prev => {
        return {
          ...prev,
          bloques: prev.bloques.map((bloque, index) => {
            if (index === bloqueActual) {
              const ejercicioExiste = bloque.ejercicios.some(e => e.nombre === nombre);
              
              if (ejercicioActual === null && !ejercicioExiste) {
                return {
                  ...bloque,
                  ejercicios: [...bloque.ejercicios, {
                    nombre: nombre,
                    repeticionesEjercicio: 10,
                    peso: 0,
                    unidadPeso: "kg",
                    tiempo: 0,
                    unidadTiempo: "segundos",
                    url: `Ejercicios/${categoriaSeleccionada}/${nombre}.json`,
                    usarPeso: false,
                    usarTiempo: false
                  }]
                };
              } else if (ejercicioActual !== null) {
                return {
                  ...bloque,
                  ejercicios: bloque.ejercicios.map((e, i) => 
                    i === ejercicioActual ? {
                      ...e,
                      nombre: nombre,
                      url: `Ejercicios/${categoriaSeleccionada}/${nombre}.json`
                    } : e
                  )
                };
              }
            }
            return bloque;
          })
        };
      });
      setMostrarSelectorEjercicio(false);
    };
  
    // Actualizar un ejercicio existente
    const actualizarEjercicio = (bloqueIndex, ejercicioIndex, campo, valor) => {
      setRutina(prev => {
        const nuevaRutina = {...prev};
        nuevaRutina.bloques[bloqueIndex].ejercicios[ejercicioIndex][campo] = valor;
        return nuevaRutina;
      });
    };
  
    // Eliminar un ejercicio
    const eliminarEjercicio = (bloqueIndex, ejercicioIndex) => {
      // Mejora: confirmación antes de eliminar
      if (window.confirm("¿Estás seguro de eliminar este ejercicio?")) {
        setRutina(prev => {
          const nuevaRutina = {...prev};
          nuevaRutina.bloques[bloqueIndex].ejercicios.splice(ejercicioIndex, 1);
          return nuevaRutina;
        });
      }
    };
  
    // Solución para los toggles de peso y tiempo
    const toggleOpcionesPeso = (bloqueIndex, ejercicioIndex) => {
      setRutina(prev => ({
        ...prev,
        bloques: prev.bloques.map((bloque, bIndex) => 
          bIndex === bloqueIndex ? {
            ...bloque,
            ejercicios: bloque.ejercicios.map((ejercicio, eIndex) => 
              eIndex === ejercicioIndex ? {
                ...ejercicio,
                usarPeso: !ejercicio.usarPeso
              } : ejercicio
            )
          } : bloque
        )
      }));
    };
    
    const toggleOpcionesTiempo = (bloqueIndex, ejercicioIndex) => {
      setRutina(prev => ({
        ...prev,
        bloques: prev.bloques.map((bloque, bIndex) => 
          bIndex === bloqueIndex ? {
            ...bloque,
            ejercicios: bloque.ejercicios.map((ejercicio, eIndex) => 
              eIndex === ejercicioIndex ? {
                ...ejercicio,
                usarTiempo: !ejercicio.usarTiempo
              } : ejercicio
            )
          } : bloque
        )
      }));
    };
  
    // Guardar la rutina
    const guardarRutina = () => {
      // Validaciones mejoradas antes de guardar
      if (!rutina.dia) {
        alert("Por favor selecciona un día para la rutina");
        return;
      }
      
      if (rutina.bloques.length === 0) {
        alert("Debes agregar al menos un bloque a la rutina");
        return;
      }
      
      // Validar que todos los bloques tengan al menos un ejercicio
      const bloquesVacios = rutina.bloques.filter(bloque => bloque.ejercicios.length === 0);
      if (bloquesVacios.length > 0) {
        alert("Todos los bloques deben tener al menos un ejercicio");
        return;
      }
      
      // Aquí implementarías la lógica para guardar la rutina en tu base de datos o sistema
      console.log("Rutina guardada:", rutina);
      alert("Rutina guardada correctamente");
      // navigate("/rutinas");
    };
  
    // Filtrar ejercicios por búsqueda
    const ejerciciosFiltrados = () => {
      if (!categoriaSeleccionada || !categorias[categoriaSeleccionada]) return [];
      
      if (!filtroEjercicios) return categorias[categoriaSeleccionada];
      
      return categorias[categoriaSeleccionada].filter(ejercicio => 
        ejercicio.toLowerCase().includes(filtroEjercicios.toLowerCase())
      );
    };
  
    if (cargando) {
      return (
        <div className="cargando-container">
          <div className="spinner"></div>
          <p>Cargando rutinas...</p>
        </div>
      );
    }
  
    return (
      <div className="crear-rutina-container">
        <header className="rutina-header">
          <h1>Crear Nueva Rutina</h1>
          <div className="rutina-info-card">
            <div className="form-group">
              <label>Día</label>
              <select 
                value={rutina.dia} 
                onChange={(e) => actualizarRutina("dia", e.target.value)}
                className="select-dia"
              >
                <option value="">Selecciona un día</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Descripción</label>
              <input 
                type="text" 
                value={rutina.descripcion} 
                onChange={(e) => actualizarRutina("descripcion", e.target.value)}
                placeholder="Ej. Entrenamiento de pecho y tríceps"
                className="input-descripcion"
              />
            </div>
          </div>
        </header>
        
        <div className="bloques-cascade">
          {rutina.bloques.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h2>Tu rutina está vacía</h2>
              <p>Comienza agregando bloques de ejercicios usando los botones de abajo</p>
            </div>
          ) : (
            rutina.bloques.map((bloque, bloqueIndex) => (
              <div key={bloqueIndex} className={`bloque-card ${bloque.tipo}`}>
                <div className="bloque-handle">
                  <div className="bloque-tipo-badge">{bloque.tipo}</div>
                </div>
                
                <div className="bloque-content">
                  <div className="bloque-header">
                    <input 
                      type="text" 
                      value={bloque.nombre} 
                      onChange={(e) => actualizarBloque(bloqueIndex, "nombre", e.target.value)}
                      className="bloque-titulo"
                      placeholder={`${bloque.tipo.charAt(0).toUpperCase() + bloque.tipo.slice(1)} sin título`}
                    />
                    
                    <button 
                      className="btn-eliminar-bloque" 
                      onClick={() => eliminarBloque(bloqueIndex)}
                      aria-label="Eliminar bloque"
                      title="Eliminar bloque"
                    >
                      <span className="icon">×</span>
                    </button>
                  </div>
                  
                  <div className="bloque-configuracion">
                    <div className="config-section">
                      {bloque.tipo !== "cardio" ? (
                        <div className="form-group">
                          <label>Series</label>
                          <input 
                            type="number" 
                            value={bloque.repeticionesSerie} 
                            onChange={(e) => actualizarBloque(bloqueIndex, "repeticionesSerie", parseInt(e.target.value) || 0)}
                            min="1"
                            className="input-number"
                          />
                        </div>
                      ) : (
                        <div className="form-group">
                          <label>Duración</label>
                          <div className="input-group">
                            <input 
                              type="number" 
                              value={bloque.duracion} 
                              onChange={(e) => actualizarBloque(bloqueIndex, "duracion", parseInt(e.target.value) || 0)}
                              min="1"
                              className="input-number"
                            />
                            <select 
                              value={bloque.unidadDuracion} 
                              onChange={(e) => actualizarBloque(bloqueIndex, "unidadDuracion", e.target.value)}
                              className="select-unidad"
                            >
                              <option value="segundos">seg</option>
                              <option value="minutos">min</option>
                            </select>
                          </div>
                        </div>
                      )}
                      
                      <div className="form-group">
                        <label>Descanso entre ejercicios</label>
                        <div className="input-group">
                          <input 
                            type="number" 
                            value={bloque.descansoEntreEjercicios} 
                            onChange={(e) => actualizarBloque(bloqueIndex, "descansoEntreEjercicios", parseInt(e.target.value) || 0)}
                            min="0"
                            className="input-number"
                          />
                          <span className="unidad">seg</span>
                        </div>
                      </div>
                      
                      {bloque.tipo !== "cardio" && (
                        <div className="form-group">
                          <label>Descanso entre series</label>
                          <div className="input-group">
                            <input 
                              type="number" 
                              value={bloque.descansoEntreSeries} 
                              onChange={(e) => actualizarBloque(bloqueIndex, "descansoEntreSeries", parseInt(e.target.value) || 0)}
                              min="0"
                              className="input-number"
                            />
                            <span className="unidad">seg</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ejercicios-section">
                    <h3>
                      <span className="ejercicios-icon">💪</span> 
                      Ejercicios
                    </h3>
                    
                    {bloque.ejercicios.length === 0 ? (
                      <div className="empty-ejercicios">
                        <p>Añade ejercicios a este bloque</p>
                      </div>
                    ) : (
                      <div className="ejercicios-lista">
                        {bloque.ejercicios.map((ejercicio, ejercicioIndex) => (
                          <div key={ejercicioIndex} className="ejercicio-card">
                            <div className="ejercicio-cr-header">
                              <h4>{ejercicio.nombre}</h4>
                              <div className="ejercicio-actions">
                                <button 
                                  className="btn-cambiar" 
                                  onClick={() => abrirSelectorEjercicio(bloqueIndex, ejercicioIndex)}
                                >
                                  Cambiar
                                </button>
                                <button 
                                  className="btn-eliminar-ejercicio" 
                                  onClick={() => eliminarEjercicio(bloqueIndex, ejercicioIndex)}
                                  aria-label="Eliminar ejercicio"
                                  title="Eliminar ejercicio"
                                >
                                  <span className="icon">×</span>
                                </button>
                              </div>
                            </div>
                            
                            <div className="ejercicio-detalles">
                              {bloque.tipo !== "cardio" && (
                                <div className="form-group">
                                  <label>Repeticiones</label>
                                  <input 
                                    type="number" 
                                    value={ejercicio.repeticionesEjercicio} 
                                    onChange={(e) => actualizarEjercicio(bloqueIndex, ejercicioIndex, "repeticionesEjercicio", parseInt(e.target.value) || 0)}
                                    min="1"
                                    className="input-number"
                                  />
                                </div>
                              )}
                              
                              <div className="opciones-toggle">
                                <div 
                                  className={`toggle-option ${ejercicio.usarPeso ? 'active' : ''}`}
                                  onClick={() => toggleOpcionesPeso(bloqueIndex, ejercicioIndex)}
                                >
                                  <span className="toggle-icon">⚖️</span>
                                  <span className="toggle-text">Peso</span>
                                  <span className={`toggle-switch ${ejercicio.usarPeso ? 'on' : 'off'}`}></span>
                                </div>
                                
                                <div 
                                  className={`toggle-option ${ejercicio.usarTiempo ? 'active' : ''}`}
                                  onClick={() => toggleOpcionesTiempo(bloqueIndex, ejercicioIndex)}
                                >
                                  <span className="toggle-icon">⏱️</span>
                                  <span className="toggle-text">Tiempo</span>
                                  <span className={`toggle-switch ${ejercicio.usarTiempo ? 'on' : 'off'}`}></span>
                                </div>
                              </div>
                              
                              {ejercicio.usarPeso && (
                                <div className="form-group option-animated">
                                  <label>Peso</label>
                                  <div className="input-group">
                                    <input 
                                      type="number" 
                                      value={ejercicio.peso} 
                                      onChange={(e) => actualizarEjercicio(bloqueIndex, ejercicioIndex, "peso", parseFloat(e.target.value) || 0)}
                                      min="0"
                                      step="0.5"
                                      className="input-number"
                                    />
                                    <select 
                                      value={ejercicio.unidadPeso} 
                                      onChange={(e) => actualizarEjercicio(bloqueIndex, ejercicioIndex, "unidadPeso", e.target.value)}
                                      className="select-unidad"
                                    >
                                      <option value="kg">kg</option>
                                      <option value="lb">lb</option>
                                    </select>
                                  </div>
                                </div>
                              )}
                              
                              {ejercicio.usarTiempo && (
                                <div className="form-group option-animated">
                                  <label>Tiempo</label>
                                  <div className="input-group">
                                    <input 
                                      type="number" 
                                      value={ejercicio.tiempo} 
                                      onChange={(e) => actualizarEjercicio(bloqueIndex, ejercicioIndex, "tiempo", parseInt(e.target.value) || 0)}
                                      min="0"
                                      className="input-number"
                                    />
                                    <select 
                                      value={ejercicio.unidadTiempo} 
                                      onChange={(e) => actualizarEjercicio(bloqueIndex, ejercicioIndex, "unidadTiempo", e.target.value)}
                                      className="select-unidad"
                                    >
                                      <option value="segundos">seg</option>
                                      <option value="minutos">min</option>
                                    </select>
                                  </div>
                                </div>
                              )}
                              
                              {bloque.tipo === "cardio" && (
                                <div className="form-group">
                                  <label>Intensidad</label>
                                  <select 
                                    value={ejercicio.intensidad || "moderada"} 
                                    onChange={(e) => actualizarEjercicio(bloqueIndex, ejercicioIndex, "intensidad", e.target.value)}
                                    className="select-intensidad"
                                  >
                                    <option value="baja">Baja</option>
                                    <option value="moderada">Moderada</option>
                                    <option value="alta">Alta</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <button 
                      className="btn-agregar-ejercicio" 
                      onClick={() => abrirSelectorEjercicio(bloqueIndex)}
                    >
                      <span className="icon">+</span> Agregar Ejercicio
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="agregar-bloque-section">
          <h2>Agregar bloque nuevo</h2>
          <div className="bloque-options">
            <div className="bloque-option" onClick={() => agregarBloque("serie")}>
              <div className="option-icon">🔄</div>
              <h3>Serie</h3>
              <p>Conjunto de repeticiones del mismo ejercicio</p>
            </div>
            
            <div className="bloque-option" onClick={() => agregarBloque("superserie")}>
              <div className="option-icon">⚡</div>
              <h3>Superserie</h3>
              <p>Varios ejercicios realizados en secuencia sin descanso</p>
            </div>
            
            <div className="bloque-option" onClick={() => agregarBloque("cardio")}>
              <div className="option-icon">🏃</div>
              <h3>Cardio</h3>
              <p>Ejercicios cardiovasculares medidos por tiempo</p>
            </div>
          </div>
        </div>
        
        <div className="acciones-footer">
          <button 
            onClick={guardarRutina} 
            className="btn-guardar" 
            disabled={rutina.bloques.length === 0 || !rutina.dia}
          >
            Guardar Rutina
          </button>
        </div>
        
        {/* Modal para seleccionar ejercicio */}
        {mostrarSelectorEjercicio && (
          <div className="modal-overlay">
            <div className="modal-ejercicio">
              <div className="modal-header">
                <h2>Seleccionar Ejercicio</h2>
                <button 
                  className="btn-cerrar-modal" 
                  onClick={() => setMostrarSelectorEjercicio(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <div className="busqueda-ejercicios">
                  <input
                    type="text"
                    placeholder="Buscar ejercicio..."
                    value={filtroEjercicios}
                    onChange={(e) => setFiltroEjercicios(e.target.value)}
                    className="input-busqueda"
                  />
                </div>
                
                <div className="categorias-container">
                  <h3>Categorías</h3>
                  <div className="categorias-grid">
                    {Object.keys(categorias).map(categoria => (
                      <div 
                        key={categoria} 
                        className={`categoria-item ${categoriaSeleccionada === categoria ? 'selected' : ''}`}
                        onClick={() => setCategoriaSeleccionada(categoria)}
                      >
                        {categoria}
                      </div>
                    ))}
                  </div>
                </div>
                
                {categoriaSeleccionada && (
                  <div className="ejercicios-seleccion">
                    <h3>Ejercicios de {categoriaSeleccionada}</h3>
                    {ejerciciosFiltrados().length > 0 ? (
                      <div className="ejercicios-grid">
                        {ejerciciosFiltrados().map((ejercicio, index) => (
                          <div 
                            key={index} 
                            className="ejercicio-seleccion-item"
                            onClick={() => seleccionarEjercicio(ejercicio)}
                          >
                            {ejercicio}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-ejercicios">
                        <p>No se encontraron ejercicios que coincidan con "{filtroEjercicios}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
