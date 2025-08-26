import { createGame } from 'odyc';
import { generateRandomLevels } from './map';

let levels = generateRandomLevels(10); // Bắt đầu với 10 levels

const cellWidth = 9;
const cellHeight = 8;
const screenWidth = 8;
const screenHeight = 8;

let levelIndex = 0;
let score = 0;

const sprites = {
  player: `
		..151...
		..555...
		...5....
		.53335..
		5.333.9.
		..3.3.9.
		..3.3.9.
		..3.3666
	`,
  cleanFloor: 2,
  dirtyFloor: `
		222222222
		222222222
		229999292
		929222292
		222222222
		222222222
		299992222
		222299222
	`,
  wall: `
		000000000
		022222220
		020000020
		020020020
		020020020
		020000020
		022222220
		000000000
	`,
};

const game = createGame({
  player: {
    sprite: sprites.player,
    position: levels[0].playerPos as [number, number],
  },
  templates: {
    '.': {
      solid: false,
      onEnter: function () {
        // Kiểm tra xem còn dirty floor không
        for (let y = 0; y < game.height; y++) {
          for (let x = 0; x < game.width; x++) {
            const cell = game.getCellAt(x, y);
            if (cell.symbol === '#') return;
          }
        }

        // Hoàn thành level - tăng score
        score++;
        levelIndex++;

        // Nếu hết levels, tạo thêm levels mới
        if (levelIndex >= levels.length) {
          const newLevels = generateRandomLevels(5);
          levels = [...levels, ...newLevels];
        }

        // Load level tiếp theo
        const { map, playerPos } = levels[levelIndex];
        game.loadMap(map, [...(playerPos as [number, number])]);

        // Hiển thị thông báo hoàn thành level
        game.openDialog(`Level ${levelIndex} completed!`);
      },
    },
    '#': {
      sprite: sprites.dirtyFloor,
      solid: false,
      sound: ['BLIP'],
      onEnter: function (target) {
        game.setCellAt(...target.position, '$');
      },
    },
    $: {
      sprite: sprites.cleanFloor,
      solid: false,
      sound: ['FALL', 424245453],
      onEnter: async function (target) {
        game.setCellAt(...target.position, '#');
        await game.openDialog('Oh no, I got it dirty again!');
        // End game ngay lập tức khi thua
        game.end(
          `Game Over!\n\nFinal Score: ${score}\nLevel reached: ${levelIndex + 1}`
        );
      },
    },
    X: {
      sprite: sprites.wall,
    },
  },
  map: levels[0].map,
  cellWidth,
  cellHeight,
  background: 0,
  volume: 0.04,
  title: 'The sweeper with the dirty shoes',
});

game.openDialog(
  ' Welcome to the sweeper with the dirty shoes!| Your mission is to sweep the dirty floor | Simple, right ? Good luck!'
);
