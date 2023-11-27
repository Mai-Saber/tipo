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
import { Col, Row } from "react-bootstrap";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../../common/upperTable/upperTable.css";
import Loading from "../../common/loading/loading";
import { Paginator } from "primereact/paginator";

function Users(props) {
  const [loading, setLoading] = useState(true);
  const [filterTypes, setFilterTypes] = useState([]);
  const [columns, setColumns] = useState([]);
  const [row, setRow] = useState([]);
  const [totalRowLength, setTotalRowLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [item, setItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    user_account_type_id: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // loading
    setTimeout(function () {
      setLoading(false);
    }, 3000);

    // get USER
    const getUsers = async () => {
      const url = `${base_url}/admin/users`;
      const res = await axios.get(url);
      setColumns(["Name", "Email", "Phone"]);
      setRow(res.data.data);
      setTotalRowLength(res.data.meta?.total);
    };
    // get filter types

    const getFilterTypes = async () => {
      const res = await axios.get(`${base_url}/system-lookups/1`);
      let arr = [];
      res.data.data.map((obj) => {
        if (obj.prefix === "ROOT" || obj.prefix === "ADMIN") {
          arr.push(obj);
        }
      });
      setFilterTypes(arr);
    };
    // call functions
    getUsers();
    getFilterTypes();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newUser,
      [e.target.name]: e.target.value,
    };
    setNewUser(newData);
    // ////////////////////
    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
    // ///////////////////
  };

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
        `${base_url}/admin/users/search?
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
      await axios.delete(`${base_url}/admin/user/${id}`, config);
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

  const handleSubmitAddUsers = async () => {
    console.log(newUser);
    await axios
      .post(`${base_url}/admin/user`, newUser)
      .then((response) => {
        Toastify({
          text: `country created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        row.unshift(response.data.data);
        setNewUser({
          name: "",
          email: "",
          phone: "",
          password: "",
          address: "",
          user_account_type_id: "",
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
    const res = await axios.get(`${base_url}/admin/user/${id}`, config);
    setItem(res.data.data);
    console.log("item", res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(`${base_url}/admin/user/${id}`);
    console.log("edit", res.data.data);
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
      phone: editItem.phone,
      password: editItem.password,
      address: editItem.address,
    };
    await axios
      .patch(`${base_url}/admin/user/${id}`, data)
      .then((res) => {
        Toastify({
          text: `User updated successfully`,
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
  // ////////////////////////////////////////
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}

      {/* user */}
      {!loading && (
        <div className="users">
          {/* header */}
          <h1 className="header">{t("Users")}</h1>

          {/* upper table */}
          <div className="upperTable">
            <Row>
              {/* search */}
              <Col xs={12} xl={4}>
                <input
                  placeholder={t("SearchByName")}
                  type="Search"
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
                      {t("UserType")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={t("UserType")}
                      name="filterType"
                      value={searchRequestControls.filterType}
                      onChange={(e) =>
                        handleSearchReq(e, { filterType: e.target.value })
                      }
                    >
                      <MenuItem value="">{t("All")}</MenuItem>
                      {filterTypes?.map((el) => (
                        <MenuItem key={el.id} value={el.id}>
                          {t(el.name)}
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

                {row?.map((item, i) => (
                  <>
                    <tr key={item.id}>
                      <td className="name">{item.name} </td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>

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
                    rowsPerPageOptions={[5, 10, 20, 30]}
                    onPageChange={onPageChange}
                  />
                </div>
              </>
            </Table>
          ) : (
            <div className="noData">
              <h3>Oops,there is no user, let's create one </h3>
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
                <span className="label">{t("Email")} :</span> {item.email}
              </p>
              <p>
                <span className="label">{t("Phone")} : </span>
                {item.phone}
              </p>
              <p>
                <span className="label">{t("Id")} : </span>
                {item.id}
              </p>
              <p>
                <span className="label">{t("CreatedAt")} : </span>
                {item.created_at}
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
                  value={newUser.name}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Email")}
                  name="email"
                  value={newUser.email}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="number"
                  label={t("Phone")}
                  name="phone"
                  value={newUser.phone}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Password")}
                  name="password"
                  value={newUser.password}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Address")}
                  name="address"
                  value={newUser.address}
                  onChange={handleChange}
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
                      value={newUser.user_account_type_id}
                      label={t("UserType")}
                      onChange={handleChange}
                    >
                      {filterTypes?.map((el) => (
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
                onClick={handleClose}
              >
                {t("Close")}
              </Button>
              <Button
                className="btn btn-primary"
                variant="primary"
                onClick={handleSubmitAddUsers}
              >
                {t("Save")}
              </Button>
            </Modal.Footer>
          </Modal>
          {/* edit modal */}
          <Modal show={editModal} onHide={handleClose} className="Modal">
            <Modal.Header closeButton>
              <Modal.Title> {t("EditUser")}</Modal.Title>
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
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="number"
                  label={t("Phone")}
                  name="phone"
                  value={editItem.phone}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Password")}
                  name="password"
                  value={editItem.password}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Address")}
                  name="address"
                  value={editItem.address}
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

export default Users;
