import React from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../../common/show modal/showModal.css";
import { useTranslation } from "react-i18next";

function ModalShow(props) {
  const { t } = useTranslation();

    return (
      <Modal show={props.show} onHide={props.handleClose} className="showModal">
        <Modal.Header closeButton className="header">
          <Modal.Title>{props.item?.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <span className="label">{t("Name")} : </span>
            {props.item?.name}
          </p>
          <p>
            <span className="label">{t("ArabicName")} :</span> {props.item?.name_ar}
          </p>
          <p>
            <span className="label">{t("PhoneCode")} : </span>
            {props.item?.phone_code}
          </p>
          <p>
            <span className="label">{t("Prefix")} : </span>
            {props.item?.prefix}
          </p>
          <p>
            <span className="label">{t("Id")} : </span>
            {props.item?.id}
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