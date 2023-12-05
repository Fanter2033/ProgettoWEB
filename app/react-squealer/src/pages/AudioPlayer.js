// AudioPlayer.js
import React, { useRef, useState, useEffect } from "react";
import notification from "./media/message.mp3";

const AudioPlayer = () => {
  const sound = new Audio(notification);
  const playSound = () => {
    sound.play();
  };

  const pauseSound = () => {
    sound.pause();
  };

  /*

  if (!document.hasFocus()) {
}

  */
 

  return (
    <>
      <button onClick={playSound}>Play Sound</button>
      <button onClick={pauseSound}>Stop Sound</button>
    </>
  );
};

export default AudioPlayer;

/*
WEB APPPPPPPPP
 const [nuoviDati, setNuoviDati] = useState(false);

  // Simula l'arrivo di nuovi dati dal database
  useEffect(() => {
    // Chiamata al database o altro meccanismo per verificare la presenza di nuovi dati
    const nuoviDatiArrivati = true;

    if (nuoviDatiArrivati) {
      setNuoviDati(true);
    }
  }, []);

  // Riproduci il suono quando ci sono nuovi dati
  useEffect(() => {
    if (nuoviDati) {
      // Aggiungi qui la tua logica per gestire la notifica (ad esempio, mostrare un avviso)
      console.log('Nuovi dati arrivati!');

      // Riproduci il suono
      AudioPlayer.playSound();
    }
  }, [nuoviDati]);

*/
