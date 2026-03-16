import { useState, useCallback, useRef } from 'react';
import type { GameState, PieceType, MoveRecord, BoardConfig, Point } from './types';
import { PIECE } from './types';

/** 默认棋盘配置 */
const DEFAULT_BOARD_SIZE = 15;

/** 方向向量: 横、竖、左斜、右斜 */
const DIRECTIONS = [
  { dr: 0, dc: 1 },  // 横向
  { dr: 1, dc: 0 },  // 纵向
  { dr: 1, dc: 1 },  // 右斜
  { dr: 1, dc: -1 }, // 左斜
];

/**
 * 五子棋核心逻辑 Hook
 * @param boardSize 棋盘大小
 */
export const useGomoku = (boardSize: number = DEFAULT_BOARD_SIZE) => {
  // 初始化空棋盘
  const createEmptyBoard = useCallback((): PieceType[][] => {
    return Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => PIECE.EMPTY)
    );
  }, [boardSize]);

  // 棋盘状态
  const [board, setBoard] = useState<PieceType[][]>(createEmptyBoard);

  // 游戏状态
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: PIECE.BLACK,
    isGameOver: false,
    winner: PIECE.EMPTY,
    winningLine: null,
    moveHistory: [],
    blackCount: 0,
    whiteCount: 0,
  });

  // 用于悔棋的棋盘历史快照
  const boardHistoryRef = useRef<PieceType[][][]>([createEmptyBoard()]);

  /**
   * 检测某个方向上的连续棋子数
   */
  const countInDirection = useCallback((
    board: PieceType[][],
    row: number,
    col: number,
    dr: number,
    dc: number,
    piece: PieceType
  ): Array<{ row: number; col: number }> => {
    const positions: Array<{ row: number; col: number }> = [];
    let r = row + dr;
    let c = col + dc;

    while (
      r >= 0 && r < boardSize &&
      c >= 0 && c < boardSize &&
      board[r][c] === piece
    ) {
      positions.push({ row: r, col: c });
      r += dr;
      c += dc;
    }

    return positions;
  }, [boardSize]);

  /**
   * 高效五子连珠检测算法
   * 检查横、竖、左斜、右斜四个方向
   */
  const checkWin = useCallback((
    board: PieceType[][],
    row: number,
    col: number,
    piece: PieceType
  ): Array<{ row: number; col: number }> | null => {
    for (const { dr, dc } of DIRECTIONS) {
      // 当前位置
      const line: Array<{ row: number; col: number }> = [{ row, col }];

      // 正方向计数
      line.push(...countInDirection(board, row, col, dr, dc, piece));
      // 反方向计数
      line.push(...countInDirection(board, row, col, -dr, -dc, piece));

      if (line.length >= 5) {
        return line.slice(0, 5); // 返回前5个位置
      }
    }

    return null;
  }, [countInDirection]);

  /**
   * 落子处理
   */
  const placePiece = useCallback((row: number, col: number): boolean => {
    // 卫语句: 检查是否可以落子
    if (gameState.isGameOver) return false;
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) return false;
    if (board[row][col] !== PIECE.EMPTY) return false;

    const newBoard = board.map(r => [...r]);
    const currentPiece = gameState.currentPlayer;

    // 落子
    newBoard[row][col] = currentPiece;

    // 检测胜负
    const winningLine = checkWin(newBoard, row, col, currentPiece);
    const isGameOver = winningLine !== null;

    // 记录历史
    const moveRecord: MoveRecord = {
      row,
      col,
      piece: currentPiece,
      timestamp: Date.now(),
    };

    boardHistoryRef.current.push(newBoard);

    // 更新状态
    setBoard(newBoard);
    setGameState(prev => ({
      currentPlayer: isGameOver ? prev.currentPlayer : (prev.currentPlayer === PIECE.BLACK ? PIECE.WHITE : PIECE.BLACK),
      isGameOver,
      winner: isGameOver ? currentPiece : PIECE.EMPTY,
      winningLine,
      moveHistory: [...prev.moveHistory, moveRecord],
      blackCount: prev.blackCount + (currentPiece === PIECE.BLACK ? 1 : 0),
      whiteCount: prev.whiteCount + (currentPiece === PIECE.WHITE ? 1 : 0),
    }));

    return true;
  }, [board, boardSize, gameState, checkWin]);

  /**
   * 悔棋
   */
  const undoMove = useCallback((): boolean => {
    // 卫语句: 检查是否可以悔棋
    if (gameState.moveHistory.length === 0) return false;
    if (boardHistoryRef.current.length <= 1) return false;

    // 移除最后一盘棋
    boardHistoryRef.current.pop();
    const previousBoard = boardHistoryRef.current[boardHistoryRef.current.length - 1];

    // 获取最后一步棋
    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];

    setBoard(previousBoard.map(r => [...r]));
    setGameState(prev => ({
      currentPlayer: lastMove.piece,
      isGameOver: false,
      winner: PIECE.EMPTY,
      winningLine: null,
      moveHistory: prev.moveHistory.slice(0, -1),
      blackCount: prev.blackCount - (lastMove.piece === PIECE.BLACK ? 1 : 0),
      whiteCount: prev.whiteCount - (lastMove.piece === PIECE.WHITE ? 1 : 0),
    }));

    return true;
  }, [gameState]);

  /**
   * 重新开始游戏
   */
  const restartGame = useCallback(() => {
    const emptyBoard = createEmptyBoard();
    boardHistoryRef.current = [emptyBoard];
    setBoard(emptyBoard);
    setGameState({
      currentPlayer: PIECE.BLACK,
      isGameOver: false,
      winner: PIECE.EMPTY,
      winningLine: null,
      moveHistory: [],
      blackCount: 0,
      whiteCount: 0,
    });
  }, [createEmptyBoard]);

  /**
   * 计算棋盘配置 (响应式)
   */
  const calculateBoardConfig = useCallback((containerWidth: number): BoardConfig => {
    // 移动端适配
    const isMobile = containerWidth < 768;
    // 移动端最大化棋盘，减去容器的 padding (4px * 2 = 8px)
    const maxCanvasSize = isMobile ? containerWidth - 8 : Math.min(containerWidth - 48, 600);

    // 计算单元格大小，减小边缘留白以最大化棋盘网格
    // 设边缘留白为半个单元格大小，则总宽度为 (boardSize - 1) * cellSize + 2 * (cellSize / 2) = boardSize * cellSize
    const cellSize = Math.floor(maxCanvasSize / boardSize);
    const padding = cellSize / 2;
    const canvasSize = cellSize * boardSize;
    const pieceRadius = Math.floor(cellSize * 0.42);

    return {
      size: boardSize,
      cellSize,
      padding,
      pieceRadius,
      canvasSize,
    };
  }, [boardSize]);

  /**
   * 屏幕坐标转棋盘坐标
   */
  const screenToBoard = useCallback(((
    screenX: number,
    screenY: number,
    canvasRect: DOMRect,
    config: BoardConfig
  ): Point | null => {
    // 计算相对于 canvas 的坐标 (考虑 qiankun 主应用布局偏移)
    const x = screenX - canvasRect.left;
    const y = screenY - canvasRect.top;

    // 转换为棋盘坐标
    const col = Math.round((x - config.padding) / config.cellSize);
    const row = Math.round((y - config.padding) / config.cellSize);

    // 边界检查
    if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
      return null;
    }

    return { row, col };
  }), [boardSize]);

  return {
    board,
    gameState,
    placePiece,
    undoMove,
    restartGame,
    calculateBoardConfig,
    screenToBoard,
  };
};

export default useGomoku;
