<template>
  <div class="home-page">
    <div class="welcome-section">
      <h1>欢迎使用微前端管理系统</h1>
      <p>基于 Turbo + qiankun 构建的企业级微前端解决方案</p>
    </div>

    <el-row :gutter="24" class="card-row">
      <el-col :span="8">
        <el-card
          shadow="hover"
          class="app-card shop-card"
          @click="goToApp('/shop')"
        >
          <div class="card-content">
            <el-icon class="card-icon" :size="48"><ShoppingCart /></el-icon>
            <h3>商城管理</h3>
            <p>基于 Nuxt 3 构建的商城子应用</p>
            <div class="tech-tags">
              <el-tag size="small">Nuxt 3</el-tag>
              <el-tag size="small" type="success">SSR</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card
          shadow="hover"
          class="app-card role-card"
          @click="goToApp('/role')"
        >
          <div class="card-content">
            <el-icon class="card-icon" :size="48"><User /></el-icon>
            <h3>角色管理</h3>
            <p>基于 Vue 3 + TDesign 的角色管理子应用</p>
            <div class="tech-tags">
              <el-tag size="small">Vue 3</el-tag>
              <el-tag size="small" type="success">TDesign</el-tag>
              <el-tag size="small" type="warning">ECharts</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card
          shadow="hover"
          class="app-card user-card"
          @click="goToApp('/user')"
        >
          <div class="card-content">
            <el-icon class="card-icon" :size="48"><UserFilled /></el-icon>
            <h3>用户管理</h3>
            <p>基于 React + Ant Design 的用户管理子应用</p>
            <div class="tech-tags">
              <el-tag size="small">React</el-tag>
              <el-tag size="small" type="success">Ant Design</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card
          shadow="hover"
          class="app-card gomoku-card"
          @click="goToApp('/gomoku')"
        >
          <div class="card-content">
            <el-icon class="card-icon" :size="48"><Grid /></el-icon>
            <h3>五子棋游戏</h3>
            <p>基于 React + Canvas 的双人五子棋游戏</p>
            <div class="tech-tags">
              <el-tag size="small">React</el-tag>
              <el-tag size="small" type="success">Canvas</el-tag>
              <el-tag size="small" type="warning">响应式</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" class="info-row">
      <el-col :span="12">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>系统架构</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="架构模式"
              >微前端 (qiankun)</el-descriptions-item
            >
            <el-descriptions-item label="构建工具"
              >Turbo + Vite</el-descriptions-item
            >
            <el-descriptions-item label="包管理"
              >pnpm workspace</el-descriptions-item
            >
            <el-descriptions-item label="主应用"
              >Vue 3 + Element Plus</el-descriptions-item
            >
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>子应用列表</span>
            </div>
          </template>
          <el-table :data="microApps" style="width: 100%">
            <el-table-column prop="name" label="应用名称" />
            <el-table-column prop="tech" label="技术栈" />
            <el-table-column prop="port" label="端口" width="80" />
            <el-table-column label="状态" width="80">
              <template #default>
                <el-tag type="success" size="small">运行中</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const microApps = [
  { name: "商城管理", tech: "Nuxt 3", port: "8001" },
  { name: "角色管理", tech: "Vue 3 + TDesign", port: "8002" },
  { name: "用户管理", tech: "React + Ant Design", port: "8003" },
  { name: "地图应用", tech: "Vue 3 + Leaflet", port: "8004" },
  { name: "五子棋", tech: "React + Canvas", port: "8005" },
];

const goToApp = (path: string) => {
  router.push(path);
};
</script>

<style lang="scss" scoped>
.home-page {
  .welcome-section {
    text-align: center;
    padding: 40px 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: #fff;
    margin-bottom: 24px;

    h1 {
      font-size: 32px;
      margin-bottom: 12px;
    }

    p {
      font-size: 16px;
      opacity: 0.9;
    }
  }

  .card-row {
    margin-bottom: 24px;
  }

  .app-card {
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-4px);
    }

    .card-content {
      text-align: center;
      padding: 20px;

      .card-icon {
        color: #1890ff;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 20px;
        margin-bottom: 8px;
        color: #333;
      }

      p {
        color: #666;
        margin-bottom: 16px;
      }

      .tech-tags {
        .el-tag {
          margin-right: 8px;
        }
      }
    }
  }

  .shop-card .card-icon {
    color: #f56c6c;
  }

  .role-card .card-icon {
    color: #67c23a;
  }

  .user-card .card-icon {
    color: #e6a23c;
  }

  .gomoku-card .card-icon {
    color: #9b59b6;
  }

  .info-row {
    .info-card {
      .card-header {
        font-weight: bold;
      }
    }
  }
}
</style>
