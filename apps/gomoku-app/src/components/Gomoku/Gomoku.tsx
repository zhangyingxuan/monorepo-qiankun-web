import React, { useRef, useEffect, useCallback, useState } from "react";
import { useGomoku } from "./useGomoku";
import type { BoardConfig, PieceType } from "./types";
import { PIECE } from "./types";
import styles from "./Gomoku.module.css";

/** 棋盘颜色配置 */
const BOARD_COLORS = {
  background: "#dcb35c",
  line: "#8b7355",
  starPoint: "#5c4a3a",
  lastMove: "#ff6b6b",
  winningLine: "rgba(255, 215, 0, 0.6)",
};

/**
 * 五子棋游戏主组件
 * 支持双人本地对战，响应式布局，qiankun 微前端兼容
 */
const Gomoku: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [boardConfig, setBoardConfig] = useState<BoardConfig | null>(null);

  const {
    board,
    gameState,
    placePiece,
    undoMove,
    restartGame,
    calculateBoardConfig,
    screenToBoard,
  } = useGomoku(15);

  /**
   * 绘制棋盘网格
   */
  const drawBoard = useCallback(
    (ctx: CanvasRenderingContext2D, config: BoardConfig) => {
      const { size, cellSize, padding, canvasSize } = config;

      // 清空画布
      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // 绘制背景
      ctx.fillStyle = BOARD_COLORS.background;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // 绘制网格线
      ctx.strokeStyle = BOARD_COLORS.line;
      ctx.lineWidth = 1;

      for (let i = 0; i < size; i++) {
        const pos = padding + i * cellSize;

        // 横线
        ctx.beginPath();
        ctx.moveTo(padding, pos);
        ctx.lineTo(canvasSize - padding, pos);
        ctx.stroke();

        // 竖线
        ctx.beginPath();
        ctx.moveTo(pos, padding);
        ctx.lineTo(pos, canvasSize - padding);
        ctx.stroke();
      }

      // 绘制星位点 (天元和四个角星)
      const starPoints = [
        [3, 3],
        [3, 11],
        [7, 7],
        [11, 3],
        [11, 11], // 标准15路棋盘星位
        [3, 7],
        [7, 3],
        [7, 11],
        [11, 7], // 边星
      ];

      ctx.fillStyle = BOARD_COLORS.starPoint;
      starPoints.forEach(([row, col]) => {
        if (row < size && col < size) {
          const x = padding + col * cellSize;
          const y = padding + row * cellSize;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(3, cellSize * 0.1), 0, Math.PI * 2);
          ctx.fill();
        }
      });
    },
    []
  );

  /**
   * 绘制棋子
   */
  const drawPiece = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      row: number,
      col: number,
      piece: PieceType,
      config: BoardConfig,
      isLastMove: boolean = false,
      isWinningPiece: boolean = false
    ) => {
      const { cellSize, padding, pieceRadius } = config;
      const x = padding + col * cellSize;
      const y = padding + row * cellSize;

      // 绘制阴影
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // 绘制棋子
      ctx.beginPath();
      ctx.arc(x, y, pieceRadius, 0, Math.PI * 2);

      if (piece === PIECE.BLACK) {
        // 黑棋渐变
        const gradient = ctx.createRadialGradient(
          x - pieceRadius * 0.3,
          y - pieceRadius * 0.3,
          0,
          x,
          y,
          pieceRadius
        );
        gradient.addColorStop(0, "#4a4a4a");
        gradient.addColorStop(1, "#1a1a1a");
        ctx.fillStyle = gradient;
      } else {
        // 白棋渐变
        const gradient = ctx.createRadialGradient(
          x - pieceRadius * 0.3,
          y - pieceRadius * 0.3,
          0,
          x,
          y,
          pieceRadius
        );
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(1, "#d0d0d0");
        ctx.fillStyle = gradient;
      }

      ctx.fill();
      ctx.restore();

      // 绘制最后落子标记
      if (isLastMove && !isWinningPiece) {
        ctx.strokeStyle = BOARD_COLORS.lastMove;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, pieceRadius * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 绘制获胜棋子高亮
      if (isWinningPiece) {
        ctx.strokeStyle = BOARD_COLORS.winningLine;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, pieceRadius + 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    },
    []
  );

  /**
   * 渲染整个棋盘
   */
  const renderBoard = useCallback(() => {
    const canvas = canvasRef.current;
    const config = boardConfig;

    if (!canvas || !config) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 绘制棋盘
    drawBoard(ctx, config);

    // 获取最后一步棋的位置
    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];

    // 获取获胜棋子位置集合
    const winningSet = new Set<string>();
    if (gameState.winningLine) {
      gameState.winningLine.forEach(({ row, col }) => {
        winningSet.add(`${row}-${col}`);
      });
    }

    // 绘制所有棋子
    for (let row = 0; row < config.size; row++) {
      for (let col = 0; col < config.size; col++) {
        const piece = board[row][col];
        if (piece !== PIECE.EMPTY) {
          const isLast =
            lastMove && lastMove.row === row && lastMove.col === col;
          const isWinning = winningSet.has(`${row}-${col}`);
          drawPiece(ctx, row, col, piece, config, isLast, isWinning);
        }
      }
    }
  }, [board, boardConfig, gameState, drawBoard, drawPiece]);

  /**
   * 处理点击/触摸事件
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const config = boardConfig;

      if (!canvas || !config || gameState.isGameOver) return;

      const rect = canvas.getBoundingClientRect();
      const point = screenToBoard(e.clientX, e.clientY, rect, config);

      if (point) {
        placePiece(point.row, point.col);
      }
    },
    [boardConfig, gameState.isGameOver, screenToBoard, placePiece]
  );

  /**
   * 响应式布局处理
   */
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const config = calculateBoardConfig(width);
        setBoardConfig(config);
      }
    };

    // 初始化尺寸
    updateSize();

    // 使用 ResizeObserver 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateBoardConfig]);

  /**
   * Canvas 尺寸更新后重新渲染
   */
  useEffect(() => {
    renderBoard();
  }, [renderBoard]);

  /**
   * 阻止移动端默认行为
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 禁用长按菜单
    const preventContextMenu = (e: Event) => e.preventDefault();
    canvas.addEventListener("contextmenu", preventContextMenu);

    return () => {
      canvas.removeEventListener("contextmenu", preventContextMenu);
    };
  }, []);

  /**
   * 获取当前玩家显示文本
   */
  const getStatusText = () => {
    if (gameState.isGameOver) {
      return gameState.winner === PIECE.BLACK ? "黑棋获胜!" : "白棋获胜!";
    }
    return gameState.currentPlayer === PIECE.BLACK ? "黑棋回合" : "白棋回合";
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>五子棋</h1>
        <div className={styles.status}>
          <span
            className={`${styles.currentPiece} ${
              gameState.currentPlayer === PIECE.BLACK
                ? styles.black
                : styles.white
            }`}
          />
          <span className={gameState.isGameOver ? styles.winner : ""}>
            {getStatusText()}
          </span>
        </div>
      </header>

      <div className={styles.canvasWrapper}>
        {boardConfig && (
          <canvas
            ref={canvasRef}
            className={`${styles.canvas} ${
              gameState.isGameOver ? styles.gameOver : ""
            }`}
            width={boardConfig.canvasSize}
            height={boardConfig.canvasSize}
            onPointerDown={handlePointerDown}
          />
        )}
      </div>

      <div className={styles.controls}>
        <button className={styles.button} onClick={restartGame} type="button">
          🔄 重新开始
        </button>
        <button
          className={`${styles.button} ${styles.secondary}`}
          onClick={undoMove}
          disabled={gameState.moveHistory.length === 0}
          type="button"
        >
          ↩️ 悔棋
        </button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={`${styles.statPiece} ${styles.black}`} />
          <span>黑棋: {gameState.blackCount}</span>
        </div>
        <div className={styles.statItem}>
          <span className={`${styles.statPiece} ${styles.white}`} />
          <span>白棋: {gameState.whiteCount}</span>
        </div>
      </div>
    </div>
  );
};

export default Gomoku;
