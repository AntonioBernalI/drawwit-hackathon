import React, { useState } from 'react';
import PalleteCell from './palleteCell.jsx'; // Asegúrate de que la ruta sea correcta
import "./App.css"; // Si tienes estilos compartidos o globales

function ColorPalette({ colorSetterFunction, onClose,  }) { // Asegúrate de desestructurar colorSetterFunction si lo pasas como prop
  const [selectedColor, setSelectedColor] = useState("none");
  const [deleteMode, setDeleteMode] = useState("off");

  const handleCellClick = (color) => {
    let newSelectedColor;

    if (selectedColor === color) {
      newSelectedColor = "none";
    } else {
      newSelectedColor = color;
    }

    setSelectedColor(newSelectedColor);

    if (colorSetterFunction) {
      colorSetterFunction(newSelectedColor);
    }
  };

  const colors = [
    "#FF0000", "#FAEBD7", "#8B4513", "#00FF00", "#FF00FF", "#FFFF00", "#0000FF",
    "#008080", "#C0C0C0", "#A020F0", "#FFA500", "#006400", "#FFDAB9", "#FFC0CB",
    "#FFFFFF", "#000000", "#800000", "#4B0082", "#A9A9A9", "#FADADD", "#696969",
    "#00FFFF", "#6B8E23", "#ADFF2F"
  ];

  return (
    <div className="paint-palette">
      <div className={`paint-palette-grid`}>
        {colors.map((color) => (
          <PalleteCell
            key={color}
            color={color}
            selected={selectedColor === color ? "selected" : "notSelected"}
            onClick={() => handleCellClick(color)}
          />
        ))}
      </div>
      <div className={`paint-palette-close-button`} onClick={onClose}>
        X
      </div>
      <div className={`paint-palette-delete-button--${deleteMode}`} onClick={() => {
        if(deleteMode === "off") {
          setDeleteMode("on");
          handleCellClick("delete");
        }else{
          setDeleteMode("off");
          handleCellClick("none");
        }}}>
        {deleteMode === "on" ? "delete: on" : "delete: off"}
        </div>
    </div>
  );
}

export default ColorPalette;
