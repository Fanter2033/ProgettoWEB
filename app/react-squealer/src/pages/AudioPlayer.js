// AudioPlayer.js
import React, { useRef, useState, useEffect } from "react";

const AudioPlayer = () => {
  const audioRef = useRef(null);
  const [audioLoaded, setAudioLoaded] = useState(false);

  const playSound = () => {
    if (audioLoaded) {
      audioRef.current.play();
    }
  };

  const pauseSound = () => {
    audioRef.current.pause();
    //audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    const handleCanPlayThrough = () => {
      setAudioLoaded(true);
    };

    //audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);

    // Cleanup dell'evento all'unmount
    return () => {
      //audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
    };
  }, []);


  return (
    <>
      <audio ref={audioRef}>
        <source src="/media/car.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
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
