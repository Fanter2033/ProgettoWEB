import React from 'react';
import "../css/App.css";

import avvoltoio from "./media/images.jpeg";
//TODO: ADD ANIMATION

const VultureAnimation = () => {
  return (
    <div className="vulture-animation">
      <img src={avvoltoio} alt="Avvoltoio" />
    </div>
  );
};

export default VultureAnimation;
