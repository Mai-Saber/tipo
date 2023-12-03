import React, { useState, useEffect } from "react";

import Table from "../../../common/table/table";
import "../../../common/show modal/showModal.css";
import Loading from "../../../common/loading/loading";
import NoData from "../../../common/no data/noData";
import TableIcons from "../../../common/table icons/tableIcons";
import { base_url, config } from "../../../service/service";

import "./companies.css";
import Buttons from "./buttons/buttons";
import AboveTable from "./above table/above table";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";
import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

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
      setColumns(["Name", "Id","","",""]);
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
          <AboveTable
            searchRequestControls={searchRequestControls}
            filterClients={filterClients}
            handleSearchReq={handleSearchReq}
            handleAdd={handleAdd}
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
                  <td>{item.id.slice(0, 8)}...</td>
                  {/* buttons */}
                  <Buttons
                    item={item}
                    handleVariant={props.handleVariant}
                    handleBranches={props.handleBranches}
                    handleCategories={props.handleCategories}
                  />
                  {/* icons */}
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
            <NoData data="company" />
          )}
          {/* modals */}
          {/* show modal */}
          <ModalShow show={showModal} handleClose={handleClose} item={item} />
          {/* add modal */}
          <ModalAdd
            show={addModal}
            handleClose={handleClose}
            newCompany={newCompany}
            handleChange={handleChange}
            handleSubmitAddCompanies={handleSubmitAddCompanies}
          />
          {/* edit modal */}
          <ModalEdit
            show={editModal}
            handleClose={handleClose}
            editItem={editItem}
            handleChange={handleChange}
            handleSubmitEdit={handleSubmitEdit}
          />
        </div>
      )}
    </>
  );
}

export default Companies;
