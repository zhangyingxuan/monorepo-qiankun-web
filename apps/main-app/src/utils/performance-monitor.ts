/**
 * 微前端性能监控工具
 * 用于统计子应用切换各阶段耗时
 */

export interface PerformanceMetrics {
  appName: string
  // 路由变更时间
  routeChangeStart?: number
  routeChangeEnd?: number
  // 旧应用卸载阶段
  beforeUnmountStart?: number
  afterUnmountEnd?: number
  // 资源加载阶段
  beforeLoadStart?: number
  afterLoadEnd?: number
  // 挂载阶段
  beforeMountStart?: number
  afterMountEnd?: number
  // 子应用内部阶段
  bootstrapStart?: number
  bootstrapEnd?: number
  mountStart?: number
  mountEnd?: number
  renderStart?: number
  renderEnd?: number
  // 首次渲染完成
  firstPaintTime?: number
}

export interface PerformanceReport {
  appName: string
  timestamp: number
  metrics: {
    // 总耗时
    totalTime: number
    // 路由变更耗时
    routeChangeTime: number
    // 卸载阶段耗时
    unmountTime: number
    // 资源加载耗时
    loadTime: number
    // 挂载阶段耗时（主应用侧）
    mountTime: number
    // 子应用 bootstrap 耗时
    bootstrapTime: number
    // 子应用 mount 耗时
    subAppMountTime: number
    // 子应用渲染耗时
    renderTime: number
    // 是否首次加载
    isFirstLoad: boolean
  }
  rawMetrics: PerformanceMetrics
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map()
  private loadedApps: Set<string> = new Set()
  private reports: PerformanceReport[] = []
  private currentSwitchStartTime: number = 0
  private previousApp: string | null = null

  /**
   * 开始一次应用切换的计时
   */
  startSwitch(appName: string): void {
    this.currentSwitchStartTime = performance.now()
    this.metrics.set(appName, {
      appName,
      routeChangeStart: this.currentSwitchStartTime
    })
    console.log(`[性能监控] 开始切换到 ${appName}`)
  }

  /**
   * 记录路由变更完成
   */
  markRouteChangeEnd(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.routeChangeEnd = performance.now()
  }

  /**
   * 记录卸载前开始
   */
  markBeforeUnmount(appName: string): void {
    // 记录到前一个应用的 metrics 中
    if (this.previousApp) {
      const metric = this.getOrCreateMetric(this.previousApp)
      metric.beforeUnmountStart = performance.now()
    }
  }

  /**
   * 记录卸载后完成
   */
  markAfterUnmount(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.afterUnmountEnd = performance.now()
    this.previousApp = null
  }

  /**
   * 记录加载前开始
   */
  markBeforeLoad(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.beforeLoadStart = performance.now()
    // 如果没有设置路由变更开始时间，则使用加载开始时间
    if (!metric.routeChangeStart) {
      metric.routeChangeStart = metric.beforeLoadStart
    }
  }

  /**
   * 记录加载完成（通过 afterMount 推断，因为 qiankun 没有 afterLoad）
   */
  markAfterLoad(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.afterLoadEnd = performance.now()
  }

  /**
   * 记录挂载前开始
   */
  markBeforeMount(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.beforeMountStart = performance.now()
    // 将加载结束时间设置为挂载开始时间（近似）
    if (!metric.afterLoadEnd) {
      metric.afterLoadEnd = metric.beforeMountStart
    }
  }

  /**
   * 记录挂载后完成
   */
  markAfterMount(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.afterMountEnd = performance.now()

    // 生成报告
    this.generateReport(appName)

    // 记录当前应用为下次切换时的前一个应用
    this.previousApp = appName

    // 标记应用已加载过
    this.loadedApps.add(appName)
  }

  /**
   * 子应用内部：记录 bootstrap 开始
   */
  markBootstrapStart(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.bootstrapStart = performance.now()
  }

