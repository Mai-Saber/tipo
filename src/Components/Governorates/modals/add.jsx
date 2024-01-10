import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../../common/show modal/showModal.css";
import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { base_url, config } from "../../../service/service";

function ModalAdd(props) {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const getCountries = async () => {
      await axios
        .get(`${base_url}/admin/countries`)
        .then((res) => {
          setCountries(res.data.data);
        })
        .catch((err) => console.log(err));
    };

    getCountries();
  }, []);

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title>{t("AddNewGovernorate")}</Modal.Title>
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
            value={props.newGovernorate?.name}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("ArabicName")}
            name="name_ar"
            value={props.newGovernorate?.name_ar}
            onChange={props.handleChange}
          />

          <InputLabel id="demo-simple-select-label">
            {t("Country")}{" "}
          </InputLabel>
          <Select
            className="input"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="country_id"
            value={props.newGovernorate?.country_id}
            label={t("Country")}
            onChange={props.handleChange}
          >
            {countries?.map((el) => (
              <MenuItem key={el.id} value={el.id}>
                {t(el.name)}
              </MenuItem>
            ))}
          </Select>

          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Prefix")}
            name="prefix"
            value={props.newGovernorate?.prefix}
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
          onClick={props.handleSubmitAddGovernorate}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
