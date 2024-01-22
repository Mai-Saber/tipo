import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import { TextField } from "@mui/material";
import axios from "axios";
import { base_url } from "../../../../../../service/service";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Col, Row } from "react-bootstrap";

function ModalAdd(props) {
  const { t } = useTranslation();
  const [company, setCompany] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");
  const [product, setProduct] = useState("");
  const [variants, setVariants] = useState([]);
  const [variantValue, setVariantValue] = useState([]);

  useEffect(() => {
    const getCompany = async () => {
      await axios
        .get(`${base_url}/admin/company/${props.newFinalProduct?.company_id}`)
        .then((res) => {
          setCompany(res.data.data.name);
        })
        .catch();
    };

    const getCLient = async () => {
      await axios
        .get(`${base_url}/admin/client/${props.newFinalProduct?.client_id}`)
        .then((res) => {
          setClient(res.data.data.name);
        })
        .catch();
    };

    const getCategory = async () => {
      await axios
        .get(
          `${base_url}/admin/company/category/${props.newFinalProduct?.category_id}`
        )
        .then((res) => {
          setCategory(res.data.data.data.name);
        })
        .catch();
    };

    const getProduct = async () => {
      await axios
        .get(
          `${base_url}/admin/company/category/product/${props.newFinalProduct?.product_id}`
        )
        .then((res) => {
          setProduct(res.data.data?.name);
        })
        .catch();
    };

    const getVariants = async () => {
      await axios
        .get(
          `${base_url}/admin/company/variants/${props.newFinalProduct?.company_id}`
        )
        .then((res) => {
          setVariants(res.data.data);
        })
        .catch((err) => console.log(err));
    };

    getCompany();
    getCLient();
    getCategory();
    getProduct();
    getVariants();
  }, []);

  const getVariantsValue = async (e) => {
    console.log("mmm", e?.target.value);
    await axios
      .get(`${base_url}/admin/company/variant-values/${e?.target.value}`)
      .then((res) => {
        console.log("ressss",res.data.data)
        setVariantValue(res?.data?.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal show={props.show} onHide={props.handleClose} className="Modal">
      <Modal.Header closeButton>
        <Modal.Title> {t("AddNewProduct")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form action="post">
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Product")}
            name="product_id"
            value={product}
          />
          <TextField
            className="input"
            id="outlined-basic"
            variant="outlined"
            type="text"
            label={t("Category")}
            name="category_id"
            value={category}
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
            value={props.newFinalProduct?.details}
            onChange={props.handleChange}
          />
          {/* box select country & governorate */}
          {/* <Box> */}
          {/* <Row>
            <Col xs={6}>
              <InputLabel id="demo-simple-select-label">
                {t("Variants")}{" "}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t("Variants")}
                value={props.newFinalProduct?.variants?.variant_id}
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
            
            <Col xs={6}>
              <InputLabel id="demo-simple-select-label">
                {t("VariantValue")}
              </InputLabel>
              <Select
                className="input"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label={t("VariantValue")}
                value={props.newFinalProduct?.variants?.variant_value_id}
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
          </Row> */}
          {/* </Box> */}
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
          onClick={props.handleSubmitAddFinalProduct}
        >
          {t("Save")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalAdd;
