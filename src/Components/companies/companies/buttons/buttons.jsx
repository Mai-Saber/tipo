import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Buttons(props) {
  const { t } = useTranslation();

  return (
    <>
      <td>
        <Link
          to="/companies/variants"
          className="btn btn-primary"
          onClick={() =>
            props.handleVariant(props.item.id, props.item?.client_id)
          }
        >
          {t("Variants")}
        </Link>
      </td>
      <td>
        <Link
          to="/companies/branches"
          className="btn btn-primary"
          onClick={() =>
            props.handleBranches(props.item?.id, props.item?.client_id)
          }
        >
          {t("Branches")}
        </Link>
      </td>
      <td>
        <Link
          to="/companies/categories"
          className="btn btn-primary"
          onClick={() =>
            props.handleCategories(props.item?.id, props.item?.client_id)
          }
        >
          {t("Categories")}
        </Link>
      </td>
    </>
  );
}

export default Buttons;
