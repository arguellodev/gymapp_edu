import React, { useState, useEffect } from "react";
import "./inicio.css";
import EditorPerfil from "./editor";
import {
  Calendar,
  Clock,
  Award,
  Dumbbell,
  Users,
  Bell,
  Heart,
  BarChart2,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import rutinaData from "../data/rutina.json";
import rutinaData2 from "../data/rutina2.json";
import rutinaData3 from "../data/rutina3.json";
import { MdEdit } from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GiUpgrade } from "react-icons/gi";
import { CgPerformance } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";

const Inicio = ({ setActiveIndex, userData }) => {
  const [selectorProgreso, setSelectorProgreso] = useState("peso");
  const [navbarLateral, setNavbarLateral] = useState(false);
  const [medicionPeso, setMedicionPeso] = useState(false);
  const [fechaHoy, setFechaHoy] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [medicionParametro, setMedicionParametro] = useState(null);
  const [valorMedicion, setValorMedicion] = useState("");
  const [editorAbierto, setEditorAbierto] = useState(false);
  const progresoActual = localStorage?.getItem("rutina-progreso-actual") || 0;
  const diasCompletados = localStorage.getItem("dias-completados");
  const sesionesCrossfit = localStorage.getItem("sesiones-crossfit");
  const rutinaActual = JSON.parse(localStorage.getItem("rutina-actual"));
  const ultimoEntreno = localStorage.getItem("ultimo-entrenamiento");

  const fechaRutina = new Date();
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  function borrarLocalStorage() {
    if (confirm("¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.")) {
        localStorage.clear();
        location.reload(); // Recarga la página
    }
}

  const diaActual = diasSemana[fechaRutina.getDay()];
  const indiceDia = rutinaActual?.rutina.findIndex(
    (dia) => dia.dia === diaActual
  );

  // Inicializar los estados con datos de localStorage
  const [datosProgresoPeso, setDatosProgresoPeso] = useState(
    JSON.parse(localStorage.getItem("registros-peso") || "[]")
  );

  const [datosProgresoMusculatura, setDatosProgresoMusculatura] = useState(
    JSON.parse(localStorage.getItem("registros-musculatura") || "[]")
  );

  const [datosProgresoGrasa, setDatosProgresoGrasa] = useState(
    JSON.parse(localStorage.getItem("registros-grasa") || "[]")
  );

  useEffect(() => {
    // Verificar si ya están en localStorage
    const rutinasGuardadas = localStorage.getItem("rutinas");

    if (!rutinasGuardadas) {
      // Si no existen, guardar los JSON iniciales
      localStorage.setItem("rutinas", JSON.stringify([rutinaData3]));
    }
  }, []);

  // Función modificada para guardar en localStorage
  const handleRegistrarMedicion = () => {
    const nuevoValor = parseFloat(valorMedicion);

    if (isNaN(nuevoValor)) {
      alert("Por favor, ingresa un valor válido");
      return;
    }

    let datosActualizados = [];
    let storageKey = "";
    let dataKey = "";

    // Determinar la clave correcta según el tipo de medición
    switch (selectorProgreso) {
      case "peso":
        dataKey = "peso";
        storageKey = "registros-peso";
        datosActualizados = [...datosProgresoPeso];
        break;
      case "musculatura":
        dataKey = "musculo"; // Usar 'musculo' en lugar de 'musculatura'
        storageKey = "registros-musculatura";
        datosActualizados = [...datosProgresoMusculatura];
        break;
      case "grasa":
        dataKey = "grasa";
        storageKey = "registros-grasa";
        datosActualizados = [...datosProgresoGrasa];
        break;
    }

    // Crear nueva entrada con semana y fecha
    const nuevaEntrada = {
      semana: datosActualizados.length + 1,
      [dataKey]: nuevoValor, // Usar la clave correcta
      fecha: fechaHoy,
    };

    // Añadir la nueva entrada
    datosActualizados.push(nuevaEntrada);

    // Guardar en localStorage
    localStorage.setItem(storageKey, JSON.stringify(datosActualizados));

    // Actualizar el estado correspondiente
    switch (selectorProgreso) {
      case "peso":
        setDatosProgresoPeso(datosActualizados);
        break;
      case "musculatura":
        setDatosProgresoMusculatura(datosActualizados);
        break;
      case "grasa":
        setDatosProgresoGrasa(datosActualizados);
        break;
    }

    // Resetear estados
    setMedicionParametro(null);
    setValorMedicion("");
  };

  const ultimoEntrenamiento = JSON.parse(
    localStorage.getItem("rutina-navegacion")
  );

  const [notificaciones, setNotificaciones] = useState(3);

  // Calcular estadísticas de peso
  const pesoInicial = datosProgresoPeso[0]?.peso || 0;
  const pesoActual = datosProgresoPeso[datosProgresoPeso.length - 1]?.peso || 0;
  const perdidaPeso = (
    userData.medidasCorporales.inicial.peso -
    userData.medidasCorporales.actual.peso
  ).toFixed(1);
  const porcentajePerdido = (
    ((userData.medidasCorporales.inicial.peso -
      userData.medidasCorporales.actual.peso) /
      userData.medidasCorporales.inicial.peso) *
    100
  ).toFixed(1);

  // Simular carga de datos
  useEffect(() => {
    // Aquí iría la llamada a tu API
    console.log("Cargando datos de usuario...");
  }, []);

  // Personalizar el tooltip del gráfico
  const CustomTooltip = ({ active, payload, label, type }) => {
    if (active && payload && payload.length) {
      // Obtener datos según el tipo seleccionado
      let data;
      switch (type) {
        case "Peso":
          data = datosProgresoPeso[label - 1];
          break;
        case "Musculo":
          data = datosProgresoMusculatura[label - 1];
          break;
        case "Grasa":
          data = datosProgresoGrasa[label - 1];
          break;
      }

      return (
        <div className="grafico-tooltip">
          <p className="tooltip-label">
            Fecha: {data?.fecha || `Semana ${label}`}
          </p>
          {type === "Peso" && (
            <p className="tooltip-data">{`${type}: ${payload[0].value} kg`}</p>
          )}
          {type === "Grasa" && (
            <p className="tooltip-data">{`${type}: ${payload[0].value} % Grasa`}</p>
          )}
          {type === "Musculo" && (
            <p className="tooltip-data">{`${type}: ${payload[0].value} % Musculatura`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="inicio-container">
        {/* Encabezado */}
        <header className="inicio-header">
          <div className="perfil-info">
            <div className="avatar" onClick={() => setNavbarLateral(true)}>
              {userData.informacionPersonal.nombre.charAt(0)}
            </div>
            <div>
              <h1>Hola, {userData.informacionPersonal.nombre}</h1>
              <p>¡Hoy es un gran día para entrenar!</p>
            </div>
          </div>
          {/*
        <div className="notificacion-badge">
          <Bell size={24} />
          {notificaciones > 0 && <span className="badge">{notificaciones}</span>}
        </div>

        */}
        </header>

        {/* Tarjeta de próxima clase */}
        <div className="tarjeta proxima-clase">
          <div className="tarjeta-header">
            <h2>Tu próximo entrenamiento</h2>
            <Clock size={20} />
          </div>
          <div className="clase-content">
            {rutinaActual ? (
              <div className="clase-info">
                <h3>{rutinaActual.rutina[indiceDia].descripcion}</h3>
                <p>Hoy - {diaActual}</p>
              </div>
            ) : (
              <div className="clase-info">
                <h3>No has seleccionado alguna rutina</h3>
              </div>
            )}

            <button
              className="boton-primario"
              onClick={() => {
                setActiveIndex(1);
              }}
            >
              Ir a entrenamiento
            </button>
          </div>
        </div>

        {/* Resumen de actividad */}
        <div className="tarjeta resumen-actividad">
          <div className="tarjeta-header">
            <h2>Tu actividad</h2>
            <BarChart2 size={20} />
          </div>
          <div className="metricas">
            <div className="metrica">
              <div className="metrica-icono">
                <Dumbbell size={20} />
              </div>
              <div className="metrica-texto">
                <p className="metrica-valor">
                  {ultimoEntreno ? ultimoEntreno : "Aun no has entrenado"}
                </p>
                <p className="metrica-label">{"Ultimo entrenamiento"}</p>
              </div>
            </div>
            <div className="metrica">
              <div className="metrica-icono fuego">
                <Heart size={20} />
              </div>
              <div className="metrica-texto">
                <p className="metrica-valor">
                  {sesionesCrossfit ? sesionesCrossfit : 0}
                </p>
                <p className="metrica-label">Sesiones Totales de Crossfit</p>
              </div>
            </div>
            <div className="metrica">
              <div className="metrica-icono">
                <Clock size={20} />
              </div>
              <div className="metrica-texto">
                <p className="metrica-valor">
                  {diasCompletados ? diasCompletados : 0}
                </p>
                <p className="metrica-label">Días de Rutina Completados</p>
              </div>
            </div>
          </div>

          <div className="progreso-contenedor">
            <div className="progreso-header">
              <p>Progreso semanal</p>
              <p>{progresoActual}%</p>
            </div>
            <div className="barra-progreso">
              <div
                className="barra-progreso-relleno"
                style={{ width: `${progresoActual}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="selector-progreso-container">
          <p>Mi progreso</p>
          <div className="selector-progreso">
            <p
              className={`selector-progreso-item ${
                selectorProgreso === "peso" && "active"
              }`}
              onClick={() => {
                setSelectorProgreso("peso");
              }}
            >
              Peso
            </p>
            <p
              className={`selector-progreso-item ${
                selectorProgreso === "musculatura" && "active"
              }`}
              onClick={() => {
                setSelectorProgreso("musculatura");
              }}
            >
              Musculatura
            </p>
            <p
              className={`selector-progreso-item ${
                selectorProgreso === "grasa" && "active"
              }`}
              onClick={() => {
                setSelectorProgreso("grasa");
              }}
            >
              Grasa
            </p>
          </div>
        </div>

        {selectorProgreso === "peso" ? (
          <div className="tarjeta progreso-peso">
            <div className="tarjeta-header">
              <h2>Progreso de peso</h2>
              <TrendingDown size={20} color="#2ed573" />
            </div>
            {datosProgresoPeso.length > 0 ?
            <>
            <div className="resumen-peso">
              <div className="peso-stat">
                <span className="peso-valor">
                  {datosProgresoPeso[0].peso} kg
                </span>
                <span className="peso-label">Peso inicial</span>
              </div>
              <div className="peso-stat actual">
                <span className="peso-valor">
                  {datosProgresoPeso[datosProgresoPeso.length-1].peso} kg
                </span>
                <span className="peso-label">Peso actual</span>
              </div>
              <div className="peso-stat perdida">
                <span className="peso-valor">{(datosProgresoPeso[datosProgresoPeso.length-1].peso-datosProgresoPeso[0].peso).toFixed(2)} kg</span>
                <span className="peso-label">{(100 -(datosProgresoPeso[datosProgresoPeso.length-1].peso *100/datosProgresoPeso[0].peso)).toFixed(2)}% perdido</span>
              </div>
            </div>

            <div className="grafico-contenedor">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={datosProgresoPeso}
                  margin={{ top: 10, right: 10, left: 5, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="semana"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `S${value}`}
                  />
                  <YAxis
                    domain={["dataMin - 2", "dataMax + 2"]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    width={30}
                  />
                  <Tooltip
                    content={(props) => (
                      <CustomTooltip {...props} type="Peso" />
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="peso"
                    stroke="#5352ed"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{
                      r: 6,
                      stroke: "#5352ed",
                      strokeWidth: 2,
                      fill: "white",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <button
                className="boton-medir-parametro"
                onClick={() => setMedicionParametro("peso")}
              >
                Registrar peso
              </button>
            </div>
            </>
            :
            <div className="inicio-sin-registros">
            <p>Aún no has agregado registros de peso</p>
            <button
                className="boton-medir-parametro"
                onClick={() => setMedicionParametro("peso")}
              >
                Registrar peso
              </button>
            </div>
            
            
            }
            
          </div>

        ) : selectorProgreso === "musculatura" ? (
          <div className="tarjeta progreso-peso">
            <div className="tarjeta-header">
              <h2>Progreso de Musculatura</h2>
              <TrendingDown size={20} color="#2ed573" />
            </div>
            {datosProgresoMusculatura.length > 0 ? 
            <>
              <div className="resumen-peso">
              <div className="peso-stat">
                <span className="peso-valor">
                  {datosProgresoMusculatura[0].musculo}%
                </span>
                <span className="peso-label">% Musculatura Inicial</span>
              </div>
              <div className="peso-stat actual">
                <span className="peso-valor">
                  {userData.medidasCorporales.actual.musculatura ||
                    datosProgresoMusculatura[
                      datosProgresoMusculatura.length - 1
                    ]?.musculo ||
                    "30"}
                  %
                </span>
                <span className="peso-label">% Musculatura actual</span>
              </div>
              <div className="peso-stat perdida">
                <span className="peso-valor">
                  {(
                    (userData.medidasCorporales.actual.musculatura ||
                      datosProgresoMusculatura[
                        datosProgresoMusculatura.length - 1
                      ]?.musculo ||
                      30) - (datosProgresoMusculatura[0].musculo || 30)
                  ).toFixed(1)}
                  %
                </span>
                <span className="peso-label">Ganancia</span>
              </div>
            </div>

            <div className="grafico-contenedor">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={datosProgresoMusculatura}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="semana"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `S${value}`}
                  />
                  <YAxis
                    domain={["dataMin - 2", "dataMax + 2"]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    width={30}
                  />
                  <Tooltip
                    content={(props) => (
                      <CustomTooltip {...props} type="Musculo" />
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="musculo"
                    stroke="#5352ed"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{
                      r: 6,
                      stroke: "#5352ed",
                      strokeWidth: 2,
                      fill: "white",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <button
                className="boton-medir-parametro"
                onClick={() => setMedicionParametro("musculatura")}
              >
                Registrar %Musculatura
              </button>
            </div>
            </>
            
            : 
            <div className="inicio-sin-registros">
            <p>Aún no has registrado algún % de Musculatura</p>
            <button
                className="boton-medir-parametro"
                onClick={() => setMedicionParametro("musculatura")}
              >
                Registrar %Musculatura
            </button>
            
            </div>
            
            }
            
          </div>
        ) : (
          <div className="tarjeta progreso-peso">
            <div className="tarjeta-header">
              <h2>Progreso de Grasa</h2>
              <TrendingDown size={20} color="#2ed573" />
            </div>
            {datosProgresoGrasa > 0 
            ?
            <>
             <div className="resumen-peso">
              <div className="peso-stat">
                <span className="peso-valor">
                  {datosProgresoGrasa[0].grasa || "35"}%
                </span>
                <span className="peso-label">% Grasa inicial</span>
              </div>
              <div className="peso-stat actual">
                <span className="peso-valor">
                  {userData.medidasCorporales.actual.grasa ||
                    datosProgresoGrasa[datosProgresoGrasa.length - 1]?.grasa ||
                    "35"}
                  %
                </span>
                <span className="peso-label">%Grasa actual</span>
              </div>
              <div className="peso-stat perdida">
                <span className="peso-valor">
                  -
                  {(
                    (datosProgresoGrasa[0].grasa || 35) -
                    (userData.medidasCorporales.actual.grasa ||
                      datosProgresoGrasa[datosProgresoGrasa.length - 1]
                        ?.grasa ||
                      35)
                  ).toFixed(1)}
                  %
                </span>
                <span className="peso-label">Reducción</span>
              </div>
            </div>

            <div className="grafico-contenedor">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={datosProgresoGrasa}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="semana"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `S${value}`}
                  />
                  <YAxis
                    domain={["dataMin - 2", "dataMax + 2"]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    width={30}
                  />
                  <Tooltip
                    content={(props) => (
                      <CustomTooltip {...props} type="Grasa" />
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="grasa"
                    stroke="#5352ed"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{
                      r: 6,
                      stroke: "#5352ed",
                      strokeWidth: 2,
                      fill: "white",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <button
                className="boton-medir-parametro"
                onClick={() => setMedicionParametro("grasa")}
              >
                Registrar %Grasa
              </button>
            </div>
            </>
            
            :
            <div className="inicio-sin-registros">
            <p>Aún no has ingresado algún registro de % de grasa</p>
             <button
                className="boton-medir-parametro"
                onClick={() => setMedicionParametro("grasa")}
              >
                Registrar %Grasa
              </button>
            
            </div>
            }
           
          </div>
        )}
      </div>

      {medicionParametro && (
        <div className="medicion-parametro-overlay">
          <div className="medicion-parametro-container">
            <h2>Añadir medición de {selectorProgreso}</h2>
            <div className="form-group">
              <label htmlFor="fechaMedicion">Fecha de medición</label>
              <input
                type="date"
                id="fechaMedicion"
                name="fechaMedicion"
                value={fechaHoy}
                onChange={(e) => setFechaHoy(e.target.value)}
                required
              />
              <label>
                {selectorProgreso.charAt(0).toUpperCase() +
                  selectorProgreso.slice(1)}
                :
              </label>
              <input
                type="number"
                id="valorMedicion"
                name="valorMedicion"
                value={valorMedicion}
                onChange={(e) => setValorMedicion(e.target.value)}
                placeholder={`Ingresa ${selectorProgreso}`}
                required
              />
            </div>
            <div className="botones-medicion">
              <button
                type="button"
                className="boton-cancelar-medicion"
                onClick={() => setMedicionParametro(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="boton-guardar"
                onClick={handleRegistrarMedicion}
              >
                Guardar medición
              </button>
            </div>
          </div>
        </div>
      )}

      {editorAbierto && <EditorPerfil setEditorAbierto={setEditorAbierto} />}

      {
        <div className={`navbar-lateral ${navbarLateral ? "active" : ""}`}>
          <div className="perfil-info">
            <div className="avatar">
              {userData.informacionPersonal.nombre.charAt(0)}
            </div>
            <div>
              <h1>{userData.informacionPersonal.nombre}</h1>
              <p>Plan Pro</p>
            </div>
            <i
              className="cerrar-navbar"
              onClick={() => setNavbarLateral(false)}
            >
              <IoMdClose />
            </i>
          </div>

          <div className="divider"></div>

          <div className="card-settings">
            <ul className="settings-list">
              <li className="settings-item pro-upgrade">
                <i className="settings-icon upgrade-icon">
                  <MdEdit />
                </i>
                <span onClick={() => setEditorAbierto(true)}>
                  Editar mi perfil
                </span>
              </li>
              <li className="settings-item pro-upgrade">
                <i className="settings-icon upgrade-icon">
                  <CgPerformance />
                </i>
                <span
                  onClick={() => {
                    setActiveIndex(2);
                  }}
                >
                  Mi progreso
                </span>
              </li>

              <li className="settings-item pro-upgrade">
                <i className="settings-icon upgrade-icon">
                  <GiUpgrade />
                </i>
                <span>Mejorar a Plan Pro</span>
              </li>
            </ul>
            <ul className="settings-list menor">
              <li className="settings-item">
                <i className="settings-icon help-icon"></i>
                <span>Reportar problemas</span>
              </li>
              <li className="settings-item">
                <i className="settings-icon logout-icon"></i>
                <span>Contactar al desarrollador</span>
              </li>
              <li className="settings-item">
                <i className="settings-icon logout-icon"></i>
                <span onClick={()=> borrarLocalStorage()}>Borrar cuenta</span>
              </li>
            </ul>
            <h1>App desarrollada por Argánion</h1>
          </div>
        </div>
      }
    </>
  );
};

export default Inicio;
