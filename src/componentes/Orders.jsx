import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';
import './Orders.css'; // Asegúrate de crear este archivo CSS

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrderCount, setNewOrderCount] = useState(0);

  // Función para guardar el estado de las órdenes en localStorage
  const saveOrdersToLocalStorage = (orders) => {
    localStorage.setItem('orders', JSON.stringify(orders));
  };

  // Función para recuperar las órdenes desde localStorage
  const getOrdersFromLocalStorage = () => {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      return JSON.parse(storedOrders);
    }
    return [];
  };

  useEffect(() => {
    const fetchOrders = async () => {
      let data = await getOrders();
      const sortedOrders = data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);

      // Recuperar las órdenes almacenadas en localStorage y combinar los estados
      const storedOrders = getOrdersFromLocalStorage();

      // Si ya hay datos guardados en localStorage, se combinan con los datos nuevos.
      if (storedOrders.length > 0) {
        // Mapear los datos de localStorage con los datos nuevos para conservar el estado.
        sortedOrders.forEach(order => {
          const storedOrder = storedOrders.find(o => o.id === order.id);
          if (storedOrder) {
            order.status = storedOrder.status;
          }
        });
      }

      setOrders(sortedOrders);
      setNewOrderCount(sortedOrders.length);
    };

    fetchOrders();
  }, []);

  const handleOrderStatusChange = (orderId, status) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );

    setOrders(updatedOrders);
    saveOrdersToLocalStorage(updatedOrders); // Guardar el estado actualizado en localStorage
  };

  return (
    <div className="orders-container">
      <h2>Tienes {newOrderCount} {newOrderCount === 1 ? 'orden nueva' : 'órdenes nuevas'}</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
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
            <div className="order-actions">
              <button
                onClick={() => handleOrderStatusChange(order.id, 'Listo')}
                className="btn ready-btn"
              >
                Listo
              </button>
              <button
                onClick={() => handleOrderStatusChange(order.id, 'En preparación')}
                className="btn preparing-btn"
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
