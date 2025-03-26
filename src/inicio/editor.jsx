import React, { useState, useEffect } from 'react';
import './editorperfil.css';

const EditorPerfil = ({ setEditorAbierto }) => {
  const [userData, setUserData] = useState({
    informacionPersonal: {
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      sexo: 'masculino',
      correo: '',
      esHipertenso: false,
    },
    medidasCorporales: {
      actual: {
        peso: '',
        altura: '',
        porcentajeGrasaCorporal: '',
        porcentajeMusculatura: '',
      }
    }
  });

  const [isEditing, setIsEditing] = useState({
    personal: false,
    medidas: false,
  });

  useEffect(() => {
    // Cargar datos de usuario desde localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

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

  const handleBodyMeasurementsChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      medidasCorporales: {
        ...userData.medidasCorporales,
        actual: {
          ...userData.medidasCorporales.actual,
          [name]: value
        }
      }
    });
  };

  const calcularIMC = () => {
    const peso = parseFloat(userData.medidasCorporales.actual.peso);
    const altura = parseFloat(userData.medidasCorporales.actual.altura);
    
    if (peso && altura) {
      const alturaMetros = altura / 100;
      return (peso / (alturaMetros * alturaMetros)).toFixed(1);
    }
    return '';
  };

  const handleGuardar = () => {
    // Actualizar datos con seguimiento
    const updatedUserData = {
      ...userData,
      medidasCorporales: {
        ...userData.medidasCorporales,
        actual: {
          ...userData.medidasCorporales.actual,
          imc: calcularIMC(),
          fecha: new Date().toISOString().split('T')[0],
        }
      },
      seguimientoPeso: userData.seguimientoPeso 
        ? [
            ...userData.seguimientoPeso, 
            {
              fecha: new Date().toISOString().split('T')[0],
              peso: parseFloat(userData.medidasCorporales.actual.peso)
            }
          ]
        : [],
      seguimientoMusculatura: userData.seguimientoMusculatura
        ? [
            ...userData.seguimientoMusculatura,
            {
              fecha: new Date().toISOString().split('T')[0],
              porcentaje: parseFloat(userData.medidasCorporales.actual.porcentajeMusculatura)
            }
          ]
        : []
    };

    // Guardar en localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    
    // Cerrar editor
    setEditorAbierto(false);
  };

  const toggleEditing = (section) => {
    setIsEditing({
      ...isEditing,
      [section]: !isEditing[section]
    });
  };

  return (
    <div className='editor-overlay'>

  
    <div className="editor-perfil-container">
      <div className="editor-perfil-card">
        <h2 className="editor-title">Editar Perfil</h2>

        {/* Sección de Información Personal */}
        <section className="profile-section">
          <div className="section-header">
            <h3>Información Personal</h3>
          </div>

          <div className="form-step">
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
          </div>
        </section>

        {/* Sección de Medidas Corporales */}
        <section className="profile-section">
          <div className="section-header">
            <h3>Medidas Corporales</h3>
          </div>

          <div className="form-step">
            <div className="form-group">
              <label htmlFor="peso">Peso actual (kg)</label>
              <input
                type="number"
                id="peso"
                name="peso"
                value={userData.medidasCorporales.actual.peso}
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
                value={userData.medidasCorporales.actual.altura}
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
                value={userData.medidasCorporales.actual.porcentajeGrasaCorporal}
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
                value={userData.medidasCorporales.actual.porcentajeMusculatura}
                onChange={handleBodyMeasurementsChange}
                placeholder="Ej: 42.5"
                step="0.1"
                min="20"
                max="70"
              />
            </div>
            
            <p className="imc-display">IMC calculado: {calcularIMC()}</p>
          </div>
        </section>

        <div className="form-actions">
          <button 
            className="btn-cancel" 
            onClick={() => setEditorAbierto(false)}
          >
            Cancelar
          </button>
          <button 
            className="btn-save" 
            onClick={handleGuardar}
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default EditorPerfil;