import React, { useState, useEffect } from "react";
import Table from "../../common/table/table";
import AboveTable from "../../common/AboveTable/AboveTable";
import "../../common/show modal/showModal.css";
import Loading from "../../common/loading/loading";
import NoData from "../../common/no data/noData";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

import axios from "axios";
import { base_url, config } from "../../service/service";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";
import TableIcons from "../../common/table icons/tableIcons";

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
  /////////////////////////////////////////
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
          <AboveTable
            handleAdd={handleAdd}
            inputName="queryString"
            inputValue={searchRequestControls.queryString}
            handleChangeSearch={(e) =>
              handleSearchReq(e, { queryString: e.target.value })
            }
          />
          {/* table */}
          {row.length !== 0 ? (
            <Table
              columns={columns}
              // pagination
              first={page}
              rows={rows}
              totalRecords={totalRowLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {row?.map((item) => (
                <tr key={item.id}>
                  <td className="name">{item.name} </td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>

                  <TableIcons
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    handleShow={handleShow}
                  />
                </tr>
              ))}
            </Table>
          ) : (
            <NoData data="Client" />
          )}
          {/* modals */}
          {/* show modal */}
          <ModalShow
            show={showModal}
            handleClose={handleClose}
            title={item.name}
            item={item}
          />

          {/* add modal */}
          <ModalAdd
            show={addModal}
            handleClose={handleClose}
            title={t("AddNewClient")}
            newClient={newClient}
            handleChange={handleChange}
            handleSubmitAddClient={handleSubmitAddClient}
          />
          {/* edit modal */}
          <ModalEdit
            show={editModal}
            handleClose={handleClose}
            editItem={editItem}
            handleChange={handleChange}
            handleSubmitEdit={() => handleSubmitEdit(editItem.id)}
          />
        </div>
      )}
    </>
  );
}

export default Clients;
