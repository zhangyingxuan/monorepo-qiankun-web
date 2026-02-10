import Phaser from 'phaser';
import { Tank } from '../objects/Tank';
import { Bullet } from '../objects/Bullet';
import { GameMap, MapTileType, TILE_SIZE } from '../config/GameMap';
import { InputManager } from '../managers/InputManager';
import { CollisionManager } from '../managers/CollisionManager';
import { ObjectPool } from '../utils/ObjectPool';

export class MainScene extends Phaser.Scene {
  private player!: Tank;
  private enemies!: Phaser.GameObjects.Group;
  private bulletPool!: ObjectPool<Bullet>;
  private inputManager!: InputManager;
  private collisionManager!: CollisionManager;
  private mapLayer!: Phaser.Tilemaps.TilemapLayer;

  // UI
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOverText!: Phaser.GameObjects.Text;
  private isGameOver: boolean = false;

  constructor() {
    super('MainScene');
  }

  preload() {
    // 生成酷炫的坦克纹理
    this.createTankTexture('tank', 0x66BB6A, 0x2E7D32); // 玩家：绿色系
    this.createTankTexture('enemy', 0xEF5350, 0xC62828); // 敌人：红色系

    // 生成圆形子弹纹理
    this.createBulletTexture('bullet', 0xFFFF00);

    // 生成 Tileset 纹理 (将所有地形拼在一张图上)
    this.createTilesetTexture();

    // 生成爆炸纹理
    this.createExplosionTexture();
  }

