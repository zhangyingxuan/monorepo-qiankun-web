<template>
  <div class="shop-home">
    <el-page-header @back="goBack" title="返回主应用">
      <template #content>
        <span class="text-large font-600">商城管理系统</span>
      </template>
    </el-page-header>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="stat in stats" :key="stat.title">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <el-icon :size="24"><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 商品列表 -->
    <el-card class="product-card">
      <template #header>
        <div class="card-header">
          <span>商品列表</span>
          <el-button type="primary" @click="addProduct">
            <el-icon><Plus /></el-icon>
            添加商品
          </el-button>
        </div>
      </template>

      <el-table :data="products" style="width: 100%" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="image" label="图片" width="100">
          <template #default="{ row }">
            <el-image
              style="width: 60px; height: 60px"
              :src="row.image"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '上架' ? 'success' : 'info'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" link @click="editProduct(row)"
              >编辑</el-button
            >
            <el-button type="danger" link @click="deleteProduct(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        layout="total, prev, pager, next"
        :total="50"
        :page-size="10"
      />
    </el-card>

    <!-- 订单统计 -->
    <el-row :gutter="20" class="order-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最近订单</span>
          </template>
          <el-table :data="orders" size="small">
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="customer" label="客户" />
            <el-table-column prop="amount" label="金额">
              <template #default="{ row }"> ¥{{ row.amount }} </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getOrderStatusType(row.status)" size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>热销商品</span>
          </template>
          <div class="hot-products">
            <div
              class="hot-item"
              v-for="(item, index) in hotProducts"
              :key="item.name"
            >
              <span class="rank" :class="{ top: index < 3 }">{{
                index + 1
              }}</span>
              <span class="name">{{ item.name }}</span>
              <span class="sales">{{ item.sales }}件</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  ShoppingCart,
  Goods,
  ShoppingBag,
  Money,
  Plus,
} from "@element-plus/icons-vue";

const stats = ref([
  { title: "商品总数", value: "1,234", icon: "Goods", color: "#409EFF" },
  { title: "订单数量", value: "856", icon: "ShoppingCart", color: "#67C23A" },
  { title: "销售额", value: "¥128,560", icon: "Money", color: "#E6A23C" },
  { title: "用户数", value: "3,542", icon: "ShoppingBag", color: "#F56C6C" },
]);

const products = ref([
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 9999,
    stock: 100,
    category: "手机",
    status: "上架",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    name: "MacBook Pro 14",
    price: 14999,
    stock: 50,
    category: "电脑",
    status: "上架",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    price: 1899,
    stock: 200,
    category: "配件",
    status: "上架",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    name: "iPad Pro 12.9",
    price: 8999,
    stock: 80,
    category: "平板",
    status: "下架",
    image: "https://via.placeholder.com/100",
  },
  {
    id: 5,
    name: "Apple Watch Ultra",
    price: 6299,
    stock: 60,
    category: "手表",
    status: "上架",
    image: "https://via.placeholder.com/100",
  },
]);

const orders = ref([
  { orderNo: "ORD202401001", customer: "张三", amount: 9999, status: "已完成" },
  {
    orderNo: "ORD202401002",
    customer: "李四",
    amount: 14999,
    status: "待发货",
  },
  { orderNo: "ORD202401003", customer: "王五", amount: 1899, status: "已发货" },
  { orderNo: "ORD202401004", customer: "赵六", amount: 8999, status: "待付款" },
]);

const hotProducts = ref([
  { name: "iPhone 15 Pro Max", sales: 1234 },
  { name: "MacBook Pro 14", sales: 856 },
  { name: "AirPods Pro 2", sales: 654 },
  { name: "iPad Pro 12.9", sales: 432 },
  { name: "Apple Watch Ultra", sales: 321 },
]);

const goBack = () => {
  window.history.pushState(null, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const addProduct = () => {
  ElMessage.success("添加商品功能");
};

const editProduct = (row: any) => {
  ElMessage.info(`编辑商品: ${row.name}`);
};

const deleteProduct = (row: any) => {
  ElMessage.warning(`删除商品: ${row.name}`);
};

const getOrderStatusType = (status: string) => {
  const map: Record<string, string> = {
    已完成: "success",
    待发货: "warning",
    已发货: "primary",
    待付款: "danger",
  };
  return map[status] || "info";
};
</script>

<style lang="scss" scoped>
.shop-home {
  .stats-row {
    margin: 20px 0;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          margin-right: 16px;
        }

        .stat-info {
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #333;
          }

          .stat-title {
            font-size: 14px;
            color: #999;
          }
        }
      }
    }
  }

  .product-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .price {
      color: #f56c6c;
      font-weight: bold;
    }

    .pagination {
      margin-top: 20px;
      justify-content: flex-end;
    }
  }

  .order-row {
    .hot-products {
      .hot-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .rank {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          margin-right: 12px;

          &.top {
            background: linear-gradient(135deg, #ff6b6b, #ff8e53);
            color: #fff;
          }
        }

        .name {
          flex: 1;
        }

        .sales {
          color: #999;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
