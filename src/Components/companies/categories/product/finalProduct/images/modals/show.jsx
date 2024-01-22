import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

function ModalShow(props) {
  const { t } = useTranslation();

  return (
    <Modal className="showModal" show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton className="header">
        <Modal.Title>{t("FinalProductImg")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <span className="label">{t("FileId")} : </span> {props.item?.file.id}
        </p>
        <p>
          <span className="label">{t("FilePath")} : </span>
          {props.item?.file.file_path}
        </p>
        <p>
          <span className="label">{t("original_name")} : </span>
          {props.item?.file.original_name}
        </p>

        <p>
          <span className="label">{t("ProductId")} : </span>
          {props.item?.product_id}
        </p>

        <p>
          <span className="label">{t("final_product_id")} : </span>
          {props.item?.final_product_id}
        </p>
        <p>
          <span className="label">{t("category_id")} : </span>
          {props.item?.category_id}
        </p>

        <p>
          <span className="label">{t("CompanyId")} : </span>
          {props.item?.company_id}
        </p>
        <p>
          <span className="label"> {t("ClientId")} : </span>
          {props.item?.client_id}
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
