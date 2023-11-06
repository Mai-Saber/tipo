import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_url, config } from "../../../service/service";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import MenuItem from "@mui/material/MenuItem";
import UpperTable from "../../../common/upperTable/upperTable";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../../common/show modal/showModal.css";
import { TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import Loading from "../../../common/loading/loading";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import Table from "../../../common/table/table";
import TablePagination from "@mui/material/TablePagination";
import TablePaginationActions from "../../../common/pagination/pagination";
import { Col, Row } from "react-bootstrap";
import "./categories.css";
import { ReactTree } from "@naisutech/react-tree";
import { Tree } from "primereact/tree";

import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";

function Categories(props) {
  const [selectedKey, setSelectedKey] = useState("");
  const [nodes, setNodes] = useState([]);

  const [data, setData] = useState([
    {
      label: "Parent",
      id: "1",
      parentId: null,
      children: [
        {
          label: "Child1",
          id: "2",
          parentId: "1",
        },
      ],
    },
    {
      label: "mai",
      id: "33",
      parentId: null,
      children: [
        {
          label: "maiiiiiiiiiii",
          id: "44",
          parentId: "33",
        },
      ],
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [parentCategory, setParentCategory] = useState([]);
  const [childCategory, setChildCategory] = useState([]);
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [item, setItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newCategory, setNewCategory] = useState({
    client_id: clientID,
    company_id: companyID,
    category_id: "",
    name: "",
  });
  const { t } = useTranslation();

  // pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(2);

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - parentCategory.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // general
  useEffect(() => {
    // loading
    setTimeout(function () {
      setLoading(false);
    }, 3000);

    // // get categories
    // const getCategories = async () => {
    //   // parent category
    //   const parentCategory = await axios.get(
    //     `${base_url}/admin/company/categories/${companyID}`
    //   );
    //   setParentCategory(parentCategory.data.data);

    //   // children
    //   const AllParentCategories = parentCategory.data.data;
    //   const arr = [];

    //   for (let i = 0; i < AllParentCategories.length; i++) {
    //     const item = AllParentCategories[i];
    //     const res = await axios.get(
    //       `${base_url}/admin/company/categories/by-category/${item.id}`
    //     );
    //     res.data.data.map((obj) => arr.push(obj));
    //     // arr.push(res.data.data);
    //   }
    //   setChildCategory(arr);
    //   console.log(
    //     "arr",
    //     arr.filter((el) => el.name === "laptop")
    //   );
    // };
    const getCategories = async () => {
      try {
        // parent category
        const parentRes = await axios.get(
          `${base_url}/admin/company/categories/${companyID}`
        );
        // تظبيط شكل الاوبجكت
        // parent categories
        for (let i = 0; i < parentRes.data.data.length; i++) {
          const obj = parentRes.data.data[i];
          let newParentObj = {
            parentId: obj.parent_category ? obj.parent_category.id : null,
            label: obj.name,
            id: obj.id,
            ...obj,
          };
          if (nodes.length !== parentRes.data.data.length) {
            nodes.push(newParentObj);
          } else {
            break;
          }
        }

        // get children
        const children = [];
        for (let i = 0; i < nodes.length; i++) {
          const ele = nodes[i];
          // child
          const childRes = await axios.get(
            `${base_url}/admin/company/categories/by-category/${ele.id}`
          );
          childRes.data.data.map((obj) => children.push(obj));
        }
        // تظبيط الاطفال
        for (let i = 0; i < children.length; i++) {
          const obj = children[i];
          let newObj = {
            label: obj.name,
            id: obj.id,
            parentId: obj.parent_category ? obj.parent_category.id : null,
            ...obj,
          };
          if (!nodes.find((item) => item.label == obj.name)) {
            nodes.push(newObj);
          }
        }

        console.log("d", nodes);
      } catch (err) {
        console.log("err", err);
      }
    };

    // call functions
    getCategories();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newCategory,
      [e.target.name]: e.target.value,
    };
    setNewCategory(newData);

    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
  };

  // search & filter
  const handleChangeSearch = async (e) => {
    if (e.target.value.trim()) {
      const res = await axios.get(
        `${base_url}/admin/company/categories/search/${companyID}?query_string=${e.target.value}`
      );
      setParentCategory(res.data.data);
    }
    if (e.target.value === "") {
      const url = `${base_url}/admin/company/categories/${companyID}`;
      const res = await axios.get(url);
      setParentCategory(res.data.data);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(`${base_url}/admin/company/category/${id}`, config);
      const newParentCategory = parentCategory.filter((item) => item.id !== id);
      const newChildCategory = childCategory.filter((item) => item.id !== id);
      // setRow(filterItems);
      setParentCategory(newParentCategory);
      setChildCategory(newChildCategory);
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
  const handleAdd = (id) => {
    if (id) {
      newCategory.category_id = id;
      console.log(id);
    } else {
      newCategory.category_id = "";
    }
    newCategory.name = "";
    setNewCategory(newCategory);
    setAddModal(true);
  };

  const handleSubmitAddBranch = async () => {
    await axios
      .post(`${base_url}/admin/company/category`, newCategory)
      .then((res) => {
        if (!newCategory.category_id) {
          parentCategory.unshift(res.data.data);
          Toastify({
            text: `Category created successfully `,
            style: {
              background: "green",
              color: "white",
            },
          }).showToast();
        } else {
          childCategory.unshift(res.data.data);

          // // append child
          // const ele = document.getElementById(newCategory.category_id);
          // var a = document.createElement("TreeItem");
          // a.appendChild(document.createTextNode(newCategory.name));
          // a.setAttribute("value", res.data.data.id);
          // a.setAttribute("nodeId", res.data.data.id);
          // a.setAttribute("label", res.data.data.name);
          // ele.appendChild(a);

          // console.log(a);

          // toast
          Toastify({
            text: `Sub Category created successfully `,
            style: {
              background: "green",
              color: "white",
            },
          }).showToast();
        }
        setNewCategory({
          client_id: clientID,
          company_id: companyID,
          category_id: "",
          name: "",
        });
        setAddModal(false);
      })
      .catch((err) => {
        console.log(err);
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
      `${base_url}/admin/company/category/${id}`,
      config
    );
    setItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(`${base_url}/admin/company/category/${id}`);
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
      email: editItem.email,
      phone: editItem.phone,
      address: editItem.address,
    };
    await axios
      .patch(`${base_url}/admin/company/category/${id}`, data)
      .then((res) => {
        Toastify({
          text: `Category updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < parentCategory.length; i++) {
          if (parentCategory[i].id === id) {
            parentCategory[i] = res.data.data;
          }
        }
        for (let i = 0; i < childCategory.length; i++) {
          if (childCategory[i].id === id) {
            childCategory[i] = res.data.data;
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
  const actionTemplate = () => {
    return (
      <div className="icons flex flex-wrap gap-2">
        {/* edit */}

        <Link
          className="edit"
          to=""
          // onClick={() => handleEdit(item.id)}
        >
          <i className="ri-pencil-line"></i>
        </Link>

        {/* delete */}
        <Link
          className="delete"
          to=""
          // onClick={() => handleDelete(item.id, item.name)}
        >
          <i className="ri-delete-bin-2-fill"></i>
        </Link>
        {/* show */}

        <Link
          className="show"
          to=""
          // onClick={() => handleShow(item.id)}
        >
          <i className="ri-eye-line"></i>
        </Link>
      </div>
    );
  };

  // ///////////////
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}

      {/* Categories */}
      {!loading && (
        <div className="categories">
          {/* header */}
          <h1 className="header">{t("Categories")}</h1>
          {/* upper table */}
          <UpperTable
            handleChangeSearch={handleChangeSearch}
            handleAdd={() => handleAdd()}
          />
          {/*tree*/}
          <div className="card flex justify-content-center">
            <Tree
              value={data}
              onClick={(e) => console.log("click",e.target)}
              className="w-full md:w-30rem"
            />
          </div>

          {/* modals*/}
          {/* show modal */}
          <Modal className="showModal" show={showModal} onHide={handleClose}>
            <Modal.Header closeButton className="header">
              <Modal.Title>{item.name}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>
                <span className="label">{t("Name")} : </span>
                {item.name}
              </p>
              <p>
                <span className="label">{t("Id")} : </span> {item.id}
              </p>
              <p>
                <span className="label">{t("created_at")} : </span>
                {item.created_at}
              </p>

              <hr />
              <h3>{t("CompanyDetails")}</h3>
              <p>
                <span className="label">{t("CompanyName")} : </span>
                {item.company?.name}
              </p>
              <p>
                <span className="label">{t("CompanyId")} : </span>
                {item.company?.id}
              </p>
              <p>
                <span className="label"> {t("ClientId")} : </span>
                {item.company?.client_id}
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
              <Modal.Title> {t("AddNewCategory")}</Modal.Title>
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
                  value={newCategory.name}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("Category_id")}
                  name="category_id"
                  value={newCategory.category_id}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("CompanyId")}
                  name="company_id"
                  value={newCategory.company_id}
                  onChange={handleChange}
                />
                <TextField
                  className="input"
                  id="outlined-basic"
                  variant="outlined"
                  type="text"
                  label={t("ClientId")}
                  name="client_id"
                  value={newCategory.client_id}
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
                onClick={handleSubmitAddBranch}
              >
                {t("Save")}
              </Button>
            </Modal.Footer>
          </Modal>
          {/* edit modal */}
          <Modal show={editModal} onHide={handleClose} className="Modal">
            <Modal.Header closeButton>
              <Modal.Title>{t("EditCategory")}</Modal.Title>
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

export default Categories;
