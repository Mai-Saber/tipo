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
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../../common/pagination/pagination";

function Countries(props) {
  const [filterTypes, setFilterTypes] = useState([]);
  const [currentFilterType, setCurrentFilterType] = useState("");
  const [columns, setColumns] = useState([]);
  const [row, setRow] = useState([]);
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [item, setItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newCountry, setNewCountry] = useState({
    name: "",
    name_ar: "",
    phone_code: "",
    prefix: "",
  });

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
    // get countries
    const getCountries = async () => {
      const url = `${base_url}/admin/countries`;
      const res = await axios.get(url);
      setColumns(Object.keys(res.data.data[1]).slice(1));
      setRow(res.data.data);
    };
    // get filter types
    const getFilterTypes = async () => {
      const res = await axios.get(`${base_url}/system-lookups/2`);
      let arr = [];
      res.data.data.map((obj) => arr.push(obj.name));
      setFilterTypes(arr);
      console.log("arr", filterTypes);
    };
    // call functions
    getCountries();
    getFilterTypes();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newCountry,
      [e.target.name]: e.target.value,
    };
    setNewCountry(newData);

    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
  };

  // search & filter
  const handleChangeSearch = async (e) => {
    const allData = [row];
    console.log(allData);
    if (e.target.value.trim()) {
      const res = await axios.get(
        `${base_url}/admin/countries/search?query_string= ${e.target.value}`
      );
      setRow(res.data.data);
    }
    if (e.target.value === "") {
      const url = `${base_url}/admin/countries`;
      const res = await axios.get(url);
      setRow(res.data.data);
    }
  };

  const handleChangeFilter = (event) => {
    setCurrentFilterType(event.target.value);
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(`${base_url}/admin/country/${id}`, config);
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

  const handleSubmitAddCountry = async () => {
    console.log(newCountry);
    await axios
      .post(`${base_url}/admin/country`, newCountry)
      .then(() => {
        Toastify({
          text: `country created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        row.unshift(newCountry);
        setNewCountry({ name: "", name_ar: "", phone_code: "", prefix: "" });
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
    const res = await axios.get(`${base_url}/admin/country/${id}`, config);
    setItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    console.log("edit", id);
    const res = await axios.get(`${base_url}/admin/country/${id}`);
    console.log(res.data.data);
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    console.log(id);
    console.log(editItem.id);
    const data = {
      name: editItem.name,
      name_ar: editItem.name_ar,
      phone_code: editItem.phone_code,
      prefix: editItem.prefix,
    };
    await axios
      .patch(`${base_url}/admin/country/${id}`, data)
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
            row[i] = data;
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
    <div className="countries">
      {/* header */}
      <h1 className="header">{props.header}</h1>

      {/* upper table */}
      <UpperTable
        handleChangeSearch={handleChangeSearch}
        handleAdd={handleAdd}
        filterName="Type"
        filterValue={currentFilterType}
        handleChangeFilter={handleChangeFilter}
      >
        {filterTypes?.map((el) => (
          <MenuItem value={el}>{el}</MenuItem>
        ))}
      </UpperTable>

      {/* table */}
      <Table
        header="Countries"
        columns={columns}
        handleChangeSearch={handleChangeSearch}
        handleAdd={handleAdd}
      >
        <>
          {/* table children */}
          {/* pagination  before table map*/}
          {(rowsPerPage > 0
            ? row.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : row
          )?.map((item) => (
            <>
              <tr key={item.id}>
                <td>{item.name} </td>
                <td>{item.name_ar}</td>
                <td>{item.phone_code}</td>
                <td>{item.flag}</td>
                <td>{item.prefix}</td>

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
                    <i class="ri-eye-line"></i>
                  </Link>
                </td>
              </tr>
            </>
          ))}
          {/* pagination */}
          <TablePagination
            className="pagination"
            rowsPerPageOptions={[3, 5, 10, 25, { label: "All", value: -1 }]}
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

      {/* modals */}
      {/* show modal */}
      <Modal className="showModal" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="header">
          <Modal.Title>{item.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <span className="label">Name : </span>
            {item.name}
          </p>
          <p>
            <span className="label">Name_ar :</span> {item.name_ar}{" "}
          </p>
          <p>
            <span className="label">phone code : </span>
            {item.phone_code}
          </p>
          <p>
            <span className="label">prefix : </span>
            {item.prefix}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            className="close btn btn-danger"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* add modal */}
      <Modal show={addModal} onHide={handleClose} className="addModal">
        <Modal.Header closeButton>
          <Modal.Title> Add New Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form action="post">
            <TextField
              autoFocus
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              label="Country Name"
              name="name"
              value={newCountry.name}
              onChange={handleChange}
            />
            <TextField
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              label="Arabic name"
              name="name_ar"
              value={newCountry.name_ar}
              onChange={handleChange}
            />

            <TextField
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="number"
              label="Phone code"
              name="phone_code"
              value={newCountry.phone_code}
              onChange={handleChange}
            />

            <TextField
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              label="prefix"
              name="prefix"
              value={newCountry.prefix}
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
            Close
          </Button>
          <Button
            className="btn btn-primary"
            variant="primary"
            onClick={handleSubmitAddCountry}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit modal */}
      <Modal show={editModal} onHide={handleClose} className="addModal">
        <Modal.Header closeButton>
          <Modal.Title> Edit Country</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form action="post">
            <TextField
              autoFocus
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              label="Country Name"
              name="name"
              value={editItem.name}
              onChange={handleChange}
            />
            <TextField
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              label="Arabic name"
              name="name_ar"
              value={editItem.name_ar}
              onChange={handleChange}
            />

            <TextField
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="number"
              label="Phone code"
              name="phone_code"
              value={editItem.phone_code}
              onChange={handleChange}
            />

            <TextField
              className="input"
              id="outlined-basic"
              variant="outlined"
              type="text"
              label="prefix"
              name="prefix"
              value={editItem.prefix}
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
            Close
          </Button>
          <Button
            className="btn btn-primary"
            variant="primary"
            onClick={() => handleSubmitEdit(editItem.id)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Countries;
