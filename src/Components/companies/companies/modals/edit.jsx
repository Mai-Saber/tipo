import React from 'react';
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";

function ModalEdit(props) {
      const { t } = useTranslation();

    return (
      <Modal show={props.show} onHide={props.handleClose} className="Modal">
        <Modal.Header closeButton>
          <Modal.Title>{t("EditCompany")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form action="post">
            <TextField
              autoFocus
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              label={t("Name")}
              name="name"
              value={props.editItem?.name}
              onChange={props.handleChange}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="close btn btn-danger"
            variant="secondary"
            onClick={props.handleClose}
          >
            {t("Close")}
          </Button>
          <Button
            className="btn btn-primary"
            variant="primary"
            onClick={() => props.handleSubmitEdit(props.editItem?.id)}
          >
            {t("Save")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default ModalEdit;