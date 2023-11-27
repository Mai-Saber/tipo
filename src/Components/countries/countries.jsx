import React, { useState, useEffect } from "react";
import Table from "../../common/table/table";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url, config } from "../../service/service";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import UpperTable from "../../common/upperTable/upperTable";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../common/show modal/showModal.css";
import { TextField } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../../common/pagination/pagination";
import { useTranslation } from "react-i18next";
import Loading from "../../common/loading/loading";
import { Paginator } from "primereact/paginator";

function Countries(props) {
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
  const [newCountry, setNewCountry] = useState({
    name: "",
    name_ar: "",
    phone_code: "",
    prefix: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // loading
    setTimeout(function () {
      setLoading(false);
    }, 3000);

    // get countries
    const getCountries = async () => {
      const url = `${base_url}/admin/countries`;
      const res = await axios.get(url);
      setColumns(["Name", "Arabic Name", "Phone Code", "Prefix"]);
      setRow(res.data.data);
      setTotalRowLength(res.data.meta?.total);
    };

    // call functions
    getCountries();
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
        `${base_url}/admin/countries/search?
        query_string=${queryString || ""}
        &per_page=${Number(perPage) || ""}
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
    setNewCountry({ name: "", name_ar: "", phone_code: "", prefix: "" });
  };

  const handleSubmitAddCountry = async () => {
    await axios
      .post(`${base_url}/admin/country`, newCountry)
      .then((response) => {
        Toastify({
          text: `country created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        row.unshift(response.data.data);
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
    console.log(res.data);
    setItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    console.log("edit", id);
    const res = await axios.get(`${base_url}/admin/country/${id}`);
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
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

      {/* countries */}

      {!loading && (
        <div className="countries">
          {/* header */}
          <h1 className="header">{t("Countries")}</h1>

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
                      <td>{item.name_ar}</td>
                      <td>{item.phone_code}</td>
                      <td>{item.prefix}</td>
                      <td>
                        <Link
                          className="btn btn-primary"
                          to="/governorate"
                          onClick={() => props.handleGovernorate(item.id)}
                        >
                          {t("Governorate")}
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
                    rowsPerPageOptions={[3,5, 10, 20, 30]}
                    onPageChange={onPageChange}
                  />
                </div>
              </>
            </Table>
          ) : (
            <div className="noData">
              <h3>Oops,there is no country, let's create one </h3>
              <img src="../../../../assets/no-data.avif" alt="no data" />
            </div>
          )}

          {/* modals */}
          {/* show modal */}
          <Modal show={showModal} onHide={handleClose} className="showModal">
            <Modal.Header closeButton className="header">
              <Modal.Title>{item.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                <span className="label">{t("Name")} : </span>
                {item.name}
              </p>
              <p>
                <span className="label">{t("ArabicName")} :</span>{" "}
                {item.name_ar}
              </p>
              <p>
                <span className="label">{t("PhoneCode")} : </span>
                {item.phone_code}
              </p>
              <p>
                <span className="label">{t("Prefix")} : </span>
                {item.prefix}
              </p>
              <p>
                <span className="label">{t("Id")} : </span>
                {item.id}
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
              <Modal.Title> {t("AddNewCountry")}</Modal.Title>
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
                  value={newCountry.name}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("ArabicName")}
                  name="name_ar"
                  value={newCountry.name_ar}
                  onChange={handleChange}
                />

                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="number"
                  label={t("PhoneCode")}
                  name="phone_code"
                  value={newCountry.phone_code}
                  onChange={handleChange}
                />

                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Prefix")}
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
                {t("Close")}
              </Button>
              <Button
                className="btn btn-primary"
                variant="primary"
                onClick={handleSubmitAddCountry}
              >
                {t("Save")}
              </Button>
            </Modal.Footer>
          </Modal>
          {/* edit modal */}
          <Modal show={editModal} onHide={handleClose} className="Modal">
            <Modal.Header closeButton>
              <Modal.Title> {t("EditCountry")}</Modal.Title>
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
                  type="text"
                  label={t("ArabicName")}
                  name="name_ar"
                  value={editItem.name_ar}
                  onChange={handleChange}
                />

                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="number"
                  label={t("PhoneCode")}
                  name="phone_code"
                  value={editItem.phone_code}
                  onChange={handleChange}
                />

                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Prefix")}
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

export default Countries;
