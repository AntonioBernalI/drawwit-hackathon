import { useMemo } from "react";
import "./DrawwitCanvas.css";

function DrawwitCanvas({ canvasRawData }) {
  if (!Array.isArray(canvasRawData) || canvasRawData.length === 0) {
    return (
      <div className="drawwit-loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const size = canvasRawData.length;

  const displayData = useMemo(() => [...canvasRawData].reverse(), [canvasRawData]);

  return (
    <div
      className="drawwit-canvas"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
      }}
    >
      {displayData.flatMap((row, y) =>
        row.map((color, x) => (
          <div
            key={`${x}-${y}`}
            className="drawwit-cell"
            style={{ backgroundColor: color }}
          />
        ))
      )}
    </div>
  );
}

export default DrawwitCanvas;
