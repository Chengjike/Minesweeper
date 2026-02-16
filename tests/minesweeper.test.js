import { describe, it, expect, beforeEach } from 'vitest';
import { MinesweeperGame } from '../src/minesweeper.js';

describe('MinesweeperGame', () => {
  let game;

  beforeEach(() => {
    game = new MinesweeperGame(9, 9, 10);
    game.init();
  });

  describe('初始化', () => {
    it('应该正确初始化游戏板', () => {
      expect(game.board.length).toBe(9);
      expect(game.board[0].length).toBe(9);
      expect(game.revealed.length).toBe(9);
      expect(game.flagged.length).toBe(9);
    });

    it('应该放置正确数量的地雷', () => {
      expect(game.minePositions.length).toBe(10);
    });

    it('游戏初始状态应该未结束', () => {
      expect(game.gameOver).toBe(false);
    });
  });

  describe('地雷放置', () => {
    it('地雷位置应该在有效范围内', () => {
      game.minePositions.forEach(([row, col]) => {
        expect(row).toBeGreaterThanOrEqual(0);
        expect(row).toBeLessThan(9);
        expect(col).toBeGreaterThanOrEqual(0);
        expect(col).toBeLessThan(9);
      });
    });

    it('地雷不应该重复放置', () => {
      const positions = game.minePositions.map(([r, c]) => `${r},${c}`);
      const uniquePositions = new Set(positions);
      expect(uniquePositions.size).toBe(10);
    });
  });

  describe('数字计算', () => {
    it('非地雷格子应该显示周围地雷数', () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (game.board[row][col] !== -1) {
            expect(game.board[row][col]).toBeGreaterThanOrEqual(0);
            expect(game.board[row][col]).toBeLessThanOrEqual(8);
          }
        }
      }
    });
  });

  describe('揭示格子', () => {
    it('揭示安全格子应该返回游戏未结束', () => {
      // 找到一个非地雷格子
      let safeRow, safeCol;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (game.board[row][col] !== -1) {
            safeRow = row;
            safeCol = col;
            break;
          }
        }
        if (safeRow !== undefined) break;
      }

      const result = game.revealCell(safeRow, safeCol);
      expect(game.revealed[safeRow][safeCol]).toBe(true);
      if (result) {
        expect(result.gameOver).toBeDefined();
      }
    });

    it('揭示地雷应该结束游戏', () => {
      const [mineRow, mineCol] = game.minePositions[0];
      const result = game.revealCell(mineRow, mineCol);

      expect(result.gameOver).toBe(true);
      expect(result.win).toBe(false);
      expect(game.gameOver).toBe(true);
    });

    it('不应该揭示已标记的格子', () => {
      game.toggleFlag(0, 0);
      const result = game.revealCell(0, 0);

      expect(result).toBe(false);
      expect(game.revealed[0][0]).toBe(false);
    });
  });

  describe('旗帜功能', () => {
    it('应该能够切换旗帜', () => {
      expect(game.flagged[0][0]).toBe(false);
      game.toggleFlag(0, 0);
      expect(game.flagged[0][0]).toBe(true);
      game.toggleFlag(0, 0);
      expect(game.flagged[0][0]).toBe(false);
    });

    it('不应该在已揭示的格子上放置旗帜', () => {
      game.revealed[0][0] = true;
      const result = game.toggleFlag(0, 0);

      expect(result).toBe(false);
      expect(game.flagged[0][0]).toBe(false);
    });
  });

  describe('剩余地雷数', () => {
    it('初始剩余地雷数应该等于总地雷数', () => {
      expect(game.getRemainingMines()).toBe(10);
    });

    it('放置旗帜后剩余地雷数应该减少', () => {
      game.toggleFlag(0, 0);
      expect(game.getRemainingMines()).toBe(9);

      game.toggleFlag(1, 1);
      expect(game.getRemainingMines()).toBe(8);
    });

    it('移除旗帜后剩余地雷数应该增加', () => {
      game.toggleFlag(0, 0);
      game.toggleFlag(0, 0);
      expect(game.getRemainingMines()).toBe(10);
    });
  });

  describe('获胜条件', () => {
    it('揭示所有非地雷格子应该获胜', () => {
      // 揭示所有非地雷格子
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (game.board[row][col] !== -1) {
            game.revealed[row][col] = true;
          }
        }
      }

      expect(game.checkWin()).toBe(true);
    });

    it('未揭示所有格子不应该获胜', () => {
      expect(game.checkWin()).toBe(false);
    });

    it('通过揭示格子触发获胜应该返回获胜状态', () => {
      // 手动揭示除了一个格子外的所有非地雷格子
      let lastSafeRow, lastSafeCol;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (game.board[row][col] !== -1) {
            if (!lastSafeRow && lastSafeRow !== 0) {
              lastSafeRow = row;
              lastSafeCol = col;
            } else {
              game.revealed[row][col] = true;
            }
          }
        }
      }

      // 揭示最后一个格子应该触发获胜
      const result = game.revealCell(lastSafeRow, lastSafeCol);
      expect(result.gameOver).toBe(true);
      expect(result.win).toBe(true);
      expect(game.gameOver).toBe(true);
    });
  });

  describe('递归揭示相邻格子', () => {
    it('揭示值为0的格子应该自动揭示相邻格子', () => {
      // 创建一个小游戏板，更容易找到0值格子
      const smallGame = new MinesweeperGame(5, 5, 3);
      smallGame.init();

      // 找到一个值为0的格子
      let zeroRow, zeroCol;
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          if (smallGame.board[row][col] === 0) {
            zeroRow = row;
            zeroCol = col;
            break;
          }
        }
        if (zeroRow !== undefined) break;
      }

      // 如果找到了0值格子，测试递归揭示
      if (zeroRow !== undefined) {
        smallGame.revealCell(zeroRow, zeroCol);

        // 检查至少有一些相邻格子被揭示
        let revealedCount = 0;
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 5; col++) {
            if (smallGame.revealed[row][col]) revealedCount++;
          }
        }

        expect(revealedCount).toBeGreaterThan(1);
      } else {
        // 如果没有找到0值格子，至少验证游戏初始化正确
        expect(smallGame.board.length).toBe(5);
      }
    });

    it('递归揭示不应该揭示已标记的格子', () => {
      const smallGame = new MinesweeperGame(5, 5, 2);
      smallGame.init();

      // 找到一个值为0的格子
      let zeroRow, zeroCol;
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
          if (smallGame.board[row][col] === 0) {
            zeroRow = row;
            zeroCol = col;
            break;
          }
        }
        if (zeroRow !== undefined) break;
      }

      if (zeroRow !== undefined) {
        // 在相邻位置放置旗帜
        const adjRow = Math.min(zeroRow + 1, 4);
        const adjCol = Math.min(zeroCol + 1, 4);
        smallGame.toggleFlag(adjRow, adjCol);

        // 揭示0值格子
        smallGame.revealCell(zeroRow, zeroCol);

        // 已标记的格子不应该被揭示
        expect(smallGame.revealed[adjRow][adjCol]).toBe(false);
      } else {
        expect(smallGame.board.length).toBe(5);
      }
    });
  });
});
