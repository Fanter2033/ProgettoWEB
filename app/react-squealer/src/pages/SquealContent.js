import React, { useEffect } from "react";

import ReactConfig from "../config/ReactConfig";

import RenderMap from "./RenderMap";
import TextLink from "./TextLink";

import "../css/App.css";

function SquealContent({ content, type, id }) {

  //!attenzione al parametro formale id
  //TODO GET squeal mappe temporizzate
  async function getSqueal() {
    if (type === "POSITION_AUTO") {
      /*
      const uri = `${ReactConfig.base_url_requests}/squeal/${id}`;

      fetch(uri)
        .then((res) => {
          console.log(res);
          if (res.ok) {
            //creation ok
            return res.json();
          }
        })
        .catch((error) => {
          console.error("Cambio mappa failed, error:", error);
        });
        */
    }
  }

  useEffect(() => {
    getSqueal();

    const intervalId = setInterval(getSqueal, 5000); //10 sec
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {type === "MESSAGE_TEXT" && (
        <>
          <div className="cool-font-text text-break">
            <TextLink text={content} />
          </div>
        </>
      )}
      {type === "IMAGE" && (
        <>
          <img src={`data:image/png;base64,${content}`} alt="Image" />
        </>
      )}
      {type === "VIDEO_URL" && (
        <>
          <a href={content} className="cool-font-link youtube-link text-break">
            {content}
          </a>
        </>
      )}
      {type === "POSITION" && (
        <>
          <RenderMap coordinates={content} />
        </>
      )}
      {type === "TEXT_AUTO" && (
        <>
          <div className="cool-font-text text-break">{content}</div>
        </>
      )}
      {type === "POSITION_AUTO" && (
        <>
          <RenderMap coordinates={content} />
        </>
      )}
    </>
  );
}

export default SquealContent;
