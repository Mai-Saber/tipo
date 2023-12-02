import * as React from "react";
import Paper from "@mui/material/Paper";
import "./table.css";
import { useTranslation } from "react-i18next";
import { Paginator } from "primereact/paginator";

export default function StickyHeadTable(props) {
  const { t } = useTranslation();

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }} className="commonTable">
      <table>
        <thead>
          <tr>
            {props.columns?.map((col) => (
              <th key={col}> {t(col)}</th>
            ))}
            <th> </th>
          </tr>
        </thead>
        <tbody>{props.children}</tbody>
      </table>
      {/* // */}
      <div className="card">
        <Paginator
          first={props.first}
          rows={props.rows}
          totalRecords={props.totalRecords}
          rowsPerPageOptions={[5, 10, 20, 30]}
          onPageChange={props.onPageChange}
        />
      </div>
    </Paper>
  );
}
