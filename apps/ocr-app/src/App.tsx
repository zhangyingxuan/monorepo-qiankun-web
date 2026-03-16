import React, { useState } from "react";
import { useOCRManager } from "./hooks/useOCRManager";
import { DocxExporter } from "./utils/DocxExporter";
import { TablePreview } from "./components/TablePreview";
import { FileUp, Download, Loader2, FileText } from "lucide-react";

const App: React.FC = () => {
  const { isProcessing, progress, results, processPDF, processImage } =
    useOCRManager();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartOCR = async () => {
    if (!selectedFile) return;

    try {
      if (selectedFile.type === "application/pdf") {
        await processPDF(selectedFile);
      } else {
        await processImage(URL.createObjectURL(selectedFile));
      }
    } catch (error) {
      console.error("OCR failed:", error);
      alert("OCR 识别失败，请检查控制台日志");
    }
  };

  const handleExport = async () => {
    if (results.length === 0) return;
    await DocxExporter.export(
      results,
      `OCR_Result_${new Date().getTime()}.docx`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            高性能 OCR 文字与表格识别系统
          </h1>
          <p className="text-gray-600">
            支持 PDF/图片识别，自动还原表格结构并导出 Word
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 transition-colors hover:border-blue-400">
            <FileUp className="w-12 h-12 text-gray-400 mb-4" />
            <label className="cursor-pointer">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                选择文件 (PDF/Image)
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
            </label>
            {selectedFile && (
              <p className="mt-4 text-sm text-gray-600 font-medium">
                已选择: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleStartOCR}
              disabled={!selectedFile || isProcessing}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              开始识别
            </button>

            <button
              onClick={handleExport}
              disabled={results.length === 0 || isProcessing}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              导出 Word
            </button>
          </div>

          {isProcessing && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{progress.status}</span>
                <span>{Math.round(progress.progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progress * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-800">
              识别结果预览
            </h2>
            {results.map((result, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium mb-4 border-b pb-2">
                  第 {idx + 1} 页
                </h3>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">
                    文本内容
                  </h4>
                  <pre className="whitespace-pre-wrap text-gray-800 bg-gray-50 p-4 rounded-md text-sm">
                    {result.text || "未识别到文本"}
                  </pre>
                </div>

                {result.tables && result.tables.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">
                      表格结构
                    </h4>
                    {result.tables.map((table, tIdx) => (
                      <TablePreview key={tIdx} tableData={table} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
