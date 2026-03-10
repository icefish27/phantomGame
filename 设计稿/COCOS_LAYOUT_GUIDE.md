# Cocos Creator 布局手册（CSS 开发者视角）

> 本手册面向有 CSS 经验的 Web 前端开发者，帮助你快速理解 Cocos Creator 中的布局概念。

---

## 核心概念对照表

| CSS 概念 | Cocos Creator 对应 | 说明 |
|---------|-------------------|------|
| `div` | `Node` | 节点是所有 UI 的基础容器 |
| `width/height` | `UITransform.contentSize` | 设置节点尺寸 |
| `position: absolute` | `setPosition()` | 绝对定位 |
| `top/left/right/bottom` | `Anchor` (锚点) + `Position` | 配合使用控制位置 |
| `display: flex` | `Widget` + 手动布局 | Cocos 没有内置 flex |
| `display: grid` | 手动计算 | 需要自己计算每个格子位置 |
| `background-color` | `Sprite` / `Graphics` | 背景图片或绘制 |
| `border-radius` | `Graphics` 绘制圆角 | 需要用代码绘制 |
| `z-index` | `zIndex` 或 `setSiblingIndex` | 控制层级 |
| `transform: translate` | `setPosition` | 移动位置 |
| `text` | `Label` | 文本组件 |
| `button` | `Button` | 按钮组件 |

---

## 坐标系系统

### 重要差异：Y 轴方向相反！

```
CSS (Web)              Cocos Creator (2D)
  +Y (上)                   +Y (上)
   ↑                        ↑
   │                        │
   │                        │
   └──────── +X (右)        └──────── +X (右)

但是在 Cocos Creator 场景中：
   +Y (上)                  +Y (上) ↑
   ↑                        ↑       │
   │                        │       │
   │    0,0 在屏幕中心       │   0,0 在屏幕中心
   └──────── +X (右)         └────────── +X (右)
```

### 屏幕尺寸

- 默认分辨率：`1280 x 720`
- 原点 `(0, 0)` 在**屏幕中心**
- 左下角：`(-width/2, -height/2)`
- 右上角：`(+width/2, +height/2)`

```typescript
// 获取屏幕尺寸
const screenWidth = 1280;
const screenHeight = 720;

// 设置节点到屏幕中心
node.setPosition(0, 0);

// 设置节点到屏幕左上角
node.setPosition(-screenWidth / 2, screenHeight / 2);
```

---

## Node（节点）= HTML 元素

在 Cocos 中，**一切都是 Node**：

```typescript
// 创建一个 <div>
const node = new Node('myDiv');

// 添加变换组件（相当于设置 width/height）
const transform = node.addComponent(UITransform);
transform.setContentSize(200, 100);  // width: 200px, height: 100px

// 添加到父节点（类似 appendChild）
parentNode.addChild(node);
```

---

## 定位方式

### 1. 绝对定位（最常用）

```typescript
// 类似 position: absolute; left: 100px; top: 50px;
node.setPosition(100, 50);

// 或者使用锚点 + 偏移
node.setPosition(0, 0);  // 默认在父节点中心
```

### 2. 锚点（Anchor）= CSS 的定位参考点

```
锚点位置图示 (0-1 范围):

Anchor     位置
(0,0) ─── 左下角
(0.5,0.5) ─── 中心
(1,1) ─── 右上角
(0,1) ─── 左上角
(1,0) ─── 右下角
```

```typescript
// 设置锚点为左上角 (类似 CSS 的 left: 0; top: 0)
transform.setAnchorPoint(0, 1);

// 设置锚点为中心
transform.setAnchorPoint(0.5, 0.5);
```

**重要**：Cocos 的 Y 轴向上，所以 `(0, 1)` 是左上角，`(0, 0)` 是左下角。

### 3. Widget 组件 = 自动布局

Widget 类似于 CSS 的 Flex 定位：

```typescript
const widget = node.addComponent(Widget);
widget.isAlignLeft = true;      // left: 0
widget.left = 10;              // left: 10px
widget.isAlignRight = true;   // right: 0
widget.isAlignTop = true;      // top: 0
widget.isAlignBottom = true;   // bottom: 0
```

