import { useState } from "react";
import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./App.css";
import DrawwitCanvas from "./DrawwitCanvas.jsx";
import ColorPalette from "./colorPalette.jsx";

function App() {
  const emptyPixelData = Array(50)
    .fill()
    .map(() => Array(50).fill("#fff"));
  const [currentMode, setCurrentMode] = useState("view"); // view || paint
  const [currentColor, setCurrentColor] = useState("none");
  const [prompt, setPrompt] = useState("");
  const [ink, setink] = useState("");

  return (
    <>
      <div className="main">
        <TransformWrapper
          initialScale={1}
          minScale={0.2}
          maxScale={5}
          centerOnInit={false}
          wheel={{ step: 0.3 }}
          doubleClick={{ disabled: true }}
          limitToBounds={false}
          limitToWrapper={false}
        >
          <TransformComponent>
            <DrawwitCanvas
              canvasRawData={emptyPixelData}
              currentMode={currentMode}
              currentColor={currentColor}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      <motion.div className="prompt-container">Skateboard</motion.div>
      <motion.div className="ink-container">99</motion.div>

      {currentMode === "view" && (
        <motion.div
          className="paint-button"
          onClick={() => {
            setCurrentMode("paint");
          }}
        >
          Paint!
        </motion.div>
      )}

      {currentMode === "paint" && (
        <ColorPalette
          onClose={() => {
            setCurrentMode("view");
          }}
          colorSetterFunction={(newColor) => {
            setCurrentColor(newColor);
          }}
        />
      )}
    </>
  );
}

export default App;
