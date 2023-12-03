import React from "react";
import Modal from "react-bootstrap/Modal";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

function ModalShow(props) {
  const { t } = useTranslation();

  return (
    <Modal className="showModal" show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton className="header">
        <Modal.Title>{props.item?.data?.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <span className="label">{t("Name")} : </span>
          {props.item?.data?.name}
        </p>
        <p>
          <span className="label">{t("Id")} : </span> {props.item?.data?.id}
        </p>
        <p>
          <span className="label">{t("created_at")} : </span>
          {props.item?.data?.created_at}
        </p>
        <p>
          <span className="label">Children Count :</span>
          {props.item?.children?.length}
        </p>

        <hr />
        <h3>{t("CompanyDetails")}</h3>
        <p>
          <span className="label">{t("CompanyName")} : </span>
          {props.item?.data?.company_id}
        </p>
        <p>
          <span className="label">{t("CompanyId")} : </span>
          {props.item?.data?.company_id}
        </p>
        <p>
          <span className="label"> {t("ClientId")} : </span>
          {props.item?.data?.client_id}
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
