import React from "react";
import { createRoot } from "react-dom/client";

import "@/styles/main.scss";
import "./style.scss";
import { Navbar } from "./components/Navbar";

const Element = (
  <div className='wrapper'>
    <Navbar />

    <div className='container mt-3'>
      <button className='btn btn-primary'>this is a button</button>
    </div>
  </div>
);

const root = createRoot(document.querySelector("#root"));
root.render(Element);
