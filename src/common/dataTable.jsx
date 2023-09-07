import React from "react";
import DataTable from "react-data-table-component";

function DataTables(props) {
  const ExpandedComponent = ({ data }) => (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Year",
      selector: (row) => row.year,
    },
  ];

  const data = [
    {
      id: 1,
      title: "Beetlejuice",
      year: "1988",
    },
    {
      id: 2,
      title: "Ghostbusters",
      year: "1984",
    },
  ];

  const selectProps = { indeterminate: (isIndeterminate) => isIndeterminate };

  return (
    <div>
      
      <DataTable title="Movie List" columns={columns} data={data} pagination />
    </div>
  );
}

export default DataTables;