| CSS | Widget 对应 |
|-----|-------------|
| `left: 10px` | `widget.isAlignLeft = true; widget.left = 10;` |
| `right: 10px` | `widget.isAlignRight = true; widget.right = 10;` |
| `top: 10px` | `widget.isAlignTop = true; widget.top = 10;` |
| `bottom: 10px` | `widget.isAlignBottom = true; widget.bottom = 10;` |
| `margin: auto` | `widget.isAlignCenterX = true; widget.isAlignCenterY = true;` |

---

## 常见布局示例

### 1. 水平居中

```typescript
// 方法1: 使用 Widget
const widget = node.addComponent(Widget);
widget.isAlignCenterX = true;

// 方法2: 手动计算
node.setPosition(parentWidth / 2, y);
```

### 2. 垂直居中

```typescript
node.setPosition(x, parentHeight / 2);
```

### 3. 左右对齐（Flex space-between）

```typescript
// 手动计算：假设两个子节点
const gap = 20;
const totalWidth = parentWidth;
const child1X = -totalWidth / 2 + child1Width / 2;
const child2X = totalWidth / 2 - child2Width / 2;

child1.setPosition(child1X, 0);
child2.setPosition(child2X, 0);
```

### 4. Grid 布局（计算器按钮）

```typescript
// 类似 CSS grid-template-columns: repeat(4, 1fr)
const cols = 4;
const gap = 12;
const padding = 20;

const btnWidth = (containerWidth - padding * 2 - gap * (cols - 1)) / cols;

// 计算每个按钮位置
const col = 0;  // 0, 1, 2, 3
const row = 0;  // 0, 1, 2, 3, 4

const x = padding + btnWidth / 2 + col * (btnWidth + gap);
const y = containerHeight - padding - btnHeight / 2 - row * (btnHeight + gap);

button.setPosition(x, y);
```

---

## 组件类型

### Sprite（精灵）= `div` + `background-image`

```typescript
const sprite = node.addComponent(Sprite);
sprite.spriteFrame = someSpriteFrame;  // 图片
sprite.color = new Color(255, 255, 255, 255);  // 颜色
sprite.sizeMode = Sprite.SizeMode.CUSTOM;  // 使用自定义尺寸
```

### Label（标签）= `span` 或 `div` 文本

```typescript
const label = node.addComponent(Label);
label.string = 'Hello';           // 文本内容
label.fontSize = 32;              // 字号
label.fontFamily = 'Arial';       // 字体
label.color = new Color(255, 255, 255, 255);  // 颜色
label.horizontalAlign = Label.HorizontalAlign.RIGHT;  // 水平对齐
label.verticalAlign = Label.VerticalAlign.CENTER;     // 垂直对齐
```

| CSS | Cocos |
|-----|-------|
| `text-align: right` | `label.horizontalAlign = Label.HorizontalAlign.RIGHT` |
| `text-align: center` | `label.horizontalAlign = Label.HorizontalAlign.CENTER` |
| `text-align: left` | `label.horizontalAlign = Label.HorizontalAlign.LEFT` |

### Button（按钮）= `button` 元素

```typescript
const button = node.addComponent(Button);
button.interactable = true;  // enabled
button.clickEvents = [];    // 点击事件

// 添加点击事件
button.node.on('click', () => {
    console.log('clicked!');
});
```

### Graphics（绘图）= `canvas` 绘制

用于绘制矩形、圆形等：

```typescript
const graphics = node.addComponent(Graphics);

// 绘制矩形
graphics.rect(-width/2, -height/2, width, height);
graphics.fillColor = new Color(255, 0, 0, 255);
graphics.fill();

// 绘制圆角矩形（需要用路径）
graphics.roundRect(-width/2, -height/2, width, height, 10);
graphics.fill();
```

---

## 颜色表示

```typescript
// RGBA: R, G, B, A (0-255)
new Color(255, 0, 0, 255);           // 红色
new Color(0, 255, 0, 255);           // 绿色
new Color(0, 0, 255, 255);          // 蓝色
new Color(255, 255, 255, 255);       // 白色
new Color(0, 0, 0, 255);             // 黑色
new Color(0, 0, 0, 0);               // 透明
new Color(39, 38, 38, 255);          // #272626
```

---

## 层级管理

```typescript
// 设置 z-index
node.zIndex = 10;

// 设置兄弟节点顺序（类似 z-index）
node.setSiblingIndex(0);  // 最底层
node.setSiblingIndex(999);  // 最顶层
```

---

## 实用代码模板

### 创建基本容器

