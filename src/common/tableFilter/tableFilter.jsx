import React from "react";
import "./tableFilter.css";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function TableFilter(props) {
  const { t } = useTranslation();

  return (
    // <div className="upperTable">
    //   <Row>
    //     {/* search */}

    //     <Col xs={12} xl={4}>
    //       <input
    //         placeholder="Search By Name"
    //         type="search"
    //         onChange={props.handleChangeSearch}
    //         className="inputSearch"
    //       />
    //     </Col>

    //     {/* filter types */}
    //     <Col xs={9} xl={4}>
    //       <Box className="filter">
    //         <FormControl fullWidth>
    //           <InputLabel id="demo-simple-select-label">
    //             {props.filterName}
    //           </InputLabel>
    //           <Select
    //             labelId="demo-simple-select-label"
    //             id="demo-simple-select"
    //             value={props.filterValue}
    //             label="filterType"
    //             onChange={props.handleChangeFilter}
    //           >
    //             {props.children}
    //           </Select>
    //         </FormControl>
    //       </Box>
    //     </Col>

    //     {/* add button */}
    //     <Col xs={3} xl={4}>
    //       <button onClick={props.handleAdd} className="add btn">
    //         <i className="ri-add-circle-line"></i>
    //       </button>
    //     </Col>
    //   </Row>
    // </div>

    <div className="upperTable">
      <Row>
        {/* search */}
        <Col xs={9} xl={8}>
          <input
            placeholder={t("SearchByName")}
            type="search"
            className="inputSearch"
            name={props.inputName}
            value={props.inputValue}
            onChange={props.handleChangeSearch}
          />
        </Col>

        {/* add button */}
        <Col xs={2} xl={4}>
          <button onClick={props.handleAdd} className="add btn">
            <i className="ri-add-circle-line"></i>
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default TableFilter;
