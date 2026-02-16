// 扫雷游戏核心逻辑类
export class MinesweeperGame {
  constructor(rows, cols, mines) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.board = [];
    this.revealed = [];
    this.flagged = [];
    this.gameOver = false;
    this.minePositions = [];
  }

  // 初始化游戏
  init() {
    this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    this.revealed = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.flagged = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.gameOver = false;
    this.minePositions = [];
    this.placeMines();
    this.calculateNumbers();
  }

  // 放置地雷
  placeMines() {
    let placed = 0;
    while (placed < this.mines) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (this.board[row][col] !== -1) {
        this.board[row][col] = -1;
        this.minePositions.push([row, col]);
        placed++;
      }
    }
  }

  // 计算每个格子周围的地雷数
  calculateNumbers() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.board[row][col] === -1) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.board[nr][nc] === -1) {
              count++;
            }
          }
        }
        this.board[row][col] = count;
      }
    }
  }

  // 点击格子
  revealCell(row, col) {
    if (this.gameOver || this.revealed[row][col] || this.flagged[row][col]) {
      return false;
    }

    this.revealed[row][col] = true;

    if (this.board[row][col] === -1) {
      this.gameOver = true;
      return { gameOver: true, win: false };
    }

    if (this.board[row][col] === 0) {
      this.revealAdjacent(row, col);
    }

    if (this.checkWin()) {
      this.gameOver = true;
      return { gameOver: true, win: true };
    }

    return { gameOver: false };
  }

  // 递归揭示相邻格子
  revealAdjacent(row, col) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols &&
            !this.revealed[nr][nc] && !this.flagged[nr][nc]) {
          this.revealed[nr][nc] = true;
          if (this.board[nr][nc] === 0) {
            this.revealAdjacent(nr, nc);
          }
        }
      }
    }
  }

  // 切换旗帜
  toggleFlag(row, col) {
    if (this.gameOver || this.revealed[row][col]) {
      return false;
    }
    this.flagged[row][col] = !this.flagged[row][col];
    return true;
  }

  // 检查是否获胜
  checkWin() {
    let revealedCount = 0;
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.revealed[row][col]) revealedCount++;
      }
    }
    return revealedCount === this.rows * this.cols - this.mines;
  }

  // 获取剩余地雷数
  getRemainingMines() {
    const flagCount = this.flagged.flat().filter(f => f).length;
    return this.mines - flagCount;
  }
}
