import * as React from "react";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import "./table.css";
import UpperTable from "../upperTable/upperTable";

export default function StickyHeadTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log("handleChangePage");
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }} className="commonTable">

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

      
    </Paper>
  );
}
