import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";

let root: ReactDOM.Root | null = null;

function render(props: any) {
  const { container } = props;
  const target = container
    ? container.querySelector("#root")
    : document.getElementById("root");
  root = ReactDOM.createRoot(target!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

renderWithQiankun({
  mount(props) {
    console.log("[ocr-app] mount", props);
    render(props);
  },
  bootstrap() {
    console.log("[ocr-app] bootstrap");
  },
  unmount() {
    console.log("[ocr-app] unmount");
    root?.unmount();
    root = null;
  },
  update(props: any) {
    console.log("[ocr-app] update", props);
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}
