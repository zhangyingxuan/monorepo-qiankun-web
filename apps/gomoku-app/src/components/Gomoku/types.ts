/**
 * 五子棋游戏类型定义
 */

/** 棋子类型 */
export type PieceType = 0 | 1 | 2; // 0: 空, 1: 黑棋, 2: 白棋

/** 棋子颜色常量 */
export const PIECE = {
  EMPTY: 0 as PieceType,
  BLACK: 1 as PieceType,
  WHITE: 2 as PieceType,
};

/** 落子记录 */
export interface MoveRecord {
  row: number;
  col: number;
  piece: PieceType;
  timestamp: number;
}

/** 游戏状态 */
export interface GameState {
  /** 当前棋手 (1: 黑棋, 2: 白棋) */
  currentPlayer: PieceType;
  /** 游戏是否结束 */
  isGameOver: boolean;
  /** 获胜者 (0: 平局/无, 1: 黑棋, 2: 白棋) */
  winner: PieceType;
  /** 获胜的五子位置 */
  winningLine: Array<{ row: number; col: number }> | null;
  /** 落子历史 */
  moveHistory: MoveRecord[];
  /** 黑棋落子数 */
  blackCount: number;
  /** 白棋落子数 */
  whiteCount: number;
}

/** 棋盘配置 */
export interface BoardConfig {
  /** 棋盘大小 (15x15 为标准) */
  size: number;
  /** 网格单元格大小 (像素) */
  cellSize: number;
  /** 棋盘边距 */
  padding: number;
  /** 棋子半径 */
  pieceRadius: number;
  /** Canvas 实际尺寸 */
  canvasSize: number;
}

/** 坐标点 */
export interface Point {
  row: number;
  col: number;
}

/** Canvas 渲染上下文 */
export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  config: BoardConfig;
  board: PieceType[][];
}
