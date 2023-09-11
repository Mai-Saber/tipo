import React, { useState, useEffect } from "react";
import Table from "../../common/table";
import axios from "axios";
import { Link } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";

function Countries(props) {
  const [columns, setColumns] = useState([]);
  const [row, setRow] = useState([]);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // let itemToRender = row;

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(
        "https://backend.tiposmart.com/tips/api/country/countries"
      );
      setColumns(Object.keys(res.data.data[1]).slice(1));
      setRow(res.data.data);
      // itemToRender = row;
    };
    getData();
  }, []);

  // const handleChangeSearch = (e) => {
  //   const arr = [];

  //   if (e.target.value.trim()) {
  //     for (let i = 0; i < row.length; i++) {
  //       if (
  //         Array.from(row[i].name).includes(e.target.value) ||
  //         e.target.value === row[i].name.toLowerCase()
  //       ) {
  //         arr.push(row[i].name);
  //       }
  //     }
  //     if (arr.length !== 0) {
  //       itemToRender = arr;
  //     } else {
  //       itemToRender = row;
  //     }
  //   } else {
  //     itemToRender = row;
  //   }
  //   console.log("items", itemToRender);
  // };

  const handleChangeSearch = async (e) => {
    if (e.target.value.trim()) {
      const res = await axios.get(
        "https://backend.tiposmart.com/tips/api/country/countries/search"
      );
      console.log(res.data.data);
      setRow(res.data.data);
    }
  };

  const handleEdit = (id) => {
    console.log("edit", id);
  };

  const handleDelete = (id) => {
    console.log("delete", id);
    const filterItems = row.filter((item) => item.id !== id);
    setRow(filterItems);
  };
  const handleAdd = () => {
    console.log("add");
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // ////////////////////////////////////////
  return (
    <div className="companies">
      <Table
        header="Countries"
        columns={columns}
        count={row.length}
        rowsPerPageOptions={[1, 5, 10, 25]}
        handleChangeSearch={handleChangeSearch}
        handleAdd={handleAdd}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleChangePage={handleChangePage}
        rowsPerPage={rowsPerPage}
        page={page}
      >
        {row?.map((item) => (
          <tr key={item.id}>
            <td>{item.name} </td>
            <td>{item.name_ar}</td>
            <td>{item.phone_code}</td>
            <td>{item.flag}</td>
            <td>{item.prefix}</td>
            <td className="icons">
              <Link className="edit" to="" onClick={() => handleEdit(item.id)}>
                <i className="ri-pencil-line"></i>
              </Link>
              <Link
                className="delete"
                to=""
                onClick={() => handleDelete(item.id)}
              >
                <i className="ri-delete-bin-2-fill"></i>
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export default Countries;
