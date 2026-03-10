import { _decorator, Component, Node, Graphics, Label, Button, Color, UITransform, Vec3, tween, EventHandler, director, EventTouch } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 计算器UI - 纯代码动态创建
 * 布局：左右分栏，左侧显示区域，右侧按钮网格
 */
@ccclass('CalculatorUI')
export class CalculatorUI extends Component {

    // UI节点
    private displayPanel!: Node;
    private buttonPanel!: Node;
    private expressionLabel!: Label;
    private resultLabel!: Label;
    private buttons: Map<string, Node> = new Map();

    // 计算器状态
    private currentValue: string = '0';
    private expression: string = '';
    private previousValue: number = 0;
    private operator: string = '';
    private waitingForOperand: boolean = false;

    // 按钮配置
    private readonly buttonConfig = [
        { label: 'C', type: 'function' },
        { label: '+/-', type: 'function' },
        { label: '%', type: 'function' },
        { label: '÷', type: 'operator' },
        { label: '7', type: 'number' },
        { label: '8', type: 'number' },
        { label: '9', type: 'number' },
        { label: '×', type: 'operator' },
        { label: '4', type: 'number' },
        { label: '5', type: 'number' },
        { label: '6', type: 'number' },
        { label: '−', type: 'operator' },
        { label: '1', type: 'number' },
        { label: '2', type: 'number' },
        { label: '3', type: 'number' },
        { label: '+', type: 'operator' },
        { label: '0', type: 'number', wide: true },
        { label: '.', type: 'number' },
        { label: '=', type: 'equals' },
    ];

    onLoad() {
        this.buildUI();
    }

    start() {
        this.updateDisplay();
    }

    /**
     * 构建完整UI
     */
    private buildUI(): void {
        const canvas = this.node;
        const canvasTransform = canvas.getComponent(UITransform)!;
        const width = canvasTransform.contentSize.width;
        const height = canvasTransform.contentSize.height;

        // 左侧显示区域 (42%)
        const leftWidth = width * 0.42;
        this.displayPanel = this.createNode('DisplayPanel', canvas);
        this.displayPanel.setPosition(-width / 2 + leftWidth / 2, 0, 0);
        const leftTransform = this.displayPanel.addComponent(UITransform);
        leftTransform.setContentSize(leftWidth, height);
        this.setupDisplayPanel(leftWidth, height);

        // 右侧按钮区域 (58%)
        const rightWidth = width * 0.58;
        this.buttonPanel = this.createNode('ButtonPanel', canvas);
        this.buttonPanel.setPosition(-width/2 + leftWidth + rightWidth/2, 0, 0); // 修复：按钮面板位置计算错误
        const rightTransform = this.buttonPanel.addComponent(UITransform);
        rightTransform.setContentSize(rightWidth, height);
        this.setupButtonPanel(rightWidth, height);
    }

    /**
     * 设置显示面板
     */
    private setupDisplayPanel(width: number, height: number): void {
        // 背景 - 使用 Graphics
        const bg = this.createNode('Bg', this.displayPanel);
        bg.addComponent(UITransform).setContentSize(width, height);
        const bgGraphics = bg.addComponent(Graphics);
        bgGraphics.fillColor = new Color(24, 24, 27, 255);
        bgGraphics.rect(-width/2, -height/2, width, height);
        bgGraphics.fill();

        // 顶部光晕
        const glow = this.createNode('Glow', this.displayPanel);
        glow.addComponent(UITransform).setContentSize(width, 24);
        glow.setPosition(0, height / 2 - 12, 0);
        const glowGraphics = glow.addComponent(Graphics);
        glowGraphics.fillColor = new Color(255, 200, 100, 60);
        glowGraphics.rect(-width/2, -12, width, 24);
        glowGraphics.fill();

        // 表达式
        this.expressionLabel = this.createLabel('Expression', this.displayPanel, {
            x: 0,
            y: height / 2 - 60,
            width: width - 40,
            height: 36,
            fontSize: 24,
            color: new Color(255, 255, 255, 64)
        });

        // 结果
        this.resultLabel = this.createLabel('Result', this.displayPanel, {
            x: 0,
            y: -20,
            width: width - 40,
            height: 80,
            fontSize: 64,
            color: new Color(255, 255, 255, 255)
        });
    }

