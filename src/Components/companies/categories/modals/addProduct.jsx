import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";
import axios from "axios";
import { base_url } from "../../../../service/service";

function ModalAddProduct(props) {
  const { t } = useTranslation();
  const [company, setCompany] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const getCompany = async () => {
      await axios
        .get(`${base_url}/admin/company/${props.newProduct?.company_id}`)
        .then((res) => {
          setCompany(res.data.data.name);
        })
        .catch();
    };

    const getCLient = async () => {
      await axios
        .get(`${base_url}/admin/client/${props.newProduct?.client_id}`)
        .then((res) => {
          setClient(res.data.data.name);
        })
        .catch();
    };

    const getCategory = async () => {
      try {
        await axios
          .get(
            `${base_url}/admin/company/category/${props.newProduct?.category_id}`
          )
          .then((res) => {
            setCategory(res.data.data.data.name);
          })
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      }
    };

    getCompany();
    getCLient();
    getCategory();
  }, []);

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewProduct")}</Modal.Title>
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
            value={props.newProduct?.name}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Category")}
            name="category_id"
            value={props.selectedCategoryName}
          />

          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Company")}
            name="company_id"
            value={company}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Client")}
            name="client_id"
            value={client}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Details")}
            name="details"
            value={props.newProduct?.details}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("description")}
            name="description"
            value={props.newProduct?.description}
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
          onClick={props.handleSubmitAddProduct}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAddProduct;
