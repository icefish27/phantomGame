import { _decorator, Component, Node, Label, Button, Color, UITransform, Vec3, tween, ScrollView, Graphics } from 'cc';

const { ccclass } = _decorator;

export interface GameData {
    title: string;
    subtitle: string;
    themeColor: Color;
}

@ccclass('LobbyUI')
export class LobbyUI extends Component {

    private readonly games: GameData[] = [
        { title: "斗地主", subtitle: "经典对局，快速开玩", themeColor: new Color(251, 191, 36, 255) },
        { title: "麻将", subtitle: "轻松牌局，随时来一圈", themeColor: new Color(52, 211, 153, 255) },
        { title: "象棋", subtitle: "残局推演，策略博弈", themeColor: new Color(96, 165, 250, 255) },
        { title: "更多游戏", subtitle: "后续持续扩展追加", themeColor: new Color(217, 70, 239, 255) },
    ];

    private selectedIndex: number = 0;
    private gameCards: Node[] = [];
    private indicators: Node[] = [];
    private scrollView: ScrollView | null = null;
    private titleLabel: Label | null = null;
    private subtitleLabel: Label | null = null;
    private accentLayer: Node | null = null;

    onLoad() {
        this.buildUI();
    }

    start() {
        this.updateSelection();
    }

    private buildUI(): void {
        const canvas = this.node;
        const canvasTransform = canvas.getComponent(UITransform)!;
        const width = canvasTransform.contentSize.width;
        const height = canvasTransform.contentSize.height;

        const leftWidth = width * 0.3;
        const rightWidth = width * 0.7;

        this.createLeftPanel(leftWidth, height);
        this.createRightPanel(rightWidth, height);
    }

    private createLeftPanel(width: number, height: number): void {
        const leftPanel = this.createNode('LeftPanel', this.node);
        leftPanel.setPosition(-width / 2, 0, 0);
        leftPanel.addComponent(UITransform).setContentSize(width, height);

        const bg = this.createNode('Bg', leftPanel);
        bg.addComponent(UITransform).setContentSize(width, height);
        const bgGraphics = bg.addComponent(Graphics);
        this.drawGradient(bgGraphics, width, height, 
            new Color(7, 11, 18, 255), 
            new Color(12, 19, 32, 255)
        );

        const titleLabel = this.createLabel('GameListTitle', leftPanel, {
            x: 0, y: height / 2 - 40, width: width, height: 30,
            fontSize: 18, color: new Color(255, 255, 255, 72)
        });
        titleLabel.string = 'GAME LIST';

        const scrollViewNode = this.createNode('ScrollView', leftPanel);
        scrollViewNode.setPosition(0, -20, 0);
        scrollViewNode.addComponent(UITransform).setContentSize(width, height - 80);

        this.scrollView = scrollViewNode.addComponent(ScrollView);
        this.scrollView.horizontal = false;
        this.scrollView.vertical = true;
        this.scrollView.inertia = true;
        this.scrollView.brake = 0.05;
        this.scrollView.elastic = true;

        const content = this.createNode('content', scrollViewNode);
        content.addComponent(UITransform).setContentSize(width, height - 80);
        this.scrollView.content = content;

        const startY = (height - 80) / 2 - 80;
        for (let i = 0; i < this.games.length; i++) {
            const game = this.games[i];
            const card = this.createGameCard(game, width - 40, 94, i === 0);
            card.setParent(content);
            const y = startY - i * 104 - 47;
            card.setPosition(0, y, 0);
            this.gameCards.push(card);
        }
    }

