import React, { useState, useEffect } from 'react';
import './inicio.css';
import { Calendar, Clock, Award, Dumbbell, Users, Bell, Heart, BarChart2, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Inicio = ({setActiveIndex, userData}) => {
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

  // Datos de progreso de peso (ejemplo)
  const [datosProgresoPeso, setDatosProgresoPeso] = useState([
    { semana: 1, peso: 85 },
    { semana: 2, peso: 84.2 },
    { semana: 3, peso: 83.7 },
    { semana: 4, peso: 82.5 },
    { semana: 5, peso: 82.8 },
    { semana: 6, peso: 81.9 },
    { semana: 7, peso: 81.3 },
    { semana: 8, peso: 80.6 }
  ]);

  const [notificaciones, setNotificaciones] = useState(3);

  // Calcular estadísticas de peso
  const pesoInicial = datosProgresoPeso[0]?.peso || 0;
  const pesoActual = datosProgresoPeso[datosProgresoPeso.length - 1]?.peso || 0;
  const perdidaPeso = (pesoInicial - pesoActual).toFixed(1);
  const porcentajePerdido = ((pesoInicial - pesoActual) / pesoInicial * 100).toFixed(1);

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
    <div className="inicio-container">
      {/* Encabezado */}
      <header className="inicio-header">
        <div className="perfil-info">
          <div className="avatar">
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
            <h3>{'userData.proximaClase'}</h3>
          </div>
          <button className="boton-primario" onClick={()=>{setActiveIndex(1)}}>Ir a entrenamiento</button>
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
              <p className="metrica-label">{'userData.ultimoEntrenamiento'}</p>
            </div>
          </div>
          <div className="metrica">
            <div className="metrica-icono fuego">
              <Heart size={20} />
            </div>
            <div className="metrica-texto">
              <p className="metrica-valor">{'userData.calorias'}</p>
              <p className="metrica-label">Calorías quemadas</p>
            </div>
          </div>
          <div className="metrica">
            <div className="metrica-icono">
              <Clock size={20} />
            </div>
            <div className="metrica-texto">
              <p className="metrica-valor">{'userData.minutosEntrenados'} min</p>
              <p className="metrica-label">Tiempo entrenado</p>
            </div>
          </div>
        </div>

        <div className="progreso-contenedor">
          <div className="progreso-header">
            <p>Progreso semanal</p>
            <p>{'userData.progresoSemana'}%</p>
          </div>
          <div className="barra-progreso">
            <div 
              className="barra-progreso-relleno" 
              style={{ width: `${userData.progresoSemana}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Gráfico de progreso de peso */}
      <div className="tarjeta progreso-peso">
        <div className="tarjeta-header">
          <h2>Progreso de peso</h2>
          <TrendingDown size={20} color="#2ed573" />
        </div>
        
        <div className="resumen-peso">
          <div className="peso-stat">
            <span className="peso-valor">{pesoInicial} kg</span>
            <span className="peso-label">Peso inicial</span>
          </div>
          <div className="peso-stat actual">
            <span className="peso-valor">{pesoActual} kg</span>
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
                domain={['dataMin - 2', 'dataMax + 2']} 
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
                activeDot={{ r: 6, stroke: "#5352ed", strokeWidth: 2, fill: "white" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

     
    </div>
  );
};

export default Inicio;