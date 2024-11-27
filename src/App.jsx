import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/auth';
import Menu from './componentes/menu';
import Orden from './componentes/orden';
import Pago from './componentes/Pago';
import { getMenu } from './services/menuApi';
import './App.css';
import { Orders } from './componentes/Orders';
import Login from './componentes/Login';
import { LoginForm } from './componentes/LoginForm';
import Cards from './componentes/Cards';
import AddProduct from './componentes/AddProduct';
import UserHistory from './componentes/UserHistory';



const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [orden, setOrden] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        const storedRole = localStorage.getItem('userRole');
        setRole(storedRole || 'user'); 
      } else {
        setIsAuthenticated(false);
        setRole('');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated && role === 'user') {
      setLoading(true);
      getMenu().then((data) => {
        setMenuItems(data);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        setLoading(false);
      });
    }
  }, [isAuthenticated, role]);

  const addToOrden = (item) => {
    const itemExists = orden.find((ordenItem) => ordenItem.id === item.id);
    if (itemExists) {
      setOrden(
        orden.map((ordenItem) =>
          ordenItem.id === item.id
            ? { ...ordenItem, Quantity: (ordenItem.Quantity || 1) + 1 }
            : ordenItem
        )
      );
    } else {
      setOrden([...orden, { ...item, Quantity: 1 }]);
    }
  };

  const removeFromOrden = (item) => {
    setOrden((prevOrden) =>
      prevOrden
        .map((ordenItem) =>
          ordenItem.id === item.id && ordenItem.Quantity > 1
            ? { ...ordenItem, Quantity: ordenItem.Quantity - 1 }
            : ordenItem
        )
        .filter((ordenItem) => ordenItem.Quantity > 0)
    );
  };

  const clearOrden = () => {
    setOrden([]);
  };

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setRole(role);
    localStorage.setItem('userRole', role); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole('');
    setOrden([]);
    setMenuItems([]);
    localStorage.removeItem('userRole'); 
  };

  const handleOrderSuccess = () => {
    setSuccessMessage('Orden correctamente realizada');
    setTimeout(() => {
      setSuccessMessage(''); 
    }, 3000);
  };

  return (
    <div className="App" style={{ padding: '50px' }}>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <button 
            onClick={handleLogout} 
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '10px 15px',
              backgroundColor: '#ff4d4d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Salir
          </button>
          {successMessage && (
            <div style={{
              backgroundColor: '#28a745',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '5px',
              textAlign: 'center',
              margin: '20px 0'
            }}>
              {successMessage}
            </div>
          )}
          {role === 'admin' ? (
            <><Orders /><Cards /><AddProduct /></>
          ) : loading ? (
            <p>Cargando menú...</p>
          ) : (
            <>
            
              <h1>Sistema de Gestión de Menú y Órdenes</h1>
              <Menu menuItems={menuItems} addToOrden={addToOrden} removeFromOrden={removeFromOrden} />
              
              <Orden orden={orden} clearOrden={clearOrden} onOrderSuccess={handleOrderSuccess} />
              <Pago orden={orden} clearOrden={clearOrden} onOrderSuccess={handleOrderSuccess} />
              <UserHistory />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;
