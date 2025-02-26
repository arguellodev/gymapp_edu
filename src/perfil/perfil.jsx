// perfil.jsx
import React, { useState, useEffect } from 'react';
import { User, Clock, Calendar, Trophy, Activity, Heart, TrendingUp, Weight, Edit, Camera, Target, AlertCircle, Info } from 'lucide-react';
import './perfil.css';

const Perfil = () => {
  const [usuario, setUsuario] = useState({
    nombre: "Eduardo",
    edad: 28,
    peso: 75.5,
    altura: 180,
    objetivo: "Hipertrofia",
    nivel: "Intermedio",
    diasEntrenamiento: 5,
    fotoPerfil: "/api/placeholder/150/150"
  });

  const [estadisticas, setEstadisticas] = useState({
    entrenamientosCompletados: 125,
    diasConsecutivos: 14,
    caloríasQuemadas: 9560,
    horasEntrenadas: 76
  });

  const [progresos, setProgresos] = useState([
    { fecha: "22/02/2025", peso: 85.6 },
    { fecha: "29/02/2025", peso: 84.2 },
    { fecha: "06/03/2025", peso: 83.7 },
    { fecha: "13/03/2025", peso: 82.5 },
    { fecha: "20/03/2025", peso: 82.8 },
    { fecha: "27/03/2025", peso: 81.9 },
    { fecha: "5/04/2025", peso: 81.3 },
    { fecha: "12/04/2025", peso: 80.6 }
  ]);

  const [showInfoFreqCard, setShowInfoFreqCard] = useState(false);

  // Cálculo de la frecuencia cardíaca
  const calcularFrecuenciaCardiaca = () => {
    // Fórmula de Karvonen para calcular la frecuencia cardíaca máxima
    const fcMaxima = 220 - usuario.edad;
    
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
    const alturaEnMetros = usuario.altura / 100;
    const imc = (usuario.peso / (alturaEnMetros * alturaEnMetros)).toFixed(1);
    
    // Determinar la zona recomendada basada en el IMC
    let zonaRecomendada = '';
    if (imc < 18.5) {
      zonaRecomendada = 'cardio';
    } else if (imc >= 18.5 && imc < 25) {
      zonaRecomendada = imc > 22 ? 'quemaGrasa' : 'cardio';
    } else {
      zonaRecomendada = 'quemaGrasa';
    }

    return {
      fcMaxima,
      zonas: {
        quemaGrasa: { min: fcMinQuemaGrasa, max: fcMaxQuemaGrasa },
        cardio: { min: fcMinCardio, max: fcMaxCardio },
        alta: { min: fcMinAlta, max: fcMaxAlta }
      },
      zonaRecomendada,
      imc
    };
  };

  const frecuenciaData = calcularFrecuenciaCardiaca();

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        
        
        <div className="perfil-info-principal">
          <h1>{usuario.nombre}</h1>
         
          <button className="btn-editar-perfil">
            <Edit size={16} />
            <span>Editar perfil</span>
          </button>
        </div>
      </div>

      <div className="perfil-estadisticas">
        <div className="estadistica-card">
          <Activity />
          <h3>{estadisticas.entrenamientosCompletados}</h3>
          <p>Entrenamientos</p>
        </div>
        <div className="estadistica-card">
          <Calendar />
          <h3>{estadisticas.diasConsecutivos}</h3>
          <p>Días consecutivos</p>
        </div>
        <div className="estadistica-card">
          <Heart />
          <h3>{Math.round(estadisticas.caloríasQuemadas / 1000)}k</h3>
          <p>Calorías quemadas</p>
        </div>
        <div className="estadistica-card">
          <Clock />
          <h3>{estadisticas.horasEntrenadas}</h3>
          <p>Horas entrenadas</p>
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
              <p>Las zonas de frecuencia cardíaca se calculan a partir de tu edad, peso y altura. 
                 Entrenar en la zona adecuada puede optimizar tus resultados.</p>
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
            <div className={`fc-zone ${frecuenciaData.zonaRecomendada === 'quemaGrasa' ? 'fc-recommended' : ''}`}>
              <div className="fc-zone-header">
                <Target size={16} />
                <h3>Zona de Quema de Grasa</h3>
                {frecuenciaData.zonaRecomendada === 'quemaGrasa' && <span className="recommended-tag">Recomendada</span>}
              </div>
              <div className="fc-zone-range">
                <span>{frecuenciaData.zonas.quemaGrasa.min} - {frecuenciaData.zonas.quemaGrasa.max} ppm</span>
                <span className="fc-zone-percent">(60-70%)</span>
              </div>
              <p className="fc-zone-desc">Ideal para sesiones largas de cardio de baja intensidad. Maximiza la quema de grasa.</p>
            </div>
            
            <div className={`fc-zone ${frecuenciaData.zonaRecomendada === 'cardio' ? 'fc-recommended' : ''}`}>
              <div className="fc-zone-header">
                <Activity size={16} />
                <h3>Zona Cardiovascular</h3>
                {frecuenciaData.zonaRecomendada === 'cardio' && <span className="recommended-tag">Recomendada</span>}
              </div>
              <div className="fc-zone-range">
                <span>{frecuenciaData.zonas.cardio.min} - {frecuenciaData.zonas.cardio.max} ppm</span>
                <span className="fc-zone-percent">(70-80%)</span>
              </div>
              <p className="fc-zone-desc">Mejora la capacidad aeróbica y resistencia. Equilibrio entre quema de grasa y rendimiento.</p>
            </div>
            
            <div className={`fc-zone ${frecuenciaData.zonaRecomendada === 'alta' ? 'fc-recommended' : ''}`}>
              <div className="fc-zone-header">
                <AlertCircle size={16} />
                <h3>Zona de Alta Intensidad</h3>
                {frecuenciaData.zonaRecomendada === 'alta' && <span className="recommended-tag">Recomendada</span>}
              </div>
              <div className="fc-zone-range">
                <span>{frecuenciaData.zonas.alta.min} - {frecuenciaData.zonas.alta.max} ppm</span>
                <span className="fc-zone-percent">(80-90%)</span>
              </div>
              <p className="fc-zone-desc">Para entrenamientos cortos e intensos. Mejora el rendimiento y resistencia anaeróbica.</p>
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
              <p><strong>Edad:</strong> {usuario.edad} años</p>
            </div>
            <div className="dato-item">
              <Weight size={16} />
              <p><strong>Peso:</strong> {usuario.peso} kg</p>
            </div>
            <div className="dato-item">
              <TrendingUp size={16} />
              <p><strong>Altura:</strong> {usuario.altura} cm</p>
            </div>
            <div className="dato-item">
              <Trophy size={16} />
              <p><strong>Objetivo:</strong> {usuario.objetivo}</p>
            </div>
            <div className="dato-item">
              <Calendar size={16} />
              <p><strong>Días de entrenamiento:</strong> {usuario.diasEntrenamiento} días/semana</p>
            </div>
          </div>
        </section>

        <section className="perfil-seccion progreso-seccion">
          <h2>Progreso de peso</h2>
          <div className="progreso-lista">
            {progresos.map((item, index) => (
              <div key={index} className="progreso-item">
                <div className="progreso-fecha">{item.fecha}</div>
                <div className="progreso-valor">{item.peso} kg</div>
                {index < progresos.length - 1 ? 
                  <div className={`progreso-cambio ${item.peso < progresos[index + 1].peso ? 'positivo' : 'negativo'}`}>
                    {(progresos[index + 1].peso - item.peso).toFixed(1)} kg
                  </div> : null
                }
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Perfil;