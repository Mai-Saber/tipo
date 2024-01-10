import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../../common/show modal/showModal.css";
import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";
import { Col, Row } from "react-bootstrap";
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
  const [governorate, setGovernorate] = useState([]);

  useEffect(() => {
    const getCountries = async () => {
      await axios
        .get(`${base_url}/admin/countries`)
        .then((res) => {
          setCountries(res.data.data);

          console.log("res", res);
        })
        .catch((err) => console.log(err));
    };

    getCountries();
  }, []);

  const getGovernorate = async (e) => {
    console.log("mmm", e?.target.value);
    await axios
      .get(`${base_url}/admin/governorates/${e?.target.value}`)
      .then((res) => {
        setGovernorate(res?.data.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
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
            value={props.newClient?.name}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Email")}
            name="email"
            value={props.newClient?.email}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="number"
            label={t("Phone")}
            name="phone"
            value={props.newClient?.phone}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Password")}
            name="password"
            value={props.newClient?.password}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Address")}
            name="address"
            value={props.newClient?.address}
            onChange={props.handleChange}
          />

          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="number"
            label={t("AvailableCompaniesCount")}
            name="available_companies_count"
            value={props.newClient?.available_companies_count}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="number"
            label={t("AvailableEmployeesCount")}
            name="available_employees_count"
            value={props.newClient?.available_employees_count}
            onChange={props.handleChange}
          />

          {/* box select country & governorate */}
          {/* <Box> */}
          <Row>
            {/* country */}
            <Col xs={6}>
              <InputLabel id="demo-simple-select-label">
                {t("CountryId")}{" "}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="country_id"
                value={props.newClient?.country_id}
                label={t("CountryId")}
                onChange={(e) =>
                {
                  getGovernorate(e);
                  props.handleChange(e);
                }}
              >
                {countries?.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {t(el.name)}
                  </MenuItem>
                ))}
              </Select>
            </Col>
            {/* governorate */}
            <Col xs={6}>
              <InputLabel id="demo-simple-select-label">
                {t("GovernorateId")}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="governorate_id"
                value={props.newClient?.governorate_id}
                label={t("GovernorateId")}
                onChange={props.handleChange}
              >
                {governorate?.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {t(el.name)}
                  </MenuItem>
                ))}
              </Select>
            </Col>
          </Row>
          {/* </Box> */}
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
          onClick={props.handleSubmitAddClient}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