    /**
     * 设置按钮面板 - 简单直接的方式
     */
    private setupButtonPanel(width: number, height: number): void {
        // 背景
        const bg = this.createNode('Bg', this.buttonPanel);
        bg.addComponent(UITransform).setContentSize(width, height);
        const bgGraphics = bg.addComponent(Graphics);
        bgGraphics.fillColor = new Color(10, 10, 12, 255);
        bgGraphics.rect(-width/2, -height/2, width, height);
        bgGraphics.fill();

        const padding = 16;
        const spacing = 12;
        const cols = 4;
        const rows = 5;
        const btnWidth = (width - padding * 2 - spacing * (cols - 1)) / cols;
        const btnHeight = (height - padding * 2 - spacing * (rows - 1)) / rows;

        // 计算每个按钮的x坐标（从左到右）
        const getX = (col: number) => {
            return -width / 2 + padding + btnWidth / 2 + col * (btnWidth + spacing);
        };
        // 计算每个按钮的y坐标（从上到下）
        const getY = (row: number) => {
            return height / 2 - padding - btnHeight / 2 - row * (btnHeight + spacing);
        };

        // 按钮配置：row, col, label, type, isWide
        const buttons = [
            // 第1行
            [0, 0, 'C', 'function', false],
            [0, 1, '+/-', 'function', false],
            [0, 2, '%', 'function', false],
            [0, 3, '÷', 'operator', false],
            // 第2行
            [1, 0, '7', 'number', false],
            [1, 1, '8', 'number', false],
            [1, 2, '9', 'number', false],
            [1, 3, '×', 'operator', false],
            // 第3行
            [2, 0, '4', 'number', false],
            [2, 1, '5', 'number', false],
            [2, 2, '6', 'number', false],
            [2, 3, '−', 'operator', false],
            // 第4行
            [3, 0, '1', 'number', false],
            [3, 1, '2', 'number', false],
            [3, 2, '3', 'number', false],
            [3, 3, '+', 'operator', false],
            // 第5行
            [4, 0, '0', 'number', true],   // 宽按钮，占第0、1列
            [4, 2, '.', 'number', false],  // 第2列
            [4, 3, '=', 'equals', false],  // 第3列
        ];

        for (const btn of buttons) {
            const row = btn[0] as number;
            const col = btn[1] as number;
            const label = btn[2] as string;
            const type = btn[3] as string;
            const isWide = btn[4] as boolean;

            // 0按钮占2列宽度，中心位置在第0列和第1列之间
            const actualWidth = isWide ? btnWidth * 2 + spacing : btnWidth;
            const x = isWide ? getX(0) + (btnWidth + spacing) / 2 : getX(col);
            const y = getY(row);

            const btnNode = this.createButton(label, type, actualWidth, btnHeight);
            btnNode.setPosition(x, y, 0);
            this.buttons.set(label, btnNode);
        }
    }

    /**
     * 创建节点
     */
    private createNode(name: string, parent: Node): Node {
        const node = new Node(name);
        node.setParent(parent);
        return node;
    }

    /**
     * 创建Label
     */
    private createLabel(name: string, parent: Node, options: {
        x: number, y: number, width: number, height: number,
        fontSize: number, color: Color
    }): Label {
        const node = this.createNode(name, parent);
        node.setPosition(options.x, options.y, 0);
        const transform = node.addComponent(UITransform);
        transform.setContentSize(options.width, options.height);

        const label = node.addComponent(Label);
        label.fontSize = options.fontSize;
        label.color = options.color;
        label.horizontalAlign = Label.HorizontalAlign.RIGHT; // 修复：使用枚举而非数字
        label.verticalAlign = Label.VerticalAlign.CENTER;   // 修复：使用枚举而非数字

        return label;
    }

    /**
     * 创建按钮
     */
    private createButton(label: string, type: string, width: number, height: number): Node {
        const node = new Node('Btn_' + label);
        this.buttonPanel.addChild(node);

        const transform = node.addComponent(UITransform);
        transform.setContentSize(width, height);

        // 背景 - 使用 Graphics 绘制矩形
        const graphics = node.addComponent(Graphics);
        graphics.fillColor = this.getButtonColor(type);
        graphics.rect(-width/2, -height/2, width, height);
        graphics.fill();

        // 按钮组件
        const button = node.addComponent(Button);
        button.target = node;

        // 文字
        const textNode = new Node('Label');
        node.addChild(textNode);
        textNode.addComponent(UITransform).setContentSize(width - 10, height - 10);

        const textLabel = textNode.addComponent(Label);
        textLabel.string = label;
        textLabel.fontSize = type === 'function' ? 24 : 32;
        textLabel.color = type === 'equals' ? new Color(0, 0, 0, 255) : new Color(255, 255, 255, 255);
        textLabel.horizontalAlign = Label.HorizontalAlign.CENTER; // 修复：使用枚举
        textLabel.verticalAlign = Label.VerticalAlign.CENTER;     // 修复：使用枚举

        // 点击事件 - 使用 EventHandler
        const eventHandler = new EventHandler();
        eventHandler.target = this.node;
        eventHandler.component = 'CalculatorUI';
        eventHandler.handler = 'onButtonClick';
        eventHandler.customEventData = label;
        button.clickEvents.push(eventHandler);

        // 点击效果
        this.addButtonEffect(node);

        return node;
    }

    /**
     * 获取按钮颜色
     */
    private getButtonColor(type: string): Color {
        switch (type) {
            case 'number': return new Color(39, 39, 42, 255);
            case 'operator': return new Color(245, 158, 11, 255);
            case 'function': return new Color(255, 255, 255, 16);
            case 'equals': return new Color(255, 255, 255, 255);
            default: return new Color(128, 128, 128, 255);
        }
    }

