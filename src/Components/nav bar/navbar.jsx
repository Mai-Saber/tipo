import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./navbar.css";

function NavBar() {
  useEffect(() => {
    window.addEventListener("resize", console.log(window.innerWidth));
    // if()
  }, []);

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navBar">
      <Container>
        <Navbar.Brand to="/users">
          <img src="../../../login img.avif" alt="logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" className="toggleButton" />

        <Navbar.Collapse className="items">
          <div className="routes">
            <ul>
              <li>
                <Nav.Link eventKey={3}>
                  <NavLink to="/users">Users</NavLink>
                </Nav.Link>
              </li>
              <li>
                <Nav.Link eventKey={3}>
                  <NavLink to="/countries">Countries</NavLink>
                </Nav.Link>
              </li>
              <li>
                <Nav.Link eventKey={3}>
                  <NavLink to="/clients">Clients</NavLink>
                </Nav.Link>
              </li>
              <li>
                <Nav.Link eventKey={3}>
                  <NavLink to="/companies">Companies</NavLink>
                </Nav.Link>
              </li>
            </ul>
          </div>
          <div className="mainItems">
            <Nav className="me-auto">
              <Nav.Link>Hello ( user )</Nav.Link>
            </Nav>
            <Nav className="right">
              <Nav.Link>English</Nav.Link>
              <Nav.Link eventKey={2}>
                <NavLink to="/"> Log out</NavLink>
              </Nav.Link>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
