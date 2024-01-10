import React, { useState, useEffect } from "react";

import "../../common/show modal/showModal.css";
import NoData from "../../common/noData/noData";
import Table from "../../common/table/table";
import Loading from "../../common/loading/loading";
import TableFilter from "../../common/tableFilter/tableFilter";
import TableIcons from "../../common/tableIcons/tableIcons";
import WrongMessage from "../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../service/service";

import axios from "axios";
import { Link } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

function Countries(props) {
  const [loading, setLoading] = useState(true);
   const [wrongMessage, setWrongMessage] = useState(false);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [countries, setCountries] = useState([]);
  const [totalCountriesLength, setTotalCountriesLength] = useState("");
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
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
    // get countries
    const getCountries = async () => {
      const url = `${base_url}/admin/countries`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id","Name", "Arabic Name", "Phone Code", "Prefix"]);
          setCountries(res.data.data);
          setTotalCountriesLength(res.data.meta?.total);
        })
        .catch((err) => {
          // loading
          setTimeout(function () {
            setLoading(false);
          }, 3000);

          setWrongMessage(true);
        });
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
        `${base_url}/admin/countries/search?
        query_string=${queryString || ""}
        &per_page=${Number(perPage) || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setCountries(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(`${base_url}/admin/country/${id}`, config);
      const newRow = countries.filter((item) => item.id !== id);
      setCountries(newRow); // setRow(filterItems);
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
        countries.unshift(response.data.data);
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
    setSelectedItem(res.data.data);
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
        for (let i = 0; i < countries.length; i++) {
          if (countries[i].id === id) {
            countries[i] = res.data.data;
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

      {!loading && !wrongMessage && (
        <div className="countries">
          {/* header */}
          <h1 className="header">{t("Countries")}</h1>

          {/* upper table */}
          <TableFilter
            handleAdd={handleAdd}
            inputName="queryString"
            inputValue={searchRequestControls.queryString}
            handleChangeSearch={(e) =>
              handleSearchReq(e, { queryString: e.target.value })
            }
          />

          {/* table */}
          {countries.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalCountriesLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {countries?.map((item,i) => (
                <tr key={item.id}>
                  <td>{i+1}</td>
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

                  <TableIcons
                    item={item}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    handleShow={handleShow}
                  />
                </tr>
              ))}
              {/* pagination */}
            </Table>
          ) : (
            <NoData data="Country" />
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
            newCountry={newCountry}
            handleChange={handleChange}
            handleSubmitAddCountry={handleSubmitAddCountry}
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

export default Countries;
