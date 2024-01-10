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
import { Link } from "react-router-dom";

function Product(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [categoryId, setCategoryID] = useState(props.categoryIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalProductsLength, setTotalProductsLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newProduct, setNewProduct] = useState({
    client_id: clientID,
    company_id: companyID,
    category_id: categoryId,
    name: "",
    description: "",
    details: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // get products
    const getProducts = async () => {
      try {
        const url = `${base_url}/admin/company/category/products/${categoryId}`;
        await axios
          .get(url)
          .then((res) => {
            setLoading(false);
            setColumnsHeader(["Id","product Name"]);
            setProducts(res.data.data);
            setTotalProductsLength(res.data.meta?.total);
          })
          .catch((err) => {
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
    getProducts();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newProduct,
      [e.target.name]: e.target.value,
    };
    setNewProduct(newData);

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
        `${base_url}/admin/company/category/products/search/${categoryId}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setProducts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/category/product/${id}`,
        config
      );
      const newRow = products.filter((item) => item.id !== id);
      setProducts(newRow); // setRow(filterItems);
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
        products.unshift(res.data.data);
        setNewProduct({
          client_id: clientID,
          company_id: companyID,
          category_id: categoryId,
          name: "",
          description: "",
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
      `${base_url}/admin/company/category/product/${id}`,
      config
    );
    setSelectedItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/category/product/${id}`
    );
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      name: editItem.name,
      details: editItem.details,
      description: editItem.description,
    };
    await axios
      .patch(`${base_url}/admin/company/category/product/${id}`, data)
      .then((res) => {
        Toastify({
          text: `product updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < products.length; i++) {
          if (products[i].id === id) {
            products[i] = res.data.data;
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
        <div className="products">
          {/* header */}
          <h1 className="header">{t("Products")}</h1>
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
          {products.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalProductsLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {products?.map((item,i) => (
                <tr key={item.id}>
                  <td>{i+1}</td>
                  <td>{item.name}</td>
                  <td>
                    <Link
                      to="/companies/category/product/finalProduct"
                      className="btn btn-primary"
                      onClick={() =>
                        props.handleFinalProducts(
                          item?.id,
                          item?.category_id,
                          item?.client_id,
                          item?.company_id
                        )
                      }
                    >
                      {t("FinalProducts")}
                    </Link>
                  </td>
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
            <NoData data="product" />
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
            newProduct={newProduct}
            handleClose={handleClose}
            handleChange={handleChange}
            handleSubmitAddBranch={handleSubmitAddProduct}
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

export default Product;
