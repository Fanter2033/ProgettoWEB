import React from "react";
import { Modal, Button } from "react-bootstrap";

const UserDeleteModal = ({
  showDeleteModal,
  handleDeleteUser,
  handleCloseDeleteModal,
}) => {
  return (
    <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
      <Modal.Header closeButton>
        <Modal.Title>Conferma Eliminazione Utente</Modal.Title>
      </Modal.Header>
      <Modal.Body>Sei sicuro di voler eliminare questo utente?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDeleteModal}>
          Annulla
        </Button>
        <Button variant="danger" onClick={handleDeleteUser}>
          Elimina Utente
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDeleteModal;
