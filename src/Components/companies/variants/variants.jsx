import React, { useState, useEffect } from "react";

import NoData from "../../../common/no data/noData";
import Table from "../../../common/table/table";
import "../../../common/show modal/showModal.css";
import AboveTable from "../../../common/AboveTable/AboveTable";
import Loading from "../../../common/loading/loading";
import TableIcons from "../../../common/table icons/tableIcons";
import { base_url, config } from "../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

function Variants(props) {
  const [loading, setLoading] = useState(true);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [columns, setColumns] = useState([]);
  const [row, setRow] = useState([]);
  const [totalRowLength, setTotalRowLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [item, setItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newVariant, setNewVariant] = useState({
    client_id: clientID,
    company_id: companyID,
    name: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // loading
    setTimeout(function () {
      setLoading(false);
    }, 3000);

    // get variants
    const getVariants = async () => {
      try {
        const url = `${base_url}/admin/company/variants/${companyID}`;
        const res = await axios.get(url);
        setColumns(["Variant Name", "Id"]);
        setRow(res.data.data);
        console.log("res", res.data.data);
        setTotalRowLength(res.data.meta?.total);
      } catch (err) {
        console.log(err);
      }
    };
    // call functions
    getVariants();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newVariant,
      [e.target.name]: e.target.value,
    };
    setNewVariant(newData);

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
        `${base_url}/admin/company/variants/search/${companyID}?
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
      await axios.delete(`${base_url}/admin/company/variant/${id}`, config);
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
      .post(`${base_url}/admin/company/variant`, newVariant)
      .then((res) => {
        Toastify({
          text: `Variant created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        row.unshift(res.data.data);
        setNewVariant({
          client_id: clientID,
          company_id: companyID,
          name: "",
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
      `${base_url}/admin/company/variant/${id}`,
      config
    );
    setItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(`${base_url}/admin/company/variant/${id}`);
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
    };
    await axios
      .patch(`${base_url}/admin/company/variant/${id}`, data)
      .then((res) => {
        Toastify({
          text: `Variant updated successfully`,
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
          <h1 className="header">{t("Variants")}</h1>
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
                  <td>{item.name}</td>
                  <td>{item.id}</td>
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
            <NoData data="variant" />
          )}
          {/* modals */}
          {/* show modal */}
          <ModalShow show={showModal} handleClose={handleClose} item={item} />
          {/* add modal */}
          <ModalAdd
            show={addModal}
            newVariant={newVariant}
            handleClose={handleClose}
            handleChange={handleChange}
            handleSubmitAddBranch={handleSubmitAddBranch}
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

export default Variants;
