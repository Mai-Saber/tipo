import React, { useState, useEffect } from "react";

import Table from "../../common/table/table";
import Loading from "../../common/loading/loading";
import "../../common/show modal/showModal.css";
import NoData from "../../common/no data/noData";
import TableIcons from "../../common/table icons/tableIcons";
import { base_url, config } from "../../service/service";

import axios from "axios";
import { Link } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import AboveTable from "./above table/above table";
import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

function Governorate(props) {
  const [loading, setLoading] = useState(true);
  const [filterCountries, setFilterCountries] = useState([]);
  const [currentFilterCountryId, setCurrentFilterCountryId] = useState(
    props.countryInApp
  );
  const [columns, setColumns] = useState([]);
  const [row, setRow] = useState([]);
  const [totalRowLength, setTotalRowLength] = useState("");
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [item, setItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newGovernorate, setNewGovernorate] = useState({
    name: "",
    name_ar: "",
    prefix: "",
    country_id: "",
  });
  const { t } = useTranslation();

  // pagination

  // general
  useEffect(() => {
    // loading
    setTimeout(function () {
      setLoading(false);
    }, 3000);

    // get Governorate
    const getGovernorate = async () => {
      const url = `${base_url}/admin/governorates-search-all`;
      const res = await axios.get(url);
      console.log(res.data.data);
      setColumns(["Name", "ArabicName", "Prefix"]);
      setRow(res.data.data);
      setTotalRowLength(res.data.meta?.total);
    };
    // get filter countries
    const filterCountries = async () => {
      const res = await axios.get(`${base_url}/admin/countries`);
      setFilterCountries(res.data.data);
    };
    // setRowBasedOnFilter
    const setRowBasedOnFilter = async () => {
      console.log("cc", currentFilterCountryId);
      if (currentFilterCountryId) {
        await axios
          .get(`${base_url}/admin/governorates/${currentFilterCountryId}`)
          .then((res) => {
            setRow(res.data.data);
          })
          .catch((err) => {
            console.log("err", err);
          });
      }
    };

    // call functions
    getGovernorate();
    filterCountries();
    setRowBasedOnFilter();
  }, []);

  // search & filter

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
        `${base_url}/admin/governorates-search-all?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &country_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setRow(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newGovernorate,
      [e.target.name]: e.target.value,
    };
    setNewGovernorate(newData);

    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(`${base_url}/admin/governorate/${id}`, config);
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
    setNewGovernorate({ name: "", name_ar: "", prefix: "", country_id: "" });
  };

  const handleSubmitAddGovernorate = async () => {
    await axios
      .post(`${base_url}/admin/governorate`, newGovernorate)
      .then((res) => {
        Toastify({
          text: `Governorate created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        row.unshift(res.data.data);
        setNewGovernorate({
          name: "",
          name_ar: "",
          prefix: "",
          country_id: "",
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
    const res = await axios.get(`${base_url}/admin/governorate/${id}`, config);
    setItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    console.log("edit", id);
    const res = await axios.get(`${base_url}/admin/governorate/${id}`);
    console.log("edit", res.data.data);
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
      name_ar: editItem.name_ar,
    };

    await axios
      .patch(`${base_url}/admin/governorate/${id}`, data)
      .then((res) => {
        Toastify({
          text: `Governorate updated successfully`,
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

      {/* governorate */}
      {!loading && (
        <div className="governorate">
          {/* header */}
          <h1 className="header">{t("Governorate")}</h1>
          {/* upper table */}
          <AboveTable
            searchRequestControls={searchRequestControls}
            handleSearchReq={handleSearchReq}
            filterCountries={filterCountries}
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
                  <td>{item.name_ar} </td>
                  <td>{item.prefix}</td>

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
            <NoData data="Governorate" />
          )}

          {/* modals */}
          {/* show modal */}
          <ModalShow show={showModal} handleClose={handleClose} item={item} />
          {/* add modal */}
          <ModalAdd
            show={addModal}
            handleClose={handleClose}
            newGovernorate={newGovernorate}
            handleSubmitAddGovernorate={handleSubmitAddGovernorate}
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

export default Governorate;
