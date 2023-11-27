import React, { useState, useEffect } from "react";
import Table from "../../common/table/table";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url, config } from "../../service/service";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import MenuItem from "@mui/material/MenuItem";
import UpperTable from "../../common/upperTable/upperTable";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../common/show modal/showModal.css";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../common/loading/loading";
import { Paginator } from "primereact/paginator";

function Clients(props) {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [row, setRow] = useState([]);
  const [totalRowLength, setTotalRowLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [item, setItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    user_account_type_id: "",
    available_companies_count: "",
    available_employees_count: "",
    country_id: "",
    governorate_id: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // loading
    setTimeout(function () {
      setLoading(false);
    }, 3000);

    // get clients
    const getClients = async () => {
      const url = `${base_url}/admin/clients`;
      const res = await axios.get(url);
      setColumns(["Name", "Email", "Phone"]);
      setRow(res.data.data);
      setTotalRowLength(res.data.meta?.total);
    };
    // call functions
    getClients();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newClient,
      [e.target.name]: e.target.value,
    };
    setNewClient(newData);

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
        `${base_url}/admin/clients/search?
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
    if (window.confirm("Are you Sure?")) {
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
    setNewClient({
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      user_account_type_id: "",
      available_companies_count: "",
      available_employees_count: "",
      country_id: "",
      governorate_id: "",
    });
  };

  const handleSubmitAddClient = async () => {
    await axios
      .post(`${base_url}/admin/client`, newClient)
      .then((res) => {
        Toastify({
          text: `Client created successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        row.unshift(res.data.data);
        setNewClient({
          name: "",
          email: "",
          phone: "",
          password: "",
          address: "",
          user_account_type_id: sessionStorage.getItem("userAccountTypeId"),
          available_companies_count: "",
          available_employees_count: "",
          country_id: "",
          governorate_id: "",
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
    const res = await axios.get(`${base_url}/admin/client/${id}`, config);
    setItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    console.log("edit", id);
    const res = await axios.get(`${base_url}/admin/client/${id}`);
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
          text: `country updated successfully`,
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
        console.log(err);
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
      {/* clients */}
      {!loading && (
        <div className="clients">
          {/* header */}
          <h1 className="header">{t("Clients")}</h1>

          {/* upper table */}
          <UpperTable
            handleAdd={handleAdd}
            inputName="queryString"
            inputValue={searchRequestControls.queryString}
            handleChangeSearch={(e) =>
              handleSearchReq(e, { queryString: e.target.value })
            }
          />

          {/* table */}
          {row.length !== 0 ? (
            <Table columns={columns}>
              <>
                {/* table children */}
                {/* pagination  before table map*/}
                {row?.map((item) => (
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
              <h3>Oops,there is no client ,let's create one </h3>
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
                <span className="label">{t("Email")} :</span> {item.email}{" "}
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
                <span className="label">{t("CreatedAt")}: </span>
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
              <Modal.Title> {t("AddNewClient")}</Modal.Title>
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
                  value={newClient.name}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Email")}
                  name="email"
                  value={newClient.email}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="number"
                  label={t("Phone")}
                  name="phone"
                  value={newClient.phone}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Password")}
                  name="password"
                  value={newClient.password}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Address")}
                  name="address"
                  value={newClient.address}
                  onChange={handleChange}
                />

                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="number"
                  label={t("AvailableCompaniesCount")}
                  name="available_companies_count"
                  value={newClient.available_companies_count}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="number"
                  label={t("AvailableEmployeesCount")}
                  name="available_employees_count"
                  value={newClient.available_employees_count}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("CountryId")}
                  name="country_id"
                  value={newClient.country_id}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("GovernorateId")}
                  name="governorate_id"
                  value={newClient.governorate_id}
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
                onClick={handleSubmitAddClient}
              >
                {t("Save")}
              </Button>
            </Modal.Footer>
          </Modal>
          {/* edit modal */}
          <Modal show={editModal} onHide={handleClose} className="Modal">
            <Modal.Header closeButton>
              <Modal.Title> {t("EditClient")}</Modal.Title>
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

export default Clients;

//  "country_id":"9a2ddaa8-33a3-46d8-a1f6-8d2da683fb3f",
//  "governorate_id":"9a11c064-b2fb-40ed-bcf2-a0225ffa0a4f"
