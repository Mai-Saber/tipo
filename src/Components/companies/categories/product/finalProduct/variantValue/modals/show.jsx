import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";

function ModalShow(props) {
  const { t } = useTranslation();

  return (
    <Modal className="showModal" show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton className="header">
        <Modal.Title>{t("FinalProduct")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <span className="label">{t("Id")} : </span> {props.item?.id}
        </p>
        <p>
          <span className="label">{t("Details")} : </span>
          {props.item?.details}
        </p>
        <p>
          <span className="label">{t("createdAt")} : </span>
          {props.item?.created_at}
        </p>
        <p>
          <span className="label">{t("CategoryId")} : </span>
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
        {/* product */}
        <hr />
        <h5>Final Product Details</h5>
        <p>
          <span className="label">{t("ProductId")} : </span>
          {props.item?.final_product?.id}
        </p>

        {/* category */}
        <hr />
        <h5>Variant Details</h5>
        <p>
          <span className="label">{t("Variant")} : </span>
          {props.item?.variant?.name}
        </p>
        <p>
          <span className="label">{t("VariantId")} : </span>
          {props.item?.variant?.id}
        </p>

        {/* Variant Value */}
        <hr />
        <h5>Variant Value Details</h5>
        <p>
          <span className="label"> {t("VariantValue")} : </span>
          {props.item?.variant_value?.value}
        </p>
        <p>
          <span className="label"> {t("VariantValueId")} : </span>

          {props.item?.variant_value?.id}
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
