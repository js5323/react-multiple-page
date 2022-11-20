import React from "react";
import { createRoot } from "react-dom/client";

const Element = <div>fm1</div>;

const root = createRoot(document.querySelector("#root"));
root.render(Element);
