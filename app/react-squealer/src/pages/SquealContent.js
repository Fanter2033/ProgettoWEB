import React from "react";

import RenderMap from "./RenderMap";
import TextLink from "./TextLink";

import "../css/App.css";

function SquealContent({ content, type }) {
  return (
    <>
      {type === "MESSAGE_TEXT" && (
        <>
          <div className="cool-font-text">
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
          <a href={content} className="cool-font-link youtube-link text-wrap">
            {content}
          </a>
        </>
      )}
      {type === "POSITION" && <RenderMap coordinates={content} />}
      {type === "TEXT_AUTO" && (
        <>
          <div className="cool-font-text">{content}</div>
        </>
      )}
      {type === "POSITION_AUTO" && <RenderMap coordinates={content} />}
    </>
  );
}

export default SquealContent;
