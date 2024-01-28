import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import NavBar from "./Components/navBar/navBar";
import SideBar from "./Components/sideBar/sideBar";

import "./common/language/language.css";
import i18n from "./common/language/i18n";
import "animate.css";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "toastify-js/src/toastify.css";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import { Outlet } from "react-router-dom";
// /////////////////////////////////////////
const token = sessionStorage.getItem("token");

axios.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("interceptor request error :(", error);
  }
);
/*///////////*/
axios.interceptors.response.use(null, (error) => {
  if (error.message === "Request failed with status code 401") {
    Toastify({
      text: `Error الحقوناااااي `,
      style: {
        background: "red",
        color: "white",
      },

      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      draggablePercent: 0,
    }).showToast();

    // setTimeout(function () {
    //   window.location = "/login";
    // }, 8000);
  }
  return Promise.reject(error);
});

////////////////////////////////////////////

function App() {
  const [openSideBar, setOpenSideBar] = React.useState(false);

  // language & direction
  useEffect(() => {
    const dir = i18n.dir(i18n.lng);
    sessionStorage.setItem("lng", i18n.logger.options.lng);
    document.getElementsByTagName("html")[0].setAttribute("dir", dir);
  }, [i18n, i18n.lng]);

  const handleSideBarOpen = () => {
    setOpenSideBar(true);
  };

  const handleSideBarClose = () => {
    setOpenSideBar(false);
  };
  //////////////////////////////////////////////////
  return (
    <div className="app">
      <ToastContainer />
      <div className="appContent">
        {/* nav */}
        <NavBar open={openSideBar} handleSideBarOpen={handleSideBarOpen} />

        {/* layout = side + outlet */}
        <div className="layout">
          <SideBar
            open={openSideBar}
            handleSideBarClose={handleSideBarClose}
            id="side"
          />
          <main className="main">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
