import React from 'react';
import "./App.css"; // Asumo que tus estilos de celda están en App.css

function PalleteCell({ color, onClick, selected }) {


  return (
    <div
      className={`paint-pallete-grid_cell--${selected}`} // Usamos 'selected' directamente
      style={{
        backgroundColor: color
      }}
      onClick={onClick}
    >
    </div>
  );
}

export default PalleteCell;
