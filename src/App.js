import { ToastContainer } from 'react-toastify';
import './App.css';
import Login from './Components/login/login';
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

function App() {
  return (
    <>
      <div className="App">
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
