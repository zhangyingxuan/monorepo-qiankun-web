Role: 你是一位资深前端架构师，精通 WebAssembly、React 18、Vite 和微前端架构。

Task: 请实现一个高性能的 纯前端 OCR 文字与表格识别系统集成到当前 qiankun 应用中，命名为 ocr-app。

Technical Requirements:

架构设计:

使用 Worker Pool 模式：避免 OCR 识别（CPU 密集型）阻塞 React 主线程。

WASM 引擎: 集成 Tesseract.js 处理通用文字，并探讨/伪代码集成 Paddle.js (或 WebGPU 加速) 处理复杂表格结构识别。

微前端兼容: 确保静态资源（.wasm, .traineddata）通过相对路径或 Vite 插件（如 vite-plugin-static-copy）正确引用，适配 qiankun 环境。

核心功能逻辑:

PDF/图像处理: 使用 pdf.js 将 PDF 页面渲染为高清 Canvas 序列。

表格识别: 实现一种算法或调用模型，能够识别单元格坐标、rowspan 和 colspan。

Word 导出: 使用 docx 库将 OCR 结果还原为 Word 格式。难点：必须将识别出的表格数据动态构建为 Table 对象，而非纯文本。

复杂表格处理:

实现一个 TableParser 类，支持将识别出的 HTML 字符串或 JSON 结构映射为 docx.Table 的行（Row）和单元格（Cell）。

工程化:

使用 TypeScript 定义严格的接口（如 OCRResult, CellStructure, TableData）。

实现进度回调（Progress Callback）以展示识别百分比。

Deliverables:

OCRService.worker.ts: 处理 WASM 初始化与识别逻辑。

useOCRManager.ts: 封装 PDF 转图片、Worker 通信与状态。

DocxExporter.ts: 实现复杂表格还原为 .docx 的核心类。

TablePreview.tsx: 一个基于 CSS Grid 的响应式组件，用于在导出前预览识别出的表格结构。
