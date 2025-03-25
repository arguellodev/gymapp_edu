import React, { useState } from 'react';
import './formulario.css';

const Formulario = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    informacionPersonal: {
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      sexo: 'masculino',
      correo: '',
      esHipertenso: false, // New field for hypertension
    },
    medidasCorporales: {
      inicial: {
        fecha: new Date().toISOString().split('T')[0],
        peso: '',
        altura: '',
        porcentajeGrasaCorporal: '',
        porcentajeMusculatura: '',
      }
    }
  });

  // Función para actualizar campos de información personal
  const handlePersonalInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      informacionPersonal: {
        ...userData.informacionPersonal,
        [name]: type === 'checkbox' ? checked : value
      }
    });
  };

  // Función para actualizar campos de medidas corporales
  const handleBodyMeasurementsChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      medidasCorporales: {
        ...userData.medidasCorporales,
        inicial: {
          ...userData.medidasCorporales.inicial,
          [name]: value
        }
      }
    });
  };

  // Avanzar al siguiente paso
  // Modifica tu función nextStep
  const nextStep = () => {
    // Validar campos según el paso actual
    if (currentStep === 1) {
      // Validar campos del paso 1
      const requiredFields = ['nombre', 'apellido', 'fechaNacimiento', 'correo'];
      for (const field of requiredFields) {
        const input = document.getElementById(field);
        if (input && !input.validity.valid) {
          input.reportValidity();
          return; // No avanzar si hay un campo inválido
        }
      }
    } else if (currentStep === 2) {
      // Validar campos del paso 2
      const requiredFields = ['peso', 'altura', 'porcentajeMusculatura'];
      for (const field of requiredFields) {
        const input = document.getElementById(field);
        if (input && !input.validity.valid) {
          input.reportValidity();
          return; // No avanzar si hay un campo inválido
        }
      }
    }
    
    // Si llegamos aquí, todos los campos son válidos
    setCurrentStep(currentStep + 1);
  };

  // Retroceder al paso anterior
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Calcular IMC
  const calcularIMC = () => {
    const peso = parseFloat(userData.medidasCorporales.inicial.peso);
    const altura = parseFloat(userData.medidasCorporales.inicial.altura);
    
    if (peso && altura) {
      const alturaMetros = altura / 100;
      return (peso / (alturaMetros * alturaMetros)).toFixed(1);
    }
    return '';
  };

  // Guardar toda la información y finalizar
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear el objeto completo para guardar
    const completeUserData = {
      ...userData,
      medidasCorporales: {
        ...userData.medidasCorporales,
        inicial: {
          ...userData.medidasCorporales.inicial,
          imc: calcularIMC()
        },
        actual: {
          fecha: new Date().toISOString().split('T')[0],
          peso: userData.medidasCorporales.inicial.peso,
          porcentajeGrasaCorporal: userData.medidasCorporales.inicial.porcentajeGrasaCorporal,
          porcentajeMusculatura: userData.medidasCorporales.inicial.porcentajeMusculatura,
          imc: calcularIMC()
        }
      },
      seguimientoPeso: [
        {
          fecha: new Date().toISOString().split('T')[0],
          peso: parseFloat(userData.medidasCorporales.inicial.peso)
        }
      ],
      seguimientoMusculatura: [
        {
          fecha: new Date().toISOString().split('T')[0],
          porcentaje: parseFloat(userData.medidasCorporales.inicial.porcentajeMusculatura)
        }
      ],
      ultimoEntrenamiento: {
        fecha: "",
        duracion: 0
      }
    };
    
    // Guardar en localStorage
    localStorage.setItem('userData', JSON.stringify(completeUserData));
    
    // Notificar que el onboarding está completo y pasar los datos
    onComplete(completeUserData);
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="progress-bar">
          <div className="progress" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
        </div>
        
        <h2 className="onboarding-title">
          {currentStep === 1 && "¡Bienvenido a GymApp!"}
          {currentStep === 2 && "Tus medidas corporales"}
          {currentStep === 3 && "Confirma tus datos"}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {/* Paso 1: Información personal */}
          {currentStep === 1 && (
            <div className="form-step">
              <p className="form-description">Comencemos con algunos datos básicos para personalizar tu experiencia</p>
              
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={userData.informacionPersonal.nombre}
                  onChange={handlePersonalInfoChange}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={userData.informacionPersonal.apellido}
                  onChange={handlePersonalInfoChange}
                  placeholder="Tu apellido"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={userData.informacionPersonal.fechaNacimiento}
                  onChange={handlePersonalInfoChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="sexo">Sexo</label>
                <select
                  id="sexo"
                  name="sexo"
                  value={userData.informacionPersonal.sexo}
                  onChange={handlePersonalInfoChange}
                  required
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={userData.informacionPersonal.correo}
                  onChange={handlePersonalInfoChange}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              
              {/* New field for hypertension */}
              <div className="form-group checkbox-group">

                <label htmlFor="esHipertenso">
                ¿Eres hipertenso?
                  <input
                    type="checkbox"
                    id="esHipertenso"
                    name="esHipertenso"
                    checked={userData.informacionPersonal.esHipertenso}
                    onChange={handlePersonalInfoChange}
                  />
                  
                </label>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-next" onClick={nextStep}>
                  Siguiente
                </button>
              </div>
            </div>
          )}
          
          {/* Paso 2: Medidas corporales */}
          {currentStep === 2 && (
            <div className="form-step">
              <p className="form-description">Ahora necesitamos tus medidas corporales para hacer un seguimiento de tu progreso</p>
              
              <div className="form-group">
                <label htmlFor="peso">Peso actual (kg)</label>
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  value={userData.medidasCorporales.inicial.peso}
                  onChange={handleBodyMeasurementsChange}
                  placeholder="Ej: 70.5"
                  step="0.01"
                  min="30"
                  max="300"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="altura">Altura (cm)</label>
                <input
                  type="number"
                  id="altura"
                  name="altura"
                  value={userData.medidasCorporales.inicial.altura}
                  onChange={handleBodyMeasurementsChange}
                  placeholder="Ej: 175"
                  min="100"
                  max="250"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="porcentajeGrasaCorporal">Porcentaje de grasa corporal (%)</label>
                <input
                  type="number"
                  id="porcentajeGrasaCorporal"
                  name="porcentajeGrasaCorporal"
                  value={userData.medidasCorporales.inicial.porcentajeGrasaCorporal}
                  onChange={handleBodyMeasurementsChange}
                  placeholder="Ej: 18.5"
                  step="0.1"
                  min="3"
                  max="50"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="porcentajeMusculatura">Porcentaje de musculatura (%)</label>
                <input
                  type="number"
                  id="porcentajeMusculatura"
                  name="porcentajeMusculatura"
                  value={userData.medidasCorporales.inicial.porcentajeMusculatura}
                  onChange={handleBodyMeasurementsChange}
                  placeholder="Ej: 42.5"
                  step="0.1"
                  min="20"
                  max="70"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  Atrás
                </button>
                <button type="button" className="btn-next" onClick={nextStep}>
                  Siguiente
                </button>
              </div>
            </div>
          )}
          
          {/* Paso 3: Confirmación */}
          {currentStep === 3 && (
            <div className="form-step">
              <p className="form-description">Revisa tus datos antes de continuar</p>
              
              <div className="summary-section">
                <h3>Información Personal</h3>
                <p><strong>Nombre:</strong> {userData.informacionPersonal.nombre} {userData.informacionPersonal.apellido}</p>
                <p><strong>Fecha de nacimiento:</strong> {userData.informacionPersonal.fechaNacimiento}</p>
                <p><strong>Sexo:</strong> {userData.informacionPersonal.sexo}</p>
                <p><strong>Correo:</strong> {userData.informacionPersonal.correo}</p>
                <p><strong>Hipertenso:</strong> {userData.informacionPersonal.esHipertenso ? 'Sí' : 'No'}</p>
              </div>
              
              <div className="summary-section">
                <h3>Medidas Corporales</h3>
                <p><strong>Peso:</strong> {userData.medidasCorporales.inicial.peso} kg</p>
                <p><strong>Altura:</strong> {userData.medidasCorporales.inicial.altura} cm</p>
                <p><strong>% Grasa corporal:</strong> {userData.medidasCorporales.inicial.porcentajeGrasaCorporal || 'Sin introducir'}</p>
                <p><strong>% Musculatura:</strong> {userData.medidasCorporales.inicial.porcentajeMusculatura || 'Sin introducir'}</p>
                <p><strong>IMC calculado:</strong> {calcularIMC()}</p>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  Atrás
                </button>
                <button type="submit" className="btn-submit">
                  Confirmar y comenzar
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Formulario;