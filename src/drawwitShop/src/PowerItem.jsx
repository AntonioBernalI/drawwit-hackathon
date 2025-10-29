import React, { useEffect, useState } from 'react';
import bomb from "/bomb.png"; // blackout = bomb
import flashlight from "/flashlight.png";
import invert from "/invert.png";
import pepper from "/pepper.png";
import smudge from "/smudge.png";
import mirror from "/mirror.png";
import inkImage from '/ink.png';


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

function PowerItem({name, description, price, onBuy}) {
  return (
    <div className={'item-main-container'}>
      <div className={'image-container'}>
        <div className={'ink-container--price'}>
          <img src={inkImage} className={'ink-image'} />
          <p>{price}</p>
        </div>
        <ImageSpawn powerName={name} />
      </div>
      <p className={'item-name-container'}>{name}</p>
      <p className={'item-description-container'}>{description}</p>
      <div className={'buy-button'} onClick={onBuy}>Buy</div>
    </div>
  );
}

export default PowerItem;
