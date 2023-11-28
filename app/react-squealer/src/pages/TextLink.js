import React from "react";
import { Link } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

function TextLink({ text }) {
  // regexp per individuare le parole che iniziano con @, § o #
  const keywordRegex = /(@[^\s]+)|(§[^\s]+)|(#\w+)/g;

  // funzione per rendere cliccabili le parole chiave nella stringa
  const renderClickableKeywords = (text) => {
    if (!text) {
      return null; // Gestione del caso in cui il testo è undefined o null
    }

    /*
    return text.split(keywordRegex).map((part, index) => {
      // Verifica se la parte corrente è una parola chiave
      if (index % 2 === 1) {
        const keywordType = part[0]; // @, § o #
        const keywordValue = part.slice(1); // Rimuovi il carattere iniziale
        return (
          <>
            {keywordType === "@" && (
              <>
                <Link key={index} to={`/infou`} state={keywordValue}>
                  {part}
                </Link>
              </>
            )}
            {keywordType !== "@" && (
              <>
                <Link key={index} to={`/infoc`} state={keywordValue}>
                  {part}
                </Link>
              </>
            )}
          </>
        );
      }
      return part;
    });
 
  */
    return text.split(/(@\S+|§\S+|#\w+)/g).map((part, index) => {
      // Verifica se la parte corrente è una parola chiave
      const match = part.match(/(@|§|#)(\S+)/);
      if (match) {
        const [_, keywordType, keywordValue] = match; // Ignora l'elemento 0, contiene la stringa completa
        const linkTo = keywordType === "@" ? "/infou" : "/infoc";

        return (
          <Link key={index} to={linkTo} state={keywordValue}>
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
