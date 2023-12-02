import React from "react";
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

function ModalAdd(props) {
  const { t } = useTranslation();

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewUser")}</Modal.Title>
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
            value={props.newUser?.name}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Email")}
            name="email"
            value={props.newUser?.email}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="number"
            label={t("Phone")}
            name="phone"
            value={props.newUser?.phone}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Password")}
            name="password"
            value={props.newUser?.password}
            onChange={props.handleChange}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Address")}
            name="address"
            value={props.newUser?.address}
            onChange={props.handleChange}
          />
          {/* select user type */}
          <Box className="type">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {t("UserType")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="user_account_type_id"
                value={props.newUser?.user_account_type_id}
                label={t("UserType")}
                onChange={props.handleChange}
              >
                {props.filterTypes?.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {t(el.name)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
          onClick={props.handleSubmitAddUsers}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