    /**
     * 添加按钮点击效果
     */
    private addButtonEffect(node: Node): void {
        const originalScale = node.getScale().clone();
        const scaleDown = 0.95;

        // 修复：添加 EventTouch 类型注解，避免类型错误
        node.on('touchstart', (event: EventTouch) => {
            tween(node)
                .to(0.05, { scale: new Vec3(scaleDown, scaleDown, 1) })
                .start();
        });

        node.on('touchend', (event: EventTouch) => {
            tween(node)
                .to(0.1, { scale: originalScale })
                .start();
        });

        node.on('touchcancel', (event: EventTouch) => {
            tween(node)
                .to(0.1, { scale: originalScale })
                .start();
        });
    }

    /**
     * 按钮点击处理 - 修复：添加 public 修饰符，否则无法被 EventHandler 调用
     */
    public onButtonClick(event: EventTouch, customData: string): void {
        const label = customData;

        switch (label) {
            case 'C': this.clear(); break;
            case '+/-': this.toggleSign(); break;
            case '%': this.percentage(); break;
            case '÷': case '×': case '−': case '+':
                this.setOperator(label); break;
            case '=': this.calculate(); break;
            case '.': this.inputDecimal(); break;
            default:
                if (label >= '0' && label <= '9') {
                    this.inputDigit(label);
                }
                break;
        }

        this.updateDisplay();
    }

    // ========== 计算器逻辑 ==========

    private inputDigit(digit: string): void {
        if (this.waitingForOperand) {
            this.currentValue = digit;
            this.waitingForOperand = false;
        } else {
            if (this.currentValue === '0') {
                this.currentValue = digit;
            } else if (this.currentValue.length < 16) {
                this.currentValue += digit;
            }
        }
    }

    private inputDecimal(): void {
        if (this.waitingForOperand) {
            this.currentValue = '0.';
            this.waitingForOperand = false;
            return;
        }
        if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }
    }

    private clear(): void {
        this.currentValue = '0';
        this.expression = '';
        this.previousValue = 0;
        this.operator = '';
        this.waitingForOperand = false;
    }

    private toggleSign(): void {
        const value = parseFloat(this.currentValue);
        if (!isNaN(value) && value !== 0) { // 修复：添加 NaN 检查
            this.currentValue = (-value).toString();
        }
    }

    private percentage(): void {
        const value = parseFloat(this.currentValue);
        if (!isNaN(value)) { // 修复：添加 NaN 检查
            this.currentValue = (value / 100).toString();
        }
    }

    private setOperator(op: string): void {
        const inputValue = parseFloat(this.currentValue);
        if (isNaN(inputValue)) return; // 修复：添加 NaN 检查

        if (this.operator && !this.waitingForOperand) {
            const result = this.doCalculate(this.previousValue, inputValue, this.operator);
            this.currentValue = this.formatResult(result);
            this.previousValue = result;
        } else {
            this.previousValue = inputValue;
        }

        this.operator = op;
        this.waitingForOperand = true;
        this.expression = `${this.previousValue} ${this.operator}`;
    }

    private calculate(): void {
        const inputValue = parseFloat(this.currentValue);
        if (isNaN(inputValue)) return; // 修复：添加 NaN 检查

        // 检查密码 7890
        if (this.currentValue === '7890') {
            console.log('跳转到游戏大厅');
            // 修复：添加场景跳转错误处理
            director.loadScene('Lobby', (err) => {
                if (err) {
                    console.error('场景跳转失败:', err);
                    // 备用方案：提示用户
                    this.currentValue = '场景不存在';
                }
            });
            return;
        }

        if (!this.operator) return;

        const result = this.doCalculate(this.previousValue, inputValue, this.operator);
        this.expression = `${this.previousValue} ${this.operator} ${inputValue} =`;
        this.currentValue = this.formatResult(result);
        this.previousValue = result;
        this.operator = '';
        this.waitingForOperand = true;
    }

    private doCalculate(a: number, b: number, op: string): number {
        switch (op) {
            case '+': return a + b;
            case '−': return a - b;
            case '×': return a * b;
            case '÷': return b !== 0 ? a / b : 0;
            default: return b;
        }
    }

    private formatResult(value: number): string {
        if (isNaN(value)) return '0'; // 修复：处理 NaN 情况
        if (Math.abs(value) > 1e15 || (Math.abs(value) < 0.0001 && value !== 0)) {
            return value.toExponential(6);
        }
        // 修复：避免出现 .0000000000 这样的冗余小数
        const formatted = (Math.round(value * 1e10) / 1e10).toString();
        if (formatted.includes('.') && formatted.endsWith('0')) {
            return formatted.replace(/\.?0*$/, '');
        }
        return formatted;
    }

    private updateDisplay(): void {
        if (this.resultLabel) {
            this.resultLabel.string = this.currentValue;
        }
        if (this.expressionLabel) {
            this.expressionLabel.string = this.expression;
        }
    }
}