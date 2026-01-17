<template>
  <div class="main-container">
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside width="220px" class="sidebar">
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
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <el-header class="header">
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

        <el-main class="main-content">
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
          <!-- 其他微应用容器 (qiankun) -->
          <div id="micro-container" v-show="isMicroApp">
            <div id="app"></div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 根据路径前缀匹配菜单项，确保子路径也能高亮对应的菜单
const activeMenu = computed(() => {
  const path = route.path;
  if (path.startsWith("/shop")) return "/shop";
  if (path.startsWith("/role")) return "/role";
  if (path.startsWith("/user")) return "/user";
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
  return path.startsWith("/role") || path.startsWith("/user");
});

const currentModule = computed(() => {
  const path = route.path;
  if (path.startsWith("/shop")) return "商城管理";
  if (path.startsWith("/role")) return "角色管理";
  if (path.startsWith("/user")) return "用户管理";
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

  .sidebar {
    background-color: #001529;

    .logo {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #002140;

      .el-icon {
        margin-right: 8px;
      }
    }

    .el-menu {
      border-right: none;
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
    }
  }
}
</style>
