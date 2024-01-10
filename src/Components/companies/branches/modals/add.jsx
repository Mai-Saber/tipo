import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";
import { base_url } from "../../../../service/service";
import axios from "axios";

function ModalAdd(props) {
  const { t } = useTranslation();
  const [company, setCompany] = useState("");
  const [client, setClient] = useState("");

  useEffect(() => {
    const getCompany = async () => {
      await axios
        .get(`${base_url}/admin/company/${props.newBranch?.company_id}`)
        .then((res) => {
          setCompany(res.data.data.name);
        })
        .catch();
    };

    const getCLient = async () => {
      await axios
        .get(`${base_url}/admin/client/${props.newBranch?.client_id}`)
        .then((res) => {
          setClient(res.data.data.name);
        })
        .catch();
    };

    getCompany();
    getCLient();
  }, []);

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewBranch")}</Modal.Title>
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
            value={props.newBranch?.name}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="number"
            label={t("Phone")}
            name="phone"
            value={props.newBranch?.phone}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Address")}
            name="address"
            value={props.newBranch?.address}
            onChange={props.handleChange}
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
          onClick={props.handleSubmitAddBranch}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
