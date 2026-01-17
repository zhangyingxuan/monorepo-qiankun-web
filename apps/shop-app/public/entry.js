// qiankun 生命周期入口 - Nuxt 3 版本
// 这个文件会被 qiankun 加载来获取生命周期函数

(function (global) {
  // 标记是否在 qiankun 环境中
  global.__POWERED_BY_QIANKUN__ = global.__POWERED_BY_QIANKUN__ || false;

  // 存储挂载容器
  let qiankunContainer = null;

  // 移动 Nuxt 渲染的内容到 qiankun 容器
  function moveNuxtContent(container) {
    if (!container) return;

    // 查找 Nuxt 渲染的根元素
    const nuxtRoot = document.getElementById("__nuxt");
    if (nuxtRoot && container) {
      // 清空容器
      const targetContainer = container.querySelector("#app") || container;
      targetContainer.innerHTML = "";
      // 将 nuxt 根元素移动到容器中
      targetContainer.appendChild(nuxtRoot);
    }
  }

  // 导出生命周期函数
  global["shop-app"] = {
    bootstrap: function () {
      console.log("[shop-app] bootstrap");
      return Promise.resolve();
    },
    mount: function (props) {
      console.log("[shop-app] mount", props);
      qiankunContainer = props.container;
      global.__POWERED_BY_QIANKUN__ = true;

      // 延迟执行，等待 Nuxt 渲染完成
      return new Promise(function (resolve) {
        setTimeout(function () {
          moveNuxtContent(qiankunContainer);
          resolve();
        }, 100);
      });
    },
    unmount: function (props) {
      console.log("[shop-app] unmount", props);
      // 清理容器
      if (qiankunContainer) {
        const targetContainer =
          qiankunContainer.querySelector("#app") || qiankunContainer;
        targetContainer.innerHTML = "";
      }
      qiankunContainer = null;
      return Promise.resolve();
    },
    update: function (props) {
      console.log("[shop-app] update", props);
      return Promise.resolve();
    },
  };

  // 同时挂载到 window 上作为备用
  if (typeof window !== "undefined") {
    window.bootstrap = global["shop-app"].bootstrap;
    window.mount = global["shop-app"].mount;
    window.unmount = global["shop-app"].unmount;
    window.update = global["shop-app"].update;
  }
})(typeof window !== "undefined" ? window : this);
