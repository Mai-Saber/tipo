import React from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom";

function NavBar(props) {
  return (
    <div className="navBar">
      <div className="left">
        <ul>
          <li>
            <NavLink to="/users">
              <img src="../../../login img.avif" alt="logo" />
            </NavLink>
          </li>
          <li>Hello user</li>
        </ul>
      </div>
      {/* right */}
      <div className="right">
        <ul>
          <li>English</li>
          <li>
            <NavLink to="/">Messages</NavLink>
          </li>
          <li>
            <NavLink to="/">logout</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
