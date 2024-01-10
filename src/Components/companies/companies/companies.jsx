import React, { useState, useEffect } from "react";

import Table from "../../../common/table/table";
import "../../../common/show modal/showModal.css";
import Loading from "../../../common/loading/loading";
import NoData from "../../../common/noData/noData";
import TableIcons from "../../../common/tableIcons/tableIcons";
import WrongMessage from "../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../service/service";

import "./companies.css";
import Buttons from "./buttons/buttons";
import CompaniesFilters from "./companiesFilters/companiesFilters";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";
import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

function Companies(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [filterClients, setFilterClients] = useState([]);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [totalCompaniesLength, setTotalCompaniesLength] = useState("");
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newCompany, setNewCompany] = useState({
    name: "",
    client_id: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // get companies
    const getCompanies = async () => {
      const url = `${base_url}/admin/companies`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id","Name","Pages"]);
          setCompanies(res.data.data);
          setTotalCompaniesLength(res.data.meta?.total);
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
        `${base_url}/admin/companies/search?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setCompanies(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(`${base_url}/admin/company/${id}`, config);
      const newRow = companies.filter((item) => item.id !== id);
      setCompanies(newRow); // setRow(filterItems);
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
        companies.unshift(res.data.data);
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
    setSelectedItem(res.data.data);
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
        for (let i = 0; i < companies.length; i++) {
          if (companies[i].id === id) {
            companies[i] = res.data.data;
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
      {!loading && !wrongMessage && (
        <div className="companies">
          {/* header */}
          <h1 className="header">{t("Companies")}</h1>
          {/* upper table */}
          <CompaniesFilters
            searchRequestControls={searchRequestControls}
            filterClients={filterClients}
            handleSearchReq={handleSearchReq}
            handleAdd={handleAdd}
          />
          {/* table */}
          {companies.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalCompaniesLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {companies?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td className="name">{item.name} </td>
                  {/* buttons */}
                  <Buttons
                    item={item}
                    handleVariant={props.handleVariant}
                    handleBranches={props.handleBranches}
                    handleContacts={props.handleContacts}
                    handleCategories={props.handleCategories}
                    handlePriceList={props.handlePriceList}
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
          <ModalShow
            show={showModal}
            handleClose={handleClose}
            item={selectedItem}
          />
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
      {/* WrongMessage */}
      {!loading && wrongMessage && <WrongMessage />}
    </>
  );
}

export default Companies;
