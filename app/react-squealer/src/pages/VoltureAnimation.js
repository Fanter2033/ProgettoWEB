import React from 'react';
import "../css/App.css";

import avvoltoio from "./media/images.jpeg";


const VultureAnimation = () => {
  return (
    <div className="vulture-animation">
      {/* Aggiungi qui l'animazione dell'avvoltoio (es. un'immagine o un'animazione CSS) */}
      <img src={avvoltoio} alt="Avvoltoio" />
    </div>
  );
};

export default VultureAnimation;
