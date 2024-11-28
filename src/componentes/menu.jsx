import React, { useState } from 'react';

const App = () => {
  // Datos de ejemplo del menú
  const menuItems = [
    { id: 1, Nombre: "Pizza", Precio: 100, Descripcion: "Pizza con queso y tomate" },
    { id: 2, Nombre: "Pasta", Precio: 80, Descripcion: "Pasta con salsa roja" },
    { id: 3, Nombre: "Ensalada", Precio: 50, Descripcion: "Ensalada fresca con aderezo" },
    { id: 4, Nombre: "Hamburguesa", Precio: 120, Descripcion: "Hamburguesa con carne de res" },
    { id: 5, Nombre: "Tacos", Precio: 60, Descripcion: "Tacos al pastor" }
  ];

  // Estado para los ítems de la orden
  const [ordenItems, setOrdenItems] = useState([]);

  // Función para agregar un ítem a la orden
  const addToOrden = (item) => {
    setOrdenItems((prevItems) => [...prevItems, item]);
  };

  // Función para eliminar un ítem de la orden
  const removeFromOrden = (item) => {
    setOrdenItems((prevItems) => prevItems.filter((ordenItem) => ordenItem.id !== item.id));
  };

  // Función para limpiar la orden
  const clearOrden = () => {
    setOrdenItems([]); // Limpiar el estado de la orden
  };

  // Calcular el total de la orden
  const getTotal = () => {
    return ordenItems.reduce((total, item) => total + item.Precio, 0);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Menú</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            style={{
              width: '30%',
              marginBottom: '20px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#333',
              color: '#fff',
              boxSizing: 'border-box',
              textAlign: 'center'
            }}
          >
            <h3>{item.Nombre} - ${item.Precio}</h3>
            <p>{item.Descripcion}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                onClick={() => addToOrden(item)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Agregar
              </button>
              <button
                onClick={() => removeFromOrden(item)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#ff4d4d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h3>Órdenes agregadas:</h3>
        {ordenItems.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: '0' }}>
            {ordenItems.map((item, index) => (
              <li key={index} style={{ marginBottom: '10px', fontSize: '18px' }}>
                {item.Nombre} - ${item.Precio}
              </li>
            ))}
          </ul>
        ) : (
          <p>No has agregado ningún ítem a la orden.</p>
        )}

        {/* Mostrar el total */}
        {ordenItems.length > 0 && (
          <h3 style={{ marginTop: '20px' }}>Total: ${getTotal()}</h3>
        )}

        {/* Botón para limpiar la orden */}
        <button
          onClick={clearOrden}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff9800',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Limpiar orden
        </button>
      </div>
    </div>
  );
};

export default App;
