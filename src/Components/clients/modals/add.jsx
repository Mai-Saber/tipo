import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../../common/show modal/showModal.css";
import { useTranslation } from "react-i18next";
import { TextField } from "@mui/material";

function ModalAdd(props) {
  const { t } = useTranslation();

  return (
   <Modal show={props.show} onHide={props.handleClose} className="Modal">
            <Modal.Header closeButton>
              <Modal.Title>
                  {props.title}
              </Modal.Title>
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
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("CountryId")}
                  name="country_id"
                  value={props.newClient?.country_id}
                  onChange={props.handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("GovernorateId")}
                  name="governorate_id"
                  value={props.newClient?.governorate_id}
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
                onClick={props.handleSubmitAddClient}
              >
                {t("Save")}
              </Button>
            </Modal.Footer>
          </Modal>
  );
}

export default ModalAdd;
