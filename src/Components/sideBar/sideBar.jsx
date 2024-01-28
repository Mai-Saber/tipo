import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PublicIcon from "@mui/icons-material/Public";
import Switch from "@mui/material/Switch";
import "./sideBar.css";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import { NavLink, Navigate } from "react-router-dom";

export default function SideBar(props) {
  // state
  const { t } = useTranslation();
  const admin_arr = [
    {
      text: t("Dashboard"),
      icon: <DashboardIcon sx={{ fontSize: "20px" }} />,
      path: "/admin-dashboard",
    },

    {
      text: t("Countries"),
      icon: <PublicIcon sx={{ fontSize: "20px" }} />,
      path: "/countries",
    },
  ];
  const client_arr = [
    {
      text: t("Dashboard"),
      icon: <DashboardIcon sx={{ fontSize: "20px" }} />,
      path: "/client-dashboard",
    },

    {
      text: t("Countries"),
      icon: <PublicIcon sx={{ fontSize: "20px" }} />,
      path: "/client-dashboard/companies",
    },
  ];

  const allPages =
    sessionStorage.getItem("prefix") === "Admin" ? admin_arr : client_arr;
  const label = { inputProps: { "aria-label": "Switch demo" } };

  // //////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="sideBar" id={props.id}>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer anchor={anchor} open={props.open}>
            {/* side bar content */}
            <Box
              className="sideBarBox"
              sx={{
                width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
              }}
              // role="presentation"
            >
              {/* logo & switch & prefix */}
              <div className="imgTitleDiv">
                <span className="ButtonImg">
                  <img src="../../../assets/logo.png" alt="logo" />
                  <Button onClick={props.handleSideBarClose}>
                    <Switch {...label} defaultChecked />
                  </Button>
                </span>
                <h3>Admin</h3>
              </div>
              <hr />
              {/* pages based on prefix */}
              {allPages.map((item) => (
                <ListItem
                  className="list"
                  key={item.path}
                  disablePadding
                  sx={{ display: "flex", color: "grey" }}
                >
                  <NavLink
                    to={item.path}
                  
                  >
                    {/* icon */}
                    <ListItemIcon className="ListItemIcon">
                      {item.icon}
                    </ListItemIcon>
                    {/* text */}
                    <ListItemText
                      primary={
                        <Typography
                          className="Typography"
                          sx={{
                            textAlign:
                              sessionStorage.getItem("lng") === "ar "
                                ? "end"
                                : "start",
                          }}
                        >
                          {item.text}
                        </Typography>
                      }
                    />
                  </NavLink>
                </ListItem>
              ))}
            </Box>{" "}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
