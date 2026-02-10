import { Entity } from '../core/Entity';

/**
 * 炮弹类
 * 处理直线运动、墙壁碰撞逻辑、敌我伤害判定
 */
export class Bullet extends Entity {
  private speed: number = 300;
  private damage: number = 1;
  public isEnemyBullet: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet');
    this.setActive(false);
    this.setVisible(false);
  }

  /**
   * 发射炮弹
   * @param x 起始X坐标
   * @param y 起始Y坐标
   * @param direction 移动方向 (Phaser.Math.Vector2)
   * @param isEnemy 是否为敌方炮弹
   */
  public fire(x: number, y: number, direction: Phaser.Math.Vector2, isEnemy: boolean = false) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.isEnemyBullet = isEnemy;

    // 设置速度
    this.getBody().setVelocity(direction.x * this.speed, direction.y * this.speed);

    // 调整炮弹角度
    if (direction.x !== 0) {
      this.setAngle(direction.x > 0 ? 90 : -90);
    } else {
      this.setAngle(direction.y > 0 ? 180 : 0);
    }
  }

  /**
   * 销毁炮弹（回收到对象池）
   */
  public kill() {
    this.setActive(false);
    this.setVisible(false);
    this.getBody().stop();
    // 可以在这里播放爆炸特效
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    // 边界检查，超出屏幕自动销毁
    if (!this.scene.cameras.main.worldView.contains(this.x, this.y)) {
      this.kill();
    }
  }
}