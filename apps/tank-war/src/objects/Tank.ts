import { Entity } from '../core/Entity';
import { Bullet } from './Bullet';
import { MainScene } from '../scenes/MainScene';
import { TILE_SIZE } from '../config/GameMap';

/**
 * 坦克类
 * 继承自 Entity。包含：等级、生命值、移动方向、开火冷却
 */
export class Tank extends Entity {
  protected speed: number = 100;
  protected health: number = 1;
  protected lastFired: number = 0;
  protected fireRate: number = 1000; // 毫秒
  protected currentDirection: Phaser.Math.Vector2;
  protected isEnemy: boolean = false;
  protected bullets: Phaser.GameObjects.Group;

  // AI 相关
  private isAIEnabled: boolean = false;
  private aiMoveTimer: number = 0;
  private aiFireTimer: number = 0;
  private nextMoveTime: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, bullets: Phaser.GameObjects.Group) {
    super(scene, x, y, texture);
    this.bullets = bullets;
    this.currentDirection = new Phaser.Math.Vector2(0, -1); // 默认向上
  }

  public setAI(enabled: boolean) {
    this.isAIEnabled = enabled;
    this.isEnemy = enabled; // 通常 AI 都是敌人
    if (enabled) {
      this.speed = 80; // 敌人稍微慢一点
    }
  }

  update(time: number, delta: number) {
    if (this.isAIEnabled) {
      this.updateAI(time);
    }
  }

  private updateAI(time: number) {
    // 移动逻辑
    if (time > this.nextMoveTime) {
      const dirs = [
        new Phaser.Math.Vector2(0, 1),
        new Phaser.Math.Vector2(0, -1),
        new Phaser.Math.Vector2(1, 0),
        new Phaser.Math.Vector2(-1, 0)
      ];
      // 简单的随机移动，后续可以优化为寻路
      const randDir = dirs[Phaser.Math.Between(0, 3)];
      this.move(randDir);

      // 随机 1-3 秒后再次改变方向
      this.nextMoveTime = time + Phaser.Math.Between(1000, 3000);
    } else {
      // 保持当前方向移动
      this.move(this.currentDirection);
    }

    // 开火逻辑
    // 简单的概率开火，或者检测前方是否有障碍物
    if (Phaser.Math.Between(0, 100) > 98) {
      this.fire(time);
    }
  }

  /**
   * 移动坦克
   * @param direction 移动方向
   */
  public move(direction: Phaser.Math.Vector2) {
    if (direction.length() === 0) {
      this.getBody().setVelocity(0, 0);
      return;
    }

    const normalizedDir = direction.clone().normalize();

    // 检查输入方向的主轴
    const isHorizontal = Math.abs(normalizedDir.x) > Math.abs(normalizedDir.y);

    // 持续尝试对齐网格
    // 只要有移动输入，就尝试将非移动轴对齐到网格中心
    // 这可以解决转向时的卡顿，并消除微小偏移
    this.alignToGrid(isHorizontal);

    this.currentDirection = normalizedDir;
    this.getBody().setVelocity(this.currentDirection.x * this.speed, this.currentDirection.y * this.speed);

    // 旋转坦克以面向移动方向
    if (Math.abs(this.currentDirection.x) > 0.1) {
      this.setAngle(this.currentDirection.x > 0 ? 90 : -90);
    } else if (Math.abs(this.currentDirection.y) > 0.1) {
      this.setAngle(this.currentDirection.y > 0 ? 180 : 0);
    }
  }

  /**
   * 将坦克对齐到最近的网格中心
   * @param isHorizontalMove 是否正在进行水平移动（如果是，则对齐 Y 轴；否则对齐 X 轴）
   */
  private alignToGrid(isHorizontalMove: boolean) {
    const threshold = 8; // 容差像素，越小越严格，越大越容易吸附。8像素对于32-40的格子比较合适

    if (isHorizontalMove) {
      // 正在水平移动，对齐 Y 轴
      const currentY = this.y;
      // 计算最近的网格中心 Y
      const gridY = Math.floor(currentY / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;

      if (Math.abs(currentY - gridY) < threshold) {
        this.y = gridY;
      }
    } else {
      // 正在垂直移动，对齐 X 轴
      const currentX = this.x;
      // 计算最近的网格中心 X
      const gridX = Math.floor(currentX / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;

      if (Math.abs(currentX - gridX) < threshold) {
        this.x = gridX;
      }
    }
  }

  /**
   * 开火
   * @param time 当前游戏时间
   */
  public fire(time: number) {
    if (time > this.lastFired) {
      const bullet = this.bullets.get(this.x, this.y) as Bullet;
      if (bullet) {
        // 调整炮弹发射位置，避免直接撞到自己
        const offset = 20;
        const startX = this.x + this.currentDirection.x * offset;
        const startY = this.y + this.currentDirection.y * offset;

        bullet.fire(startX, startY, this.currentDirection, this.isEnemy);
        this.lastFired = time + this.fireRate;
      }
    }
  }

  /**
   * 受到伤害
   * @param damage 伤害值
   */
  public takeDamage(damage: number) {
    this.health -= damage;
    if (this.health <= 0) {
      this.destroy();
      // 播放爆炸特效
      if (this.scene instanceof MainScene) {
        (this.scene as MainScene).showExplosion(this.x, this.y);
      }
    }
  }
}