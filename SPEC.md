# 幻影游戏 - 规格说明书 (SPEC)

## 1. 项目概述

### 项目名称
幻影游戏 (Phantom Game)

### 项目类型
基于 Cocos Creator 3.8.8 的 2D 壳应用 + 多子游戏工程骨架

### 核心功能
- 计算器界面作为启动入口
- 输入特定密码 "7890" 后按 "=" 进入游戏大厅
- 游戏大厅展示多个子游戏入口

### 目标用户
游戏玩家

---

## 2. 界面规格

### 2.1 场景结构

| 场景名称 | 描述 | 入口 |
|---------|------|------|
| Calculator | 计算器界面 | 启动默认进入 |
| Lobby | 游戏大厅 | 输入 7890 后按 = 进入 |

### 2.2 计算器界面 (Calculator)

**布局结构** (参考设计稿 calculator_ui.png):
- **横屏布局**，左右分栏
- 左侧：显示区域（占 42% 宽度）
- 右侧：按键区域（占 58% 宽度）

**显示区域**:
- 背景：深色渐变 (`#18181b` → `#0a0a0c`)，带微光效果
- 顶部：24px 高渐变光晕
- 表达式文字：白色，透明度 25%，右侧对齐
- 结果文字：白色，7xl 大小，右对齐

**按键区域**:
- 按键布局：5 行 4 列（最后一行 3 个键）
- 圆角：22px
- 高度：64px

**按键样式**:

