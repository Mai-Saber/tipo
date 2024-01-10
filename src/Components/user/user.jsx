import React, { useState, useEffect } from "react";

import Table from "../../common/table/table";
import NoData from "../../common/noData/noData";
import TableIcons from "../../common/tableIcons/tableIcons";
import Loading from "../../common/loading/loading";
import "../../common/show modal/showModal.css";
import WrongMessage from "../../common/wrongMessage/wrongMessage";
import "../../common/tableFilter/tableFilter.css";
import { base_url, config } from "../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import UserFilters from "./userFilters/userFilters";
import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

function Users(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [userAccountTypes, setUserAccountTypes] = useState([]);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalUsersLength, setTotalUsersLength] = useState("");
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    user_account_type_id: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // get USER
    const getUsers = async () => {
      const url = `${base_url}/admin/users`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id","Name", "Email", "Phone"]);
          setUsers(res.data.data);
          setTotalUsersLength(res.data.meta?.total);
        })
        .catch((err) => {
          // loading
          setTimeout(function () {
            setLoading(false);
          }, 3000);

          setWrongMessage(true);
        });
    };

    // get filter types
    const userAccountTypes = async () => {
      const res = await axios.get(`${base_url}/system-lookups/1`);
      let arr = [];
      res.data.data.map((obj) => {
        if (obj.prefix === "ROOT" || obj.prefix === "ADMIN") {
          arr.push(obj);
        }
      });
      setUserAccountTypes(arr);
    };
    // call functions
    getUsers();
    userAccountTypes();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newUser,
      [e.target.name]: e.target.value,
    };
    setNewUser(newData);
    // ////////////////////
    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
    // ///////////////////
  };

  // search & filter & pagination

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchRequestControls, setSearchRequestControls] = useState({
    query_string: "",
    user_account_type_id: "",
    page: "",
    per_page: "",
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
        query_string: queryString,
        user_account_type_id: filterType,
        page: pageNumber,
        per_page: perPage,
      });

      const res = await axios.get(
        `${base_url}/admin/users/search?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setUsers(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(`${base_url}/admin/user/${id}`, config);
      const newRow = users.filter((item) => item.id !== id);
      setUsers(newRow); // setRow(filterItems);
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

  const handleSubmitAddUsers = async () => {
    await axios
      .post(`${base_url}/admin/user`, newUser)
      .then((response) => {
        Toastify({
          text: `user created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        users.unshift(response.data.data);
        setNewUser({
          name: "",
          email: "",
          phone: "",
          password: "",
          address: "",
          user_account_type_id: "",
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
    const res = await axios.get(`${base_url}/admin/user/${id}`, config);
    setSelectedItem(res.data.data);
    console.log("item", res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(`${base_url}/admin/user/${id}`);
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
          text: `User updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < users.length; i++) {
          if (users[i].id === id) {
            users[i] = res.data.data;
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
      {/* user */}
      {!loading && !wrongMessage && (
        <div className="users">
          {/* header */}
          <h1 className="header">{t("Users")}</h1>
          {/* upper table */}
          <UserFilters
            searchRequestControls={searchRequestControls}
            handleSearchReq={handleSearchReq}
            filterTypes={userAccountTypes}
            handleAdd={handleAdd}
          />
          {/* table */}
          {users.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalUsersLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {users?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i+1}</td>
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
            <NoData data="user" />
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
            newUser={newUser}
            filterTypes={userAccountTypes}
            handleChange={handleChange}
            handleSubmitAddUsers={handleSubmitAddUsers}
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

export default Users;
