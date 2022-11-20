import React from "react";
import { createRoot } from "react-dom/client";

const Element = <div>fm2</div>;

const root = createRoot(document.querySelector("#root"));
root.render(Element);

export default function (rootElement: Element) {
  const root = createRoot(rootElement);
  root.render(Element);
}
