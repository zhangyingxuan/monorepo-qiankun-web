<template>
  <div class="role-list">
    <t-card title="角色列表" :bordered="false">
      <template #actions>
        <t-space>
          <t-input v-model="searchKey" placeholder="搜索角色" clearable>
            <template #prefix-icon><t-icon name="search" /></template>
          </t-input>
          <t-button theme="primary">
            <template #icon><t-icon name="add" /></template>
            新增
          </t-button>
        </t-space>
      </template>

      <t-table
        :data="filteredRoles"
        :columns="columns"
        row-key="id"
        hover
        stripe
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
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { MessagePlugin } from "tdesign-vue-next";

const searchKey = ref("");

const columns = [
  { colKey: "id", title: "ID", width: 80 },
  { colKey: "name", title: "角色名称" },
  { colKey: "code", title: "角色编码" },
  { colKey: "description", title: "描述" },
  { colKey: "status", title: "状态", width: 100, cell: "status" },
  { colKey: "op", title: "操作", width: 120, cell: "op" },
];

const roles = ref([
  {
    id: 1,
    name: "超级管理员",
    code: "super_admin",
    description: "拥有系统全部权限",
    status: "启用",
  },
  {
    id: 2,
    name: "管理员",
    code: "admin",
    description: "拥有大部分管理权限",
    status: "启用",
  },
  {
    id: 3,
    name: "普通用户",
    code: "user",
    description: "普通用户权限",
    status: "启用",
  },
  {
    id: 4,
    name: "访客",
    code: "guest",
    description: "只有查看权限",
    status: "启用",
  },
  {
    id: 5,
    name: "测试角色",
    code: "test",
    description: "测试用角色",
    status: "禁用",
  },
]);

const filteredRoles = computed(() => {
  if (!searchKey.value) return roles.value;
  return roles.value.filter(
    (role) =>
      role.name.includes(searchKey.value) || role.code.includes(searchKey.value)
  );
});

const handleEdit = (row: any) => {
  MessagePlugin.info(`编辑: ${row.name}`);
};

const handleDelete = (row: any) => {
  MessagePlugin.warning(`删除: ${row.name}`);
};
</script>

<style lang="scss" scoped>
.role-list {
  padding: 0;
}
</style>
