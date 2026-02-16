// 科学计算器核心逻辑类
export class Calculator {
  constructor() {
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.shouldResetScreen = false;
    this.memory = 0;
  }

  // 清除所有
  clear() {
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.shouldResetScreen = false;
  }

  // 清除当前输入
  clearEntry() {
    this.currentValue = '0';
    this.shouldResetScreen = false;
  }

  // 删除最后一位
  backspace() {
    if (this.currentValue.length > 1) {
      this.currentValue = this.currentValue.slice(0, -1);
    } else {
      this.currentValue = '0';
    }
  }

  // 输入数字
  inputNumber(num) {
    if (this.shouldResetScreen) {
      this.currentValue = num;
      this.shouldResetScreen = false;
    } else {
      this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
    }
  }

  // 输入小数点
  inputDecimal() {
    if (this.shouldResetScreen) {
      this.currentValue = '0.';
      this.shouldResetScreen = false;
    } else if (!this.currentValue.includes('.')) {
      this.currentValue += '.';
    }
  }

  // 切换正负号
  toggleSign() {
    this.currentValue = String(parseFloat(this.currentValue) * -1);
  }

  // 基本运算
  setOperation(op) {
    if (this.operation !== null) {
      this.calculate();
    }
    this.previousValue = this.currentValue;
    this.operation = op;
    this.shouldResetScreen = true;
  }

  // 计算结果
  calculate() {
    if (this.operation === null || this.previousValue === '') {
      return;
    }

    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
    let result;

    switch (this.operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        if (current === 0) {
          this.currentValue = 'Error';
          this.operation = null;
          this.previousValue = '';
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    this.currentValue = String(result);
    this.operation = null;
    this.previousValue = '';
    this.shouldResetScreen = true;
  }

  // 百分比
  percentage() {
    this.currentValue = String(parseFloat(this.currentValue) / 100);
  }

  // 平方
  square() {
    const num = parseFloat(this.currentValue);
    this.currentValue = String(num * num);
    this.shouldResetScreen = true;
  }

  // 平方根
  squareRoot() {
    const num = parseFloat(this.currentValue);
    if (num < 0) {
      this.currentValue = 'Error';
    } else {
      this.currentValue = String(Math.sqrt(num));
    }
    this.shouldResetScreen = true;
  }

  // 倒数
  reciprocal() {
    const num = parseFloat(this.currentValue);
    if (num === 0) {
      this.currentValue = 'Error';
    } else {
      this.currentValue = String(1 / num);
    }
    this.shouldResetScreen = true;
  }

  // 三角函数 - sin
  sin() {
    const num = parseFloat(this.currentValue);
    this.currentValue = String(Math.sin(num * Math.PI / 180));
    this.shouldResetScreen = true;
  }

  // 三角函数 - cos
  cos() {
    const num = parseFloat(this.currentValue);
    this.currentValue = String(Math.cos(num * Math.PI / 180));
    this.shouldResetScreen = true;
  }

  // 三角函数 - tan
  tan() {
    const num = parseFloat(this.currentValue);
    this.currentValue = String(Math.tan(num * Math.PI / 180));
    this.shouldResetScreen = true;
  }

  // 对数
  log() {
    const num = parseFloat(this.currentValue);
    if (num <= 0) {
      this.currentValue = 'Error';
    } else {
      this.currentValue = String(Math.log10(num));
    }
    this.shouldResetScreen = true;
  }

  // 自然对数
  ln() {
    const num = parseFloat(this.currentValue);
    if (num <= 0) {
      this.currentValue = 'Error';
    } else {
      this.currentValue = String(Math.log(num));
    }
    this.shouldResetScreen = true;
  }

  // 指数
  exp() {
    const num = parseFloat(this.currentValue);
    this.currentValue = String(Math.exp(num));
    this.shouldResetScreen = true;
  }

  // 幂运算
  power(exponent) {
    const num = parseFloat(this.currentValue);
    this.currentValue = String(Math.pow(num, exponent));
    this.shouldResetScreen = true;
  }

  // 阶乘
  factorial() {
    const num = parseInt(this.currentValue);
    if (num < 0 || !Number.isInteger(num)) {
      this.currentValue = 'Error';
    } else if (num > 170) {
      this.currentValue = 'Infinity';
    } else {
      let result = 1;
      for (let i = 2; i <= num; i++) {
        result *= i;
      }
      this.currentValue = String(result);
    }
    this.shouldResetScreen = true;
  }

  // 内存操作 - 存储
  memoryStore() {
    this.memory = parseFloat(this.currentValue);
  }

  // 内存操作 - 读取
  memoryRecall() {
    this.currentValue = String(this.memory);
    this.shouldResetScreen = true;
  }

  // 内存操作 - 清除
  memoryClear() {
    this.memory = 0;
  }

  // 内存操作 - 加
  memoryAdd() {
    this.memory += parseFloat(this.currentValue);
  }

  // 内存操作 - 减
  memorySubtract() {
    this.memory -= parseFloat(this.currentValue);
  }

  // 获取当前显示值
  getDisplay() {
    return this.currentValue;
  }

  // 获取内存值
  getMemory() {
    return this.memory;
  }
}
