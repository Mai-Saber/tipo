import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";
import axios from "axios";
import { base_url } from "../../../../../../../service/service";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Col, Row } from "react-bootstrap";

function ModalAdd(props) {
  const { t } = useTranslation();
  const [finalProduct, setFinalProduct] = useState("");
  const [variants, setVariants] = useState([]);
  const [variantValue, setVariantValue] = useState([]);

  useEffect(() => {
    const getFinalProduct = async () => {
      await axios
        .get(
          `${base_url}/admin/company/category/product/final-product/${props.newVariantValue?.final_product_id}`
        )
        .then((res) => {
          setFinalProduct(res.data?.data?.details);
        })
        .catch();
    };

    const getVariants = async () => {
      await axios
        .get(`${base_url}/admin/company/variants/${props.companyId}`)
        .then((res) => {
          setVariants(res.data.data);
        })
        .catch((err) => console.log(err));
    };

    getFinalProduct();
    getVariants();
  }, []);

  const getVariantsValue = async (e) => {
    console.log("mmm", e?.target.value);
    await axios
      .get(`${base_url}/admin/company/variant-values/${e?.target.value}`)
      .then((res) => {
        setVariantValue(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewVarianValue")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="post">
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("FinalProduct")}
            name="final_product_id"
            value={finalProduct}
          />
          {/* <Box> */}
          <Row>
            {/* variants */}
            <Col xs={6}>
              <InputLabel id="demo-simple-select-label">
                {t("Variants")}{" "}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t("Variants")}
                value={props.newVariantValue?.variant_id}
                name="variant_id"
                onChange={(e) => {
                  getVariantsValue(e);
                  props.handleChange(e);
                }}
              >
                {variants?.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {t(el.name)}
                  </MenuItem>
                ))}
              </Select>
            </Col>
            {/* variants Value */}
            <Col xs={6}>
              <InputLabel id="demo-simple-select-label">
                {t("VariantValue")}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t("VariantValue")}
                value={props.newVariantValue?.variant_value_id}
                name="variant_value_id"
                onChange={props.handleChange}
              >
                {variantValue?.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {t(el.value)}
                  </MenuItem>
                ))}
              </Select>
            </Col>
          </Row>
          {/* </Box> */}
          <TextField
            className="input"
            style={{
              marginTop: "20px",
            }}
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Details")}
            name="details"
            value={props.newVariantValue?.details}
            onChange={props.handleChange}
          />
        </form>
      </Modal.Body>
      {/* footer */}
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
          onClick={props.handleSubmitAddFinalProductVariantValue}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
