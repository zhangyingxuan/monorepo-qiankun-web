<template>
  <div class="main-container">
    <el-container class="layout-container">
      <!-- 移动端顶部导航栏 -->
      <div class="mobile-header" v-if="isMobile">
        <div class="mobile-header-content">
          <el-icon class="menu-toggle" @click="drawerVisible = true" size="24">
            <Menu />
          </el-icon>
          <span class="mobile-title">微前端管理系统</span>
          <el-dropdown>
            <el-avatar
              :size="32"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>设置</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 移动端抽屉菜单 -->
      <el-drawer
        v-model="drawerVisible"
        direction="ltr"
        :size="280"
        :with-header="false"
        class="mobile-drawer"
        v-if="isMobile"
      >
        <div class="drawer-content">
          <div class="logo">
            <el-icon size="24"><Grid /></el-icon>
            <span>微前端管理系统</span>
          </div>
          <el-menu
            :default-active="activeMenu"
            class="el-menu-vertical"
            background-color="#001529"
            text-color="#fff"
            active-text-color="#1890ff"
            router
            @select="handleMenuSelect"
          >
            <el-menu-item index="/">
              <el-icon><HomeFilled /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/shop">
              <el-icon><ShoppingCart /></el-icon>
              <span>商城管理</span>
            </el-menu-item>
            <el-menu-item index="/role">
              <el-icon><User /></el-icon>
              <span>角色管理</span>
            </el-menu-item>
            <el-menu-item index="/user">
              <el-icon><UserFilled /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/map">
              <el-icon><Location /></el-icon>
              <span>地图应用</span>
            </el-menu-item>
            <el-menu-item index="/gomoku">
              <el-icon><Grid /></el-icon>
              <span>五子棋</span>
            </el-menu-item>
            <el-menu-item index="/tank-war">
              <el-icon><Aim /></el-icon>
              <span>坦克大战</span>
            </el-menu-item>
            <el-menu-item index="/ocr">
              <el-icon><Document /></el-icon>
              <span>OCR识别</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-drawer>

      <!-- PC端侧边栏 -->
      <el-aside
        v-if="!isMobile"
        :width="isCollapsed ? '64px' : '220px'"
        class="sidebar"
      >
        <div class="logo">
          <el-icon size="24"><Grid /></el-icon>
          <span v-show="!isCollapsed">微前端管理系统</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#1890ff"
          router
          :collapse="isCollapsed"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <template #title>首页</template>
          </el-menu-item>
          <el-menu-item index="/shop">
            <el-icon><ShoppingCart /></el-icon>
            <template #title>商城管理</template>
          </el-menu-item>
          <el-menu-item index="/role">
            <el-icon><User /></el-icon>
            <template #title>角色管理</template>
          </el-menu-item>
          <el-menu-item index="/user">
            <el-icon><UserFilled /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="/map">
            <el-icon><Location /></el-icon>
            <template #title>地图应用</template>
          </el-menu-item>
          <el-menu-item index="/gomoku">
            <el-icon><Grid /></el-icon>
            <template #title>五子棋</template>
          </el-menu-item>
          <el-menu-item index="/tank-war">
            <el-icon><Aim /></el-icon>
            <template #title>坦克大战</template>
          </el-menu-item>
          <el-menu-item index="/ocr">
            <el-icon><Document /></el-icon>
            <template #title>OCR识别</template>
          </el-menu-item>
        </el-menu>
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="isCollapsed = !isCollapsed">
          <el-icon :size="18">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
        </div>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <el-header class="header" v-if="!isMobile">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentModule">{{
                currentModule
              }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar
                  :size="32"
                  src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
                />
                <span class="username">管理员</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>设置</el-dropdown-item>
                  <el-dropdown-item divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main-content" :class="{ 'mobile-main': isMobile }">
          <!-- 主应用路由视图 -->
          <router-view v-show="isMainApp" />
          <!-- shop-app 使用 iframe 嵌入 (Nuxt 3) -->
          <div v-show="isShopApp" class="iframe-container">
            <iframe
              v-if="isShopApp"
              src="http://localhost:8001"
              frameborder="0"
              class="micro-iframe"
            ></iframe>
          </div>
          <!--其他微应用容器 (qiankun) -->
          <div id="micro-container" v-show="isMicroApp"></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { Menu, Fold, Expand, Document } from "@element-plus/icons-vue";

