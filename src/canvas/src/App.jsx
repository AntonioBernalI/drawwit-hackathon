import { useState } from "react";
import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./App.css";
import DrawwitCanvas from './DrawwitCanvas.jsx';

function App() {
  const emptyPixelData = Array(50).fill().map(() => Array(50).fill("#fff"));


  return (
    <>
      {/* Todo lo que puede moverse o hacer zoom */}
      <div className="main">
        <TransformWrapper
          initialScale={1}
          minScale={0.3}
          maxScale={10}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
        >
          <TransformComponent>
            <DrawwitCanvas canvasRawData={emptyPixelData}>

            </DrawwitCanvas>
          </TransformComponent>
        </TransformWrapper>
      </div>
      {/* Elementos fijos en pantalla */}
      <motion.div className="prompt-container">Skateboard</motion.div>
      <motion.div className="ink-container">99</motion.div>
      <motion.div className="paint-button">Paint !</motion.div>
    </>
  );
}

export default App;
