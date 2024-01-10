import React, { useState, useEffect } from "react";

import TableFilter from "../../../common/tableFilter/tableFilter";
import "../../../common/show modal/showModal.css";
import Loading from "../../../common/loading/loading";
import NoData from "../../../common/noData/noData";
import WrongMessage from "../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../service/service";
import "primeicons/primeicons.css";
import "./categories.css";

import axios from "axios";
import { Link } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";
import ModalAddProduct from "./modals/addProduct";

function Categories(props) {
  const [categories, setCategories] = useState([]);
  const [totalCategoriesLength, setTotalCategoriesLength] = useState("");

  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const [newCategory, setNewCategory] = useState({
    client_id: clientID,
    company_id: companyID,
    category_id: "",
    name: "",
  });
  const { t } = useTranslation();
  // for add product model
  const [addProductModal, setAddProductModal] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [newProduct, setNewProduct] = useState({
    client_id: clientID,
    company_id: companyID,
    category_id: "",
    name: "",
    description: "",
    details: "",
  });

  // general
  useEffect(() => {
    // call functions
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      await axios
        .get(`${base_url}/admin/company/categories/${companyID}`)
        .then((res) => {
          setLoading(false);
          setCategories(res.data.data);
          setTotalCategoriesLength(res.data.meta?.total);
        })
        .catch((err) => {
          // loading
          setTimeout(function () {
            setLoading(false);
          }, 3000);

          setWrongMessage(true);
        });
    } catch (err) {
      console.log("errr", err);
    }
  };

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newCategory,
      [e.target.name]: e.target.value,
    };
    setNewCategory(newData);
    //////////////////////
    const addedProduct = {
      ...newProduct,
      [e.target.name]: e.target.value,
    };
    setNewProduct(addedProduct);

    console.log(e.target.name, e.target.value);
    // ///////////////////
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
        `${base_url}/admin/company/categories/search/${companyID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setCategories(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(`${base_url}/admin/company/category/${id}`, config);
      getCategories();
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

  // add category

  const handleCatNameForAddModel = async (id) => {
    await axios
      .get(`${base_url}/admin/company/category/${id}`)
      .then((res) => {
        setCategoryName(res.data.data.data.name);
      })
      .catch();
  };

  const handleAdd = (id) => {
    newCategory.category_id = id;
    newCategory.name = "";
    setNewCategory(newCategory);
    setAddModal(true);
    // for show name instead id in modal
    if (id !== "") {
      handleCatNameForAddModel(id);
    }
  };

  const handleSubmitAddCategory = async () => {
    await axios
      .post(`${base_url}/admin/company/category`, newCategory)
      .then((res) => {
        if (!newCategory.category_id) {
          categories.unshift(res.data.data);
          Toastify({
            text: `Category created successfully `,
            style: {
              background: "green",
              color: "white",
            },
          }).showToast();
        }
        //child
        else {
          getCategories();
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

  // add product
  const handleAddProduct = async (id) => {
    console.log(id);
    newProduct.category_id = id;
    setNewProduct(newProduct);

    // get category name
    await axios
      .get(`${base_url}/admin/company/category/${id}`)
      .then((res) => {
        setSelectedCategoryName(res.data.data.data.name);
      })
      .catch((err) => console.log(err));

    setAddProductModal(true);
  };

  const handleSubmitAddProduct = async () => {
    await axios
      .post(`${base_url}/admin/company/category/product`, newProduct)
      .then((res) => {
        Toastify({
          text: `Product created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        setNewProduct({
          client_id: clientID,
          company_id: companyID,
          category_id: "",
          name: "",
          description: "",
          details: "",
        });
        setAddProductModal(false);
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
    const res = await axios.get(
      `${base_url}/admin/company/category/${id}`,
      config
    );
    setSelectedItem(res.data.data);
    setShowModal(true);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(`${base_url}/admin/company/category/${id}`);
    setEditItem(res.data.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
    };
    console.log("data", data);
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
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].data?.id === id) {
            categories[i] = res.data.data;
          } else {
            getCategories();
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
    setAddProductModal(false);
  };
  // ////////////////////////////////////////
  const actionTemplate = (item) => {
    return (
      <div className="flex icons">
        {/* product */}
        <Link
          to="/companies/category/product"
          title="Go to this category' products"
          className="btn btn-primary"
          onClick={() =>
            props.handleProducts(
              item?.data.id,
              item?.data.client_id,
              item?.data.company_id
            )
          }
        >
          {t("Products")}
        </Link>
        {/* add product */}
        <Link
          to=""
          title="Add Product to this category"
          className="btn btn-primary"
          onClick={() => handleAddProduct(item.data.id)}
        >
          {t("AddProducts")}
        </Link>
        {/* add */}
        <Link
          className="add"
          title="Add sub category"
          to=""
          onClick={() => handleAdd(item.data.id)}
        >
          <i className="ri-add-circle-line"></i>
        </Link>
        {/* edit */}
        <Link
          className="edit"
          title="edit this category"
          to=""
          onClick={() => handleEdit(item.data.id)}
        >
          <i className="ri-pencil-line"></i>
        </Link>
        {/* delete */}
        <Link
          className="delete"
          to=""
          title="delete this category"
          onClick={() => handleDelete(item.data.id, item.data.name)}
        >
          <i className="ri-delete-bin-2-fill"></i>
        </Link>
        {/* show */}
        <Link
          className="show"
          title="show this category"
          to=""
          onClick={() => handleShow(item.data.id)}
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
      {!loading && !wrongMessage && (
        <div className="categories">
          {/* header */}
          <h1 className="header">{t("Categories")}</h1>
          {/* upper table */}
          <TableFilter
            handleAdd={() => handleAdd("")}
            inputName="queryString"
            inputValue={searchRequestControls.queryString}
            handleChangeSearch={(e) =>
              handleSearchReq(e, { queryString: e.target.value })
            }
          />
          {/*tree*/}
          {categories.length !== 0 ? (
            <>
              <div className="card">
                <TreeTable
                  className="table"
                  value={categories}
                  tableStyle={{ minWidth: "100%" }}
                >
                  <Column field="name" header="Name" expander sortable></Column>
                  <Column
                    body={(item) => actionTemplate(item)}
                    field="id"
                    headerClassName="w-10rem"
                  />
                </TreeTable>
              </div>
              {/* pagination */}
              <div className="card">
                <Paginator
                  first={pageNumber}
                  rows={rowsPerPage}
                  totalRecords={totalCategoriesLength}
                  rowsPerPageOptions={[3, 5, 10, 20, 30]}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          ) : (
            <NoData data="category" />
          )}
          {/* modals*/}
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
            newCategory={newCategory}
            categoryName={categoryName}
            handleChange={handleChange}
            handleSubmitAddCategory={handleSubmitAddCategory}
          />
          {/* add product modal */}
          <ModalAddProduct
            show={addProductModal}
            handleClose={handleClose}
            newProduct={newProduct}
            selectedCategoryName={selectedCategoryName}
            handleChange={handleChange}
            handleSubmitAddProduct={handleSubmitAddProduct}
          />
          {/* edit modal */}
          <ModalEdit
            show={editModal}
            editItem={editItem}
            handleClose={handleClose}
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

export default Categories;
