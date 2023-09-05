import React from "react";
import "./navbar.css";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";

function NavBar(props) {
  return (
    <div className="navBar">
      <div className="left">
        <ul>
          <li>
            <NavLink className="navbar-brand logo" to="/profile">
              <img src="../../../public/logo 4" alt="logo" />
            </NavLink>
          </li>
          <li>Hello user</li>
        </ul>
      </div>
      {/* right */}
      <div className="right">
        <ul>
          <li>English</li>
          <li>Messages</li>
          <li>
            <NavLink to="/">logout</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavBar;
