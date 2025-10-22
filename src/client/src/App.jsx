import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import './styles/mainApp.css';
import randomWordList from './randomWordList.js';
import { navigateTo, showToast } from '@devvit/web/client';


function App() {
  const [isLoading, setIsLoading] = useState(false);

  const [selectedWordType, setSelectedWordType] = useState("none");
  const [word, setWord] = useState("");
  const [randomDisplayWord, setRandomDisplayWord] = useState("");

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

  async function publishMatch(prompt) {
    const response = await fetch('/api/publish-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();

    if (!data.ok || !data.url) {
      showToast(`something went wrong.`)
      console.error(`something went wrong ${data.error}`);
      return;
    }
    return data.url
  }


  function getStyle(wordType) {
    const isSelected = selectedWordType === wordType;
    return {
      backgroundColor: isSelected ? "#ac68f0" : "white",
      color: isSelected ? "white" : "black",
      transition: "background-color 0.3s ease, color 0.3s ease",
      cursor: "pointer"
    };
  }

  function getDoneButtonStyle() {
    if(selectedWordType === "none") {
      return {
        backgroundColor: "white",
        border: "3px solid gray",
        cursor: "pointer"
      }
    }else if ((selectedWordType !== "none")||(word.trim() === "")) {
      return {
        backgroundColor: "#ac68f0",
        userSelect: "none"
      }
    }
  }

  return (
    <motion.div className="main">
      {
        isLoading && (
          <motion.div
            className="loading-screen-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 100,
              damping: 10,
              bounce: 0.4,
            }}
          >
            <motion.div
              className="loading-screen-backdrop_toast"
              initial={{ y: -1000 }}
              animate={{ y: 0}}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 400,
                damping: 15,
                bounce: 0.6,
              }}
            >
              Loading...
            </motion.div>
          </motion.div>
        )
      }
      {
        !isLoading && (
          <motion.div
            className="main_selector-container"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 400,
              damping: 15,
              bounce: 0.6,
            }}
          >
            <motion.header
              className="selector-container_header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.6,
                duration: 0.5,
                stiffness: 800,
                damping: 15,
                bounce: 0.6,
              }}
            >
              Select Prompt
            </motion.header>

            {/* RANDOM */}
            <motion.header
              className="selector-container_selector--random"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSelectedWordType("random")}
              style={getStyle("random")}
              transition={{
                delay: 0.8,
                duration: 0.5,
                stiffness: 800,
                damping: 15,
                bounce: 0.6,
              }}
            >
              <div className="selector-container--random__word-container"
                   onClick={() => {
                     const randomIndex = Math.floor(Math.random() * randomWordList.length);
                     if (randomDisplayWord.trim() === "") {
                       setWord(randomWordList[randomIndex]);
                       setRandomDisplayWord(randomWordList[randomIndex])
                     }
                   }}
              >
                <div className="word-container_label">Random Word</div>
                <motion.div
                  key={"hello"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{rotateY:15}}
                  onClick={() => {
                    setSelectedWordType("random");
                    const randomIndex = Math.floor(Math.random() * randomWordList.length);
                    if (randomDisplayWord.trim() === "") {
                      setWord(randomWordList[randomIndex]);
                      setRandomDisplayWord(randomWordList[randomIndex])
                    }
                  }}
                >
                  {randomDisplayWord}
                </motion.div>
              </div>
              <motion.div
                className="selector-container--random__word-changer"
                whileTap={{scaleX:1.1}}
                whileHover={{scaleX:0.9}}
                onClick={() => {
                  const randomIndex = Math.floor(Math.random() * randomWordList.length);
                  setWord(randomWordList[randomIndex]);
                  setRandomDisplayWord(randomWordList[randomIndex])
                }}
              >
                Change Word
              </motion.div>
            </motion.header>

            {/*/!* CUSTOM *!/*/}
            {/*<motion.header*/}
            {/*  className="selector-container_selector--custom"*/}
            {/*  initial={{ opacity: 0 }}*/}
            {/*  animate={{ opacity: 1 }}*/}
            {/*  onClick={() => setSelectedWordType("custom")}*/}
            {/*  style={getStyle("custom")}*/}
            {/*  transition={{*/}
            {/*    delay: 1,*/}
            {/*    duration: 0.5,*/}
            {/*    stiffness: 800,*/}
            {/*    damping: 15,*/}
            {/*    bounce: 0.6,*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <div className="selector-container--custom__word-container"*/}
            {/*       whileHover={{rotateY:15}}*/}
            {/*  >*/}
            {/*    <div className="word-container_label">Custom Word</div>*/}
            {/*    <input*/}
            {/*      className="word-container_input"*/}
            {/*      onChange={(e) => {*/}
            {/*        setWord(e.target.value)*/}
            {/*        setRandomDisplayWord("")*/}
            {/*      }}*/}
            {/*      onBlur={(e) => {*/}
            {/*        setWord("")*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*</motion.header>*/}

            {/* DONE BUTTON */}
            <motion.div
              className="selector-container_done-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 1.2,
                duration: 0.5,
                stiffness: 800,
                damping: 15,
                bounce: 0.6,
              }}
              style={getDoneButtonStyle("custom")}
              onClick={async () => {
                if (word.trim() !== "") {
                  setIsLoading(true)
                  try {
                    const postUrl = await publishMatch(word)
                    navigateTo(postUrl)
                  } catch (error) {
                    await devvitLog(`${error}`)
                  }
                }
              }}

            >
              Done!
            </motion.div>
          </motion.div>
        )
      }
    </motion.div>
  );
}

export default App;
