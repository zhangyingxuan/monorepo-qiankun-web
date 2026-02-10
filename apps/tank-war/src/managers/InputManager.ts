import Phaser from 'phaser';

/**
 * 输入管理器
 * 兼容键盘和移动端虚拟摇杆
 */
export class InputManager {
  private scene: Phaser.Scene;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private wasd: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
  } | undefined;

  // 虚拟摇杆状态
  private joystickDirection: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  private isJoystickActive: boolean = false;
  private isFireButtonPressed: boolean = false;

  // UI 元素
  private joystickBase: Phaser.GameObjects.Arc | undefined;
  private joystickThumb: Phaser.GameObjects.Arc | undefined;
  private fireButton: Phaser.GameObjects.Arc | undefined;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initKeyboard();
    this.initVirtualJoystick();
  }

  private initKeyboard() {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        space: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      };
    }
  }

  private initVirtualJoystick() {
    // 仅在移动设备或触摸屏上显示虚拟摇杆
    // 为了测试方便，我们默认都显示，或者根据配置显示
    // 摇杆底座
    const joystickX = 80;
    const joystickY = this.scene.cameras.main.height - 80;
    const radius = 50;

    this.joystickBase = this.scene.add.circle(joystickX, joystickY, radius, 0x888888, 0.5)
      .setScrollFactor(0)
      .setDepth(100)
      .setInteractive();

    // 摇杆滑块
    this.joystickThumb = this.scene.add.circle(joystickX, joystickY, 20, 0xcccccc, 0.8)
      .setScrollFactor(0)
      .setDepth(101);

    // 开火按钮
    const fireBtnX = this.scene.cameras.main.width - 80;
    const fireBtnY = this.scene.cameras.main.height - 80;

    this.fireButton = this.scene.add.circle(fireBtnX, fireBtnY, 40, 0xff0000, 0.5)
      .setScrollFactor(0)
      .setDepth(100)
      .setInteractive();

    // 添加文字标识
    this.scene.add.text(fireBtnX - 15, fireBtnY - 10, 'FIRE', { fontSize: '16px', color: '#ffffff' })
      .setScrollFactor(0)
      .setDepth(101);

    // 摇杆事件处理
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isPointInCircle(pointer, this.joystickBase!)) {
        this.isJoystickActive = true;
        this.updateJoystick(pointer);
      } else if (this.isPointInCircle(pointer, this.fireButton!)) {
        this.isFireButtonPressed = true;
        this.fireButton!.setAlpha(0.8);
      }
    });

    this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isJoystickActive) {
        this.updateJoystick(pointer);
      }
    });

    this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.isJoystickActive = false;
      this.isFireButtonPressed = false;
      this.fireButton!.setAlpha(0.5);

      // 重置摇杆位置
      if (this.joystickThumb && this.joystickBase) {
        this.joystickThumb.setPosition(this.joystickBase.x, this.joystickBase.y);
        this.joystickDirection.set(0, 0);
      }
    });
  }

  private isPointInCircle(pointer: Phaser.Input.Pointer, circle: Phaser.GameObjects.Arc): boolean {
    const dx = pointer.x - circle.x;
    const dy = pointer.y - circle.y;
    return (dx * dx + dy * dy) <= (circle.radius * circle.radius);
  }

  private updateJoystick(pointer: Phaser.Input.Pointer) {
    if (!this.joystickBase || !this.joystickThumb) return;

    const dx = pointer.x - this.joystickBase.x;
    const dy = pointer.y - this.joystickBase.y;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), this.joystickBase.radius);

    const thumbX = this.joystickBase.x + Math.cos(angle) * dist;
    const thumbY = this.joystickBase.y + Math.sin(angle) * dist;

    this.joystickThumb.setPosition(thumbX, thumbY);

    // 计算方向向量 (归一化)
    // 为了模拟 4 方向移动，我们进行阈值判断
    if (dist > 10) { // 死区
      if (Math.abs(dx) > Math.abs(dy)) {
        this.joystickDirection.set(dx > 0 ? 1 : -1, 0);
      } else {
        this.joystickDirection.set(0, dy > 0 ? 1 : -1);
      }
    } else {
      this.joystickDirection.set(0, 0);
    }
  }

  /**
   * 获取移动方向
   */
  public getMoveDirection(): Phaser.Math.Vector2 {
    const direction = new Phaser.Math.Vector2(0, 0);

    if (this.isJoystickActive) {
      return this.joystickDirection;
    }

    if (this.cursors && this.wasd) {
      if (this.cursors.left.isDown || this.wasd.left.isDown) {
        direction.x = -1;
      } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
        direction.x = 1;
      } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
        direction.y = -1;
      } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
        direction.y = 1;
      }
    }

    return direction;
  }

  /**
   * 是否按下开火键
   */
  public isFireDown(): boolean {
    if (this.isFireButtonPressed) return true;

    if (this.cursors && this.wasd) {
      return this.cursors.space.isDown || this.wasd.space.isDown;
    }
    return false;
  }
}