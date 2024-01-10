import React, { useState, useEffect } from "react";

import NoData from "../../../../common/noData/noData";
import Table from "../../../../common/table/table";
import "../../../../common/show modal/showModal.css";
import TableFilter from "../../../../common/tableFilter/tableFilter";
import Loading from "../../../../common/loading/loading";
import TableIcons from "../../../../common/tableIcons/tableIcons";
import WrongMessage from "../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

function WareHouse(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [branchId, setBranchID] = useState(props.branchIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [WareHouses, setWareHouses] = useState([]);
  const [totalWareHousesLength, setTotalWareHousesLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newWareHouse, setNewWareHouse] = useState({
    client_id: clientID,
    company_id: companyID,
    branch_id: branchId,
    name: "",
    details: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // get WareHouses
    const getWareHouses = async () => {
      try {
        const url = `${base_url}/admin/company/branch/warehouses/${companyID}`;
        await axios
          .get(url)
          .then((res) => {
            setLoading(false);
            console.log("res", res.data.data);
            setColumnsHeader(["Id", "company Name", "WareHouse Name"]);
            setWareHouses(res.data.data);
            setTotalWareHousesLength(res.data.meta?.total);
          })
          .catch((err) => {
            console.log(err);
            // loading
            setTimeout(function () {
              setLoading(false);
            }, 3000);

            setWrongMessage(true);
          });
      } catch (err) {
        console.log(err);
      }
    };
    // call functions
    getWareHouses();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newWareHouse,
      [e.target.name]: e.target.value,
    };
    setNewWareHouse(newData);

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
        `${base_url}/admin/company/branch/warehouses/search/${companyID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setWareHouses(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async ({ id, name }) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/branch/warehouse/${id}`,
        config
      );
      const newRow = WareHouses.filter((item) => item.id !== id);
      setWareHouses(newRow); // setRow(filterItems);
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

  const handleSubmitAddWareHouse = async () => {
    await axios
      .post(`${base_url}/admin/company/branch/warehouse`, newWareHouse)
      .then((res) => {
        Toastify({
          text: `warehouses created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        WareHouses.unshift(res.data.data);
        setNewWareHouse({
          client_id: clientID,
          company_id: companyID,
          branch_id: branchId,
          name: "",
          details: "",
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
      `${base_url}/admin/company/branch/warehouse/${id}`,
      config
    );
    setSelectedItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/branch/warehouse/${id}`
    );
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
    };
    await axios
      .patch(`${base_url}/admin/company/branch/warehouse/${id}`, data)
      .then((res) => {
        Toastify({
          text: `Ware House updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < WareHouses.length; i++) {
          if (WareHouses[i].id === id) {
            WareHouses[i] = res.data.data;
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

      {/* variants */}
      {!loading && !wrongMessage && (
        <div className="WareHouse">
          {/* header */}
          <h1 className="header">{t("WareHouses")}</h1>
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
          {WareHouses.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalWareHousesLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {WareHouses?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.company?.name}</td>
                  <td>{item.name}</td>

                  {/* icons */}
                  <TableIcons
                    item={item}
                    handleDelete={() =>
                      handleDelete({ name: item.name, id: item.id })
                    }
                    handleEdit={handleEdit}
                    handleShow={handleShow}
                  />
                </tr>
              ))}
            </Table>
          ) : (
            <NoData data="WareHouse" />
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
            newWareHouse={newWareHouse}
            handleClose={handleClose}
            handleChange={handleChange}
            handleSubmitAddWareHouse={handleSubmitAddWareHouse}
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
      {/* wrong message */}
      {!loading && wrongMessage && <WrongMessage />}
    </>
  );
}

export default WareHouse;
