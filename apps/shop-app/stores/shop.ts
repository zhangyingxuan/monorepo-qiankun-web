import { defineStore } from 'pinia'

export interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: string
  status: string
  image: string
}

export const useShopStore = defineStore('shop', {
  state: () => ({
    products: [] as Product[],
    cart: [] as Array<{ product: Product; quantity: number }>,
    loading: false
  }),

  getters: {
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => {
        return total + item.product.price * item.quantity
      }, 0)
    },

    cartCount: (state) => {
      return state.cart.reduce((count, item) => count + item.quantity, 0)
    }
  },

  actions: {
    addToCart(product: Product, quantity = 1) {
      const existing = this.cart.find(item => item.product.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.cart.push({ product, quantity })
      }
    },

    removeFromCart(productId: number) {
      const index = this.cart.findIndex(item => item.product.id === productId)
      if (index > -1) {
        this.cart.splice(index, 1)
      }
    },

    clearCart() {
      this.cart = []
    }
  }
})