  /**
   * 子应用内部：记录 bootstrap 结束
   */
  markBootstrapEnd(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.bootstrapEnd = performance.now()
  }

  /**
   * 子应用内部：记录 mount 开始
   */
  markMountStart(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.mountStart = performance.now()
  }

  /**
   * 子应用内部：记录 mount 结束
   */
  markMountEnd(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.mountEnd = performance.now()
  }

  /**
   * 子应用内部：记录渲染开始
   */
  markRenderStart(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.renderStart = performance.now()
  }

  /**
   * 子应用内部：记录渲染结束
   */
  markRenderEnd(appName: string): void {
    const metric = this.getOrCreateMetric(appName)
    metric.renderEnd = performance.now()
    metric.firstPaintTime = performance.now()
  }

  /**
   * 生成性能报告
   */
  private generateReport(appName: string): void {
    const metric = this.metrics.get(appName)
    if (!metric) return

    const now = performance.now()
    const isFirstLoad = !this.loadedApps.has(appName)

    const report: PerformanceReport = {
      appName,
      timestamp: Date.now(),
      metrics: {
        totalTime: this.calculateDuration(metric.routeChangeStart, metric.afterMountEnd || now),
        routeChangeTime: this.calculateDuration(metric.routeChangeStart, metric.beforeLoadStart),
        unmountTime: this.calculateDuration(metric.beforeUnmountStart, metric.afterUnmountEnd),
        loadTime: this.calculateDuration(metric.beforeLoadStart, metric.afterLoadEnd),
        mountTime: this.calculateDuration(metric.beforeMountStart, metric.afterMountEnd),
        bootstrapTime: this.calculateDuration(metric.bootstrapStart, metric.bootstrapEnd),
        subAppMountTime: this.calculateDuration(metric.mountStart, metric.mountEnd),
        renderTime: this.calculateDuration(metric.renderStart, metric.renderEnd),
        isFirstLoad
      },
      rawMetrics: { ...metric }
    }

    this.reports.push(report)
    this.printReport(report)

    // 可以在这里将报告发送到监控平台
    this.sendToMonitoringPlatform(report)
  }

  /**
   * 计算持续时间
   */
  private calculateDuration(start?: number, end?: number): number {
    if (start === undefined || end === undefined) return 0
    return Math.round((end - start) * 100) / 100
  }

  /**
   * 获取或创建 metric
   */
  private getOrCreateMetric(appName: string): PerformanceMetrics {
    let metric = this.metrics.get(appName)
    if (!metric) {
      metric = { appName }
      this.metrics.set(appName, metric)
    }
    return metric
  }

  /**
   * 打印性能报告到控制台
   */
  private printReport(report: PerformanceReport): void {
    const { appName, metrics } = report
    const loadType = metrics.isFirstLoad ? '首次加载' : '再次加载'

    console.group(`%c[性能报告] ${appName} (${loadType})`, 'color: #1890ff; font-weight: bold;')

    console.log(`%c┌─────────────────────────────────────────────────────┐`, 'color: #52c41a')
    console.log(`%c│ 阶段                    │ 耗时(ms)                  │`, 'color: #52c41a')
    console.log(`%c├─────────────────────────────────────────────────────┤`, 'color: #52c41a')

    const stages = [
      { name: '路由变更', time: metrics.routeChangeTime },
      { name: '资源加载', time: metrics.loadTime },
      { name: '应用挂载(主应用)', time: metrics.mountTime },
      { name: 'Bootstrap(子应用)', time: metrics.bootstrapTime },
      { name: 'Mount(子应用)', time: metrics.subAppMountTime },
      { name: '渲染(子应用)', time: metrics.renderTime },
    ]

    stages.forEach(stage => {
      const timeStr = stage.time > 0 ? `${stage.time}ms` : '-'
      const color = stage.time > 500 ? '#ff4d4f' : stage.time > 200 ? '#faad14' : '#52c41a'
      console.log(`%c│ ${stage.name.padEnd(20)} │ ${timeStr.padStart(20)} │`, `color: ${color}`)
    })

    console.log(`%c├─────────────────────────────────────────────────────┤`, 'color: #52c41a')

    const totalColor = metrics.totalTime > 1000 ? '#ff4d4f' : metrics.totalTime > 500 ? '#faad14' : '#52c41a'
    console.log(`%c│ 总耗时                  │ ${(metrics.totalTime + 'ms').padStart(20)} │`, `color: ${totalColor}; font-weight: bold`)

    console.log(`%c└─────────────────────────────────────────────────────┘`, 'color: #52c41a')

    console.groupEnd()

    // 可视化时间线
    this.printTimeline(report)
  }

