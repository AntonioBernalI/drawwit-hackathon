import { useState, useEffect } from "react";
import "./DrawwitCanvas.css";

function DrawwitCanvas({ canvasRawData , currentMode, currentColor, onCellClick, ink}) {
  if (!Array.isArray(canvasRawData) || canvasRawData.length === 0) {
    return (
      <div className="drawwit-loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  async function addPixelPlaced() {
    try {
      const response = await fetch('/api/add-pixels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1 }),
      });

      if (!response.ok) {
        console.error('Failed to add pixel:', response.status);
        return;
      }

      const data = await response.json();
      console.log(`Pixel added successfully. Total: ${data.total}`);
      return data;
    } catch (error) {
      console.error('Error connecting to /api/add-pixels:', error);
    }
  }

  async function spendInk(quantity) {
    try {
      const response = await fetch('/api/spend-ink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Error spending ink:', data.error);
        return;
      }

      console.log('Ink updated:', data.ink);
      return data.ink;
    } catch (err) {
      console.log('Error in spendInk:', err.message);
    }
  }

  const [displayData, setDisplayData] = useState([...canvasRawData].reverse());
  const size = displayData.length;


  const handleCellClick = (x, y) => {
    if (ink <= 0) return;
    if (currentMode === "view" || !currentColor || currentColor === "none") return;

    setDisplayData((prev) => {
      const newData = prev.map((row) => [...row]);
      newData[y][x] = currentColor === "delete" ? "white" : currentColor;
      onCellClick(newData);
      return newData;
    });

    (async () => {
      try {
        await spendInk(1);
        await addPixelPlaced();
      } catch (err) {
        console.error("Error updating backend:", err);
        // opcional: revertir el cambio en caso de error
      }
    })();
  };


  useEffect(() => {
    setDisplayData(canvasRawData);
  }, [canvasRawData]);


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
            onClick={async () => {
              await handleCellClick(x, y)
            }}
          />
        ))
      )}
    </div>
  );
}

export default DrawwitCanvas;
