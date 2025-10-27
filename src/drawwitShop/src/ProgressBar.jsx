import React from 'react';
import './App.css'

function LevelProgressBar({pixelsPlaced}) {

  function gamma(x) {
    return Math.ceil((-1 + Math.sqrt(1 + (4 * x) / 50)) / 2);
  }

  function a(x) {
    const n = gamma(x);
    return 100 * ((n - 1) * n) / 2;
  }

  function z(x) {
    const n = gamma(x);
    return 100 * (n * (n + 1)) / 2;
  }

  const level = gamma(pixelsPlaced);
  const start = a(pixelsPlaced);
  const goal = z(pixelsPlaced);

  return (
    <div className={"level-bar-main-container"}>
      <p className={"level-text-container"}>{`level: ${level}`}</p>
      <div className={"level-bar-back"}>
        <div className={"level-bar-front"} style={{
          width:`${String((pixelsPlaced/goal)*100)}%`
        }}>
        </div>
      </div>
      <p className={"minutes-elapsed-text"}>{`pixels placed: ${pixelsPlaced}`}</p>
      <p className={"start-label"}>{start}</p>
      <p className={"goal-label"}>{goal}</p>
      <div className={"start-container"}>
        <p>ink capacity:</p>
        <p>{(20*level+1)+30}</p>
      </div>
      <div className={"goal-container"}>
        <p>ink capacity:</p>
        <p>{(20*(level+2))+30}</p>
      </div>
    </div>
  );
}

export default LevelProgressBar;
