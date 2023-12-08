import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { Modal } from "react-bootstrap";
import "../css/App.css";

//TODO: POST comment
//TODO: GET comment

function CommentModal({ squeal, showComment, handleCloseComment }) {
  //console.log(squeal);
  ///POST /squeal/{id}/comment/ ------------------------------------------------------------------------------------------------------------
  const [comment, setComment] = useState("");

  async function postComment() {
    /*
    try {
      const data = {
        content: comment,
      };
      const uri = `${ReactConfig.base_url_requests}/squeal/${squeal}/comment/`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(data),
      };

      let result = await fetch(uri, options);
      //console.log(result);

      if (result.ok) {
        let json = await result.json();
        console.log("POST COMMENTOOOOOO OK", json);
        setComment(json);
        handleCloseComment();
        //console.log(comment);
      } else {
        console.error("Errore nella POST del commento:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch per il commento:", error);
    }
    */
  }

  //GET /squeal/{id}/comment/ ------------------------------------------------------------------------------------------------------------
  const [readComment, setReadComment] = useState([]);

  async function getComments() {
    /*
    try {
      const uri = `${ReactConfig.base_url_requests}/squeal/${squeal}/comment/`;
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        mode: "cors",
      };

      let result = await fetch(uri, options);
      //console.log(result);

      if (result.ok) {
        let json = await result.json();
        //console.log("reaaaaaaaaad comment", json);
        setReadComment(json);
      } else {
        console.error("Errore nella GET dei commenti:", result.statusText);
      }
    } catch (error) {
      console.error("Errore nella fetch:", error);
    }
    */
  }

  useEffect(() => {
    //getComments();
    //const intervalId2 = setInterval(getComments, 10000); //10 sec

    return () => {
      //clearInterval(intervalId2);
    };
  }, []);

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <>
      <Modal show={showComment} onHide={handleCloseComment} centered>
        <Modal.Header closeButton className="modal-buy-header">
          <Modal.Title>Commenta</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-buy-body">
          <div className="row p-2 mb-3">
            <form onSubmit={postComment}>
              <label htmlFor="comment" className=" cool-font-medium">
                Commento:
              </label>
              <input
                type="text"
                name="comment"
                className="cool-font-text text-center box"
                style={{ color: "#072f38", backgroundColor: "#e0bb76" }}
                id="commentToSqueal"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button type="submit" className="blue-button box">
  COMMENTA
</button>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer style={footerStyle}>
          
          
          
          <button className="red-button box" onClick={handleCloseComment}>
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CommentModal;
