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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Editar o Eliminar Productos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg p-4">
            {editingProduct === product.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={(e) => setFormData({ ...formData, Nombre: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Nombre del Producto"
                />
                <input
                  type="text"
                  name="Descripcion"
                  value={formData.Descripcion}
                  onChange={(e) => setFormData({ ...formData, Descripcion: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Descripción"
                />
                <input
                  type="number"
                  name="Precio"
                  value={formData.Precio}
                  onChange={(e) => setFormData({ ...formData, Precio: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Precio"
                />
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => saveChanges(product.id)}
                    className="bg-green-500 text-white py-2 px-6 rounded-lg transition hover:bg-green-600"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="bg-gray-500 text-white py-2 px-6 rounded-lg transition hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800">{product.Nombre}</h3>
                <p className="text-gray-600 mb-4">{product.Descripcion}</p>
                <p className="font-bold text-green-600">${product.Precio}</p>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => toggleAvailability(product.id, product.Estado)}
                    className={`py-2 px-4 rounded-lg text-white ${
                      product.Estado === "Disponible" ? "bg-blue-500" : "bg-yellow-500"
                    } transition hover:bg-opacity-80`}
                  >
                    {product.Estado === "Disponible"
                      ? "Marcar como no disponible"
                      : "Marcar como disponible"}
                  </button>
                  <button
                    onClick={() => startEditing(product)}
                    className="bg-indigo-500 text-white py-2 px-4 rounded-lg transition hover:bg-indigo-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg transition hover:bg-red-600"
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
