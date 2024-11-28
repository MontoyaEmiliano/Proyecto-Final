import React, { useState } from 'react';
import { createOrder } from '../services/orderService';
import emailjs from 'emailjs-com';

const Pago = ({ orden, clearOrden, onOrderSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta');
  const [splitCount, setSplitCount] = useState(1);
  const [splitAmounts, setSplitAmounts] = useState([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticket, setTicket] = useState(null);

  const handlePayment = async () => {
    if (customerName === '' || paymentMethod === '') {
      alert('Por favor, completa todos los campos');
      return;
    }

    const totalAmount = orden.reduce(
      (acc, item) => acc + (item.price * item.quantity),
      0
    );

    const splitPerPerson = totalAmount / splitCount;
    const newSplitAmounts = Array(splitCount).fill(splitPerPerson);

    const order = {
      customerName: customerName,
      items: orden,
      payment: paymentMethod,
      timestamp: new Date(),
      splitAmounts: newSplitAmounts,
    };

    try {
      // 1. Crear el pedido en tu base de datos (Firebase, etc.)
      await createOrder(order);
      clearOrden();
      onOrderSuccess();
      setCustomerName('');
      setPaymentMethod('');
      setSplitCount(1);
      setSplitAmounts([]);
      setShowCardModal(false);
      setCardDetails({ cardNumber: '', expiryDate: '', cvv: '' });
      
      // 2. Generar el ticket
      generateTicket(order, totalAmount, splitPerPerson);

      // 3. Enviar el correo con los detalles del pedido utilizando EmailJS
      sendEmail(order, totalAmount, splitPerPerson);

    } catch (error) {
      console.error('Error al realizar el pedido:', error);
    }
  };

  // Generar los detalles del ticket
  const generateTicket = (order, totalAmount, splitPerPerson) => {
    const ticketData = `
      ------------------------
        TICKET DE PAGO
        Tu pedido está en 
        preparación
      ------------------------
      Cliente: ${order.customerName}
      Fecha: ${order.timestamp.toLocaleString()}
      
      Detalles de la Orden:
      ${order.items.map(item => `${item.name} x${item.quantity} - $${item.price}`).join('\n')}
      
      Total a Pagar: $${totalAmount}
      Dividido entre ${splitCount} personas: $${splitPerPerson.toFixed(2)} por persona
      
      Método de Pago: ${order.payment}
      
      ------------------------
      ¡Gracias por su compra!
      ------------------------
    `;
    setTicket(ticketData);
    setShowTicketModal(true);
  };

  // Enviar el correo con EmailJS
  const sendEmail = (order, totalAmount, splitPerPerson) => {
    const templateParams = {
      customer_name: order.customerName,
      items: order.items.map(item => `${item.name} x${item.quantity} - $${item.price}`).join(', '),
      total_amount: totalAmount,
      split_per_person: splitPerPerson.toFixed(2),
      payment_method: order.payment,
      split_count: splitCount,
      timestamp: order.timestamp.toLocaleString(),
    };

    // Enviar el correo con los parámetros a través de EmailJS
    emailjs.send('service_coijrnr', 'template_kwttt6n', templateParams, 'E3WYl4yZJVVqis7X3')
      .then(response => {
        console.log('Correo enviado con éxito:', response);
      })
      .catch(error => {
        console.error('Error al enviar el correo:', error);
      });
  };

  const handleSplitChange = (e) => {
    const newCount = parseInt(e.target.value);
    if (isNaN(newCount) || newCount < 1) {
      return;
    }
    setSplitCount(newCount);
    setSplitAmounts([]);
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === 'Tarjeta') {
      setShowCardModal(true);
    } else {
      setShowCardModal(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
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
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label style={{ marginRight: '10px' }}>Método de Pago:</label>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => handlePaymentMethodChange('Tarjeta')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: paymentMethod === 'Tarjeta' ? '#333' : '#ccc',
              color: paymentMethod === 'Tarjeta' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Tarjeta
          </button>
          <button
            onClick={() => handlePaymentMethodChange('Efectivo')}
            style={{
              padding: '10px 20px',
              margin: '0 10px',
              backgroundColor: paymentMethod === 'Efectivo' ? '#333' : '#ccc',
              color: paymentMethod === 'Efectivo' ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Efectivo
          </button>
        </div>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Dividir la cuenta entre:</label>
        <input
          type="number"
          value={splitCount}
          onChange={handleSplitChange}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <span> Personas</span>
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
          disabled: customerName === '' || paymentMethod === '',
        }}
      >
        Pagar
      </button>

      {showCardModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#000',
          color: '#fff',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          zIndex: 1000,
          width: '300px'
        }}>
          <h3>Detalles de la Tarjeta</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Número de Tarjeta:</label>
            <input
              type="text"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleCardDetailsChange}
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Fecha de Expiración:</label>
            <input
              type="text"
              name="expiryDate"
              value={cardDetails.expiryDate}
              onChange={handleCardDetailsChange}
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>CVV:</label>
            <input
              type="text"
              name="cvv"
              value={cardDetails.cvv}
              onChange={handleCardDetailsChange}
              style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            />
          </div>
          <button
            onClick={() => setShowCardModal(false)}
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
            Cerrar
          </button>
        </div>
      )}

      {showTicketModal && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#fff',
          color: '#333',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          zIndex: 1000,
          width: '300px'
        }}>
          <h3>Ticket de Pago</h3>
          <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {ticket}
          </pre>
          <button
            onClick={() => setShowTicketModal(false)}
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
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default Pago;
