import React from "react";
import { Col, Row } from "react-bootstrap";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";

function AboveTable(props) {
  const { t } = useTranslation();

  return (
    <div className="upperTable">
      <Row>
        {/* search */}
        <Col xs={12} xl={4}>
          <input
            placeholder={t("SearchByGovernorateName")}
            type="search"
            name="queryString"
            value={props.searchRequestControls?.queryString}
            onChange={(e) =>
              props.handleSearchReq(e, { queryString: e.target.value })
            }
            className="inputSearch"
          />
        </Col>
        {/* filter types */}
        <Col xs={9} xl={4}>
          <Box className="filter">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                {t("SelectCountry")}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Country"
                name="filterType"
                value={props.searchRequestControls?.filterType}
                onChange={(e) =>
                  props.handleSearchReq(e, { filterType: e.target.value })
                }
              >
                <MenuItem value="">All</MenuItem>
                {props.filterCountries?.map((el) => (
                  <MenuItem key={el.id} value={el.id}>
                    {el.name}
                  </MenuItem>
                ))}
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

export default AboveTable;
