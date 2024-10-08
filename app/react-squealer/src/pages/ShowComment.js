import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Card, CardHeader } from "react-bootstrap";
import ReactConfig from "../config/ReactConfig";

// <b className="cool-font-text">DA:&nbsp;</b>

function ShowComment({ arrayComment }) {
  const [wannaRead, setWannaRead] = useState(false);
  const changeState = () => {
    setWannaRead(!wannaRead);
  };

  return (
    <div>
      <button
        className="custom-button cool-font-small mt-2 box"
        onClick={changeState}
      >
        LEGGI I COMMENTI ({arrayComment.length})
      </button>

      {wannaRead &&
        arrayComment
          .map((comment, index) => (
            <Col key={index}>
              <Card className="offers m-2">
                <Card.Header className="d-flex flex-row justify-content-center align-items-center">
                  <Link to={ReactConfig.pathFunction("/infou")} state={comment.username} className="link-comment" aria-label="clicca se vuoi avere più informazioni su questo utente">
                      <b > {comment.username} </b>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-info-circle-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                      </svg>
                  </Link>
                </Card.Header>
                <Card.Footer>
                  <p className="cool-medium-yellow m-0">{comment.comment}</p>
                </Card.Footer>
              </Card>
            </Col>
          ))
          .reverse()}

      {wannaRead && arrayComment.length === 0 && <p className="cool-font-text mt-2">NON CI SONO COMMENTI</p>}
    </div>
  );
}

export default ShowComment;
