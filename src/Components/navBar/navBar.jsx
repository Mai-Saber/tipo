import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import Switch from "@mui/material/Switch";
import "./navBar.css";
import Avatar from "@mui/material/Avatar";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

function NavBar(props) {
  const [drawerDirections, setDrawerDirections] = React.useState({
    left: false,
  });
  const { i18n, t } = useTranslation();
  const label = { inputProps: { "aria-label": "Switch demo" } };

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

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerDirections({ ...drawerDirections, [anchor]: open });
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="navBar">
      <AppBar position="static">
        <Toolbar>
          {/* switch button */}
          <Button onClick={props.handleSideBarOpen} className="switch">
            <Switch {...label} defaultChecked />{" "}
          </Button>
          {/* logo */}
          <img
            style={{
              ...(props.open && { display: "none" }),
              width: 70,

              paddingBottom: "5px",
            }}
            alt="profile"
            src="../../../assets/logo.png"
          />

          {/* rightPart */}
          <div className="rightPart">
            {/* language */}
            <span >
              <button className="btn language" >
                {sessionStorage.getItem("lng")}
              </button>
            </span>
            {/* avatar */}
            <img
              className="avatar"
              src="../../../assets/avatar.jpg"
              alt="avatar"
            />
            {/* prefix */}
            <span className="prefix">{sessionStorage.getItem("prefix")}</span>
            {/* notification */}
            <span>
              <NotificationsNoneIcon />
            </span>
            {/* logout */}
            <span>
              <NavLink
                to="/"
                className="logout"
                title="log out"
                onClick={handleClearToken}
              >
                <i className="ri-logout-box-r-line"></i>
              </NavLink>
            </span>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;



 {
   /* switch button */
 }
//  <Button onClick={toggleDrawer(anchor, true)}>
//    <Switch {...label} defaultChecked />
        //  </Button>;
        



        // <select defaultValue={i18n.language} onChange={onChangeLang}>
        //       {LANGUAGES.map(({ code, label }) => (
        //         <option key={code} value={code}>
        //           {t(label)}
        //         </option>
        //       ))}
        //     </select>

        //     <NavLink
        //       to="/"
        //       className="logout"
        //       eventkey={2}
        //       title="log out"
        //       onClick={handleClearToken}
        //     >
        //       {/* <i className="ri-logout-box-r-line"></i> */}
        //       {t("Logout")}
        //     </NavLink>
   
