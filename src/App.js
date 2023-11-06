import { ToastContainer } from 'react-toastify';
import "animate.css";
import React, { useEffect, useState } from "react";
import "./App.css";
import "./common/language/language.css"
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
import i18n from "./common/language/i18n";
import Branches from "./Components/companies/Branches/branches";
import Governorate from "./Components/Governorates/Governorates";
import Categories from './Components/companies/categories/categories';
import { PrimeReactProvider } from "primereact/api";
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
  const [countryId, setCountryId] = useState("");
  const [companyID, setCompanyId] = useState("");
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    const dir = i18n.dir(i18n.lng);
    document.getElementsByTagName("html")[0].setAttribute("dir", dir);
    console.log("atr", document.getElementsByTagName("html")[0].attributes[1]==="rtl");
  }, [i18n, i18n.lng]);

  const handleGovernorate = (id) => {
    setCountryId(id);
  };

  const handleBranches = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };

  const handleCategories = (id, clientId) => {
    setCompanyId(id);
    setClientId(clientId);
  };

  const handleSideBar = () => {
    if (window.innerWidth < 900) {
      document.getElementById("side").classList.toggle("disable");
    }
  };
  return (
    <>
      <div className="app">
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/" exact element={<Login />} />
          </Routes>
          {/* ///////////////*/}
          {sessionStorage.getItem("token") && (
            <div className="appContent">
              {window.location.pathname.trim() === "/" || (
                <NavBar handleSideBar={handleSideBar} />
              )}
              <div className="layout">
                <SideBar id="side" handleSideBar={handleSideBar} />

                <main className="main">
                  <PrimeReactProvider>
                    <Routes>
                      <Route
                        path="/countries"
                        element={
                          <Countries handleGovernorate={handleGovernorate} />
                        }
                      />
                      , ,
                      <Route
                        path="/governorate"
                        element={<Governorate countryInApp={countryId} />}
                      />
                      ,
                      <Route
                        path="/companies"
                        element={
                          <Companies
                            handleBranches={handleBranches}
                            handleCategories={handleCategories}
                          />
                        }
                      />
                      ,
                      <Route
                        path="/companies/branches"
                        element={
                          <Branches
                            companyIDInApp={companyID}
                            clientIdInApp={clientId}
                          />
                        }
                      />
                      ,
                      <Route
                        path="/companies/categories"
                        element={
                          <Categories
                            companyIDInApp={companyID}
                            clientIdInApp={clientId}
                          />
                        }
                      />
                      ,
                      <Route path="/users" element={<User />} />,
                      <Route path="/clients" element={<Clients />} />,
                      <Route path="*" element={<NotFound />} />,
                    </Routes>
                  </PrimeReactProvider>
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
