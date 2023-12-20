import React from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

function TextLink({ text }) {
  // regexp per individuare le parole che iniziano con @, § o #
  const keywordRegex = /(@[^\s]+)|(§[^\s]+)|(#\w+)/g;

  // funzione per rendere cliccabili le parole chiave nella stringa
  const renderClickableKeywords = (text) => {
    if (!text) {
      return null; // se testo è undefined o null
    }

    return text.split(/(@\S+|§\S+|#\w+)/g).map((part, index) => {
      // verifica se la parte corrente è una parola chiave
      const match = part.match(/(@|§|#)(\S+)/);
      if (match) {
        const [_, keywordType, keywordValue] = match; // ignora l'elemento 0, contiene la stringa completa
        const linkTo = keywordType === "@" ? "/infou" : "/infoc";

        //console.log(linkTo);
        //console.log(keywordValue);

        return (
          <Link key={index} to={linkTo} state={keywordValue} style={{color : "#528b57", fontWeight: "bold"}}>
            {part}
          </Link>
        );
      }

      return part;
    });
  };

  return <div>{renderClickableKeywords(text)}</div>;
}

export default TextLink;
