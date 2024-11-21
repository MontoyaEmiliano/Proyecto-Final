// Pago.jsx
import React, { useState } from 'react';
import { createOrder } from '../services/orderService';

const Pago = ({ orden, clearOrden, onOrderSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePayment = async () => {
    if (customerName === '' || paymentMethod === '') {
      alert('Por favor, complete todos los campos');
      return;
    }

    const order = {
      customerName: customerName,
      items: orden,
      payment: paymentMethod,
      timestamp: new Date(),
    };

    try {
      await createOrder(order);
      clearOrden();
      onOrderSuccess(); // Llama a onOrderSuccess para mostrar el mensaje
      setCustomerName('');
      setPaymentMethod('');
    } catch (error) {
      console.error('Error al realizar el pedido:', error);
    }
  };

  return (
    <div>
      <h2>Pago</h2>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Nombre del Cliente:</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Método de Pago:</label>
        <input
          type="text"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <button
        onClick={handlePayment}
        style={{
          padding: '10px 20px',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Pagar
      </button>
    </div>
  );
};

export default Pago;
