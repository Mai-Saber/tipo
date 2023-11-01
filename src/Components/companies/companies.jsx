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
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../../common/pagination/pagination";
import { useTranslation } from "react-i18next";
import "./companies.css";
import "../../common/upperTable/upperTable.css";
import { Col, Row } from "react-bootstrap";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Loading from "../../common/loading/loading";

function Companies(props) {
  const [loading, setLoading] = useState(true);
  const [filterClients, setFilterClients] = useState([]);
  const [currentFilterClientId, setCurrentFilterClientId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState([]);
  const [row, setRow] = useState([]);
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

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - row.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    };

    // get filter countries
    const filterClients = async () => {
      const res = await axios.get(`${base_url}/admin/clients`);
      setFilterClients(res.data.data);
    };

    // setRowBasedOnFilter
    const setRowBasedOnFilter = async () => {
      if (currentFilterClientId) {
        await axios
          .get(`${base_url}/admin/clients/${currentFilterClientId}`)
          .then((res) => {
            setRow(res.data.data);
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    };

    // call functions
    getCompanies();
    filterClients();
    setRowBasedOnFilter();
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
  const handleChangeSearch = async (e) => {
    setSearchValue(e.target.value);

    // if input has value >> set row
    if (e.target.value.trim()) {
      const res = await axios.get(
        `${base_url}/admin/companies/search?query_string=${e.target.value}`
      );
      setRow(res.data.data);
    }

    // if input empty >> reset row
    if (e.target.value === "") {
      const url = `${base_url}/admin/companies/search`;
      const res = await axios.get(url);
      setRow(res.data.data);
    }

    // if search & filter have value
    if (e.target.value.trim() && currentFilterClientId.trim()) {
      console.log("qs", e.target.value);
      console.log("ci", currentFilterClientId);

      await axios
        .get(
          `${base_url}/admin/companies/search?client_id=${currentFilterClientId}&query_string=${e.target.value}`
        )
        .then((res) => {
          setRow(res.data.data);
          console.log("rrr", res);
        });
    }
  };

  const handleChangeFilter = async (e) => {
    setCurrentFilterClientId(e.target.value);

    // handle filter value
    if (e.target.value === "All") {
      const res = await axios.get(`${base_url}/admin/companies`);
      setRow(res.data.data);
    } else {
      await axios
        .get(`${base_url}/admin/client-companies/${e.target.value}`)
        .then((res) => {
          setRow(res.data.data);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }

    // if search & filter have value
    if (searchValue.trim() && e.target.value.trim()) {
      await axios
        .get(
          `${base_url}/admin/companies/search?client_id=${e.target.value}&query_string=${searchValue}`
        )
        .then((res) => {
          setRow(res.data.data);
          console.log("rrr", res);
        });
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
                  onChange={handleChangeSearch}
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
                      value={currentFilterClientId}
                      label={t("SelectCLient")}
                      onChange={handleChangeFilter}
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
                {(rowsPerPage > 0
                  ? row.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : row
                )?.map((item) => (
                  <>
                    <tr key={item.id}>
                      <td className="name">{item.name} </td>
                      <td>{item.id}</td>
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
                <TablePagination
                  className="pagination"
                  rowsPerPageOptions={[
                    3,
                    5,
                    10,
                    25,
                    { label: "All", value: -1 },
                  ]}
                  colSpan={3}
                  count={row.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
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
