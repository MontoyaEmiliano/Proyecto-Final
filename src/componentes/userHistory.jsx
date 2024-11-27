import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const UserHistory = ({ loggedInUserName }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Orders"));
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = () => {
    const matchingOrders = orders.filter(
      (order) => order.customerName.toLowerCase() === loggedInUserName.toLowerCase()
    );
    setFilteredOrders(matchingOrders);
  };

  const handleClear = () => {
    setFilteredOrders([]);
  };

  return (
    <div className="user-history-container">
      <h1 className="user-history-title">Consultar mi Historial</h1>
      <div className="user-history-input-group">
        <button
          onClick={handleSearch}
          className="user-history-search-button"
        >
          Buscar
        </button>
      </div>
      {filteredOrders.length > 0 && (
        <div className="user-history-cards">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card">
              <h2 className="card-title">{order.customerName}</h2>
              {order.items.map((item, index) => (
                <div key={index} className="card-description">
                  <p>Producto: {item.name}</p>
                  <p>Cantidad: {item.Quantity}</p>
                  <p>Precio: ${item.price}</p>
                  <p>Descripción: {item.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {filteredOrders.length > 0 && (
        <button className="user-history-clear-button" onClick={handleClear}>
          Ocultar
        </button>
      )}
    </div>
  );
};

export default UserHistory;