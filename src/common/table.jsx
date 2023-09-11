import * as React from "react";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import "./table.css";

export default function StickyHeadTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log("handleChangePage");
  };

 

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }} className="commonTable">
      <h1 className="header">{props.header}</h1>

      <div className="search-add">
        <input
          placeholder="Search By Name"
          type="search"
          onChange={props.handleChangeSearch}
          className="inputSearch"
        />
        <button onClick={props.handleAdd} className="add btn">
          <i className="ri-add-circle-line"></i>
        </button>
      </div>

      <table>
        <thead>
          <tr>
            {props.columns?.map((col) => (
              <th key={col}> {col}</th>
            ))}
            <th> </th>
          </tr>
        </thead>
        <tbody>{props.children}</tbody>
      </table>

      <TablePagination
        component="div"
        count={10}
        page={props.page}
        onPageChange={props.handleChangePage}
        rowsPerPage={props.rowsPerPage}
        onRowsPerPageChange={props.handleChangeRowsPerPage}
      />
    </Paper>
  );
}
