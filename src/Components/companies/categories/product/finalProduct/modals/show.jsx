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
        {/* product */}
        <hr />
        <h5>Product Details</h5>
        <p>
          <span className="label">{t("Product")} : </span>
          {props.item?.product?.name}
        </p>
        <p>
          <span className="label">{t("ProductId")} : </span>
          {props.item?.product?.id}
        </p>
        <p>
          <span className="label"> {t("CreatedAt")} : </span>
          {props.item?.product?.created_at}
        </p>
        {/* category */}
        <hr />
        <h5>Category Details</h5>
        <p>
          <span className="label">{t("CategoryId")} : </span>
          {props.item?.product?.category_id}
        </p>
        <p>
          <span className="label">{t("Category")} : </span>
          {props.item?.category?.name}
        </p>
        {/* company */}
        <hr />
        <h5>Company Details</h5>
        <p>
          <span className="label">{t("Company")} : </span>
          {props.item?.company?.name}
        </p>
        <p>
          <span className="label">{t("CompanyId")} : </span>
          {props.item?.product?.company_id}
        </p>
        {/* client */}
        <hr />
        <h5>Client Details</h5>
        <p>
          <span className="label"> {t("Client")} : </span>
          {props.item?.client?.name}
        </p>
        <p>
          <span className="label"> {t("ClientAccountType")} : </span>
          {props.item?.client?.account_type?.prefix}
        </p>
        <p>
          <span className="label"> {t("ClientId")} : </span>
          {props.item?.product?.client_id}
        </p>
        <p>
          <span className="label"> {t("Phone")} : </span>
          {props.item?.client?.phone}
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