  /**
   * 打印时间线可视化
   */
  private printTimeline(report: PerformanceReport): void {
    const { metrics } = report
    const total = metrics.totalTime || 1
    const scale = 50 // 时间线总长度（字符数）

    console.log('%c时间线:', 'font-weight: bold')

    const timeline = [
      { name: '加载', time: metrics.loadTime, color: '#1890ff' },
      { name: '挂载', time: metrics.mountTime, color: '#52c41a' },
      { name: '渲染', time: metrics.renderTime, color: '#722ed1' },
    ]

    timeline.forEach(item => {
      if (item.time > 0) {
        const length = Math.max(1, Math.round((item.time / total) * scale))
        console.log(`${item.name}: %c${'█'.repeat(length)}%c ${item.time}ms`, `color: ${item.color}`, 'color: inherit')
      }
    })
  }

  /**
   * 发送报告到监控平台
   */
  private sendToMonitoringPlatform(report: PerformanceReport): void {
    // 这里可以接入实际的监控平台，如：
    // - 自建监控系统
    // - Sentry Performance
    // - 阿里云 ARMS
    // - 腾讯云 RUM

    // 示例：发送到自定义接口
    // fetch('/api/performance/report', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(report)
    // })

    // 存储到 localStorage 用于调试
    try {
      const key = 'micro-app-performance-reports'
      const existingReports = JSON.parse(localStorage.getItem(key) || '[]')
      existingReports.push(report)
      // 只保留最近 50 条记录
      if (existingReports.length > 50) {
        existingReports.splice(0, existingReports.length - 50)
      }
      localStorage.setItem(key, JSON.stringify(existingReports))
    } catch (e) {
      console.warn('Failed to save performance report to localStorage:', e)
    }
  }

  /**
   * 获取所有性能报告
   */
  getReports(): PerformanceReport[] {
    return [...this.reports]
  }

  /**
   * 获取性能统计摘要
   */
  getSummary(): Record<string, { avgTime: number; minTime: number; maxTime: number; count: number }> {
    const summary: Record<string, { times: number[]; avgTime: number; minTime: number; maxTime: number; count: number }> = {}

    this.reports.forEach(report => {
      if (!summary[report.appName]) {
        summary[report.appName] = { times: [], avgTime: 0, minTime: Infinity, maxTime: 0, count: 0 }
      }

      const s = summary[report.appName]
      s.times.push(report.metrics.totalTime)
      s.count++
      s.minTime = Math.min(s.minTime, report.metrics.totalTime)
      s.maxTime = Math.max(s.maxTime, report.metrics.totalTime)
    })

    Object.keys(summary).forEach(appName => {
      const s = summary[appName]
      s.avgTime = Math.round(s.times.reduce((a, b) => a + b, 0) / s.times.length)
    })

    return summary
  }

  /**
   * 清除所有记录
   */
  clear(): void {
    this.metrics.clear()
    this.reports = []
    this.loadedApps.clear()
    this.previousApp = null
    localStorage.removeItem('micro-app-performance-reports')
  }
}

// 创建全局单例
export const performanceMonitor = new PerformanceMonitor()

// 挂载到 window 对象，方便调试
if (typeof window !== 'undefined') {
  (window as any).__MICRO_APP_PERF__ = performanceMonitor
}

export default performanceMonitor
