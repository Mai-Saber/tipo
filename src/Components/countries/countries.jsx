import React, { useState, useEffect } from "react";
import axios from "axios";
import { Paginator } from "primereact/paginator";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import NoData from "../../common/noData/noData";

import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

import Loading from "../../common/loading/loading";
import WrongMessage from "../../common/wrongMessage/wrongMessage";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import "./countries.css";
import { useTranslation } from "react-i18next";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import { base_url, config } from "../../service/service";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { use } from "i18next";

function Countries(props) {
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState("");
  const [wrongMessage, setWrongMessage] = useState(false);
  const [totalcountrysLength, setTotalcountrysLength] = useState("");
  const [countries, setCountries] = useState([]);
  const [ActiveIdArr] = useState([
    {
      id: "active",
      name: "Active",
    },
    {
      id: "inactive",
      name: "InActive",
    },
  ]);
  //modals
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [newCountry, setNewCountry] = useState({
    name: "",
    name_ar: "",
    phoneCode: "",
    prefix: "",
  });
  const { t } = useTranslation();
  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 33,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: t("Name"),
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "nameAr",
      headerName: t("NameAr"),
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "phoneCode",
      headerName: t("PhoneCode"),
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "prefix",
      headerName: t("Prefix"),
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "activation",
      headerName: t("Activation"),
      flex: 1,
      flexGrow: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        return (
          <Box className="activeBox">
            <IconButton
              id="activButton"
              color="success"
              onClick={() => {
                ChangeCountryStatus(row);
              }}
            >
              <CheckBoxOutlinedIcon
                sx={{
                  color: row.active ? "green" : "red",
                }}
                fontSize="small"
              />
            </IconButton>
          </Box>
        );
      },
    },

    {
      field: "actions",
      headerName: t("Actions"),
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => {
        return (
          <Box className="actionsBox">
            <IconButton color="success" onClick={() => handleEdit(row.id)}>
              <BorderColorOutlinedIcon
                sx={{
                  color: "green",
                }}
                fontSize="small"
              />
            </IconButton>
          </Box>
        );
      },
    },
  ];
  // //////////////////////////////////////////////////////////////
  // general
  useEffect(() => {
    // get countrys
    const getCountries = async () => {
      const url = `${base_url}/admin/countries`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setCountries(res.data.data);
          setTotalcountrysLength(res.data.meta?.total);
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
        `${base_url}/admin/countries/search?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setCountries(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // add
  const handleAdd = () => {
    setAddModal(true);
    setNewCountry({
      name: "",
      nameAr: "",
      phoneCode: "",
      prefix: "",
    });
  };

  const handleSubmitAddCountry = async () => {
    await axios
      .post(`${base_url}/admin/country`, newCountry)
      .then((res) => {
        Toastify({
          text: `country created successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        countries.unshift(res.data.data);
        setNewCountry({
          name: "",
          name_ar: "",
          phoneCode: "",
          prefix: "",
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

  // edit
  const handleEdit = async (id) => {
    console.log("edit", id);
    const res = await axios.get(`${base_url}/admin/country/${id}`);
    console.log("edit", res.data.data);
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
        console.log(err);
      });
  };

  // close any modal
  const handleClose = () => {
    setAddModal(false);
    setEditModal(false);
  };

  const handleChangeSelectActive = (id) => {
    setActiveId(id === "all" ? "" : id);
  };

  const ChangeCountryStatus = async (country) => {
    const url = country.active
      ? `${base_url}/admin/country-inactive/${country.id}`
      : `${base_url}/admin/country-active/${country.id}`;
    await axios.patch(url, {}, config);
    setCountries(
      countries.filter((row) => {
        return row.id !== country.id;
      })
    );
  };

  ////////////////////////////////////////////
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}
      {/* countries */}
      {!loading && !wrongMessage && (
        <div className="countries">
          {/* header & add button */}
          <Box className="headerBox">
            <h3 className="header">{t("Countries")}</h3>
            <Button
              className="btn add"
              variant="contained"
              size="small"
              onClick={handleAdd}
              startIcon={<AddLocationAltOutlinedIcon />}
            >
              {t("AddNewCountry")}
            </Button>
          </Box>
          {/* filters */}
          <Box className="filters">
            <Stack className="stack">
              <TextField
                id={"selectedActive"}
                select
                label={t("Active ")}
                defaultValue="all"
                variant="standard"
                size="small"
                onChange={(event) => {
                  handleChangeSelectActive(event.target.value);
                }}
              >
                {/* active filter */}
                <MenuItem key="all" value="all">
                  {t("All")}
                </MenuItem>
                {ActiveIdArr?.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            {/* search */}
            <Stack className="searchStack">
              <TextField
                className="inputSearch"
                autoFocus
                margin="dense"
                id="search"
                label={t("Search")}
                type="search"
                fullWidth
                variant="standard"
                name="queryString"
                value={searchRequestControls.queryString}
                onChange={(e) =>
                  handleSearchReq(e, { queryString: e.target.value })
                }
              />
            </Stack>
          </Box>
          {/* table */}
          {countries.length !== 0 ? (
            <DataGrid
              sx={{ mt: 3 }}
              rows={countries.map((item) => {
                return {
                  id: item.id,
                  name: item.name,
                  nameAr: item.name_ar,
                  phoneCode: item.phone_code,
                  prefix: item.prefix,
                  active: item.active,
                };
              })}
              rowHeight={40}
              slots={{ toolbar: GridToolbar }}
              // @ts-ignore
              columns={columns}
              autoHeight
              hideFooter
            />
          ) : (
            <NoData data="country" />
          )}
          {/* pagination */}
          <Stack className="paginationStack">
            <div className="card">
              <Paginator
                rowsPerPageOptions={[5, 10, 20, 30]}
                first={pageNumber}
                rows={rowsPerPage}
                totalRecords={totalcountrysLength}
                onPageChange={onPageChange}
              />
            </div>
          </Stack>

          {/* modals */}

          {/* add modal */}
          <ModalAdd
            show={addModal}
            handleClose={handleClose}
            title={t("AddNewcountry")}
            newcountry={newCountry}
            handleChange={handleChange}
            handleSubmitAddCountry={handleSubmitAddCountry}
          />
          {/* edit modal */}
          <ModalEdit
            show={editModal}
            handleClose={handleClose}
            editItem={editItem}
            handleChange={handleChange}
            handleSubmitEdit={() => handleSubmitEdit(editItem.id)}
          />
        </div>
      )}
      {/* wrong message */}
      {!loading && wrongMessage && <WrongMessage />}
    </>
  );
}

export default Countries;
