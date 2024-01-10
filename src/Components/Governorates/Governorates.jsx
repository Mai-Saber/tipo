import React, { useState, useEffect } from "react";

import Table from "../../common/table/table";
import Loading from "../../common/loading/loading";
import "../../common/show modal/showModal.css";
import NoData from "../../common/noData/noData";
import TableIcons from "../../common/tableIcons/tableIcons";
import WrongMessage from "../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import GovernorateFilters from "./governorateFilters/governorateFilters";
import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

function Governorate(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [filterCountries, setFilterCountries] = useState([]);
  const [currentFilterCountryId, setCurrentFilterCountryId] = useState(
    props.countryInApp
  );
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [Governorate, setGovernorate] = useState([]);
  const [totalGovernorateLength, setTotalGovernorateLength] = useState("");
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newGovernorate, setNewGovernorate] = useState({
    name: "",
    name_ar: "",
    prefix: "",
    country_id: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // get Governorate
    const getGovernorate = async () => {
      const url = `${base_url}/admin/governorates-search-all`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id", "Name", "ArabicName", "Prefix"]);
          setGovernorate(res.data.data);
          setTotalGovernorateLength(res.data.meta?.total);
        })
        .catch((err) => {
          // loading
          setTimeout(function () {
            setLoading(false);
          }, 3000);

          setWrongMessage(true);
        });
    };
    // get filter countries
    const filterCountries = async () => {
      const res = await axios.get(`${base_url}/admin/countries`);
      setFilterCountries(res.data.data);
    };
    // setRowBasedOnFilter
    const setRowBasedOnFilter = async () => {
      if (currentFilterCountryId) {
        await axios
          .get(`${base_url}/admin/governorates/${currentFilterCountryId}`)
          .then((res) => {
            console.log("bb");
            setGovernorate(res.data.data);
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

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchRequestControls, setSearchRequestControls] = useState({
    queryString: "",
    filterType: "",
    pageNumber: "",
    perPage: "",
  });

  const onPageChange = (e) => {
    setRowsPerPage(e.rows);
    setPageNumber(e.page + 1);

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
      setGovernorate(res.data.data);
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
      const newRow = Governorate.filter((item) => item.id !== id);
      setGovernorate(newRow); // setRow(filterItems);
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
        Governorate.unshift(res.data.data);
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
    setSelectedItem(res.data.data);
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
        for (let i = 0; i < Governorate.length; i++) {
          if (Governorate[i].id === id) {
            Governorate[i] = res.data.data;
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
      {!loading && !wrongMessage && (
        <div className="governorate">
          {/* header */}
          <h1 className="header">{t("Governorate")}</h1>
          {/* upper table */}
          <GovernorateFilters
            searchRequestControls={searchRequestControls}
            handleSearchReq={handleSearchReq}
            filterCountries={filterCountries}
            handleAdd={handleAdd}
          />
          {/* table */}
          {Governorate.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalGovernorateLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {Governorate?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
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
          <ModalShow
            show={showModal}
            handleClose={handleClose}
            item={selectedItem}
          />
          {/* add modal */}
          <ModalAdd
            show={addModal}
            handleClose={handleClose}
            newGovernorate={newGovernorate}
            handleSubmitAddGovernorate={handleSubmitAddGovernorate}
            handleChange={handleChange}
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

      {!loading && wrongMessage && <WrongMessage />}
    </>
  );
}

export default Governorate;
