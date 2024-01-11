import React, { useState, useEffect } from "react";

import NoData from "../../../../../../common/noData/noData";
import Table from "../../../../../../common/table/table";
import "../../../../../../common/show modal/showModal.css";
import TableFilter from "../../../../../../common/tableFilter/tableFilter";
import Loading from "../../../../../../common/loading/loading";
import TableIcons from "../../../../../../common/tableIcons/tableIcons";
import WrongMessage from "../../../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

function FinalProductVariantValues(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [finalProductId, setFinalProductId] = useState(
    props.finalProductIDInApp
  );
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [variantValues, setVariantValues] = useState([]);
  const [totalProductsLength, setTotalProductsLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newVariantValue, setNewVariantValue] = useState({
    final_product_id: finalProductId,
    variant_id: "",
    variant_value_id: "",
    details: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    try {
      // get variantsValue
      const getVariantValues = async () => {
        try {
          const url = `${base_url}/admin/company/category/product/final-product-variant-values/${finalProductId}`;
          await axios
            .get(url)
            .then((res) => {
              setLoading(false);
              setColumnsHeader(["Id", "Name"]);
              setVariantValues(res.data?.data);
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
      getVariantValues();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newVariantValue,
      [e.target.name]: e.target.value,
    };
    setNewVariantValue(newData);

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
        `${base_url}/admin/company/category/product/final-product-variant-values/search/${finalProductId}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setVariantValues(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/category/product/final-product-variant-value/${id}`,
        config
      );
      const newRow = variantValues.filter((item) => item.id !== id);
      setVariantValues(newRow); // setRow(filterItems);
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

  const handleSubmitAddFinalProductVariantValue = async () => {
    const data = {
      final_product_id: finalProductId,
      variants: [
        {
          variant_id: newVariantValue.variant_id,
          variant_value_id: newVariantValue.variant_value_id,
          details: newVariantValue.details,
        },
      ],
    };

    console.log(data);

    await axios
      .post(
        `${base_url}/admin/company/category/product/final-product-variant-value`,
        data
      )
      .then((res) => {
        Toastify({
          text: `variant Value created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        variantValues.unshift(res.data.data);
        setNewVariantValue({
          final_product_id: finalProductId,
          variants: [],
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
      `${base_url}/admin/company/category/product/final-product-variant-value/${id}`,
      config
    );
    console.log("show",res.data.data);
    setSelectedItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/category/product/final-product-variant-value/${id}`
    );
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      details: editItem.details,
    };
    await axios
      .patch(
        `${base_url}/admin/company/category/product/final-product-variant-value/${id}`,
        data
      )
      .then((res) => {
        Toastify({
          text: `Variant Value updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < variantValues.length; i++) {
          if (variantValues[i].id === id) {
            variantValues[i] = res.data.data;
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
        <div className="FinalProductVariantValues">
          {/* header */}
          <h1 className="header">{t("FinalProductVariantValues")}</h1>
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
          {variantValues.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalProductsLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {variantValues?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.details}</td>

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
            <NoData data="Variant Value" />
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
            companyId={companyID}
            newVariantValue={newVariantValue}
            handleClose={handleClose}
            handleChange={handleChange}
            handleSubmitAddFinalProductVariantValue={
              handleSubmitAddFinalProductVariantValue
            }
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

export default FinalProductVariantValues;
