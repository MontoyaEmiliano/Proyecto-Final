import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      // Ordenar las órdenes por fecha de manera descendente
      const sortedOrders = data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      setOrders(sortedOrders);
      setNewOrderCount(sortedOrders.length);
    };

    fetchOrders();
  }, []);

  const handleOrderStatusChange = (orderId, status) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <div>
      <h2>Tienes {newOrderCount} {newOrderCount === 1 ? 'orden nueva' : 'órdenes nuevas'}</h2>
      <div>
        {orders.map((order) => (
          <div key={order.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h3>Orden #{order.id}</h3>
            <p><strong>Fecha:</strong> {new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</p>
            <h4>Ítems:</h4>
            <ul>
              {order.items?.map((item) => (
                <li key={item.name}>
                  {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                </li>
              ))}
            </ul>
            <div>
              <button
                onClick={() => handleOrderStatusChange(order.id, 'Listo')}
                style={{
                  padding: '5px 10px',
                  marginRight: '10px',
                  backgroundColor: '#F44336',  // Rojo
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Listo
              </button>
              <button
                onClick={() => handleOrderStatusChange(order.id, 'En preparación')}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#F44336',  // Rojo
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                En preparación
              </button>
            </div>
            {order.status && <p><strong>Estado:</strong> {order.status}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};