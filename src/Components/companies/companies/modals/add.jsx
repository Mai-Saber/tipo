import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { base_url, config } from "../../../../service/service";

function ModalAdd(props) {
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const getCLients = async () => {
      await axios
        .get(`${base_url}/admin/clients`)
        .then((res) => {
          setClients(res.data.data);

          console.log("res", res);
        })
        .catch((err) => console.log(err));
    };

    getCLients();
  }, []);
  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewCompany")}</Modal.Title>
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
            value={props.newCompany?.name}
            onChange={props.handleChange}
          />

          <InputLabel id="demo-simple-select-label">
            {t("Client")}{" "}
          </InputLabel>
          <Select
            className="input"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="client_id"
            value={props.newCompany?.client_id}
            label={t("Client")}
            onChange={props.handleChange}
          >
            {clients?.map((el) => (
              <MenuItem key={el.id} value={el.id}>
                {t(el.name)}
              </MenuItem>
            ))}
          </Select>
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
          onClick={props.handleSubmitAddCompanies}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
