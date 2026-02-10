import Phaser from 'phaser';

/**
 * 对象池管理器
 * 封装 Phaser.GameObjects.Group 以实现对象池模式
 */
export class ObjectPool<T extends Phaser.GameObjects.GameObject> {
  private group: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene, classType: Function, maxSize: number = 50) {
    this.group = scene.add.group({
      classType: classType,
      maxSize: maxSize,
      runChildUpdate: true
    });
  }

  /**
   * 获取一个对象
   * 如果池中有空闲对象则复用，否则创建新对象（如果未达上限）
   */
  public get(x: number, y: number): T | null {
    const item = this.group.get(x, y);
    if (item) {
      item.setActive(true);
      item.setVisible(true);
    }
    return item as T;
  }

  /**
   * 获取底层 Group
   */
  public getGroup(): Phaser.GameObjects.Group {
    return this.group;
  }
}