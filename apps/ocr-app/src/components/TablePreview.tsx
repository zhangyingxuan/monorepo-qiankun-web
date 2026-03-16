import React from "react";
import type { TableData } from "../types";

interface TablePreviewProps {
  tableData: TableData;
}

export const TablePreview: React.FC<TablePreviewProps> = ({ tableData }) => {
  if (!tableData || !tableData.rows || tableData.rows.length === 0) {
    return <div className="text-gray-500 italic">No table data available</div>;
  }

  // 计算最大列数
  const maxCols = Math.max(
    ...tableData.rows.map((row) =>
      row.reduce((sum, cell) => sum + (cell.colspan || 1), 0)
    )
  );

  return (
    <div className="overflow-x-auto w-full border border-gray-300 rounded-md shadow-sm">
      <div
        className="grid gap-px bg-gray-300"
        style={{
          gridTemplateColumns: `repeat(${maxCols}, minmax(100px, 1fr))`,
        }}
      >
        {tableData.rows.map((row, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <div
                key={`cell-${rowIndex}-${cellIndex}`}
                className="bg-white p-2 text-sm text-gray-800 flex items-center justify-center break-words"
                style={{
                  gridColumn: `span ${cell.colspan || 1}`,
                  gridRow: `span ${cell.rowspan || 1}`,
                }}
              >
                {cell.text}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
