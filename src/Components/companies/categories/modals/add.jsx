import React from 'react';
import Modal from "react-bootstrap/Modal";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
function ModalAdd(props) {
      const { t } = useTranslation();

    return (
      <Modal show={props.show} onHide={props.handleClose} className="Modal">
        <Modal.Header closeButton>
          <Modal.Title> {t("AddNewCategory")}</Modal.Title>
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
              value={props.newCategory?.name}
              onChange={props.handleChange}
            />
            <TextField
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              label={t("Category_id")}
              name="category_id"
              value={props.newCategory?.category_id}
              onChange={props.handleChange}
            />
            <TextField
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              label={t("CompanyId")}
              name="company_id"
              value={props.newCategory?.company_id}
              onChange={props.handleChange}
            />
            <TextField
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              label={t("ClientId")}
              name="client_id"
              value={props.newCategory?.client_id}
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
            onClick={props.handleSubmitAddCategory}
          >
            {t("Save")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default ModalAdd;