| 按键类型 | 背景 | 文字颜色 | 边框 |
|---------|------|---------|------|
| 数字 0-9, 小数点 | 深灰渐变 (#27272a → #181717) | 白色 | 白色 5% |
| 运算符 ÷ × − + | 橙黄渐变 (#f59e0b → #f97316) | 白色 | 无 |
| 功能键 C +/- % | 半透明白 (#ffffff10) | 白色 | 白色 10% |
| 等号 = | 白渐变 (white → #e5e5e5) | 黑色 | 无 |

**按键列表**:
```
第1行: C    +/-    %    ÷
第2行: 7    8      9    ×
第3行: 4    5      6    −
第4行: 1    2      3    +
第5行: 0    .      =
```

### 2.3 游戏大厅界面 (Lobby)

**布局结构** (参考设计稿 lobby_ui.png):
- 横屏布局
- 左侧：游戏列表（30% 宽度）
- 右侧：选中展示 + 底部操作区（70% 宽度）

**整体背景**:
- 深色渐变背景 (#070b12 → #0c1320)
- 径向光晕效果（左上 15%、右上 82%）
- 多层底部弧形光效

**游戏列表区域**:
- 标题："GAME LIST"，白色 28% 透明度，11px，大写
- 列表项：4 个游戏卡片
- 卡片尺寸：204px × 94px，圆角 18px

**游戏卡片**:
| 字段 | 内容 |
|-----|------|
| 斗地主 | 经典对局，快速开玩 |
| 麻将 | 轻松牌局，随时来一圈 |
| 象棋 | 残局推演，策略博弈 |
| 更多游戏 | 后续持续扩展追加 |

**卡片样式**:
- 未选中：边框白色 10%，透明度 65%
- 选中：边框白色 34%，放大 1.035 倍，白色光晕阴影

**右侧展示区**:
- 标题："NOW SELECTED"，白色 32% 透明度
- 游戏名称：58px，白色
- 副标题：16px，白色 52% 透明度
- 分割线：白色 10% 透明度

**底部操作区**:
- 指示点：当前选中显示白色条，其他显示圆点
- 翻页按钮：← →，白色 10% 背景
- "进入"按钮：白色背景，黑色文字，圆角

---

## 3. 功能规格

### 3.1 计算器功能

**核心逻辑**:
1. 数字输入：点击数字键添加到当前输入
2. 小数点：支持输入小数（只能有一个小数点）
3. 运算符切换：点击运算符切换当前运算符
4. 清空 (C)：清空所有输入
5. 取反 (+/-)：正负数切换
6. 百分比 (%)：转换为百分比
7. 等号 (=)：
   - 正常计算表达式结果
   - **特殊逻辑**：如果当前输入为 "7890"，则跳转到游戏大厅场景

**计算器状态**:
```typescript
interface CalculatorState {
    displayValue: string;    // 当前显示值
    expression: string;      // 表达式（如 "12 × 8 + 24"）
    previousValue: number;    // 上一个值
    operator: string;        // 当前运算符
    waitingForOperand: boolean; // 等待输入新操作数
}
```

### 3.2 场景跳转逻辑

**触发条件**:
- 用户输入 "7890"
- 点击 "=" 按钮

**跳转流程**:
```
输入 "7890" → 点击 "=" → 跳转到 Lobby 场景
```

**跳转方式**:
```typescript
director.loadScene('Lobby');
```

### 3.3 大厅交互功能

**游戏选择**:
- 点击左侧游戏列表项选中游戏
- 左右箭头按钮切换选中项
- 自动循环（最后一项 → 第一项）

**进入游戏**:
- 点击 "进入" 按钮（暂未实现，跳转日志）

---

## 4. 技术规格

### 4.1 项目结构

```
assets/
├── calculator/           # 计算器模块
│   ├── scenes/
│   │   └── Calculator.fire    # 计算器场景
│   └── scripts/
│       ├── Calculator.ts       # 计算器主组件
│       └── Button.ts           # 按钮组件
├── lobby/               # 大厅模块
│   ├── scenes/
│   │   └── Lobby.fire          # 大厅场景
│   └── scripts/
│       ├── Lobby.ts            # 大厅主组件
│       └── GameCard.ts        # 游戏卡片组件
└── games/               # 子游戏模块（预留）
    ├── chess/           # 象棋
    └── landlords/       # 斗地主
```

### 4.2 组件设计

**Calculator 组件**:
```typescript
@Component('Calculator')
export class Calculator extends Component {
    @property(Label)
    displayLabel: Label;        // 显示结果的 Label

    @property(Label)
    expressionLabel: Label;     // 显示表达式的 Label

    // 状态
    private currentValue: string = '0';
    private expression: string = '';
    private pendingOperator: string = '';
    private waitingForOperand: boolean = false;

    // 方法
    inputDigit(digit: string): void;
    inputDecimal(): void;
    clear(): void;
    toggleSign(): void;
    calculatePercentage(): void;
    setOperator(operator: string): void;
    calculate(): void;
    updateDisplay(): void;
}
```

**Lobby 组件**:
```typescript
@Component('Lobby')
export class Lobby extends Component {
    @property([Node])
    gameCards: Node[];          // 游戏卡片节点数组

    @property(Node)
    selectedIndicator: Node;     // 选中指示器

    @property(Label)
    gameTitleLabel: Label;       // 游戏标题

    @property(Label)
    gameSubtitleLabel: Label;    // 游戏副标题

    private selectedIndex: number = 0;

    selectGame(index: number): void;
    nextGame(): void;
    prevGame(): void;
    enterGame(): void;
}
```

### 4.3 场景配置

| 属性 | 值 |
|-----|-----|
| 设计分辨率 | 1280 × 720 |
| 适配模式 | WIDTH_CONTRAINT |
| 帧率 | 60 FPS |
| 渲染器 | Canvas |

---

## 5. 验收标准

### 5.1 计算器界面
- [ ] 显示区域和按键区域布局正确（左右分栏）
- [ ] 所有 17 个按键显示正确
- [ ] 按键颜色符合设计稿
- [ ] 数字输入功能正常
- [ ] 四则运算功能正常
- [ ] C 清空功能正常
- [ ] +/- 取反功能正常
- [ ] % 百分比功能正常

### 5.2 密码跳转
- [ ] 输入 "7890" 后按 "=" 跳转到大厅
- [ ] 输入其他数字按 "=" 正常计算结果

### 5.3 大厅界面
- [ ] 4 个游戏卡片显示正确
- [ ] 点击卡片可切换选中状态
- [ ] 左右箭头可切换游戏
- [ ] 选中游戏后右侧展示区更新
- [ ] "进入"按钮点击有响应

### 5.4 整体体验
- [ ] 场景切换流畅
- [ ] 无控制台错误
- [ ] 横屏适配正确