    private createGameCard(game: GameData, width: number, height: number, isActive: boolean): Node {
        const card = this.createNode('GameCard', this.node);
        const transform = card.addComponent(UITransform);
        transform.setContentSize(width, height);

        const bg = this.createNode('Bg', card);
        bg.addComponent(UITransform).setContentSize(width, height);
        const bgGraphics = bg.addComponent(Graphics);
        bgGraphics.fillColor = new Color(30, 30, 40, 200);
        bgGraphics.roundRect(-width/2, -height/2, width, height, 18);
        bgGraphics.fill();

        const gradientBg = this.createNode('GradientBg', card);
        gradientBg.addComponent(UITransform).setContentSize(width, height);
        const gradientGraphics = gradientBg.addComponent(Graphics);
        const startColor = new Color(game.themeColor.r, game.themeColor.g, game.themeColor.b, 89);
        const endColor = new Color(game.themeColor.r, game.themeColor.g, game.themeColor.b, 26);
        this.drawGradient(gradientGraphics, width, height, startColor, endColor);
        gradientGraphics.roundRect(-width/2, -height/2, width, height, 18);
        gradientGraphics.fill();

        const border = this.createNode('Border', card);
        border.addComponent(UITransform).setContentSize(width + 4, height + 4);
        const borderGraphics = border.addComponent(Graphics);
        borderGraphics.strokeColor = new Color(255, 255, 255, isActive ? 61 : 26);
        borderGraphics.lineWidth = 1;
        borderGraphics.roundRect(-(width+4)/2, -(height+4)/2, width + 4, height + 4, 20);
        borderGraphics.stroke();
        border.setSiblingIndex(0);

        let glow: Node | null = null;
        if (isActive) {
            glow = this.createNode('Glow', card);
            glow.addComponent(UITransform).setContentSize(width + 12, height + 12);
            const glowGraphics = glow.addComponent(Graphics);
            glowGraphics.fillColor = new Color(255, 255, 255, 26);
            glowGraphics.roundRect(-(width+12)/2, -(height+12)/2, width + 12, height + 12, 24);
            glowGraphics.fill();
            glow.setSiblingIndex(-1);
        }

        const titleLabel = this.createLabel('Title', card, {
            x: -width / 2 + 16, y: -height / 2 + 24, width: width - 32, height: 28,
            fontSize: isActive ? 20 : 18, color: new Color(255, 255, 255, isActive ? 255 : 204)
        });
        titleLabel.string = game.title;

        const subtitleLabel = this.createLabel('Subtitle', card, {
            x: -width / 2 + 16, y: -height / 2 + 54, width: width - 32, height: 20,
            fontSize: 14, color: new Color(255, 255, 255, isActive ? 173 : 102)
        });
        subtitleLabel.string = game.subtitle;

        const button = card.addComponent(Button);
        button.node.on(Button.EventType.CLICK, () => {
            const index = this.games.indexOf(game);
            this.onCardClick(index);
        });

        (card as any).borderNode = border;
        (card as any).glowNode = glow;
        (card as any).titleLabel = titleLabel;
        (card as any).subtitleLabel = subtitleLabel;

        return card;
    }

    private createRightPanel(width: number, height: number): void {
        const rightPanel = this.createNode('RightPanel', this.node);
        rightPanel.setPosition(width / 2, 0, 0);
        rightPanel.addComponent(UITransform).setContentSize(width, height);

        const bg = this.createNode('Bg', rightPanel);
        bg.addComponent(UITransform).setContentSize(width, height);
        const bgGraphics = bg.addComponent(Graphics);
        this.drawGradient(bgGraphics, width, height, 
            new Color(10, 16, 32, 250), 
            new Color(7, 9, 16, 250)
        );

        this.accentLayer = this.createNode('AccentLayer', rightPanel);
        this.accentLayer.addComponent(UITransform).setContentSize(width, height);
        const accentGraphics = this.accentLayer.addComponent(Graphics);
        this.drawGradient(accentGraphics, width, height, 
            new Color(253, 186, 116, 89), 
            new Color(251, 191, 36, 26)
        );

        const selectedTitle = this.createLabel('SelectedTitle', rightPanel, {
            x: -width / 2 + 40, y: height / 2 - 50, width: width - 80, height: 24,
            fontSize: 16, color: new Color(255, 255, 255, 82)
        });
        selectedTitle.string = 'NOW SELECTED';

        this.titleLabel = this.createLabel('GameTitle', rightPanel, {
            x: -width / 2 + 40, y: height / 2 - 120, width: width - 80, height: 70,
            fontSize: 48, color: new Color(255, 255, 255, 255)
        });

        this.subtitleLabel = this.createLabel('GameSubtitle', rightPanel, {
            x: -width / 2 + 40, y: height / 2 - 180, width: width - 80, height: 40,
            fontSize: 18, color: new Color(255, 255, 255, 133)
        });

        const divider = this.createNode('Divider', rightPanel);
        divider.addComponent(UITransform).setContentSize(280, 1);
        divider.setPosition(-width / 2 + 40, height / 2 - 220, 0);
        const dividerGraphics = divider.addComponent(Graphics);
        dividerGraphics.fillColor = new Color(255, 255, 255, 26);
        dividerGraphics.rect(0, 0, 280, 1);
        dividerGraphics.fill();

        this.createBottomControls(rightPanel, width, height);
    }

