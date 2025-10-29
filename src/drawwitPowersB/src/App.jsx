import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import inkImage from '/ink.png'
import { showToast } from '@devvit/web/client';
import PowerSnippet from './powerSnippet.jsx';
import {
  applyBlackout,
  applyFlashbang,
  applyInvert,
  applyMirrorVertical,
  applyPepper,
  applySmudge,
} from './powerFunctions.js';


function App() {
  const [pixelsPlaced, setPixelsPlaced] = useState("")
  const [ink, setInk] = useState("")
  const [powerHash, setPowerHash] = useState({
    pepper: "0",
    flashlight: "0",
    smudge: "0",
    invert: "0",
    mirror: "0",
    blackout: "0"
  })
  const [matchHash, setMatchHash] = useState({
    prompt: "loading...",
    canvasA: null,
    canvasB: null,
    status: 'active',
    factionA: null,
    factionB: null,
    topCollaborators: null,
    totalInkSpentOnFactionA: null,
    totalInkSpentOnFactionB: null,
    votesA: '...',
    votesB: '...',
  })

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

  async function updateCanvasB(postId, canvasB) {
    try {
      const response = await fetch("/api/update-canvasB", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, canvasB }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update canvasB");
      }

      return data;
    } catch (err) {
      console.error("Error updating canvasB:", err);
      return { ok: false, error: err.message };
    }
  }

  const getPowers = async () => {
    try {
      const response = await fetch('/api/get-power', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return data.powers;
      } else {
        showToast(data.error || 'Something went wrong!');
        return null;
      }
    } catch (error) {
      showToast('Network error!');
      return null;
    }
  };

  const spendPower = async (powerName) => {
    try {
      const response = await fetch('/api/decrement-power', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestedPower: powerName
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await devvitLog(`power spent: ${JSON.stringify(data)}`);
        showToast(`${powerName} used`);
      } else {
        await devvitLog(`Error: ${data.error}`);
        showToast(data.error || 'something went wrong!');
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const powerHash = await getPowers();
        setPowerHash(powerHash);
      } catch (error) {
        await devvitLog(`something went wrong while fetching power hash: ${error}`)
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postId = await fetchPostId();
        const record = await fetchMatchHash(postId);
        const powerHash = await getPowers();
        setPowerHash(powerHash);
        const parsedRecord = {
          ...record,
          canvasB: typeof record.canvasA === "string" ? JSON.parse(record.canvasB) : record.canvasB
        };

        setMatchHash(parsedRecord);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="main-container">
      <div className="shop-container">
        <div className="welcome-message">Your powers</div>
        <div className="shop-father-container">
          {Object.values(powerHash || {}).some(value => value !== "0") ? (
            <>
              <PowerSnippet
                powerName="pepper"
                amount={powerHash.pepper}
                onUse={async () => {
                  try {
                    await spendPower("pepper");
                    const postId = await fetchPostId();
                    await updateCanvasB(postId, applyPepper(matchHash.canvasB));
                  } catch (error) {
                    console.error("Error while using pepper:", error);
                    await devvitLog(`Error while using pepper ${error}`);
                  }
                }}
              />

              <PowerSnippet
                powerName="flashlight"
                amount={powerHash.flashlight}
                onUse={async () => {
                  try {
                    await spendPower("flashlight");
                    const postId = await fetchPostId();
                    await updateCanvasB(postId, applyFlashbang(matchHash.canvasB));
                  } catch (error) {
                    console.error("Error while using flashlight:", error);
                    await devvitLog(`Error while using flashlight ${error}`);
                  }
                }}
              />

              <PowerSnippet
                powerName="smudge"
                amount={powerHash.smudge}
                onUse={async () => {
                  try {
                    await spendPower("smudge");
                    const postId = await fetchPostId();
                    await updateCanvasB(postId, applySmudge(matchHash.canvasB));
                  } catch (error) {
                    console.error("Error while using smudge:", error);
                    await devvitLog(`Error while using smudge ${error}`);
                  }
                }}
              />

              <PowerSnippet
                powerName="invert"
                amount={powerHash.invert}
                onUse={async () => {
                  try {
                    await spendPower("invert");
                    const postId = await fetchPostId();
                    await updateCanvasB(postId, applyInvert(matchHash.canvasB));
                  } catch (error) {
                    console.error("Error while using invert:", error);
                    await devvitLog(`Error while using invert ${error}`);
                  }
                }}
              />

              <PowerSnippet
                powerName="mirror"
                amount={powerHash.mirror}
                onUse={async () => {
                  try {
                    await spendPower("mirror");
                    const postId = await fetchPostId();
                    await updateCanvasB(postId, applyMirrorVertical(matchHash.canvasB));
                  } catch (error) {
                    console.error("Error while using mirror:", error);
                    await devvitLog(`Error while using mirror ${error}`);
                  }
                }}
              />

              <PowerSnippet
                powerName="blackout"
                amount={powerHash.blackout}
                onUse={async () => {
                  try {
                    await spendPower("blackout");
                    const postId = await fetchPostId();
                    await updateCanvasB(postId, applyBlackout(matchHash.canvasB));
                  } catch (error) {
                    console.error("Error while using blackout:", error);
                    await devvitLog(`Error while using blackout ${error}`);
                  }
                }}
              />
            </>
          ) : (
            <div className="no-powers">
              You don’t have any powers yet, but you can save up some ink and visit our shop to buy some.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
