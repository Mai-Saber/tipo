import React, { useState, useEffect } from "react";
import Table from "../../../common/table/table";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url, config } from "../../../service/service";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import MenuItem from "@mui/material/MenuItem";
import UpperTable from "../../../common/upperTable/upperTable";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../../common/show modal/showModal.css";
import { TextField } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../../../common/pagination/pagination";
import { useTranslation } from "react-i18next";
import Loading from "../../../common/loading/loading";

function Branches(props) {
  const [loading, setLoading] = useState(true);

  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [columns, setColumns] = useState([]);
  const [row, setRow] = useState([]);
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [item, setItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newBranch, setNewBranch] = useState({
    client_id: clientID,
    company_id: companyID,
    name: "",
    phone: "",
    address: "",
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
    const getBranches = async () => {
      const url = `${base_url}/admin/company/branches/${companyID}`;
      const res = await axios.get(url);
      setColumns(["CompanyName", "BranchName", "Phone"]);
      setRow(res.data.data);
     
    };
    // call functions
    getBranches();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newBranch,
      [e.target.name]: e.target.value,
    };
    setNewBranch(newData);

    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
  };

  // search & filter
  const handleChangeSearch = async (e) => {
    if (e.target.value.trim()) {
      const res = await axios.get(
        `${base_url}/admin/company/branches/search/${companyID}?query_string=${e.target.value}`
      );
      setRow(res.data.data);
    }
    if (e.target.value === "") {
      const url = `${base_url}/admin/company/branches/${companyID}`;
      const res = await axios.get(url);
      setRow(res.data.data);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(`${base_url}/admin/company/branch/${id}`, config);
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

  const handleSubmitAddBranch = async () => {
    await axios
      .post(`${base_url}/admin/company/branch`, newBranch)
      .then((res) => {
        Toastify({
          text: `Branch created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        row.unshift(res.data.data);
        setNewBranch({
          client_id: clientID,
          company_id: companyID,
          name: "",
          phone: "",
          address: "",
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
    const res = await axios.get(
      `${base_url}/admin/company/branch/${id}`,
      config
    );
    setItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(`${base_url}/admin/company/branch/${id}`);
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
      email: editItem.email,
      phone: editItem.phone,
      address: editItem.address,
    };
    await axios
      .patch(`${base_url}/admin/company/branch/${id}`, data)
      .then((res) => {
        Toastify({
          text: `Branch updated successfully`,
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

      {/* branches */}
      {!loading && (
        <div className="branches">
          {/* header */}
          <h1 className="header">{t("Branches")}</h1>

          {/* upper table */}
          <UpperTable
            handleChangeSearch={handleChangeSearch}
            handleAdd={handleAdd}
          />

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
                      <td className="name">{item.company?.name} </td>
                      <td>{item.name}</td>
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
              <h3>This Company hasn't any branches, let's create one </h3>
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
                <span className="label">{t("Id")} : </span> {item.id}
              </p>
              <p>
                <span className="label">{t("Phone")} : </span>
                {item.phone}
              </p>
              <p>
                <span className="label">{t("Address")} : </span>
                {item.address}
              </p>
              <hr />
              <h3>{t("CompanyDetails")}</h3>
              <p>
                <span className="label">{t("CompanyName")} : </span>
                {item.company?.name}
              </p>
              <p>
                <span className="label">{t("CompanyId")} : </span>
                {item.company?.id}
              </p>
              <p>
                <span className="label"> {t("ClientId")} : </span>
                {item.company?.client_id}
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
              <Modal.Title> {t("AddNewBranch")}</Modal.Title>
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
                  value={newBranch.name}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="number"
                  label={t("Phone")}
                  name="phone"
                  value={newBranch.phone}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Address")}
                  name="address"
                  value={newBranch.address}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("CompanyId")}
                  name="company_id"
                  value={newBranch.company_id}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("ClientId")}
                  name="client_id"
                  value={newBranch.client_id}
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
                onClick={handleSubmitAddBranch}
              >
                {t("Save")} 
              </Button>
            </Modal.Footer>
          </Modal>
          {/* edit modal */}
          <Modal show={editModal} onHide={handleClose} className="Modal">
            <Modal.Header closeButton>
              <Modal.Title>{t("EditBranch")}</Modal.Title>
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
                  label={t("Email")}
                  name="email"
                  value={editItem.email}
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

export default Branches;
