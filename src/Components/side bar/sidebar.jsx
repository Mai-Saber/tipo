import React from "react";
import "./sidebar.css";
import { NavLink } from "react-router-dom";

function SideBar(props) {
  return (
    <div className="sideBar">
      <ul>
        <li>
          <NavLink to="/users">
            Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/countries">
            Countries
          </NavLink>
        </li>
        <li>
          <NavLink to="/clients">
            Clients
          </NavLink>
        </li>
        <li>
          <NavLink to="/companies">
            Companies
          </NavLink>
        </li>
        
      </ul>
    </div>
  );
}

export default SideBar;
