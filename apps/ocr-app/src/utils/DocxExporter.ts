import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, BorderStyle } from 'docx';
import type { OCRResult, TableData } from '../types';

export class TableParser {
  static parse(tableData: TableData): Table {
    const rows = tableData.rows.map(row => {
      const cells = row.map(cell => {
        return new TableCell({
          children: [new Paragraph({ children: [new TextRun(cell.text)] })],
          columnSpan: cell.colspan > 1 ? cell.colspan : undefined,
          rowSpan: cell.rowspan > 1 ? cell.rowspan : undefined,
          width: {
            size: cell.width,
            type: WidthType.DXA,
          },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
          }
        });
      });
      return new TableRow({ children: cells });
    });

    return new Table({
      rows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    });
  }
}

export class DocxExporter {
  static async export(results: OCRResult[], filename: string = 'ocr-result.docx') {
    const children: any[] = [];

    results.forEach((result, index) => {
      // 添加文本
      if (result.text) {
        const paragraphs = result.text.split('\n').map(line => {
          return new Paragraph({
            children: [new TextRun(line)],
          });
        });
        children.push(...paragraphs);
      }

      // 添加表格
      if (result.tables && result.tables.length > 0) {
        result.tables.forEach(tableData => {
          const table = TableParser.parse(tableData);
          children.push(table);
          // 表格后添加空行
          children.push(new Paragraph({ text: "" }));
        });
      }

      // 分页符 (除了最后一页)
      if (index < results.length - 1) {
        children.push(new Paragraph({ pageBreakBefore: true }));
      }
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
