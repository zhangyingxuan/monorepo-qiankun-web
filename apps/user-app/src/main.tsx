import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import {
  renderWithQiankun,
  qiankunWindow,
} from "vite-plugin-qiankun/dist/helper";
import App from "./App";
import "./index.css";

let root: ReactDOM.Root | null = null;

const render = (container?: HTMLElement) => {
  const mountElement = container
    ? (container.querySelector("#app") as HTMLElement)
    : (document.getElementById("app") as HTMLElement);

  root = ReactDOM.createRoot(mountElement);
  root.render(
    <React.StrictMode>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </React.StrictMode>
  );
};

renderWithQiankun({
  mount(props) {
    console.log("[user-app] mount", props);
    render(props.container);
  },
  bootstrap() {
    console.log("[user-app] bootstrap");
  },
  unmount() {
    console.log("[user-app] unmount");
    if (root) {
      root.unmount();
      root = null;
    }
  },
  update(props) {
    console.log("[user-app] update", props);
  },
});

// 独立运行时
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
