// Orders.jsx
import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/orderService';

export const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h1>Orders</h1>
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '20px' 
        }}
      >
        {orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order.id} 
              style={{ 
                width: '45%', 
                marginBottom: '10px', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                backgroundColor: '#333', 
                color: '#fff', 
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <h3 style={{ marginBottom: '5px' }}>
                Order ID: <span style={{ fontWeight: 'normal' }}>{order.id}</span>
              </h3>
              <div>
                <strong>Items:</strong>
                <ul style={{ paddingLeft: '15px', margin: '5px 0' }}>
                  {order.items && order.items.map((item, index) => (
                    <li 
                      key={index} 
                      style={{ 
                        marginBottom: '5px', 
                        padding: '5px', 
                        backgroundColor: '#444', 
                        borderRadius: '4px' 
                      }}
                    >
                      <p style={{ margin: '2px 0' }}><strong>Name:</strong> {item.name}</p>
                      <p style={{ margin: '2px 0' }}><strong>Price:</strong> ${item.price}</p>
                      <p style={{ margin: '2px 0' }}><strong>Quantity:</strong> {item.Quantity}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <p style={{ margin: '5px 0' }}><strong>Total:</strong> ${order.items ? order.items.reduce((acc, item) => acc + item.price * item.Quantity, 0) : 'N/A'}</p>
              <p style={{ margin: '5px 0' }}><strong>Payment Method:</strong> {order.payment || 'N/A'}</p>
              <p style={{ margin: '5px 0' }}><strong>Order Date:</strong> {order.timestamp ? new Date(order.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
            </div>
          ))
        ) : (
          <p style={{ color: '#aaa' }}>No orders available</p>
        )}
      </div>
    </div>
  );
};
