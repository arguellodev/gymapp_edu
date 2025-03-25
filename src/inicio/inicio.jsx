import React, { useState, useEffect } from "react";
import "./inicio.css";
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
  const [fechaHoy, setFechaHoy] = useState(new Date().toISOString().split('T')[0]);
  const [medicionParametro, setMedicionParametro] = useState(null);
  const [valorMedicion, setValorMedicion] = useState('');

  const progresoActual = localStorage?.getItem("rutina-progreso-actual") || 0;


  useEffect(() => {
    // Verificar si ya están en localStorage
    const rutinasGuardadas = localStorage.getItem("rutinas");

    if (!rutinasGuardadas) {
      // Si no existen, guardar los JSON iniciales
      localStorage.setItem("rutinas", JSON.stringify([rutinaData3]));
    }
  }, []);

  console.log(progresoActual);
  // Estado para datos de usuario y gimnasio (normalmente vendría de una API)
  /*
  const [userData, setUserData] = useState({
    nombre: datosUsuario.informacionPersonal.nombre,
    proximaClase: "Pecho y Tríceps",
    ultimoEntrenamiento: "Hace 2 días",
    progresoSemana: 75,
    calorias: 2340,
    minutosEntrenados: 143,
  });*/
  useEffect(() => {
    // Verificar si ya están en localStorage
    const rutinasGuardadas = localStorage.getItem("rutinas");

    if (!rutinasGuardadas) {
      // Si no existen, guardar los JSON iniciales
      localStorage.setItem("rutinas", JSON.stringify([rutinaData3]));
    }
  }, []);

  // Datos de progreso de peso (ejemplo)
  const [datosProgresoPeso, setDatosProgresoPeso] = useState([
    { semana: 1, peso: 85 },
    { semana: 2, peso: 84.2 },
    { semana: 3, peso: 83.7 },
    { semana: 4, peso: 82.5 },
    { semana: 5, peso: 82.8 },
    { semana: 6, peso: 81.9 },
    { semana: 7, peso: 81.3 },
    { semana: 8, peso: 80.6 },
  ]);

  const [datosProgresoMusculatura, setDatosProgresoMusculatura] = useState([
    { semana: 1, musculo: 30 },
    { semana: 2, musculo: 31 },
    { semana: 3, musculo: 32 },
    { semana: 4, musculo: 33.5 },
    { semana: 5, musculo: 34 },
    { semana: 6, musculo: 35 },
    { semana: 7, musculo: 36 },
    { semana: 8, musculo: 37 },
  ]);
  

  const [datosProgresoGrasa, setDatosProgresoGrasa] = useState([
    { semana: 1, grasa: 35 },
    { semana: 2, grasa: 33.8 },
    { semana: 3, grasa: 32.5 },
    { semana: 4, grasa: 31 },
    { semana: 5, grasa: 30 },
    { semana: 6, grasa: 28.5 },
    { semana: 7, grasa: 27.2 },
    { semana: 8, grasa: 26 },
  ]);
  
  const handleRegistrarMedicion = () => {
    const nuevoValor = parseFloat(valorMedicion);
    
    if (isNaN(nuevoValor)) {
      alert('Por favor, ingresa un valor válido');
      return;
    }

    const nuevaEntrada = { 
      semana: datosProgresoPeso.length + 1, 
      [selectorProgreso]: nuevoValor 
    };

    switch(selectorProgreso) {
      case 'peso':
        setDatosProgresoPeso(prev => [...prev, nuevaEntrada]);
        break;
      case 'musculatura':
        setDatosProgresoMusculatura(prev => [...prev, nuevaEntrada]);
        break;
      case 'grasa':
        setDatosProgresoGrasa(prev => [...prev, nuevaEntrada]);
        break;
    }

    // Resetear estados
    setMedicionParametro(null);
    setValorMedicion('');
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
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="grafico-tooltip">
          <p className="tooltip-label">Semana {label}</p>
          <p className="tooltip-data">{`Peso: ${payload[0].value} kg`}</p>
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
            <div className="clase-info">
              <h3></h3>
            </div>
            <button
              className="boton-primario"
              onClick={() => {
                setActiveIndex(1);
              }}
            >
              Continuar entrenamiento
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
                <p className="metrica-valor">Último entrenamiento</p>
                <p className="metrica-label">
                  {"userData.ultimoEntrenamiento"}
                </p>
              </div>
            </div>
            <div className="metrica">
              <div className="metrica-icono fuego">
                <Heart size={20} />
              </div>
              <div className="metrica-texto">
                <p className="metrica-valor">{"userData.calorias"}</p>
                <p className="metrica-label">Calorías quemadas</p>
              </div>
            </div>
            <div className="metrica">
              <div className="metrica-icono">
                <Clock size={20} />
              </div>
              <div className="metrica-texto">
                <p className="metrica-valor">
                  {"userData.minutosEntrenados"} min
                </p>
                <p className="metrica-label">Tiempo entrenado</p>
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
            <p className={`selector-progreso-item ${selectorProgreso === 'peso'&& 'active' }`} onClick={()=>{setSelectorProgreso('peso')}}>Peso</p>
            <p className={`selector-progreso-item ${selectorProgreso === 'musculatura'&& 'active' }`} onClick={()=>{setSelectorProgreso('musculatura')}}>Musculatura</p>
            <p className={`selector-progreso-item ${selectorProgreso === 'grasa'&& 'active' }`} onClick={()=>{setSelectorProgreso('grasa')}}>Grasa</p>
          </div>
        </div>
        
        {selectorProgreso === 'peso'
         ? 
         <div className="tarjeta progreso-peso">
          <div className="tarjeta-header">
            <h2>Progreso de peso</h2>
            <TrendingDown size={20} color="#2ed573" />
          </div>

          <div className="resumen-peso">
            <div className="peso-stat">
              <span className="peso-valor">
                {userData.medidasCorporales.inicial.peso} kg
              </span>
              <span className="peso-label">Peso inicial</span>
            </div>
            <div className="peso-stat actual">
              <span className="peso-valor">
                {userData.medidasCorporales.actual.peso} kg
              </span>
              <span className="peso-label">Peso actual</span>
            </div>
            <div className="peso-stat perdida">
              <span className="peso-valor">-{perdidaPeso} kg</span>
              <span className="peso-label">{porcentajePerdido}% perdido</span>
            </div>
          </div>

          <div className="grafico-contenedor">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart
                data={datosProgresoPeso}
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
                <Tooltip content={<CustomTooltip />} />
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
            onClick={() => setMedicionParametro('peso')}
            >Registrar peso</button>
          </div>
        </div>
         : 
        selectorProgreso === 'musculatura' 
        ?
        <div className="tarjeta progreso-peso">
        <div className="tarjeta-header">
          <h2>Progreso de Musculatura</h2>
          <TrendingDown size={20} color="#2ed573" />
        </div>

        <div className="resumen-peso">
          <div className="peso-stat">
            <span className="peso-valor">
              {userData.medidasCorporales.inicial.peso} kg
            </span>
            <span className="peso-label">% Musculatura Inicial</span>
          </div>
          <div className="peso-stat actual">
            <span className="peso-valor">
              {userData.medidasCorporales.actual.peso} kg
            </span>
            <span className="peso-label">% Musculatura actual</span>
          </div>
          <div className="peso-stat perdida">
            <span className="peso-valor">-{perdidaPeso} kg</span>
            <span className="peso-label">{porcentajePerdido}% perdido</span>
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
              <Tooltip content={<CustomTooltip />} />
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
          onClick={() => setMedicionParametro('musculatura')}
          >Registrar %Musculatura</button>
        </div>
      </div>
      : 
      <div className="tarjeta progreso-peso">
          <div className="tarjeta-header">
            <h2>Progreso de Grasa</h2>
            <TrendingDown size={20} color="#2ed573" />
          </div>

          <div className="resumen-peso">
            <div className="peso-stat">
              <span className="peso-valor">
                {userData.medidasCorporales.inicial.peso} kg
              </span>
              <span className="peso-label">Peso inicial</span>
            </div>
            <div className="peso-stat actual">
              <span className="peso-valor">
                {userData.medidasCorporales.actual.peso} kg
              </span>
              <span className="peso-label">%Grasa actual</span>
            </div>
            <div className="peso-stat perdida">
              <span className="peso-valor">-{perdidaPeso} kg</span>
              <span className="peso-label">{porcentajePerdido}% perdido</span>
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
                <Tooltip content={<CustomTooltip />} />
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
            onClick={() => setMedicionParametro('grasa')}
            >Registrar %Grasa</button>
          </div>
        </div>
      
      }
      
      


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
              <label>{selectorProgreso.charAt(0).toUpperCase() + selectorProgreso.slice(1)}:</label>
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
                <span>Editar mi perfil</span>
              </li>
              <li className="settings-item pro-upgrade">
                <i className="settings-icon upgrade-icon">
                  <CgPerformance />
                </i>
                <span>Mi progreso</span>
              </li>
              <li className="settings-item pro-upgrade">
                <i className="settings-icon upgrade-icon">
                  <FaChalkboardTeacher />
                </i>
                <span>Conoce a tus coach</span>
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
                <span>Cerrar sesión</span>
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
