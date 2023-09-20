import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./upperTable.css";
import { Col, Row } from "react-bootstrap";

function UpperTable(props) {
  return (
    <div className="upperTable">
      <Row>
        {/* search */}

        <Col xs={12} xl={4}>
          <input
            placeholder="Search By Name"
            type="search"
            onChange={props.handleChangeSearch}
            className="inputSearch"
          />
        </Col>

        {/* filter types */}
        <Col xs={9} xl={4}>
          <Box className="filter">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {props.filterName}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={props.filterValue}
                label="filterType"
                onChange={props.handleChangeFilter}
              >
                {props.children}
              </Select>
            </FormControl>
          </Box>
        </Col>

        {/* add button */}
        <Col xs={3} xl={4}>
          <button onClick={props.handleAdd} className="add btn">
            <i className="ri-add-circle-line"></i>
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default UpperTable;
