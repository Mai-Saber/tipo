import React, { useEffect, useState } from "react";
import "./login.css";
import { TextField, Button, Link } from "@mui/material";
import { base_url } from "../../service/service";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import Modal from "react-modal";
import "remixicon/fonts/remixicon.css";



function Login(props) {
  // state

  const [account, setAccount] = useState({
    email: "",
    password: "",
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  // function
  useEffect(() => {
    window.onload = () => {
      sessionStorage.removeItem("token");
    };
  }, []);

  const handleChange = (e) => {
    const newAccount = {
      ...account,
      [e.target.name]: e.target.value,
    };
    setAccount(newAccount);
  };

  // ////////////
  const handleSubmit = async () => {
    //   constants
    const url = base_url + `/auth/login`;
    const data = { user: account.email, password: account.password };

    await axios
      .post(url, data)
      .then((response) => {
        sessionStorage.setItem("token", response.data.data.token);
        sessionStorage.setItem("name", response.data.data.name);
        sessionStorage.setItem("prefix","Admin")

        Toastify({
          text: `Hello ${response.data.data.name}`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        window.location = "/countries";
      })
      .catch((error) => {
        console.log("err", error);
        Toastify({
          text: `${error.response.data.message}`,
          style: {
            background: "red",
            color: "white",
          },
        }).showToast();
      });

    // make inputs empty
    setAccount({
      email: "",
      password: "",
    });
  };

  const handleKeyDown = (e) => {
    const isEnter = e.keyCode == 13;
    if (isEnter && account.email.trim() && account.password.trim().length > 3) {
      handleSubmit();
    }
  };
  // //////////////////////////////////////
  // return
  return (
    <div className="loginPage">
      <div className="box">
        <form action="post">
          <TextField
            className="input"
            id="standard-basic"
            label="Email"
            type="text"
            variant="outlined"
            name="email"
            value={account.email}
            onChange={(e) => handleChange(e)}
            title="Write your user name please.."
            autoFocus
          />
          <TextField
            className="input"
            id="standard-basic "
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            value={account.password}
            onChange={(e) => handleChange(e)}
            title="must be more than 3 characters"
            onKeyDown={handleKeyDown}
          />
          {account.password.trim() !== "" && account.password.length < 3 && (
            <p className="alert alert-danger">
              <b>Must be more than 3 digits</b>
            </p>
          )}

          <div className="buttons">
            <Link className="forgetPassword" onClick={() => setIsOpen(true)}>
              Forget Password
            </Link>
            <Modal
              // show={addModal}
              // onHide={handleClose}
              className="Modal"
            >
              <Modal.Header closeButton>
                <Modal.Title> Forgot Password </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
                  <input type="email" />
                  <button> Verify</button>
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className="close btn btn-danger"
                  variant="secondary"
                  // onClick={handleClose}
                >
                  close
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
          {/* // submit ///////////////////////////////// */}
          <Button
            className="btn btn-primary"
            variant="contained"
            id="submit"
            onClick={handleSubmit}
            disabled={
              !account.email || account.password.length < 3 ? true : false
            }
          >
            submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