const route = useRoute();

// 响应式断点：768px 以下为移动端
const isMobile = ref(false);
const isCollapsed = ref(false);
const drawerVisible = ref(false);

// 检测屏幕宽度
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
  // 平板模式下默认折叠侧边栏
  if (window.innerWidth >= 768 && window.innerWidth < 1024) {
    isCollapsed.value = true;
  } else if (window.innerWidth >= 1024) {
    isCollapsed.value = false;
  }
};

// 菜单选择后关闭抽屉
const handleMenuSelect = () => {
  drawerVisible.value = false;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});

// 根据路径前缀匹配菜单项，确保子路径也能高亮对应的菜单
const activeMenu = computed(() => {
  const path = route.path;
  if (path.startsWith("/shop")) return "/shop";
  if (path.startsWith("/role")) return "/role";
  if (path.startsWith("/user")) return "/user";
  if (path.startsWith("/map")) return "/map";
  if (path.startsWith("/gomoku")) return "/gomoku";
  if (path.startsWith("/tank-war")) return "/tank-war";
  if (path.startsWith("/ocr")) return "/ocr";
  return "/";
});

const isMainApp = computed(() => {
  const path = route.path;
  return path === "/" || path === "/home";
});

// shop-app 使用 iframe 方式
const isShopApp = computed(() => {
  return route.path.startsWith("/shop");
});

// role-app 和 user-app 使用 qiankun 方式
const isMicroApp = computed(() => {
  const path = route.path;
  return (
    path.startsWith("/role") ||
    path.startsWith("/user") ||
    path.startsWith("/map") ||
    path.startsWith("/gomoku") ||
    path.startsWith("/tank-war") ||
    path.startsWith("/ocr")
  );
});

const currentModule = computed(() => {
  const path = route.path;
  if (path.startsWith("/shop")) return "商城管理";
  if (path.startsWith("/role")) return "角色管理";
  if (path.startsWith("/user")) return "用户管理";
  if (path.startsWith("/map")) return "地图应用";
  if (path.startsWith("/gomoku")) return "五子棋";
  if (path.startsWith("/tank-war")) return "坦克大战";
  if (path.startsWith("/ocr")) return "OCR识别";
  return "";
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
}

.main-container {
  height: 100%;

  .layout-container {
    height: 100%;
  }

  // 移动端顶部导航栏
  .mobile-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: #001529;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    .mobile-header-content {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;

      .menu-toggle {
        color: #fff;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background 0.3s;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }

      .mobile-title {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  // 移动端抽屉菜单样式
  .mobile-drawer {
    .drawer-content {
      height: 100%;
      background: #001529;
      display: flex;
      flex-direction: column;
    }

    .logo {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid #002140;

      .el-icon {
        margin-right: 8px;
      }
    }

    .el-menu {
      border-right: none;
      flex: 1;
    }
  }

  .sidebar {
    background-color: #001529;
    transition: width 0.3s;
    position: relative;

    .logo {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #002140;
      white-space: nowrap;
      overflow: hidden;

      .el-icon {
        margin-right: 8px;
        flex-shrink: 0;
      }
    }

    .el-menu {
      border-right: none;
    }

    .collapse-btn {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      cursor: pointer;
      color: #fff;
      transition: all 0.3s;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .header {
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    padding: 0 24px;

    .header-left {
      display: flex;
      align-items: center;
    }

    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;

        .username {
          margin-left: 8px;
          color: #333;
        }
      }
    }
  }

  .main-content {
    background: #f0f2f5;
    padding: 24px;
    overflow: auto;

    &.mobile-main {
      padding: 8px;
      padding-top: 64px; // 为固定顶部导航留出空间
    }

    .iframe-container {
      height: 100%;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;

      .micro-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
    }

    #micro-container {
      height: 100%;
      background: #fff;
      border-radius: 8px;
      overflow: auto;

      > div {
        min-height: 100%;
      }
    }
  }
}

// 移动端适配
@media screen and (max-width: 767px) {
  .main-container {
    .main-content {
      #micro-container,
      .iframe-container {
        border-radius: 4px;
      }
    }
  }
}

// 平板适配
@media screen and (min-width: 768px) and (max-width: 1023px) {
  .main-container {
    .header {
      padding: 0 16px;

      .username {
        display: none;
      }
    }

    .main-content {
      padding: 16px;
    }
  }
}
</style>
