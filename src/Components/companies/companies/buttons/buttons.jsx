import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

function Buttons(props) {
  const { t } = useTranslation();

  return (
      <td>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Go to</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Go to"
          >
            
            <MenuItem value="contacts">
              <Link
                to="/companies/contacts"
                className="btn"
                onClick={() =>
                  props.handleContacts(props.item.id, props.item?.client_id)
                }
              >
                {t("Contacts")}
              </Link>
            </MenuItem>
            {/* /// */}
            <MenuItem value="PriceList">
              <Link
                to="/companies/priceList"
                className="btn"
                onClick={() =>
                  props.handlePriceList(props.item.id, props.item?.client_id)
                }
              >
                {t("PriceList")}
              </Link>
            </MenuItem>
            {/* /// */}
            <MenuItem value="variants">
              <Link
                to="/companies/variants"
                className="btn"
                onClick={() =>
                  props.handleVariant(props.item.id, props.item?.client_id)
                }
              >
                {t("Variants")}
              </Link>
            </MenuItem>
            {/* //// */}
            <MenuItem value="branches">
              <Link
                to="/companies/branches"
                className="btn"
                onClick={() =>
                  props.handleBranches(props.item?.id, props.item?.client_id)
                }
              >
                {t("Branches")}
              </Link>
            </MenuItem>
            {/* /// */}
            <MenuItem value="categories">
              <Link
                to="/companies/categories"
                className="btn"
                onClick={() =>
                  props.handleCategories(props.item?.id, props.item?.client_id)
                }
              >
                {t("Categories")}
              </Link>
            </MenuItem>
          </Select>
        </FormControl>
      </td>
  );
}

export default Buttons;
