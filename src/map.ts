interface MapLevel {
  map: string;
  playerPos: [number, number];
}

// Hàm generate map random với chướng ngại vật X
export function generateRandomMap(
  width: number = 12,
  height: number = 12,
  obstacleCount: number = 12,
  playerPos: [number, number] = [3, 0]
): MapLevel {
  // Tạo map cơ bản với tường bao quanh
  const map: string[][] = [];

  // Khởi tạo map với dấu chấm (.)
  for (let y = 0; y < height; y++) {
    map[y] = [];
    for (let x = 0; x < width; x++) {
      if (y === 0 || y === height - 1 || x === 0 || x === width - 1) {
        map[y][x] = '.'; // Viền ngoài
      } else {
        map[y][x] = '#'; // Khu vực bên trong
      }
    }
  }

  // Đặt chướng ngại vật X ngẫu nhiên
  let placedObstacles = 0;
  const maxAttempts = obstacleCount * 10; // Tránh vòng lặp vô hạn
  let attempts = 0;

  while (placedObstacles < obstacleCount && attempts < maxAttempts) {
    const x = Math.floor(Math.random() * (width - 2)) + 1; // Tránh viền
    const y = Math.floor(Math.random() * (height - 2)) + 1; // Tránh viền

    // Kiểm tra không đặt chướng ngại vật ở vị trí player
    if (x !== playerPos[0] || y !== playerPos[1]) {
      if (map[y][x] === '#') {
        map[y][x] = 'X';
        placedObstacles++;
      }
    }
    attempts++;
  }

  // Chuyển đổi map thành string
  const mapString = map.map((row) => row.join('')).join('\n');

  return {
    map: `
${mapString}
`,
    playerPos,
  };
}

// Hàm generate nhiều level random
export function generateRandomLevels(count: number = 5): MapLevel[] {
  const levels: MapLevel[] = [];

  for (let i = 0; i < count; i++) {
    // Tăng độ khó dần theo level
    const obstacleCount = Math.min(4 + i * 2, 12);
    const randomLevel = generateRandomMap(8, 8, obstacleCount, [3, 0]);
    levels.push(randomLevel);
  }

  return levels;
}

// Hàm thêm random levels vào levels array hiện tại
export function addRandomLevelsToExisting(
  existingLevels: MapLevel[],
  additionalCount: number = 3
): MapLevel[] {
  const randomLevels = generateRandomLevels(additionalCount);
  return [...existingLevels, ...randomLevels];
}
