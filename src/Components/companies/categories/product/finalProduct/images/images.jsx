import React, { useState, useEffect } from "react";

import NoData from "../../../../../../common/noData/noData";
import Table from "../../../../../../common/table/table";
import "../../../../../../common/show modal/showModal.css";
import TableFilter from "../../../../../../common/tableFilter/tableFilter";
import Loading from "../../../../../../common/loading/loading";
import WrongMessage from "../../../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import { Link } from "react-router-dom";

function FinalProductImages(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [finalProductId, setFinalProductId] = useState(
    props.finalProductIDInApp
  );
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [images, setImages] = useState([]);
  const [totalImagesLength, setTotalImagesLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const [file, setFile] = useState();
  const { t } = useTranslation();

  // general
  useEffect(() => {
    try {
      console.log("imgggggggggggg");
      // get img
      const getImages = async () => {
        try {
          const url = `${base_url}/admin/company/category/product/final-product-images/${finalProductId}`;
          await axios
            .get(url)
            .then((res) => {
              setLoading(false);
              setColumnsHeader(["Id", "images"]);
              setImages(res.data?.data);
              console.log(res.data.data);
              setTotalImagesLength(res.data.meta?.total);
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
      getImages();
    } catch (err) {
      console.log(err);
    }
  }, []);

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
        `${base_url}/admin/company/category/product/final-product-images/search/${finalProductId}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setImages(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/category/product/final-product-image/${id}`,
        config
      );
      const newRow = images.filter((item) => item.id !== id);
      setImages(newRow); // setRow(filterItems);
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

  const handleChangeFile = (event) => {
    setFile(event.target.files[0]);
    console.log("handleChangeFile", event.target.files[0]);
  };

  const handleCreateImgFromFile = async ({ fileId }) => {
    await axios
      .post(`${base_url}/admin/company/category/product/final-product-image`, {
        final_product_id: finalProductId,
        files: [fileId],
      })
      .then((res) => {
        Toastify({
          text: `Image created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        images.unshift(res.data.data);

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

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    await axios
      .post(`${base_url}/storage/file`, formData, {
        headers: { Authorization: "Bearer " + sessionStorage.getItem("token") },
      })
      .then((res) => {
        Toastify({
          text: res.data.message,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        handleCreateImgFromFile({ fileId: res.data.data.id });
      });
  };

  // show
  const handleShow = async (id) => {
    setShowModal(true);
    const res = await axios.get(
      `${base_url}/admin/company/category/product/final-product-image/${id}`,
      config
    );
    console.log("show", res.data.data);
    setSelectedItem(res.data.data);
  };

  // close any modal
  const handleClose = () => {
    setShowModal(false);
    setAddModal(false);
  };
  // ////////////////////////////////////////
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}

      {/* variants */}
      {!loading && !wrongMessage && (
        <div className="FinalProductImages">
          {/* header */}
          <h1 className="header">{t("FinalProductImages")}</h1>
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
          {images.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalImagesLength}
              onPageChange={onPageChange}
            >
              {/* table children */}

              {images?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>
                    <img src={item?.file?.file_path} alt="product img here" />
                  </td>
                  {/* icons */}
                  <td className="icons">
                    {/* delete */}
                    <Link
                      className="delete"
                      to=""
                      onClick={() => handleDelete(item?.id, props.item?.name)}
                    >
                      <i className="ri-delete-bin-2-fill"></i>
                    </Link>
                    {/* show */}

                    <Link
                      className="show"
                      to=""
                      onClick={() => handleShow(item?.id)}
                    >
                      <i className="ri-eye-line"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <NoData data="Image" />
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
            handleUpload={handleUpload}
            handleFile={handleChangeFile}
            handleClose={handleClose}
          />
        </div>
      )}
      {/* wrong message */}
      {!loading && wrongMessage && <WrongMessage />}
    </>
  );
}

export default FinalProductImages;
