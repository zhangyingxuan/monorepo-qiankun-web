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

// 性能监控实例（由主应用传入）
let performanceMonitor: any = null;

const render = (container?: HTMLElement) => {
  // 标记渲染开始
  if (performanceMonitor) {
    performanceMonitor.markRenderStart("user-app");
  }
  const renderStartTime = performance.now();

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

  // 标记渲染结束
  const renderEndTime = performance.now();
  if (performanceMonitor) {
    performanceMonitor.markRenderEnd("user-app");
  }
  console.log(
    `[user-app] 渲染耗时: ${(renderEndTime - renderStartTime).toFixed(2)}ms`
  );
};

renderWithQiankun({
  mount(props) {
    // 获取主应用传递的性能监控实例
    performanceMonitor = props.performanceMonitor;

    // 标记 mount 开始
    if (performanceMonitor) {
      performanceMonitor.markMountStart("user-app");
    }
    const mountStartTime = performance.now();

    console.log("[user-app] mount", props);
    render(props.container);

    // 标记 mount 结束
    const mountEndTime = performance.now();
    if (performanceMonitor) {
      performanceMonitor.markMountEnd("user-app");
    }
    console.log(
      `[user-app] mount 阶段耗时: ${(mountEndTime - mountStartTime).toFixed(
        2
      )}ms`
    );
  },
  bootstrap() {
    // 标记 bootstrap 开始
    if (performanceMonitor) {
      performanceMonitor.markBootstrapStart("user-app");
    }
    const bootstrapStartTime = performance.now();

    console.log("[user-app] bootstrap");

    // 标记 bootstrap 结束
    const bootstrapEndTime = performance.now();
    if (performanceMonitor) {
      performanceMonitor.markBootstrapEnd("user-app");
    }
    console.log(
      `[user-app] bootstrap 阶段耗时: ${(
        bootstrapEndTime - bootstrapStartTime
      ).toFixed(2)}ms`
    );
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