    private createBottomControls(rightPanel: Node, width: number, height: number): void {
        const bottomY = -height / 2 + 60;

        const indicatorContainer = this.createNode('Indicators', rightPanel);
        indicatorContainer.setPosition(-width / 2 + 60, bottomY, 0);

        const indicatorSpacing = 20;
        for (let i = 0; i < this.games.length; i++) {
            const dot = this.createNode(`Dot_${i}`, indicatorContainer);
            const dotWidth = i === 0 ? 32 : 10;
            dot.addComponent(UITransform).setContentSize(dotWidth, 6);
            dot.setPosition(i * indicatorSpacing, 0, 0);
            const dotGraphics = dot.addComponent(Graphics);
            dotGraphics.fillColor = new Color(255, 255, 255, i === 0 ? 255 : 51);
            dotGraphics.roundRect(-dotWidth / 2, -3, dotWidth, 6, 3);
            dotGraphics.fill();
            this.indicators.push(dot);
        }

        const btnContainer = this.createNode('Buttons', rightPanel);
        btnContainer.setPosition(width / 2 - 80, bottomY, 0);

        const prevBtn = this.createControlButton('PrevBtn', '◀', 40, 40);
        prevBtn.setParent(btnContainer);
        prevBtn.setPosition(-60, 0, 0);
        prevBtn.addComponent(Button).node.on(Button.EventType.CLICK, this.onPrevClick, this);

        const nextBtn = this.createControlButton('NextBtn', '▶', 40, 40);
        nextBtn.setParent(btnContainer);
        nextBtn.setPosition(0, 0, 0);
        nextBtn.addComponent(Button).node.on(Button.EventType.CLICK, this.onNextClick, this);

        const enterBtn = this.createEnterButton('EnterBtn', '进入', 80, 40);
        enterBtn.setParent(btnContainer);
        enterBtn.setPosition(70, 0, 0);
        enterBtn.addComponent(Button).node.on(Button.EventType.CLICK, this.onEnterClick, this);
    }

    private createControlButton(name: string, label: string, width: number, height: number): Node {
        const node = this.createNode(name, this.node);
        node.addComponent(UITransform).setContentSize(width, height);

        const bg = node.addComponent(Graphics);
        bg.fillColor = new Color(255, 255, 255, 26);
        bg.roundRect(-width/2, -height/2, width, height, 20);
        bg.fill();

        const text = this.createLabel(name + '_Label', node, {
            x: 0, y: 0, width: width - 10, height: height - 10,
            fontSize: 16, color: new Color(255, 255, 255, 200)
        });
        text.string = label;

        return node;
    }

    private createEnterButton(name: string, label: string, width: number, height: number): Node {
        const node = this.createNode(name, this.node);
        node.addComponent(UITransform).setContentSize(width, height);

        const bg = node.addComponent(Graphics);
        bg.fillColor = new Color(255, 255, 255, 255);
        bg.roundRect(-width/2, -height/2, width, height, 20);
        bg.fill();

        const text = this.createLabel(name + '_Label', node, {
            x: 0, y: 0, width: width - 10, height: height - 10,
            fontSize: 16, color: new Color(0, 0, 0, 255)
        });
        text.string = label;

        return node;
    }

    private drawGradient(graphics: Graphics, width: number, height: number, startColor: Color, endColor: Color): void {
        const steps = 20;
        for (let i = 0; i < steps; i++) {
            const t = i / (steps - 1);
            const r = Math.round(startColor.r + (endColor.r - startColor.r) * t);
            const g = Math.round(startColor.g + (endColor.g - startColor.g) * t);
            const b = Math.round(startColor.b + (endColor.b - startColor.b) * t);
            const a = Math.round(startColor.a + (endColor.a - startColor.a) * t);

            graphics.fillColor = new Color(r, g, b, a);
            graphics.rect(-width/2, -height/2 + (height/steps) * i, width, height/steps);
            graphics.fill();
        }
    }

    private updateSelection(): void {
        this.updateCards();
        this.updateIndicators();
        this.updateRightPanel();
    }