  create() {
    // 创建爆炸动画
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 4 }),
      frameRate: 20,
      hideOnComplete: true
    });

    // 1. 初始化对象池
    this.bulletPool = new ObjectPool<Bullet>(this, Bullet, 50);

    // 2. 创建地图
    this.createMap();

    // 3. 创建玩家
    // 找到地图上的出生点（这里简单定为 4, 12）
    this.player = new Tank(this, 4 * TILE_SIZE + 20, 12 * TILE_SIZE + 20, 'tank', this.bulletPool.getGroup());

    // 4. 创建敌人
    this.enemies = this.add.group({ runChildUpdate: true });
    this.spawnEnemy(0, 0);
    this.spawnEnemy(6, 0);
    this.spawnEnemy(12, 0);

    // 5. 初始化管理器
    this.inputManager = new InputManager(this);
    this.collisionManager = new CollisionManager(this);

    // 6. 设置碰撞
    this.collisionManager.setupCollisions(
      this.player,
      this.enemies,
      this.bulletPool.getGroup(),
      this.mapLayer
    );

    // 7. 设置相机
    this.cameras.main.setBounds(0, 0, 13 * TILE_SIZE, 13 * TILE_SIZE);
    this.physics.world.setBounds(0, 0, 13 * TILE_SIZE, 13 * TILE_SIZE);

    // 8. UI
    this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', color: '#ffffff' })
      .setScrollFactor(0)
      .setDepth(100);

    this.gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'GAME OVER', { fontSize: '40px', color: '#ff0000' })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false);
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;

    if (!this.player.active) {
      this.isGameOver = true;
      this.gameOverText.setVisible(true);
      return;
    }

    // 处理玩家输入
    const direction = this.inputManager.getMoveDirection();
    this.player.move(direction);

    if (this.inputManager.isFireDown()) {
      this.player.fire(time);
    }

    // 更新玩家状态 (如果有需要)
    this.player.update(time, delta);

    // 敌人 AI 更新
    this.enemies.children.entries.forEach((enemy: any) => {
      const tank = enemy as Tank;
      if (tank.active) {
        tank.update(time, delta);
      }
    });

    // 检查胜利条件 (所有敌人被消灭)
    if (this.enemies.countActive() === 0) {
      this.gameOverText.setText('VICTORY!');
      this.gameOverText.setColor('#00ff00');
      this.gameOverText.setVisible(true);
      this.isGameOver = true;
    }
  }

  private createMap() {
    // 创建 Tilemap
    const map = this.make.tilemap({ data: GameMap, tileWidth: TILE_SIZE, tileHeight: TILE_SIZE });

    // 添加 Tileset
    // 注意：addTilesetImage 第一个参数是 Tiled 编辑器中的 tileset 名字（这里不重要），第二个是 key
    const tileset = map.addTilesetImage('tileset', 'tileset-texture');

    if (tileset) {
      this.mapLayer = map.createLayer(0, tileset, 0, 0)!;

      // 设置碰撞属性
      // 砖墙(1), 钢墙(2), 水(4), 家(5) 需要碰撞
      this.mapLayer.setCollision([MapTileType.BRICK_WALL, MapTileType.STEEL_WALL, MapTileType.WATER, MapTileType.BASE]);
    }
  }

  private spawnEnemy(gridX: number, gridY: number) {
    const x = gridX * TILE_SIZE + TILE_SIZE / 2;
    const y = gridY * TILE_SIZE + TILE_SIZE / 2;
    const enemy = new Tank(this, x, y, 'enemy', this.bulletPool.getGroup());
    enemy.setAI(true);
    this.enemies.add(enemy);
  }

  public addScore(points: number) {
    this.score += points;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  public showExplosion(x: number, y: number) {
    const explosion = this.add.sprite(x, y, 'explosion');
    explosion.play('explode');
    explosion.once('animationcomplete', () => {
      explosion.destroy();
    });
  }

  /**
   * 创建子弹纹理
   */
  private createBulletTexture(key: string, color: number) {
    const radius = 4;
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(color, 1);
    graphics.fillCircle(radius, radius, radius);
    graphics.generateTexture(key, radius * 2, radius * 2);
  }

  /**
   * 创建酷炫的坦克纹理
   * @param key 纹理 Key
   * @param bodyColor 车体颜色
   * @param turretColor 炮塔颜色
   */
  private createTankTexture(key: string, bodyColor: number, turretColor: number) {
    const size = TILE_SIZE; // 假设 TILE_SIZE 已导入
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // 1. 绘制履带 (左右两侧)
    const trackWidth = size * 0.25;
    graphics.fillStyle(0x333333); // 深灰色履带
    graphics.fillRect(0, 0, trackWidth, size); // 左履带
    graphics.fillRect(size - trackWidth, 0, trackWidth, size); // 右履带

    // 履带细节 (横纹)
    graphics.lineStyle(1, 0x000000, 0.5);
    for (let i = 0; i < size; i += 4) {
      graphics.beginPath();
      graphics.moveTo(0, i);
      graphics.lineTo(trackWidth, i);
      graphics.moveTo(size - trackWidth, i);
      graphics.lineTo(size, i);
      graphics.strokePath();
    }

    // 2. 绘制车体 (中间)
    const bodyWidth = size * 0.6;
    const bodyHeight = size * 0.85;
    const bodyX = (size - bodyWidth) / 2;
    const bodyY = (size - bodyHeight) / 2;

    graphics.fillStyle(bodyColor);
    graphics.fillRoundedRect(bodyX, bodyY, bodyWidth, bodyHeight, 4);

    // 车体细节 (简单的装甲线条)
    graphics.lineStyle(1, 0x000000, 0.3);
    graphics.strokeRoundedRect(bodyX + 2, bodyY + 2, bodyWidth - 4, bodyHeight - 4, 2);

    // 3. 绘制炮塔 (中心)
    const turretSize = size * 0.4;
    graphics.fillStyle(turretColor);
    graphics.fillCircle(size / 2, size / 2, turretSize / 2);
    graphics.lineStyle(1, 0x000000, 0.5);
    graphics.strokeCircle(size / 2, size / 2, turretSize / 2);

    // 4. 绘制炮管 (默认向上)
    const barrelWidth = size * 0.1;
    const barrelHeight = size * 0.45;
    graphics.fillStyle(0x666666); // 炮管颜色
    graphics.fillRect((size - barrelWidth) / 2, 0, barrelWidth, size / 2);

    // 炮口制退器
    graphics.fillStyle(0x333333);
    graphics.fillRect((size - barrelWidth * 1.5) / 2, 0, barrelWidth * 1.5, 4);

    // 生成纹理
    graphics.generateTexture(key, size, size);
  }

  private createPlaceholderTexture(key: string, color: number, width: number = TILE_SIZE, height: number = TILE_SIZE, alpha: number = 1) {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(color, alpha);
    graphics.fillRect(0, 0, width, height);
    graphics.generateTexture(key, width, height);
  }

  private createTilesetTexture() {
    // 创建一个包含所有 Tile 类型的纹理条
    // 0: Empty (Black/Transparent), 1: Brick (Brown), 2: Steel (Silver), 3: Grass (Green), 4: Water (Blue), 5: Base (Pink)
    const colors = [
      0x000000, // 0 Empty
      0xA52A2A, // 1 Brick
      0xC0C0C0, // 2 Steel
      0x00FF00, // 3 Grass
      0x0000FF, // 4 Water
      0xFF00FF  // 5 Base
    ];

    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    colors.forEach((color, index) => {
      graphics.fillStyle(color, 1);
      // 绘制每个 tile
      graphics.fillRect(index * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);

      // 给砖墙加点纹理细节
      if (index === 1) {
        graphics.lineStyle(2, 0x000000);
        graphics.strokeRect(index * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE);
      }
    });

    graphics.generateTexture('tileset-texture', TILE_SIZE * colors.length, TILE_SIZE);
  }

  private createExplosionTexture() {
    const size = 32;
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });

    // 绘制 5 帧爆炸效果
    for (let i = 0; i < 5; i++) {
      graphics.clear();
      graphics.fillStyle(0xffa500, 1 - i * 0.2); // 橙色，逐渐透明
      graphics.fillCircle(size / 2, size / 2, (i + 1) * 4);
      graphics.fillStyle(0xff0000, 1 - i * 0.2); // 红色核心
      graphics.fillCircle(size / 2, size / 2, (i + 1) * 2);

      // 这里我们需要把每一帧绘制到一个大的纹理上，或者生成 SpriteSheet
      // 简单起见，我们生成一个 SpriteSheet
      // 但是 graphics.generateTexture 只能生成一张图
      // 所以我们需要在不同的位置绘制
    }

    // 重新实现：绘制在一张宽图上
    graphics.clear();
    for (let i = 0; i < 5; i++) {
      const centerX = i * size + size / 2;
      const centerY = size / 2;

      graphics.fillStyle(0xffa500, 1);
      graphics.fillCircle(centerX, centerY, (i + 2) * 3);
      graphics.fillStyle(0xff0000, 1);
      graphics.fillCircle(centerX, centerY, (i + 1) * 2);
    }

    graphics.generateTexture('explosion', size * 5, size);

    // 手动添加帧信息，使其成为 SpriteSheet
    const texture = this.textures.get('explosion');
    for (let i = 0; i < 5; i++) {
      // add(name, sourceIndex, x, y, width, height)
      texture.add(i, 0, i * size, 0, size, size);
    }
  }
}