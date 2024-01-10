import React from "react";
import { NavLink, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./navBar.css";
import { LANGUAGES } from "../../common/language/constants";
import { useTranslation } from "react-i18next";

function NavBar(props) {
  const { i18n, t } = useTranslation();

  const onChangeLang = (e) => {
    const lang_code = e.target.value;
    sessionStorage.setItem("language", lang_code);
    i18n.changeLanguage(lang_code);
    document.body.dir = i18n.dir();
    handleStyleBasedOnDir(e.target.value);
  };

  const handleClearToken = () => {
    sessionStorage.removeItem("token");
  };

  const handleStyleBasedOnDir = (code) => {
    if (code === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.getElementsByClassName("app")[0].classList.add("appInArabic");
    }
    if (code === "en") {
      document.documentElement.setAttribute("dir", "ltr");
      document.getElementsByClassName("app")[0].classList.remove("appInArabic");
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navBar">
      <Container className="containerNav">
        <Navbar.Brand to="/users">
          <img src="../../../assets/logo2.png" alt="logo" />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className="toggleButton"
          onClick={props.handleSideBar}
        />

        <Navbar className="items">
          <Nav className="me-auto">
            <p className="welcome">
              {t("Welcome")}{" "}
              <span className="name">{sessionStorage.getItem("name")}</span>
            </p>
          </Nav>
          <Nav className="right">
            <select defaultValue={i18n.language} onChange={onChangeLang}>
              {LANGUAGES.map(({ code, label }) => (
                <option key={code} value={code}>
                  {t(label)}
                </option>
              ))}
            </select>

            <NavLink
              to="/"
              className="logout"
              eventkey={2}
              title="log out"
              onClick={handleClearToken}
            >
              {/* <i className="ri-logout-box-r-line"></i> */}
              {t("Logout")}
            </NavLink>
          </Nav>
        </Navbar>
      </Container>
    </Navbar>
  );
}

export default NavBar;
