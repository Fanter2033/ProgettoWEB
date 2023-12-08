import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Card } from "react-bootstrap";

function ShowComment({ arrayComment }) {
  const [wannaRead, setWannaRead] = useState(false);
  const changeState = () => {
    setWannaRead(!wannaRead);
  };

  return (
    <div>
      <button className="custom-button cool-font-small mt-2" onClick={changeState}>
        LEGGI I COMMENTI
        ({arrayComment.length})
      </button>

      {wannaRead &&
        arrayComment.map((comment, index) => (
          <Col key={index}>
            <Card>
              <p>DA: {comment.username}</p>
              <p>{comment.comment}</p>
            </Card>
          </Col>
        ))}
      {wannaRead && arrayComment.length === 0 && <p>NON CI SONO COMMENTI</p>}
    </div>
  );
}

export default ShowComment;
