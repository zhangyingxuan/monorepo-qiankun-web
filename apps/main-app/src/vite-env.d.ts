/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// qiankun 类型声明
declare module 'qiankun' {
  export interface RegistrableApp {
    name: string
    entry: string
    container: string | HTMLElement
    activeRule: string | ((location: Location) => boolean) | Array<string | ((location: Location) => boolean)>
    props?: Record<string, unknown>
  }

  export interface LifeCycles {
    beforeLoad?: (app: RegistrableApp) => Promise<void>
    beforeMount?: (app: RegistrableApp) => Promise<void>
    afterMount?: (app: RegistrableApp) => Promise<void>
    beforeUnmount?: (app: RegistrableApp) => Promise<void>
    afterUnmount?: (app: RegistrableApp) => Promise<void>
  }

  export interface StartOpts {
    prefetch?: boolean | 'all' | string[]
    sandbox?: boolean | { strictStyleIsolation?: boolean; experimentalStyleIsolation?: boolean }
    singular?: boolean
    fetch?: typeof window.fetch
  }

  export function registerMicroApps(apps: RegistrableApp[], lifeCycles?: LifeCycles): void
  export function start(opts?: StartOpts): void
}
