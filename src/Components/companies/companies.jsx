import React, { useState, useEffect } from "react";
import Table from "../../common/table/table";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url, config } from "../../service/service";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import MenuItem from "@mui/material/MenuItem";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../common/show modal/showModal.css";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./companies.css";
import "../../common/upperTable/upperTable.css";
import { Col, Row } from "react-bootstrap";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Loading from "../../common/loading/loading";
import { Paginator } from "primereact/paginator";

function Companies(props) {
  const [loading, setLoading] = useState(true);
  const [filterClients, setFilterClients] = useState([]);
  const [columns, setColumns] = useState([]);
  const [row, setRow] = useState([]);
  const [totalRowLength, setTotalRowLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [item, setItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newCompany, setNewCompany] = useState({
    name: "",
    client_id: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // loading
    setTimeout(function () {
      setLoading(false);
    }, 3000);

    // get companies
    const getCompanies = async () => {
      const url = `${base_url}/admin/companies`;
      const res = await axios.get(url);
      setColumns(["Name", "Id", ""]);
      setRow(res.data.data);
      setTotalRowLength(res.data.meta?.total);
    };

    // get filter countries
    const filterClients = async () => {
      const res = await axios.get(`${base_url}/admin/clients`);
      setFilterClients(res.data.data);
    };

    // call functions
    getCompanies();
    filterClients();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newCompany,
      [e.target.name]: e.target.value,
    };
    setNewCompany(newData);

    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
  };

  // search & filter
  // search & filter & pagination

  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(0);
  const [searchRequestControls, setSearchRequestControls] = useState({
    queryString: "",
    filterType: "",
    pageNumber: "",
    perPage: "",
  });

  const onPageChange = (e) => {
    setRows(e.rows);
    setPage(e.page + 1);

    handleSearchReq(e, {
      perPage: e.rows,
      pageNumber: e.page + 1,
    });
  };

  const handleSearchReq = async (
    e,
    { queryString, filterType, perPage, pageNumber }
  ) => {
    try {
      setSearchRequestControls({
        queryString: queryString,
        filterType: filterType,
        pageNumber: pageNumber,
        perPage: perPage,
      });

      const res = await axios.get(
        `${base_url}/admin/companies/search?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setRow(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(`${base_url}/admin/company/${id}`, config);
      const newRow = row.filter((item) => item.id !== id);
      setRow(newRow); // setRow(filterItems);
      Toastify({
        text: `${name} deleted `,
        style: {
          background: "green",
          color: "white",
        },
      }).showToast();
    } else {
      Toastify({
        text: `${name} haven't deleted `,
        style: {
          background: "orange",
          color: "white",
        },
      }).showToast();
    }
  };

  // add
  const handleAdd = () => {
    setAddModal(true);
  };

  const handleSubmitAddCompanies = async () => {
    await axios
      .post(`${base_url}/admin/company`, newCompany)
      .then((res) => {
        Toastify({
          text: `company created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        row.unshift(res.data.data);
        setNewCompany({
          name: "",
          client_id: "",
        });
        setAddModal(false);
      })
      .catch((err) => {
        console.log("err", err.response.data.message);
        Toastify({
          text: `${err.response.data.message}`,
          style: {
            background: "red",
            color: "white",
          },
        }).showToast();
      });
  };

  // show
  const handleShow = async (id) => {
    setShowModal(true);
    const res = await axios.get(`${base_url}/admin/company/${id}`, config);
    setItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(`${base_url}/admin/company/${id}`);
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
    };
    await axios
      .patch(`${base_url}/admin/company/${id}`, data)
      .then((res) => {
        Toastify({
          text: `Company updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < row.length; i++) {
          if (row[i].id === id) {
            row[i] = res.data.data;
          }
        }
        setEditItem({});
        setEditModal(false);
      })
      .catch((err) => {
        Toastify({
          text: `${err.response.data.message}`,
          style: {
            background: "red",
            color: "white",
          },
        }).showToast();
      });
  };

  // close any modal
  const handleClose = () => {
    setShowModal(false);
    setAddModal(false);
    setEditModal(false);
  };

  /////////////////////////////////////////////////
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}

      {/* companies */}
      {!loading && (
        <div className="companies">
          {/* header */}
          <h1 className="header">{t("Companies")}</h1>

          {/* upper table */}
          <div className="upperTable">
            <Row>
              {/* search */}
              <Col xs={12} xl={4}>
                <input
                  placeholder={t("SearchByCompanyName")}
                  type="search"
                  name="queryString"
                  value={searchRequestControls.queryString}
                  onChange={(e) =>
                    handleSearchReq(e, { queryString: e.target.value })
                  }
                  className="inputSearch"
                />
              </Col>
              {/* filter types */}
              <Col xs={9} xl={4}>
                <Box className="filter">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      {t("SelectCLient")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={t("SelectCLient")}
                      name="filterType"
                      value={searchRequestControls.filterType}
                      onChange={(e) =>
                        handleSearchReq(e, { filterType: e.target.value })
                      }
                    >
                      <MenuItem value="All">All</MenuItem>
                      {filterClients?.map((el) => (
                        <MenuItem key={el.id} value={el.id}>
                          {el.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Col>
              {/* add button */}
              <Col xs={3} xl={4}>
                <button onClick={handleAdd} className="add btn">
                  <i className="ri-add-circle-line"></i>
                </button>
              </Col>
            </Row>
          </div>

          {/* table */}
          {row.length !== 0 ? (
            <Table columns={columns}>
              <>
                {/* table children */}
                {/* pagination  before table map*/}
                {row?.map((item) => (
                  <>
                    <tr key={(item.id)}>
                      <td className="name">{item.name} </td>
                      <td>{(item.id).slice(0,8)}...</td>
                      <td>
                        <Link
                          to="/companies/variants"
                          className="btn btn-primary"
                          onClick={() =>
                            props.handleVariant(item.id, item.client_id)
                          }
                        >
                          {t("Variants")}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="/companies/branches"
                          className="btn btn-primary"
                          onClick={() =>
                            props.handleBranches(item.id, item.client_id)
                          }
                        >
                          {t("Branches")}
                        </Link>
                      </td>
                      <td>
                        <Link
                          to="/companies/categories"
                          className="btn btn-primary"
                          onClick={() =>
                            props.handleCategories(item.id, item.client_id)
                          }
                        >
                          {t("Categories")}
                        </Link>
                      </td>

                      <td className="icons">
                        {/* edit */}

                        <Link
                          className="edit"
                          to=""
                          onClick={() => handleEdit(item.id)}
                        >
                          <i className="ri-pencil-line"></i>
                        </Link>

                        {/* delete */}
                        <Link
                          className="delete"
                          to=""
                          onClick={() => handleDelete(item.id, item.name)}
                        >
                          <i className="ri-delete-bin-2-fill"></i>
                        </Link>
                        {/* show */}

                        <Link
                          className="show"
                          to=""
                          onClick={() => handleShow(item.id)}
                        >
                          <i className="ri-eye-line"></i>
                        </Link>
                      </td>
                    </tr>
                  </>
                ))}
                {/* pagination */}
                <div className="card">
                  <Paginator
                    first={page}
                    rows={rows}
                    totalRecords={totalRowLength}
                    rowsPerPageOptions={[3, 5, 10, 20, 30]}
                    onPageChange={onPageChange}
                  />
                </div>
              </>
            </Table>
          ) : (
            <div className="noData">
              <h3>Oops,there is no company, let's create one </h3>
              <img src="../../../../assets/no-data.avif" alt="no data" />
            </div>
          )}

          {/* modals */}
          {/* show modal */}
          <Modal className="showModal" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton className="header">
              <Modal.Title>{item.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                <span className="label">{t("Name")} : </span>
                {item.name}
              </p>
              <p>
                <span className="label">{t("Id")} :</span> {item.id}{" "}
              </p>

              <p>
                <span className="label">{"ClientId :"} </span>
                {item.client_id}
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}
                className="close btn btn-danger"
              >
                {t("Close")}
              </Button>
            </Modal.Footer>
          </Modal>
          {/* add modal */}
          <Modal show={addModal} onHide={handleClose} className="Modal">
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
                  value={newCompany.name}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("ClientId")}
                  name="client_id"
                  value={newCompany.client_id}
                  onChange={handleChange}
                />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="close btn btn-danger"
                variant="secondary"
                onClick={handleClose}
              >
                {t("Close")}
              </Button>
              <Button
                className="btn btn-primary"
                variant="primary"
                onClick={handleSubmitAddCompanies}
              >
                {t("Save")}
              </Button>
            </Modal.Footer>
          </Modal>
          {/* edit modal */}
          <Modal show={editModal} onHide={handleClose} className="Modal">
            <Modal.Header closeButton>
              <Modal.Title>{t("EditCompany")}</Modal.Title>
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
                  value={editItem.name}
                  onChange={handleChange}
                />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="close btn btn-danger"
                variant="secondary"
                onClick={handleClose}
              >
                {t("Close")}
              </Button>
              <Button
                className="btn btn-primary"
                variant="primary"
                onClick={() => handleSubmitEdit(editItem.id)}
              >
                {t("Save")}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default Companies;
