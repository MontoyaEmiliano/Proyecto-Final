import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/auth'; 

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerRole, setRegisterRole] = useState('user'); 

  const handleLogin = async () => {
    const { user, role, error } = await loginUser(username, password);
    if (user) {
      onLogin(role); 
      localStorage.setItem('userRole', role);
    } else {
      alert(error || 'Error al iniciar sesión');
    }
  };

  const handleRegister = async () => {
    const additionalData = { name: registerName, role: registerRole };
    const { user, error } = await registerUser(email, registerPassword, additionalData);
    if (user) {
      alert('Usuario registrado correctamente.');
      setIsRegistering(false);
    } else {
      alert(error || 'Error al registrar usuario');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {isRegistering ? (
        <>
          <h2>Registro</h2>
          <input 
            type="text" 
            placeholder="Nombre" 
            value={registerName} 
            onChange={(e) => setRegisterName(e.target.value)} 
            style={{ marginBottom: '10px' }}
          />
          <br />
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ marginBottom: '10px' }}
          />
          <br />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={registerPassword} 
            onChange={(e) => setRegisterPassword(e.target.value)} 
            style={{ marginBottom: '10px' }}
          />
          <br />
          <label style={{ marginRight: '10px' }}>Rol:</label>
          <select value={registerRole} onChange={(e) => setRegisterRole(e.target.value)} style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          <br />
          <button 
            onClick={handleRegister} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#333', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Registrarse
          </button>
          <br />
          <button onClick={() => setIsRegistering(false)} style={{ marginTop: '10px' }}>
            Ya tengo una cuenta
          </button>
        </>
      ) : (
        <>
          <h2>Inicio de Sesión </h2>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ marginBottom: '10px' }}
          />
          <br />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ marginBottom: '10px' }}
          />
          <br />
          <button 
            onClick={handleLogin} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#333', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Iniciar Sesión
          </button>
          <br />
          <button onClick={() => setIsRegistering(true)} style={{ marginTop: '10px' }}>
            Crear una cuenta
          </button>
        </>
      )}
    </div>
  );
};

export default Login;
