import React, { useState, useEffect } from "react";
import { collection, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

const Cards = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: "",
    Descripcion: "",
    Precio: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Products"), (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, []);

  const toggleAvailability = async (id, currentStatus) => {
    const newStatus = currentStatus === "Disponible" ? "No Disponible" : "Disponible";
    const productRef = doc(db, "Products", id);
    await updateDoc(productRef, { Estado: newStatus });
  };

  const deleteProduct = async (id) => {
    const productRef = doc(db, "Products", id);
    await deleteDoc(productRef);
  };

  const startEditing = (product) => {
    setEditingProduct(product.id);
    setFormData({
      Nombre: product.Nombre,
      Descripcion: product.Descripcion,
      Precio: product.Precio,
    });
  };

  const saveChanges = async (id) => {
    const productRef = doc(db, "Products", id);
    await updateDoc(productRef, formData);
    setEditingProduct(null);
  };

  return (
    <div>
      <h2>Editar o Eliminar Productos</h2>
      <div>
        {products.map((product) => (
          <div key={product.id} className="card">
            {editingProduct === product.id ? (
              <div>
                <input
                  type="text"
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                />
                <input
                  type="text"
                  name="Descripcion"
                  value={formData.Descripcion}
                  onChange={(e) => setFormData({ ...formData, Descripcion: e.target.value })}
                />
                <input
                  type="number"
                  name="Precio"
                  value={formData.Precio}
                  onChange={(e) => setFormData({ ...formData, Precio: e.target.value })}
                />
                <button onClick={() => saveChanges(product.id)}>Guardar</button>
                <button onClick={() => setEditingProduct(null)}>Cancelar</button>
              </div>
            ) : (
              <>
                <h3>{product.Nombre}</h3>
                <p>{product.Descripcion}</p>
                <p>${product.Precio}</p>
                <button onClick={() => toggleAvailability(product.id, product.Estado)}>
                  {product.Estado === "Disponible" ? "Marcar como no disponible" : "Marcar como disponible"}
                </button>
                <button onClick={() => startEditing(product)}>Editar</button>
                <button onClick={() => deleteProduct(product.id)}>Eliminar</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
