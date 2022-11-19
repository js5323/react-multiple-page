import React from "react";
import { createRoot } from "react-dom/client";

import "./style.scss";

const Element = <div>Hello index2</div>;

const root = createRoot(document.querySelector("#root"));
root.render(Element);