    private updateCards(): void {
        for (let i = 0; i < this.gameCards.length; i++) {
            const card = this.gameCards[i];
            const isActive = i === this.selectedIndex;
            const border = (card as any).borderNode as Node;
            const glow = (card as any).glowNode as Node;
            const titleLabel = (card as any).titleLabel as Label;
            const subtitleLabel = (card as any).subtitleLabel as Label;

            if (border) {
                const graphics = border.getComponent(Graphics)!;
                graphics.strokeColor = new Color(255, 255, 255, isActive ? 61 : 26);
                graphics.clear();
                graphics.lineWidth = 1;
                graphics.roundRect(-102, -47, 204, 94, 20);
                graphics.stroke();
            }

            if (glow) {
                if (isActive) {
                    glow.active = true;
                    const graphics = glow.getComponent(Graphics)!;
                    graphics.clear();
                    graphics.fillColor = new Color(255, 255, 255, 26);
                    graphics.roundRect(-108, -53, 216, 106, 24);
                    graphics.fill();
                } else {
                    glow.active = false;
                }
            }

            if (titleLabel) {
                titleLabel.fontSize = isActive ? 20 : 18;
                titleLabel.color = new Color(255, 255, 255, isActive ? 255 : 204);
            }

            if (subtitleLabel) {
                subtitleLabel.color = new Color(255, 255, 255, isActive ? 173 : 102);
            }

            const targetScale = isActive ? 1.035 : 1.0;
            tween(card)
                .to(0.2, { scale: new Vec3(targetScale, targetScale, 1) })
                .start();
        }
    }

    private updateIndicators(): void {
        for (let i = 0; i < this.indicators.length; i++) {
            const dot = this.indicators[i];
            const isActive = i === this.selectedIndex;
            const graphics = dot.getComponent(Graphics)!;
            graphics.fillColor = new Color(255, 255, 255, isActive ? 255 : 51);
            graphics.clear();
            const w = isActive ? 32 : 10;
            graphics.roundRect(-w / 2, -3, w, 6, 3);
            graphics.fill();

            dot.getComponent(UITransform)!.setContentSize(w, 6);
        }
    }

    private updateRightPanel(): void {
        const game = this.games[this.selectedIndex];
        if (this.titleLabel) {
            this.titleLabel.string = game.title;
        }
        if (this.subtitleLabel) {
            this.subtitleLabel.string = game.subtitle;
        }

        if (this.accentLayer) {
            const graphics = this.accentLayer.getComponent(Graphics);
            if (graphics) {
                const transform = this.accentLayer.getComponent(UITransform);
                if (transform) {
                    const width = transform.contentSize.width;
                    const height = transform.contentSize.height;
                    const startColor = new Color(game.themeColor.r, game.themeColor.g, game.themeColor.b, 89);
                    const endColor = new Color(game.themeColor.r, game.themeColor.g, game.themeColor.b, 26);
                    this.drawGradient(graphics, width, height, startColor, endColor);
                }
            }
        }
    }

    private scrollToCard(index: number): void {
        if (!this.scrollView) return;

        const content = this.scrollView.content;
        if (!content) return;

        const cardHeight = 94;
        const spacing = 10;
        const targetY = index * (cardHeight + spacing);

        tween(content)
            .to(0.3, { position: new Vec3(content.position.x, targetY, 0) })
            .start();
    }

    public onCardClick(index: number): void {
        if (index === this.selectedIndex) return;

        this.selectedIndex = index;
        this.updateSelection();
        this.scrollToCard(index);
    }

    public onPrevClick(): void {
        const newIndex = (this.selectedIndex - 1 + this.games.length) % this.games.length;
        this.onCardClick(newIndex);
    }

    public onNextClick(): void {
        const newIndex = (this.selectedIndex + 1) % this.games.length;
        this.onCardClick(newIndex);
    }

    public onEnterClick(): void {
        const game = this.games[this.selectedIndex];
        console.log('进入游戏:', game.title);
    }

    private createNode(name: string, parent: Node): Node {
        const node = new Node(name);
        node.setParent(parent);
        return node;
    }

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
        label.horizontalAlign = Label.HorizontalAlign.LEFT;
        label.verticalAlign = Label.VerticalAlign.CENTER;

        return label;
    }
}
