import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

// Redux
import { store } from "./redux/store";

// App
import App from "./App";
import "./assets/css/index.css";
import "antd/dist/antd.css";

global.backendserver = "https://trustbe.herokuapp.com"

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
  ,
  document.getElementById("root")
);
