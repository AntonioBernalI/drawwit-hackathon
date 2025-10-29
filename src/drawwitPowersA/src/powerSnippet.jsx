import React, { useEffect, useState } from 'react';
import bomb from "/bomb.png"; // blackout = bomb
import flashlight from "/flashlight.png";
import invert from "/invert.png";
import pepper from "/pepper.png";
import smudge from "/smudge.png";
import mirror from "/mirror.png";


function ImageSpawn({powerName}) {
  const [image, setImage] = useState(bomb);
  useEffect(() => {
    switch (powerName) {
      case "blackout":
        setImage(bomb);
        break;
      case "flashlight":
        setImage(flashlight);
        break;
      case "invert":
        setImage(invert);
        break;
      case "smudge":
        setImage(smudge);
        break;
      case "mirror":
        setImage(mirror);
        break;
      case "pepper":
        setImage(pepper);
        break;
    }
  }, [powerName]);

  return(
    <img
      className={`${powerName}-image`}
      src={image}
      alt={`${powerName}`}
    />
  )
}

function PowerSnippet({powerName, amount, onUse}) {
  if (Number(amount) > 0){
    return (
      <div className={'power-snippet'}>
        <div className={'image-container'}>
          <ImageSpawn powerName={powerName} />
        </div>
        <p className={'amount-label'}>{`x ${amount}`}</p>
        <div className={'use-button'} onClick={onUse}>Use</div>
        <div className={'power-name-label'}>{powerName}</div>
      </div>
    );
  }else{
    return (
      <></>
    )
  }
}

export default PowerSnippet;
