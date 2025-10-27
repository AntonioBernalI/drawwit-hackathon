import { useState, useEffect } from "react";
import "./DrawwitCanvas.css";

function DrawwitCanvas({ canvasRawData , currentMode, currentColor}) {
  if (!Array.isArray(canvasRawData) || canvasRawData.length === 0) {
    return (
      <div className="drawwit-loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const [displayData, setDisplayData] = useState([...canvasRawData].reverse());
  const size = displayData.length;

  const handleCellClick = (x, y) => {
    if (currentMode === "view" || currentColor === "none" || currentColor === "delete" || currentColor === "") {
      return;
    }

    setDisplayData((prev) => {
      console.log(currentColor)
      const newData = prev.map((row) => [...row]); // copia profunda
      newData[y][x] = currentColor; // modificamos la celda
      return newData;
    });
  };

  const exportCanvas = () => {
  };

  return (
    <div
      className="drawwit-canvas"
      style={{
        "--size": size,
      }}
    >
      {displayData.flatMap((row, y) =>
        row.map((color, x) => (
          <div
            key={`${x}-${y}`}
            className="drawwit-cell"
            style={{
              backgroundColor: color,
              cursor: "pointer",
            }}
            onClick={() => handleCellClick(x, y)}
          />
        ))
      )}
    </div>
  );
}

export default DrawwitCanvas;
