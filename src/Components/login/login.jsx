import React, { useState } from "react";
import "./login.css";
import { TextField, Button } from "@mui/material";
import { base_url } from "../../constants";
import axios from "axios";
import { toast } from "react-toastify";
import Joi from "joi";

function Login(props) {
  // state
  const [account, setAccount] = useState({
    user: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // function
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
    const data = { user: account.user, password: account.password };
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      Accept: "application/json",
    };
    console.log("url", url);
    console.log("data", data);

    await axios
      .post(url, data)
      .then((response) => {
        console.log("token", response.data.data.token);
      })
      .catch((error) => {
        console.log("err", error);
      });

    // make inputs empty
    setAccount({
      user: "",
      password: "",
    });
    //   window.location="/home"
  };
  // get token
  // await axios({
  //   method: "post",
  //   url: url,
  //   headers: { headers: headers },
  //   data: data,
  // })

  // return
  return (
    <div className="loginPage">
      <div className="box">
        <form>
          <TextField
            className="input"
            id="standard-basic"
            label="User Name"
            type="text"
            variant="outlined"
            name="user"
            value={account.user}
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
          />
          {account.password.trim() !== "" && account.password.length < 3 && (
            <p className="alert alert-danger">
              <b>Must be more than 3 digits</b>
            </p>
          )}

          <Button
            className="btn btn-primary"
            variant="contained"
            id="submit"
            onClick={handleSubmit}
            // disabled={
            //   !account.user || account.password.length < 3 ? true : false
            // }
          >
            submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
