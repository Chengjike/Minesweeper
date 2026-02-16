# 测试框架文档

## 概述

本项目使用 Vitest 作为测试框架，为游戏中心的各个游戏提供单元测试和集成测试。

## 技术栈

- **测试框架**: Vitest v1.2.0
- **测试环境**: happy-dom (模拟浏览器环境)
- **测试 UI**: @vitest/ui (可视化测试界面)

## 项目结构

```
Minesweeper/
├── src/                    # 源代码目录
│   └── minesweeper.js     # 扫雷游戏核心逻辑
├── tests/                  # 测试文件目录
│   └── minesweeper.test.js # 扫雷游戏测试
├── package.json           # 项目配置
├── vitest.config.js       # Vitest 配置文件
└── TEST.md               # 本文档
```

## 安装依赖

```bash
npm install
```

## 运行测试

### 基本命令

```bash
# 运行所有测试（监听模式）
npm test

# 运行一次测试
npm run test:run

# 运行测试并生成覆盖率报告
npm run test:coverage

# 启动可视化测试界面
npm run test:ui
```

## 测试覆盖范围

### 扫雷游戏 (minesweeper.test.js)

测试涵盖以下功能模块：

1. **初始化测试**
   - 游戏板正确初始化
   - 地雷数量正确
   - 游戏初始状态

2. **地雷放置测试**
   - 地雷位置有效性
   - 地雷不重复

3. **数字计算测试**
   - 周围地雷数计算正确

4. **揭示格子测试**
   - 揭示安全格子
   - 揭示地雷结束游戏
   - 不能揭示已标记格子

5. **旗帜功能测试**
   - 切换旗帜
   - 已揭示格子不能放置旗帜

6. **剩余地雷数测试**
   - 初始剩余地雷数
   - 旗帜影响剩余数

7. **获胜条件测试**
   - 揭示所有非地雷格子获胜
   - 未完成不获胜

## 编写新测试

### 测试文件命名规范

- 测试文件放在 `tests/` 目录
- 文件名格式: `[功能名].test.js`
- 例如: `tetris.test.js`, `match3.test.js`

### 测试代码示例

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { YourClass } from '../src/your-module.js';

describe('功能模块名称', () => {
  let instance;

  beforeEach(() => {
    instance = new YourClass();
  });

  it('应该测试某个功能', () => {
    expect(instance.someMethod()).toBe(expectedValue);
  });
});
```

## 配置说明

### vitest.config.js

```javascript
{
  test: {
    environment: 'happy-dom',  // 使用 happy-dom 模拟浏览器
    globals: true,             // 全局注入测试 API
    coverage: {
      provider: 'v8',          // 使用 V8 覆盖率提供者
      reporter: ['text', 'json', 'html']
    }
  }
}
```

## 最佳实践

1. **测试隔离**: 每个测试应该独立，使用 `beforeEach` 重置状态
2. **清晰命名**: 测试描述应该清楚说明测试内容
3. **单一职责**: 每个测试只验证一个功能点
4. **边界测试**: 测试边界条件和异常情况
5. **可读性**: 使用 describe 分组组织相关测试

## 持续集成

可以在 CI/CD 流程中添加：

```bash
npm run test:run
```

确保所有测试通过后再部署。

## 下一步计划

- [ ] 添加俄罗斯方块游戏测试
- [ ] 添加消消乐游戏测试
- [ ] 添加 E2E 测试
- [ ] 提高测试覆盖率到 80% 以上

---

*创建日期: 2026-02-16*
