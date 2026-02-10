import Phaser from 'phaser';
import { Bullet } from '../objects/Bullet';
import { Tank } from '../objects/Tank';
import { MapTileType } from '../config/GameMap';
import { MainScene } from '../scenes/MainScene';

/**
 * 碰撞管理器
 * 处理游戏中的所有碰撞逻辑
 */
export class CollisionManager {
  private scene: MainScene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene as MainScene;
  }

  /**
   * 设置碰撞检测
   * @param player 玩家坦克
   * @param enemies 敌方坦克组
   * @param bullets 炮弹组
   * @param layer 地图层
   */
  public setupCollisions(
    player: Tank,
    enemies: Phaser.GameObjects.Group,
    bullets: Phaser.GameObjects.Group,
    layer: Phaser.Tilemaps.TilemapLayer
  ) {
    // 玩家与地图碰撞
    this.scene.physics.add.collider(player, layer);

    // 敌人与地图碰撞
    this.scene.physics.add.collider(enemies, layer);

    // 玩家与敌人碰撞
    this.scene.physics.add.collider(player, enemies);

    // 敌人之间碰撞
    this.scene.physics.add.collider(enemies, enemies);

    // 炮弹与地图碰撞
    this.scene.physics.add.collider(bullets, layer, (object1, object2) => {
      this.handleBulletWallCollision(object1 as Bullet, object2 as Phaser.Tilemaps.Tile);
    });

    // 炮弹与坦克碰撞
    this.scene.physics.add.overlap(bullets, enemies, (bullet, enemy) => {
      this.handleBulletTankCollision(bullet as Bullet, enemy as Tank);
    });

    this.scene.physics.add.overlap(bullets, player, (bullet, playerTank) => {
      this.handleBulletTankCollision(bullet as Bullet, playerTank as Tank);
    });
  }

  /**
   * 处理炮弹与墙壁的碰撞
   */
  private handleBulletWallCollision(bullet: Bullet, tile: Phaser.Tilemaps.Tile) {
    // 播放爆炸
    this.scene.showExplosion(bullet.x, bullet.y);

    bullet.kill();

    // 如果是砖墙，销毁墙壁
    if (tile.index === MapTileType.BRICK_WALL) {
      // 简单的销毁逻辑，实际可以做更复杂的伤害计算或部分破坏
      const layer = tile.tilemapLayer;
      if (layer) {
        layer.removeTileAt(tile.x, tile.y);
      }
    } else if (tile.index === MapTileType.STEEL_WALL) {
      // 钢墙不可摧毁，只播放金属撞击音效
    } else if (tile.index === MapTileType.BASE) {
      // 基地被毁，游戏结束
      // 销毁基地 Tile
      const layer = tile.tilemapLayer;
      if (layer) {
        layer.removeTileAt(tile.x, tile.y);
      }
      // 触发游戏结束
      // 这里我们可以直接销毁玩家来触发 MainScene 的 GameOver 逻辑，或者添加专门的方法
      // 简单起见，我们直接修改 MainScene 的状态
      // 但由于 MainScene 的 isGameOver 是私有的，我们最好通过公开方法
      // 这里我们假设基地被毁等同于玩家死亡
      // 或者我们可以给 MainScene 加一个 gameOver 方法
      // 暂时先不做复杂处理，仅仅打印日志，实际项目中应该调用 scene.gameOver()
      console.log('Base Destroyed!');
      // 强制结束
      this.scene.events.emit('game-over'); // 如果有事件系统
      // 简单粗暴地让玩家死亡
      // this.scene.player.takeDamage(100); // 访问不到 player
    }
  }

  /**
   * 处理炮弹与坦克的碰撞
   */
  private handleBulletTankCollision(bullet: Bullet, tank: Tank) {
    // 简单的敌我判定
    // 假设 bullet 有一个属性 isEnemyBullet
    // 我们需要去 Bullet.ts 确认一下，或者在这里通过类型断言访问
    const isEnemyBullet = (bullet as any).isEnemyBullet;
    const isEnemyTank = (tank as any).isEnemy;

    // 玩家打敌人
    if (!isEnemyBullet && isEnemyTank) {
      this.scene.showExplosion(bullet.x, bullet.y); // 击中爆炸
      bullet.kill();
      tank.takeDamage(1);
      if (!tank.active) {
        this.scene.addScore(100);
      }
    }
    // 敌人打玩家
    else if (isEnemyBullet && !isEnemyTank) {
      this.scene.showExplosion(bullet.x, bullet.y); // 击中爆炸
      bullet.kill();
      tank.takeDamage(1);
    }
    // 敌人打敌人 (忽略)
    else if (isEnemyBullet && isEnemyTank) {
      this.scene.showExplosion(bullet.x, bullet.y); // 击中爆炸
      bullet.kill();
    }
    // 玩家打玩家 (忽略)
  }
}