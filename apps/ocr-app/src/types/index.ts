export interface CellStructure {
  text: string;
  rowspan: number;
  colspan: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TableData {
  rows: CellStructure[][];
}

export interface OCRResult {
  text: string;
  tables: TableData[];
  confidence: number;
}

export interface OCRProgress {
  status: string;
  progress: number;
}
