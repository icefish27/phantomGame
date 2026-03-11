import { _decorator, Component, Node, Label, Button, Color, UITransform, Vec3, tween, Sprite, Graphics, SpriteFrame, resources } from 'cc';

const { ccclass, property } = _decorator;

import { GameData } from './LobbyUI';

@ccclass('GameCard')
export class GameCard extends Component {

    @property(Label)
    titleLabel: Label | null = null;

    @property(Label)
    subtitleLabel: Label | null = null;

    @property(Node)
    bgNode: Node | null = null;

    @property(Node)
    borderNode: Node | null = null;

    @property(Node)
    glowNode: Node | null = null;

    @property(Node)
    gradientNode: Node | null = null;

    @property(Sprite)
    bgSprite: Sprite | null = null;

    private gameData: GameData | null = null;
    private index: number = 0;
    private isSelected: boolean = false;
    private clickCallback: ((index: number) => void) | null = null;

    onLoad() {
        this.bindButtonClick();
    }

    public init(data: GameData, index: number): void {
        this.gameData = data;
        this.index = index;

        if (this.titleLabel) {
            this.titleLabel.string = data.title;
        }
        if (this.subtitleLabel) {
            this.subtitleLabel.string = data.subtitle;
        }

        // 加载背景图片
        if (this.bgSprite && data.imagePath) {
            resources.load(data.imagePath, SpriteFrame, (err, spriteFrame) => {
                if (!err && spriteFrame) {
                    this.bgSprite!.spriteFrame = spriteFrame;
                }
            });
        }

        this.updateThemeColor(data.themeColor);
    }

    public setClickCallback(callback: (index: number) => void): void {
        this.clickCallback = callback;
    }

    public setSelected(selected: boolean): void {
        if (this.isSelected === selected) return;

        this.isSelected = selected;
        this.updateVisuals();
    }

    private updateVisuals(): void {
        if (!this.titleLabel || !this.subtitleLabel) return;

        const titleColor = this.isSelected ? new Color(255, 255, 255, 255) : new Color(255, 255, 255, 204);
        const subtitleColor = this.isSelected ? new Color(255, 255, 255, 173) : new Color(255, 255, 255, 102);
        const titleFontSize = this.isSelected ? 20 : 18;

        this.titleLabel.color = titleColor;
        this.titleLabel.fontSize = titleFontSize;
        this.subtitleLabel.color = subtitleColor;

        if (this.borderNode) {
            const borderGraphics = this.borderNode.getComponent(Graphics);
            if (borderGraphics) {
                borderGraphics.strokeColor = new Color(255, 255, 255, this.isSelected ? 61 : 26);
                borderGraphics.clear();
                borderGraphics.lineWidth = 1;
                borderGraphics.roundRect(-102, -47, 204, 94, 20);
                borderGraphics.stroke();
            }
        }

        if (this.glowNode) {
            this.glowNode.active = this.isSelected;
        }

        const targetScale = this.isSelected ? 1.035 : 1.0;
        tween(this.node)
            .to(0.2, { scale: new Vec3(targetScale, targetScale, 1) })
            .start();
    }

    private updateThemeColor(color: Color): void {
        if (!this.gradientNode) return;

        const gradientGraphics = this.gradientNode.getComponent(Graphics);
        if (gradientGraphics) {
            const startColor = new Color(color.r, color.g, color.b, 89);
            const endColor = new Color(color.r, color.g, color.b, 26);
            this.drawGradient(gradientGraphics, 200, 94, startColor, endColor);
        }
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

    private bindButtonClick(): void {
        const button = this.node.getComponent(Button);
        if (button) {
            button.node.on(Button.EventType.CLICK, this.onClick, this);
        }
    }

    private onClick(): void {
        if (this.clickCallback) {
            this.clickCallback(this.index);
        }
    }
}
