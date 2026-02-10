import Phaser from 'phaser';

/**
 * 基础实体类
 * 处理位置、尺寸和物理碰撞体
 */
export class Entity extends Phaser.GameObjects.Sprite {
  protected scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    // 确保物理体存在
    if (this.body) {
      this.body.setCollideWorldBounds(true);
    }
  }

  /**
   * 获取物理身体
   */
  public getBody(): Phaser.Physics.Arcade.Body {
    return this.body as Phaser.Physics.Arcade.Body;
  }
}