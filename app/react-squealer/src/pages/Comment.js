import React, { useState, useEffect } from "react";
import CommentModal from "./CommentModal";

import "../css/App.css";

function Comment({ squeal }) {
  const [showComment, setShowComment] = useState(false);

  const handleOpenComment = () => {
    setShowComment(true);
  };
  const handleCloseComment = () => {
    setShowComment(false);
  };

  return (
    <>
      <button
        className="green-button cool-font-small w-50 box mt-2"
        onClick={handleOpenComment}
      >
        COMMENTA
      </button>
      <CommentModal
        squeal={squeal}
        showComment={showComment}
        handleCloseComment={handleCloseComment}
      />
    </>
  );
}

export default Comment;
