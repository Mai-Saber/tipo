import React, { useState } from "react";
import "./sideBar.css";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

function SideBar(props) {
  const { t } = useTranslation();

  return (
    <div className="sideBar" id={props.id}>
      <ul>
        <li>
          <NavLink to="/countries" onClick={props.handleSideBar}>
            {t("Countries")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/governorate" onClick={props.handleSideBar}>
            {t("Governorate")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/companies" onClick={props.handleSideBar}>
            {t("Companies")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" onClick={props.handleSideBar}>
            {t("Users")}
          </NavLink>
        </li>
        <li>
          <NavLink to="/clients" onClick={props.handleSideBar}>
            {t("Clients")}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
