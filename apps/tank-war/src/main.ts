import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';
import { TILE_SIZE } from './config/GameMap';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import './style.css';

let game: Phaser.Game | null = null;

function initGame(container: HTMLElement | string) {
  // 如果已存在实例，先销毁
  if (game) {
    game.destroy(true);
    game = null;
  }

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 13 * TILE_SIZE,
    height: 13 * TILE_SIZE,
    parent: container,
    backgroundColor: '#000000',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 }, // 俯视视角无重力
        debug: false
      }
    },
    scene: [MainScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };

  game = new Phaser.Game(config);
}

function render(props: any = {}) {
  const { container } = props;

  // 确定挂载点
  // 如果在 qiankun 中，container 是主应用提供的节点
  // 我们需要在其中查找或创建一个容器，或者直接使用它
  // 为了保持样式一致性，我们尝试查找 #game-container，如果找不到就创建一个

  let target: HTMLElement | string = 'game-container';

  if (container) {
    // qiankun 环境
    // 尝试在 container 内部找 #game-container
    let gameContainer = container.querySelector('#game-container');
    if (!gameContainer) {
      // 如果没有，创建一个并附加到 container
      gameContainer = document.createElement('div');
      gameContainer.id = 'game-container';
      container.appendChild(gameContainer);
    }
    target = gameContainer;
  } else {
    // 独立运行环境，直接使用 index.html 中的 #game-container
    // 如果找不到（比如 index.html 被修改了），则回退到 body
    if (!document.getElementById('game-container')) {
      const div = document.createElement('div');
      div.id = 'game-container';
      document.body.appendChild(div);
    }
  }

  initGame(target);
}

renderWithQiankun({
  mount(props) {
    console.log('[tank-war] mount');
    render(props);
  },
  bootstrap() {
    console.log('[tank-war] bootstrap');
  },
  unmount(props) {
    console.log('[tank-war] unmount');
    if (game) {
      game.destroy(true);
      game = null;
    }
  },
  update(props) {
    console.log('[tank-war] update');
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}