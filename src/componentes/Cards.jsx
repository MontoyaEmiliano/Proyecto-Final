import React, { useEffect, useState } from "react";
import { collection, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

const Cards = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: "",
  });

  const fetchProducts = () => {
    const productsRef = collection(db, "Products");
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    });

    return () => unsubscribe();
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Disponible" ? "No Disponible" : "Disponible";
      const productRef = doc(db, "Products", id);
      await updateDoc(productRef, { Estado: newStatus });
      console.log(`Producto ${id} marcado como ${newStatus}.`);
    } catch (error) {
      console.error("Error al cambiar el estado del producto: ", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const productRef = doc(db, "Products", id);
      await deleteDoc(productRef);
      console.log(`Producto ${id} eliminado.`);
    } catch (error) {
      console.error("Error al eliminar el producto: ", error);
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product.id);
    setFormData({
      Nombre: product.Nombre,
      Descripcion: product.Descripcion,
      Precio: product.Precio,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveChanges = async (id) => {
    try {
      const productRef = doc(db, "Products", id);
      await updateDoc(productRef, formData);
      console.log(`Producto ${id} actualizado.`);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error al actualizar el producto: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = fetchProducts();
    return () => unsubscribe(); 
  }, []);

  return (
    <div className="cards-section">
      <div className="cards-container">
        {products.map((product) => (
          <div key={product.id} className="card">
            {editingProduct === product.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="Descripcion"
                  value={formData.Descripcion}
                  onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="Precio"
                  value={formData.Precio}
                  onChange={handleInputChange}
                />
                <button onClick={() => saveChanges(product.id)} className="card-button-save">Guardar</button>
                <button onClick={() => setEditingProduct(null)} className="card-button-cancel">Cancelar</button>
              </div>
            ) : (
              <>
                <h2 className="card-title">{product.Nombre}</h2>
                <p className="card-description">{product.Descripcion}</p>
                <p className="card-price">${product.Precio}</p>
                <p
                  className={`card-status ${
                    product.Estado === "Disponible" ? "status-available" : "status-unavailable"
                  }`}
                >
                  {product.Estado}
                </p>
                <div className="card-actions">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={product.Estado === "Disponible"}
                      onChange={() => toggleAvailability(product.id, product.Estado)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <button onClick={() => startEditing(product)} className="card-button-edit">Editar</button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="card-button card-button-delete"
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;