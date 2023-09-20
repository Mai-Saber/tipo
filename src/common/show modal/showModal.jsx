import * as React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

function ShowModal(props) {
  return (
    <div className="modal">
      <Modal
        show={props.showModal}
        onHide={props.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>,,,mmm</Modal.Title>
        </Modal.Header>
        <Modal.Body>kmkk</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary"
            onClick={props.handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ShowModal;
