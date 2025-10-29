
export function applyPepper(canvas) {
  const size = canvas.length;
  const totalPixels = size * size;
  const pepperCount = Math.floor(totalPixels * (0.01 + Math.random() * 0.02));
  for (let i = 0; i < pepperCount; i++) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    canvas[y][x] = "#000000";
  }
  return canvas;
}

export function applyFlashbang(canvas) {
  const brighten = (v) => Math.min(255, v + (255 - v) * 0.7); // 70% toward white
  return canvas.map(row =>
    row.map(color => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const newColor = `#${[brighten(r), brighten(g), brighten(b)]
        .map(v => Math.round(v).toString(16).padStart(2, "0"))
        .join("")}`;
      return newColor;
    })
  );
}

export function applySmudge(canvas) {
  const size = canvas.length;
  const newCanvas = canvas.map(row => [...row]);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = Math.floor(Math.random() * 7) - 3; // shift -3..3
      const dy = Math.floor(Math.random() * 7) - 3;
      const nx = Math.min(size - 1, Math.max(0, x + dx));
      const ny = Math.min(size - 1, Math.max(0, y + dy));
      newCanvas[y][x] = canvas[ny][nx];
    }
  }
  return newCanvas;
}

export function applyInvert(canvas) {
  const invert = (v) => 255 - v;
  return canvas.map(row =>
    row.map(color => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const newColor = `#${[invert(r), invert(g), invert(b)]
        .map(v => v.toString(16).padStart(2, "0"))
        .join("")}`;
      return newColor;
    })
  );
}

export function applyMirrorVertical(canvas) {
  const size = canvas.length;
  const newCanvas = canvas.map(row => [...row]);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size / 2; x++) {
      newCanvas[y][size - 1 - x] = canvas[y][x];
    }
  }
  return newCanvas;
}

export function applyMirrorHorizontal(canvas) {
  const size = canvas.length;
  const newCanvas = canvas.map(row => [...row]);
  for (let y = 0; y < size / 2; y++) {
    newCanvas[size - 1 - y] = [...canvas[y]];
  }
  return newCanvas;
}

export function applyBlackout(canvas) {
  const size = canvas.length;
  const newCanvas = Array(size).fill().map(() => Array(size).fill("#000000"));
  return newCanvas;
}
