<template>
  <div class="permission-page">
    <t-card title="权限管理" :bordered="false">
      <t-tree
        :data="permissionTree"
        :checkable="true"
        :expand-all="true"
        hover
      />
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const permissionTree = ref([
  {
    value: "system",
    label: "系统管理",
    children: [
      {
        value: "user",
        label: "用户管理",
        children: [
          { value: "user:add", label: "新增用户" },
          { value: "user:edit", label: "编辑用户" },
          { value: "user:delete", label: "删除用户" },
          { value: "user:view", label: "查看用户" },
        ],
      },
      {
        value: "role",
        label: "角色管理",
        children: [
          { value: "role:add", label: "新增角色" },
          { value: "role:edit", label: "编辑角色" },
          { value: "role:delete", label: "删除角色" },
          { value: "role:view", label: "查看角色" },
        ],
      },
    ],
  },
  {
    value: "business",
    label: "业务管理",
    children: [
      {
        value: "order",
        label: "订单管理",
        children: [
          { value: "order:add", label: "创建订单" },
          { value: "order:edit", label: "编辑订单" },
          { value: "order:delete", label: "删除订单" },
        ],
      },
      {
        value: "product",
        label: "商品管理",
        children: [
          { value: "product:add", label: "新增商品" },
          { value: "product:edit", label: "编辑商品" },
          { value: "product:delete", label: "删除商品" },
        ],
      },
    ],
  },
]);
</script>

<style lang="scss" scoped>
.permission-page {
  padding: 0;
}
</style>
