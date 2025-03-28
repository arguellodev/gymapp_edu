// perfil.jsx
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  User,
  Clock,
  Calendar,
  Trophy,
  Activity,
  Heart,
  TrendingUp,
  Weight,
  Edit,
  Camera,
  Target,
  AlertCircle,
  Info,
} from "lucide-react";
import "./perfil.css";

const Perfil = ({ userData }) => {



  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const [datosProgresoPeso, setDatosProgresoPeso] = useState(
      JSON.parse(localStorage.getItem("registros-peso") || "[]")
    );
  
    const [datosProgresoMusculatura, setDatosProgresoMusculatura] = useState(
      JSON.parse(localStorage.getItem("registros-musculatura") || "[]")
    );
  
    const [datosProgresoGrasa, setDatosProgresoGrasa] = useState(
      JSON.parse(localStorage.getItem("registros-grasa") || "[]")
    );

  const [usuario, setUsuario] = useState({
    nombre: "Eduardo",
    edad: 28,
    peso: 75.5,
    altura: 180,
    objetivo: "Hipertrofia",
    nivel: "Intermedio",
    diasEntrenamiento: 5,
    fotoPerfil: "/api/placeholder/150/150",
  });

  

  const [estadisticas, setEstadisticas] = useState({
    entrenamientosCompletados: 125,
    diasConsecutivos: 14,
    caloríasQuemadas: 9560,
    horasEntrenadas: 76,
  });

  const [progresos, setProgresos] = useState([
    { fecha: "22/02/2025", peso: 85.6 },
    { fecha: "29/02/2025", peso: 84.2 },
    { fecha: "06/03/2025", peso: 83.7 },
    { fecha: "13/03/2025", peso: 82.5 },
    { fecha: "20/03/2025", peso: 82.8 },
    { fecha: "27/03/2025", peso: 81.9 },
    { fecha: "5/04/2025", peso: 81.3 },
    { fecha: "12/04/2025", peso: 80.6 },
  ]);
  const diasCompletados = localStorage.getItem("dias-completados");
  const sesionesCrossfit = localStorage.getItem("sesiones-crossfit");
  const registrosCrossfit = (() => {
    const data = localStorage.getItem("registros-crossfit");
    return data ? JSON.parse(data) : null;
})();
  const [showInfoFreqCard, setShowInfoFreqCard] = useState(false);

  // Cálculo de la frecuencia cardíaca
  const calcularFrecuenciaCardiaca = () => {
    // Fórmula de Karvonen para calcular la frecuencia cardíaca máxima
    const fcMaxima =
      220 -
      (new Date().getFullYear() -
        new Date(userData.informacionPersonal.fechaNacimiento).getFullYear() -
        (new Date() < new Date(new Date().getFullYear(), 4, 16) ? 1 : 0));

    // Zona de quema de grasa: típicamente entre 60-70% de la FC máxima
    const fcMinQuemaGrasa = Math.round(fcMaxima * 0.6);
    const fcMaxQuemaGrasa = Math.round(fcMaxima * 0.7);

    // Zona cardiovascular: típicamente entre 70-80% de la FC máxima
    const fcMinCardio = Math.round(fcMaxima * 0.7);
    const fcMaxCardio = Math.round(fcMaxima * 0.8);

    // Zona de alta intensidad: típicamente entre 80-90% de la FC máxima
    const fcMinAlta = Math.round(fcMaxima * 0.8);
    const fcMaxAlta = Math.round(fcMaxima * 0.9);

    // Cálculo del IMC
    const alturaEnMetros = userData.medidasCorporales.inicial.altura / 100;
    if(datosProgresoPeso.length > 0) {

      
    }
    const calcimc = () => {
    if(datosProgresoPeso.length > 0) {
      return (
        (
          datosProgresoPeso[datosProgresoPeso.length-1].peso /
          (alturaEnMetros * alturaEnMetros)
        ).toFixed(1)
      )
     
    }
    else{
      return 'No se puede calcular'
    }

    
  }
  const imc = calcimc();
    // Determinar la zona recomendada basada en el IMC
    let zonaRecomendada = "";
    if (imc < 18.5) {
      zonaRecomendada = "cardio";
    } else if (imc >= 18.5 && imc < 25) {
      zonaRecomendada = imc > 22 ? "quemaGrasa" : "cardio";
    } else {
      zonaRecomendada = "quemaGrasa";
    }

    return {
      fcMaxima,
      zonas: {
        quemaGrasa: { min: fcMinQuemaGrasa, max: fcMaxQuemaGrasa },
        cardio: { min: fcMinCardio, max: fcMaxCardio },
        alta: { min: fcMinAlta, max: fcMaxAlta },
      },
      zonaRecomendada,
      imc,
    };
  };

  const frecuenciaData = calcularFrecuenciaCardiaca();
  console.log(registrosCrossfit);
  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-info-principal">
          <h1>{userData.informacionPersonal.nombre}</h1>

          <button className="btn-editar-perfil">
            <Edit size={16} />
            <span>Editar perfil</span>
          </button>
        </div>
      </div>

      <div className="perfil-estadisticas">
        <div className="estadistica-card">
          <Activity />
          <h3>{diasCompletados ? diasCompletados : 0 }</h3>
          <p>Días de rutina completados</p>
        </div>
        {/*
        <div className="estadistica-card">
          <Calendar />
          <h3>{estadisticas.diasConsecutivos}</h3>
          <p>Días consecutivos entrenando</p>
        </div>*/}

        <div className="estadistica-card">
          <Clock />
          <h3>{sesionesCrossfit}</h3>
          <p>Sesiones de Crossfit totales</p>
        </div>
      </div>

      {/* Nuevo card de Frecuencia Cardíaca */}
      <div className="frecuencia-cardiaca-card">
        <div className="fc-card-header">
          <h2>
            <Heart size={20} /> Zonas de Frecuencia Cardíaca
            <button
              className="info-button"
              onClick={() => setShowInfoFreqCard(!showInfoFreqCard)}
            >
              <Info size={16} />
            </button>
          </h2>
          {showInfoFreqCard && (
            <div className="info-tooltip">
              <p>
                Las zonas de frecuencia cardíaca se calculan a partir de tu
                edad, peso y altura. Entrenar en la zona adecuada puede
                optimizar tus resultados.
              </p>
            </div>
          )}
        </div>

        <div className="fc-card-content">
          <div className="fc-stats">
            <div className="fc-stat-item">
              <span className="fc-label">FC Máxima:</span>
              <span className="fc-value">{frecuenciaData.fcMaxima} ppm</span>
            </div>
            <div className="fc-stat-item">
              <span className="fc-label">IMC:</span>
              <span className="fc-value">{frecuenciaData.imc} kg/m²</span>
            </div>
          </div>

          <div className="fc-zones">
            <div
              className={`fc-zone ${
                frecuenciaData.zonaRecomendada === "quemaGrasa"
                  ? "fc-recommended"
                  : ""
              }`}
            >
              <div className="fc-zone-header">
                <Target size={16} />
                <h3>Zona de Quema de Grasa</h3>
                {frecuenciaData.zonaRecomendada === "quemaGrasa" && (
                  <span className="recommended-tag">Recomendada</span>
                )}
              </div>
              <div className="fc-zone-range">
                <span>
                  {frecuenciaData.zonas.quemaGrasa.min} -{" "}
                  {frecuenciaData.zonas.quemaGrasa.max} ppm
                </span>
                <span className="fc-zone-percent">(60-70%)</span>
              </div>
              <p className="fc-zone-desc">
                Ideal para sesiones largas de cardio de baja intensidad.
                Maximiza la quema de grasa.
              </p>
            </div>

            <div
              className={`fc-zone ${
                frecuenciaData.zonaRecomendada === "cardio"
                  ? "fc-recommended"
                  : ""
              }`}
            >
              <div className="fc-zone-header">
                <Activity size={16} />
                <h3>Zona Cardiovascular</h3>
                {frecuenciaData.zonaRecomendada === "cardio" && (
                  <span className="recommended-tag">Recomendada</span>
                )}
              </div>
              <div className="fc-zone-range">
                <span>
                  {frecuenciaData.zonas.cardio.min} -{" "}
                  {frecuenciaData.zonas.cardio.max} ppm
                </span>
                <span className="fc-zone-percent">(70-80%)</span>
              </div>
              <p className="fc-zone-desc">
                Mejora la capacidad aeróbica y resistencia. Equilibrio entre
                quema de grasa y rendimiento.
              </p>
            </div>

            <div
              className={`fc-zone ${
                frecuenciaData.zonaRecomendada === "alta"
                  ? "fc-recommended"
                  : ""
              }`}
            >
              <div className="fc-zone-header">
                <AlertCircle size={16} />
                <h3>Zona de Alta Intensidad</h3>
                {frecuenciaData.zonaRecomendada === "alta" && (
                  <span className="recommended-tag">Recomendada</span>
                )}
              </div>
              <div className="fc-zone-range">
                <span>
                  {frecuenciaData.zonas.alta.min} -{" "}
                  {frecuenciaData.zonas.alta.max} ppm
                </span>
                <span className="fc-zone-percent">(80-90%)</span>
              </div>
              <p className="fc-zone-desc">
                Para entrenamientos cortos e intensos. Mejora el rendimiento y
                resistencia anaeróbica.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="perfil-secciones">
        <section className="perfil-seccion">
          <h2>Información personal</h2>
          <div className="perfil-datos">
            <div className="dato-item">
              <User size={16} />
              <p>
                <strong>Edad:</strong>{" "}
                {new Date().getFullYear() -
                  new Date(
                    userData.informacionPersonal.fechaNacimiento
                  ).getFullYear() -
                  (new Date() < new Date(new Date().getFullYear(), 4, 16)
                    ? 1
                    : 0)}{" "}
                años
              </p>
            </div>
            <div className="dato-item">
              <Weight size={16} />
              <p>
                <strong>Peso:</strong> {datosProgresoPeso.length > 0 ? `${datosProgresoPeso[datosProgresoPeso.length - 1].peso} Kg`: 'Sin registros' }{" "}
              
              </p>
            </div>
            <div className="dato-item">
              <TrendingUp size={16} />
              <p>
                <strong>Altura:</strong>{" "}
                {userData.medidasCorporales.inicial.altura} cm
              </p>
            </div>
            <div className="dato-item">
              <Trophy size={16} />
              <p>
                <strong>Objetivo:</strong> {usuario.objetivo}
              </p>
            </div>
            <div className="dato-item">
              <Calendar size={16} />
              <p>
                <strong>Días de entrenamiento:</strong>{" "}
                {usuario.diasEntrenamiento} días/semana
              </p>
            </div>
          </div>
        </section>

        <section className="perfil-seccion progreso-seccion">
          <h2>Progreso de peso</h2>
          <div className="progreso-lista">
            {datosProgresoPeso.map((item, index) => (
              <div key={index} className="progreso-item">
                <div className="progreso-fecha">{item.fecha}</div>
                <div className="progreso-valor">{item.peso} kg</div>
                {index < datosProgresoPeso.length - 1 ? (
                  <div
                    className={`progreso-cambio ${
                      item.peso < datosProgresoPeso[index + 1].peso
                        ? "positivo"
                        : "negativo"
                    }`}
                  >
                    {(datosProgresoPeso[index + 1].peso - item.peso).toFixed(1)} kg
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
        <section className="perfil-seccion registros-crossfit">
      <h2 className="text-2xl font-bold mb-4">Registros de Crossfit</h2>
      <div className="registros-crossfit-lista space-y-3">
        {registrosCrossfit?.map((item, index) => (
          <div 
            key={index} 
            className={`crossfit-registro-item border rounded-lg shadow-sm transition-all duration-300 ease-in-out 
              ${expandedIndex === index ? 'expanded' : ''}`}
          >
            <div 
              className="registro-crossfit-header flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center space-x-3">
                <p className="registro-crossfit-tipo font-semibold text-lg">{item.tipo}</p>
                <p className="registro-crossfit-fecha text-gray-500">Fecha: {item.fecha}</p>
              </div>
              {expandedIndex === index ? (
                <ChevronUp className="text-gray-600" />
              ) : (
                <ChevronDown className="text-gray-600" />
              )}
            </div>
            
            {expandedIndex === index && (
              <div className="registro-crossfit-informacion p-4 bg-gray-50 rounded-b-lg">
                {item.rondas && (
                  <div className="flex justify-between border-b py-2">
                    <span>Intervalos:</span>
                    <span className="font-medium">{item.rondas}</span>
                  </div>
                )}
                {item.tiempo && (
                  <div className="flex justify-between border-b py-2">
                    <span>Tiempo total:</span>
                    <span className="font-medium">{item.tiempo}</span>
                  </div>
                )}
                {item.trabajo && (
                  <div className="flex justify-between border-b py-2">
                    <span>Tiempo de trabajo:</span>
                    <span className="font-medium">{item.trabajo} segundos</span>
                  </div>
                )}
                {item.descanso && (
                  <div className="flex justify-between border-b py-2">
                    <span>Tiempo de descanso:</span>
                    <span className="font-medium">{item.descanso} segundos</span>
                  </div>
                )}
                {item.listaEjercicios && (
                  <div className="flex flex-col py-2">
                    <span className="mb-2">Ejercicios realizados:</span>
                    <span className="font-medium">{item.listaEjercicios}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {registrosCrossfit === null && <h1>Aún no has realizado sesiones de Crossfit</h1>}
      </div>
    </section>
      </div>
    </div>
  );
};

export default Perfil;
