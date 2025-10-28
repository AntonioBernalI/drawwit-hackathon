import { useState , useEffect} from "react";
import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./App.css";
import DrawwitCanvas from "./DrawwitCanvas.jsx";
import ColorPalette from "./colorPalette.jsx";
import inkImage from "/ink.png";

function App() {
  const [currentMode, setCurrentMode] = useState("view"); // view || paint
  const [currentColor, setCurrentColor] = useState("none");
  const [prompt, setPrompt] = useState("");
  const [inkCount, setInkCount] = useState(30);

  const [matchHash, setMatchHash] = useState({
    prompt: "loading...",
    canvasA: Array(50)
      .fill()
      .map(() => Array(50).fill("#fff")),
    canvasB: Array(50)
      .fill()
      .map(() => Array(50).fill("#fff")),
    status: 'active',
    factionA: null,
    factionB: null,
    topCollaborators: null,
    totalInkSpentOnFactionA: null,
    totalInkSpentOnFactionB: null,
    votesA: '...',
    votesB: '...',
  })

  const [ink, setInk] = useState("");


  async function addInk(amount) {
    try {
      const response = await fetch('/api/add-ink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }), // 👈 CAMBIO AQUÍ
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('Error adding ink:', data.error);
        return;
      }

      console.log('Ink updated:', data.ink);
      return data.ink;
    } catch (err) {
      console.log('Error in addInk:', err.message);
    }
  }



  async function devvitLog(message) {
    const response = await fetch('/api/log-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data;
  }

  async function updateInk() {
    try {
      const response = await fetch('/api/update-ink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      // Este endpoint no devuelve nada (204)
      await devvitLog('Ink updated successfully (update-ink)');
    } catch (error) {
      await devvitLog(`Failed to update ink: ${error}`);
      console.error(error);
    }
  }

  async function updateLastInkCheck() {
    try {
      const response = await fetch('/api/update-last-ink-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      await devvitLog(`✅ Last ink check updated for ${data.username} at ${data.lastInkCheck}`);
    } catch (error) {
      await devvitLog(`❌ Failed to update last ink check: ${error}`);
      console.error(error);
    }
  }


  async function fetchInk() {
    try {
      const response = await fetch('/api/get-ink', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.ink;
    } catch (error) {
      await devvitLog(`Failed to fetch ink: ${error}`);
      throw error;
    }
  }

  const fetchPostId = async () => {
    try {
      const response = await fetch('/api/get-post-id', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.postId;
    } catch (error) {
      await devvitLog(`Failed to fetch post ID:, ${error}`)
      throw error;
    }
  };

  async function fetchMatchHash(key) {
    try {
      const response = await fetch('/api/get-hash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: key }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const record = await response.json();
      return record;
    } catch (error) {
      await devvitLog(`an error happened while fetching matchData: ${error}`);
      throw error;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await updateInk();

        const ink = await fetchInk();
        setInk(ink);
        await devvitLog(`Ink available: ${ink}`);

        const postId = await fetchPostId();
        const record = await fetchMatchHash(postId);

        const parsedRecord = {
          ...record,
          canvasA: typeof record.canvasA === "string" ? JSON.parse(record.canvasA) : record.canvasA,
          canvasB: typeof record.canvasB === "string" ? JSON.parse(record.canvasB) : record.canvasB,
        };

        setMatchHash(parsedRecord);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const run = async () => {
      await devvitLog("running run()...")
      await addInk(1);
      await updateLastInkCheck();
      try {
        const ink = await fetchInk();
        setInk(ink);
        await devvitLog(`succesfully added ink every second: ${ink}`);
      } catch (error) {
        await devvitLog(`error occurred while adding ink: ${error}`);
      }
    };

    const secondInterval = setInterval(() => {
      setInkCount((prev) => (prev === 0 ? 30 : prev - 1));
    }, 1000);

    const inkInterval = setInterval(run, 30000);

    return () => {
      clearInterval(secondInterval);
      clearInterval(inkInterval);
    };
  }, []);

  async function handleCellClick(displayData) {
    await devvitLog(`handleCellClick called with: ${JSON.stringify(displayData)}`);

    setMatchHash((prevHash) => ({
      ...prevHash,
      canvasA: displayData,
    }));
    
    await devvitLog("About to fetch postId...");
    const postId = await fetchPostId();
    await devvitLog(`Got postId: ${postId}`);
    
    try {
      await devvitLog("Making API call to update-canvasA...");
      const ink = await fetchInk();
      setInk(ink);
      await devvitLog(`ink updated: ${ink}`);

      const res = await fetch("/api/update-canvasA", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, canvasA: displayData }),
      });
      
      await devvitLog(`Response status: ${res.status}`);
      const data = await res.json();
      await devvitLog(`Response data: ${JSON.stringify(data)}`);
      
      if (!res.ok) throw new Error(data.error || "Error while updating canvas A");
      await devvitLog("canvas update succesful");
      return data;
    } catch (err) {
      await devvitLog(`Error while updating canvasA: ${err.message}`);
    }
  }

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
          onTransformed={(ref) => {
            const { positionX, positionY } = ref.state;
            const limit = 1500;

            if (Math.abs(positionX) > limit || Math.abs(positionY) > limit) {
              ref.centerView(ref.state.scale, 300); // centra con animación
            }
          }}
        >
          <TransformComponent>
            <DrawwitCanvas
              canvasRawData={matchHash.canvasA}
              currentMode={currentMode}
              currentColor={currentColor}
              onCellClick={handleCellClick}
              ink={ink==="" ? 0 : Number(ink)}
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      <motion.div className="prompt-container">{matchHash.prompt}</motion.div>
      <motion.div className="ink-container">
        <p>{ink}</p>
        <img src={inkImage} alt="ink" className={"ink-image"}/>
      </motion.div>
      <div className="countdown-container">
        <p>1 ink every 30s</p>
        <p className={"countdown"}>{`0:${inkCount}`}</p>
      </div>
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
