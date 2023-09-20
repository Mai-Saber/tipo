import { ToastContainer } from 'react-toastify';
import React, { useState } from "react";
import "./App.css";
import Login from "./Components/login/login";
import "bootstrap/dist/css/bootstrap.min.css";
import "toastify-js/src/toastify.css";
import NavBar from "./Components/nav bar/navbar";
import SideBar from "./Components/side bar/sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import User from "./Components/user/user";
import Countries from "./Components/countries/countries";
import Clients from "./Components/clients/clients";
import Companies from "./Components/companies/companies";
import NotFound from "./Components/notFound/notFound";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

import { useTranslation } from "react-i18next";
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
// ///////////////////////////////////////////
// /////////////////
function App() {


  return (
    <>
      <div className="App">
        <div className="lang">
        
        </div>

        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/" exact element={<Login />} />
          </Routes>
          {/* ///////////////*/}
          {sessionStorage.getItem("token") && (
            <div className="appContent">
              <NavBar />
              <div className="layout">
                <SideBar />
                <main className="main">
                  <Routes>
                    <Route path="/users" element={<User />} />,
                    <Route path="/countries" element={<Countries />} />,
                    <Route path="/clients" element={<Clients />} />,
                    <Route path="/companies" element={<Companies />} />,
                    <Route path="*" element={<NotFound />} />,
                  </Routes>
                </main>
              </div>
            </div>
          )}
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
