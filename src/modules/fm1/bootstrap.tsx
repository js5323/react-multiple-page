import React from "react";
import { createRoot } from "react-dom/client";

import "@/packages/index1/style.scss";

const Element = <div>fm1</div>;

const root = createRoot(document.querySelector("#root"));
root.render(Element);

export default function (rootElement: Element) {
  const root = createRoot(rootElement);
  root.render(Element);
}
