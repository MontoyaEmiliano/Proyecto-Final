// orden.jsx
import React from 'react';

const Orden = ({ orden, clearOrden }) => {
  const total = orden.reduce((acc, item) => acc + item.price * item.Quantity, 0);

  return (
    <div>
      <h2 className="text-center">Orden</h2>
      <ul>
        {orden.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price} x {item.Quantity}
          </li>
        ))}
      </ul>
      <h3>Total: ${total}</h3>
      <button 
        onClick={clearOrden} 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#ff4d4d', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer', 
          marginTop: '10px',
          marginBottom: '20px'
        }}
      >
        Limpiar Orden
      </button>
    </div>
  );
};

export default Orden;