```typescript
function createContainer(name: string, width: number, height: number, parent: Node): Node {
    const node = new Node(name);
    node.layer = 33554432;  // UI 层级

    const transform = node.addComponent(UITransform);
    transform.setContentSize(width, height);

    node.setPosition(0, 0);
    parent.addChild(node);

    return node;
}
```

### 创建带背景的容器

```typescript
function createPanel(name: string, width: number, height: number, color: Color, parent: Node): Node {
    const node = new Node(name);
    node.layer = 33554432;

    const transform = node.addComponent(UITransform);
    transform.setContentSize(width, height);

    // 背景
    const graphics = node.addComponent(Graphics);
    graphics.rect(-width/2, -height/2, width, height);
    graphics.fillColor = color;
    graphics.fill();

    node.setPosition(0, 0);
    parent.addChild(node);

    return node;
}
```

### 创建文本

```typescript
function createLabel(text: string, fontSize: number, color: Color, parent: Node): Label {
    const node = new Node();
    node.layer = 33554432;

    node.addComponent(UITransform);

    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.color = color;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;

    parent.addChild(node);
    return label;
}
```

### 创建按钮

```typescript
function createButton(
    text: string,
    width: number,
    height: number,
    bgColor: Color,
    textColor: Color,
    onClick: () => void
): Node {
    const node = new Node('Btn_' + text);
    node.layer = 33554432;

    const transform = node.addComponent(UITransform);
    transform.setContentSize(width, height);

    // 背景
    const graphics = node.addComponent(Graphics);
    graphics.rect(-width/2, -height/2, width, height);
    graphics.fillColor = bgColor;
    graphics.fill();

    // 按钮组件
    const button = node.addComponent(Button);
    button.interactable = true;

    // 文字
    const labelNode = new Node();
    labelNode.addComponent(UITransform);
    const label = labelNode.addComponent(Label);
    label.string = text;
    label.fontSize = 32;
    label.color = textColor;
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    node.addChild(labelNode);

    // 点击事件
    button.node.on('click', onClick);

    return node;
}
```

---

## 布局计算示例（计算器布局）

参考 `CalculatorManager.ts` 中的实际代码：

```typescript
// 屏幕尺寸
const screenWidth = 1280;
const screenHeight = 720;

// 左侧面板 35%，右侧 65%
const leftWidth = screenWidth * 0.35;
const rightWidth = screenWidth * 0.65;

// 左侧面板位置（左上角）
const leftPanel = createPanel('Left', leftWidth, screenHeight, darkColor);
leftPanel.setPosition(-screenWidth / 2, screenHeight / 2);

// 右侧面板位置
const rightPanel = createPanel('Right', rightWidth, screenHeight, darkerColor);
rightPanel.setPosition(-screenWidth / 2 + leftWidth, screenHeight / 2);

// 按钮网格计算
const cols = 4;
const rows = 5;
const gap = 12;
const padding = 24;

const btnWidth = (rightWidth - padding * 2 - gap * (cols - 1)) / cols;
const btnHeight = 64;

// 计算位置（从右上角开始，向左下角布局）
const x = padding + btnWidth / 2 + col * (btnWidth + gap);
const y = screenHeight - padding - btnHeight / 2 - row * (btnHeight + gap);
```

---

## 调试技巧

### 在编辑器中查看位置

Cocos Creator 编辑器中：
1. 选中节点
2. 在 Inspector 面板查看 `Position`、`Anchor`、`ContentSize`
3. 可以直接拖拽调整位置

### 打印调试信息

```typescript
const transform = node.getComponent(UITransform);
console.log('Size:', transform.contentSize);
console.log('Position:', node.position);
console.log('Anchor:', transform.anchorPoint);
```

---

## 快速上手建议

1. **先用编辑器拖拽布局**：在 Cocos Creator 编辑器中创建节点、调整位置，比纯代码更直观
2. **理解坐标系**：记住原点在屏幕中心，Y 轴向上
3. **先画草图**：计算器布局可以先在纸上画出网格，再翻译成代码
4. **使用 Widget**：需要自适应布局时使用 Widget 组件
5. **参考现有代码**：`CalculatorManager.ts` 是很好的参考示例

---

## 常用快捷键（编辑器）

- `Ctrl + S`：保存场景
- `Ctrl + D`：复制选中节点
- `Delete`：删除节点
- `F`：聚焦选中节点
- 鼠标中键拖拽：平移视图
- 滚轮：缩放视图
