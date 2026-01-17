import { defineStore } from 'pinia'

export interface Role {
  id: number
  name: string
  code: string
  description: string
  status: string
  permissions: string[]
}

export const useRoleStore = defineStore('role', {
  state: () => ({
    roles: [] as Role[],
    currentRole: null as Role | null,
    loading: false
  }),

  getters: {
    activeRoles: (state) => {
      return state.roles.filter(role => role.status === '启用')
    }
  },

  actions: {
    setRoles(roles: Role[]) {
      this.roles = roles
    },

    addRole(role: Role) {
      this.roles.push(role)
    },

    updateRole(id: number, data: Partial<Role>) {
      const index = this.roles.findIndex(r => r.id === id)
      if (index > -1) {
        this.roles[index] = { ...this.roles[index], ...data }
      }
    },

    deleteRole(id: number) {
      const index = this.roles.findIndex(r => r.id === id)
      if (index > -1) {
        this.roles.splice(index, 1)
      }
    }
  }
})
