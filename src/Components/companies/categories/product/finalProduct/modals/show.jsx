import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

function ModalShow(props) {
  const { t } = useTranslation();

  return (
    <Modal className="showModal" show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton className="header">
        <Modal.Title>{props.item?.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <span className="label">{t("Name")} : </span>
          {props.item?.name}
        </p>
        <p>
          <span className="label">{t("Id")} : </span> {props.item?.id}
        </p>

        <p>
          <span className="label">{t("categoryName")} : </span>
          {props.item?.category?.name}
        </p>
        <p>
          <span className="label">{t("categoryId")} : </span>
          {props.item?.category?.id}
        </p>
        <p>
          <span className="label">{t("CompanyName")} : </span>
          {props.item?.company?.name}
        </p>
        <p>
          <span className="label">{t("CompanyId")} : </span>
          {props.item?.company?.id}
        </p>
        <p>
          <span className="label"> {t("ClientId")} : </span>
          {props.item?.client?.id}
        </p>
        <p>
          <span className="label">{t("createdAt")} : </span>
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
