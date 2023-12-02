import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../../common/show modal/showModal.css";
import { useTranslation } from "react-i18next";

function ModalShow(props) {
  const { t } = useTranslation();

  return (
    <Modal className="showModal" show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton className="header">
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <span className="label">{t("Name")} : </span>
          {props.item?.name}
        </p>
        <p>
          <span className="label">{t("Email")} :</span> {props.item?.email}{" "}
        </p>
        <p>
          <span className="label">{t("Phone")} : </span>
          {props.item?.phone}
        </p>
        <p>
          <span className="label">{t("Id")} : </span>
          {props.item?.id}
        </p>
        <p>
          <span className="label">{t("CreatedAt")}: </span>
          {props.item?.created_at}
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={props.handleClose}
          className="close btn btn-danger"
        >
          {t("Close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalShow;
