import { describe, it, expect, beforeEach } from 'vitest';
import { Calculator } from '../src/calculator.js';

describe('Calculator', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('初始化', () => {
    it('应该正确初始化计算器', () => {
      expect(calc.currentValue).toBe('0');
      expect(calc.previousValue).toBe('');
      expect(calc.operation).toBe(null);
      expect(calc.memory).toBe(0);
    });
  });

  describe('数字输入', () => {
    it('应该能够输入单个数字', () => {
      calc.inputNumber('5');
      expect(calc.getDisplay()).toBe('5');
    });

    it('应该能够输入多个数字', () => {
      calc.inputNumber('1');
      calc.inputNumber('2');
      calc.inputNumber('3');
      expect(calc.getDisplay()).toBe('123');
    });

    it('初始0后输入数字应该替换0', () => {
      calc.inputNumber('7');
      expect(calc.getDisplay()).toBe('7');
    });
  });

  describe('小数点输入', () => {
    it('应该能够输入小数点', () => {
      calc.inputNumber('3');
      calc.inputDecimal();
      calc.inputNumber('1');
      calc.inputNumber('4');
      expect(calc.getDisplay()).toBe('3.14');
    });

    it('不应该输入多个小数点', () => {
      calc.inputNumber('3');
      calc.inputDecimal();
      calc.inputNumber('1');
      calc.inputDecimal();
      calc.inputNumber('4');
      expect(calc.getDisplay()).toBe('3.14');
    });
  });

  describe('基本运算', () => {
    it('应该能够执行加法', () => {
      calc.inputNumber('5');
      calc.setOperation('+');
      calc.inputNumber('3');
      calc.calculate();
      expect(calc.getDisplay()).toBe('8');
    });

    it('应该能够执行减法', () => {
      calc.inputNumber('1');
      calc.inputNumber('0');
      calc.setOperation('-');
      calc.inputNumber('3');
      calc.calculate();
      expect(calc.getDisplay()).toBe('7');
    });

    it('应该能够执行乘法', () => {
      calc.inputNumber('4');
      calc.setOperation('×');
      calc.inputNumber('5');
      calc.calculate();
      expect(calc.getDisplay()).toBe('20');
    });

    it('应该能够执行除法', () => {
      calc.inputNumber('1');
      calc.inputNumber('5');
      calc.setOperation('÷');
      calc.inputNumber('3');
      calc.calculate();
      expect(calc.getDisplay()).toBe('5');
    });

    it('除以0应该显示错误', () => {
      calc.inputNumber('5');
      calc.setOperation('÷');
      calc.inputNumber('0');
      calc.calculate();
      expect(calc.getDisplay()).toBe('Error');
    });
  });

  describe('清除功能', () => {
    it('C应该清除所有内容', () => {
      calc.inputNumber('5');
      calc.setOperation('+');
      calc.inputNumber('3');
      calc.clear();
      expect(calc.getDisplay()).toBe('0');
      expect(calc.operation).toBe(null);
      expect(calc.previousValue).toBe('');
    });

    it('CE应该只清除当前输入', () => {
      calc.inputNumber('5');
      calc.setOperation('+');
      calc.inputNumber('3');
      calc.clearEntry();
      expect(calc.getDisplay()).toBe('0');
      expect(calc.operation).toBe('+');
    });

    it('退格应该删除最后一位', () => {
      calc.inputNumber('1');
      calc.inputNumber('2');
      calc.inputNumber('3');
      calc.backspace();
      expect(calc.getDisplay()).toBe('12');
    });

    it('退格到最后一位应该显示0', () => {
      calc.inputNumber('5');
      calc.backspace();
      expect(calc.getDisplay()).toBe('0');
    });
  });

  describe('正负号切换', () => {
    it('应该能够切换正负号', () => {
      calc.inputNumber('5');
      calc.toggleSign();
      expect(calc.getDisplay()).toBe('-5');
    });

    it('应该能够从负数切换回正数', () => {
      calc.inputNumber('5');
      calc.toggleSign();
      calc.toggleSign();
      expect(calc.getDisplay()).toBe('5');
    });
  });

  describe('百分比', () => {
    it('应该能够计算百分比', () => {
      calc.inputNumber('5');
      calc.inputNumber('0');
      calc.percentage();
      expect(calc.getDisplay()).toBe('0.5');
    });
  });

  describe('科学函数', () => {
    it('应该能够计算平方', () => {
      calc.inputNumber('5');
      calc.square();
      expect(calc.getDisplay()).toBe('25');
    });

    it('应该能够计算平方根', () => {
      calc.inputNumber('1');
      calc.inputNumber('6');
      calc.squareRoot();
      expect(calc.getDisplay()).toBe('4');
    });

    it('负数平方根应该显示错误', () => {
      calc.inputNumber('5');
      calc.toggleSign();
      calc.squareRoot();
      expect(calc.getDisplay()).toBe('Error');
    });

    it('应该能够计算倒数', () => {
      calc.inputNumber('4');
      calc.reciprocal();
      expect(calc.getDisplay()).toBe('0.25');
    });

    it('0的倒数应该显示错误', () => {
      calc.reciprocal();
      expect(calc.getDisplay()).toBe('Error');
    });

    it('应该能够计算阶乘', () => {
      calc.inputNumber('5');
      calc.factorial();
      expect(calc.getDisplay()).toBe('120');
    });

    it('0的阶乘应该是1', () => {
      calc.factorial();
      expect(calc.getDisplay()).toBe('1');
    });

    it('负数阶乘应该显示错误', () => {
      calc.inputNumber('5');
      calc.toggleSign();
      calc.factorial();
      expect(calc.getDisplay()).toBe('Error');
    });
  });

  describe('三角函数', () => {
    it('应该能够计算sin(0)', () => {
      calc.sin();
      expect(parseFloat(calc.getDisplay())).toBeCloseTo(0, 10);
    });

    it('应该能够计算sin(90)', () => {
      calc.inputNumber('9');
      calc.inputNumber('0');
      calc.sin();
      expect(parseFloat(calc.getDisplay())).toBeCloseTo(1, 10);
    });

    it('应该能够计算cos(0)', () => {
      calc.cos();
      expect(parseFloat(calc.getDisplay())).toBeCloseTo(1, 10);
    });

    it('应该能够计算tan(45)', () => {
      calc.inputNumber('4');
      calc.inputNumber('5');
      calc.tan();
      expect(parseFloat(calc.getDisplay())).toBeCloseTo(1, 10);
    });
  });

  describe('对数函数', () => {
    it('应该能够计算log10(100)', () => {
      calc.inputNumber('1');
      calc.inputNumber('0');
      calc.inputNumber('0');
      calc.log();
      expect(parseFloat(calc.getDisplay())).toBeCloseTo(2, 10);
    });

    it('负数或0的log应该显示错误', () => {
      calc.log();
      expect(calc.getDisplay()).toBe('Error');
    });

    it('应该能够计算ln(e)', () => {
      calc.currentValue = String(Math.E);
      calc.ln();
      expect(parseFloat(calc.getDisplay())).toBeCloseTo(1, 10);
    });

    it('负数或0的ln应该显示错误', () => {
      calc.ln();
      expect(calc.getDisplay()).toBe('Error');
    });
  });

  describe('指数和幂运算', () => {
    it('应该能够计算e^1', () => {
      calc.inputNumber('1');
      calc.exp();
      expect(parseFloat(calc.getDisplay())).toBeCloseTo(Math.E, 10);
    });

    it('应该能够计算幂运算', () => {
      calc.inputNumber('2');
      calc.power(3);
      expect(calc.getDisplay()).toBe('8');
    });
  });

  describe('内存功能', () => {
    it('应该能够存储到内存', () => {
      calc.inputNumber('4');
      calc.inputNumber('2');
      calc.memoryStore();
      expect(calc.getMemory()).toBe(42);
    });

    it('应该能够从内存读取', () => {
      calc.inputNumber('7');
      calc.memoryStore();
      calc.clear();
      calc.memoryRecall();
      expect(calc.getDisplay()).toBe('7');
    });

    it('应该能够清除内存', () => {
      calc.inputNumber('5');
      calc.memoryStore();
      calc.memoryClear();
      expect(calc.getMemory()).toBe(0);
    });

    it('应该能够向内存加值', () => {
      calc.inputNumber('1');
      calc.inputNumber('0');
      calc.memoryStore();
      calc.clear();
      calc.inputNumber('5');
      calc.memoryAdd();
      expect(calc.getMemory()).toBe(15);
    });

    it('应该能够从内存减值', () => {
      calc.inputNumber('2');
      calc.inputNumber('0');
      calc.memoryStore();
      calc.clear();
      calc.inputNumber('5');
      calc.memorySubtract();
      expect(calc.getMemory()).toBe(15);
    });
  });

  describe('连续运算', () => {
    it('应该能够执行连续运算', () => {
      calc.inputNumber('5');
      calc.setOperation('+');
      calc.inputNumber('3');
      calc.setOperation('×');
      expect(calc.getDisplay()).toBe('8');
      calc.inputNumber('2');
      calc.calculate();
      expect(calc.getDisplay()).toBe('16');
    });
  });
});
