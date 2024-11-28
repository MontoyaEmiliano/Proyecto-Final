import React from "react";

const Menu = ({ menuItems, addToOrden, removeFromOrden }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <h2 className="text-center">Menú</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div
              key={item.id}
              style={{
                width: "30%",
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#333",
                color: "#fff",
                boxSizing: "border-box",
              }}
            >
              <h3>{item.Nombre} - ${item.Precio}</h3>
              <p>{item.Descripcion}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button
                  onClick={() => addToOrden(item)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Agregar
                </button>
                <button
                  onClick={() => removeFromOrden(item)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#ff4d4d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
