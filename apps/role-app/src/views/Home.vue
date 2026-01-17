<template>
  <div class="role-home">
    <t-page-header>
      <template #title>
        <span>角色管理系统</span>
      </template>
      <template #action>
        <t-button theme="default" @click="goBack">返回主应用</t-button>
      </template>
    </t-page-header>

    <!-- 统计卡片 -->
    <t-row :gutter="16" class="stats-row">
      <t-col :span="3" v-for="stat in stats" :key="stat.title">
        <t-card :bordered="false" hover-shadow class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color }">
              <t-icon :name="stat.icon" size="24px" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-title">{{ stat.title }}</div>
            </div>
          </div>
        </t-card>
      </t-col>
    </t-row>

    <!-- 图表区域 -->
    <t-row :gutter="16" class="chart-row">
      <t-col :span="6">
        <t-card title="角色分布" :bordered="false" hover-shadow>
          <div ref="pieChartRef" class="chart"></div>
        </t-card>
      </t-col>
      <t-col :span="6">
        <t-card title="权限使用趋势" :bordered="false" hover-shadow>
          <div ref="lineChartRef" class="chart"></div>
        </t-card>
      </t-col>
    </t-row>

    <!-- 角色列表 -->
    <t-card title="角色列表" :bordered="false" hover-shadow class="table-card">
      <template #actions>
        <t-button theme="primary" @click="handleAdd">
          <template #icon><t-icon name="add" /></template>
          新增角色
        </t-button>
      </template>

      <t-table
        :data="roles"
        :columns="columns"
        row-key="id"
        hover
        stripe
        :pagination="pagination"
      >
        <template #status="{ row }">
          <t-tag
            :theme="row.status === '启用' ? 'success' : 'default'"
            variant="light"
          >
            {{ row.status }}
          </t-tag>
        </template>
        <template #op="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="primary" @click="handlePermission(row)">权限</t-link>
            <t-popconfirm
              content="确定删除该角色吗？"
              @confirm="handleDelete(row)"
            >
              <t-link theme="danger">删除</t-link>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import { MessagePlugin } from "tdesign-vue-next";

const pieChartRef = ref<HTMLElement | null>(null);
const lineChartRef = ref<HTMLElement | null>(null);
let pieChart: echarts.ECharts | null = null;
let lineChart: echarts.ECharts | null = null;

const stats = ref([
  { title: "角色总数", value: "24", icon: "user-circle", color: "#0052d9" },
  { title: "权限数量", value: "156", icon: "secured", color: "#2ba471" },
  { title: "活跃用户", value: "1,234", icon: "user", color: "#e37318" },
  { title: "操作日志", value: "8,562", icon: "file", color: "#d54941" },
]);

const columns = [
  { colKey: "id", title: "ID", width: 80 },
  { colKey: "name", title: "角色名称" },
  { colKey: "code", title: "角色编码" },
  { colKey: "description", title: "描述" },
  { colKey: "userCount", title: "用户数", width: 100 },
  { colKey: "status", title: "状态", width: 100, cell: "status" },
  { colKey: "createTime", title: "创建时间", width: 180 },
  { colKey: "op", title: "操作", width: 160, cell: "op" },
];

const roles = ref([
  {
    id: 1,
    name: "超级管理员",
    code: "super_admin",
    description: "拥有系统全部权限",
    userCount: 2,
    status: "启用",
    createTime: "2024-01-01 10:00:00",
  },
  {
    id: 2,
    name: "管理员",
    code: "admin",
    description: "拥有大部分管理权限",
    userCount: 5,
    status: "启用",
    createTime: "2024-01-02 10:00:00",
  },
  {
    id: 3,
    name: "普通用户",
    code: "user",
    description: "普通用户权限",
    userCount: 100,
    status: "启用",
    createTime: "2024-01-03 10:00:00",
  },
  {
    id: 4,
    name: "访客",
    code: "guest",
    description: "只有查看权限",
    userCount: 50,
    status: "启用",
    createTime: "2024-01-04 10:00:00",
  },
  {
    id: 5,
    name: "测试角色",
    code: "test",
    description: "测试用角色",
    userCount: 3,
    status: "禁用",
    createTime: "2024-01-05 10:00:00",
  },
]);

const pagination = {
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 5,
};

const goBack = () => {
  window.history.pushState(null, "", "/");
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const handleAdd = () => {
  MessagePlugin.success("新增角色功能");
};

const handleEdit = (row: any) => {
  MessagePlugin.info(`编辑角色: ${row.name}`);
};

const handlePermission = (row: any) => {
  MessagePlugin.info(`配置权限: ${row.name}`);
};

const handleDelete = (row: any) => {
  MessagePlugin.warning(`删除角色: ${row.name}`);
};

const initCharts = () => {
  // 饼图
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value);
    pieChart.setOption({
      tooltip: {
        trigger: "item",
      },
      legend: {
        bottom: "5%",
        left: "center",
      },
      series: [
        {
          name: "角色分布",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 2, name: "超级管理员" },
            { value: 5, name: "管理员" },
            { value: 100, name: "普通用户" },
            { value: 50, name: "访客" },
            { value: 3, name: "测试角色" },
          ],
        },
      ],
    });
  }

  // 折线图
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value);
    lineChart.setOption({
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["权限使用次数", "新增用户"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "权限使用次数",
          type: "line",
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "新增用户",
          type: "line",
          smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310],
        },
      ],
    });
  }
};

const handleResize = () => {
  pieChart?.resize();
  lineChart?.resize();
};

onMounted(() => {
  initCharts();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  pieChart?.dispose();
  lineChart?.dispose();
});
</script>

<style lang="scss" scoped>
.role-home {
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

  .chart-row {
    margin-bottom: 20px;

    .chart {
      height: 300px;
    }
  }

  .table-card {
    margin-bottom: 20px;
  }
}
</style>
