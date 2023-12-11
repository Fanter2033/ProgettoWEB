import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactConfig from "../config/ReactConfig";

import { useUserContext } from "../config/UserContext";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Modal } from "react-bootstrap";
import "../css/App.css";

//TODO: POST comment
//TODO: GET comment

function CommentModal({ squeal, showComment, handleCloseComment }) {
  //console.log(squeal);
  const { userGlobal, setUserGlobal } = useUserContext();

  const notify = () =>
    toast.error("Non sei loggato", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  ///POST /squeal/{id}/comment/ ------------------------------------------------------------------------------------------------------------
  const [comment, setComment] = useState("");

  async function postComment() {
    if (userGlobal.username !== "") {
      setComment(comment);

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
          handleCloseComment();
          //console.log(comment);
        } else {
          console.error("Errore nella POST del commento:", result.statusText);
        }
      } catch (error) {
        console.error("Errore nella fetch per il commento:", error);
      }
    } else {
      notify();
    }
  }

  const footerStyle = {
    backgroundColor: "#e0bb76",
  };

  return (
    <>
      <Modal show={showComment} onHide={handleCloseComment} centered>
        <Modal.Header closeButton className="modal-buy-header">
          <Modal.Title className="cool-font-medium">Commenta</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-buy-body p-5">
          <div className="row p-2 mb-3">
            <label htmlFor="comment" className=" cool-font-medium">
              Commento
            </label>
            <textarea
              type="text"
              name="comment"
              className="cool-font-text text-center box"
              style={{
                color: "#072f38",
                backgroundColor: "#e0bb76",
               
              }}
              rows="4"
              cols="30"
              id="commentToSqueal"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
        </Modal.Body>
        <Modal.Footer
          style={footerStyle}
          className="d-flex justify-content-center"
        >
          <button
            className="blue-button cool-font-small box w-50 box"
            onClick={postComment}
          >
            COMMENTA
          </button>
          <button
            className="red-button box cool-font-small w-50 box"
            onClick={handleCloseComment}
          >
            ANNULLA
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CommentModal;
