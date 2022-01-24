function seed() {
  let seed = [];
  for (let i = 0; i < arguments.length; i++) {
    seed.push(arguments[i]);
  }
  return seed;
}

function same([x, y], [j, k]) {
  const [xValue, yValue] = [x, y];
  const [jValue, kValue] = [j, k];
  if ((xValue == jValue) && (yValue == kValue)) {
    return true;
  }
  return false;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  const [xValue, yValue] = cell;
  for (i = 0; i < this.length; i++) {
    let [x, y] = this[i];
    if ((x == xValue) && (y == yValue)) {
      return true;
    }
  }
  return false;
}

const printCell = (cell, state) => {
  if (contains.call(state, cell)) {
    return '\u25A3';
  }
  return '\u25A2';
};

const corners = (state = [0, 0]) => {
  let xCord = [];
  let yCord = [];
  let corner = {
    topRight: [0, 0],
    bottomLeft: [0, 0]
  };

  if (state.length) {
    state.forEach(element => {
      let [x, y] = element;
      xCord.push(x);
      yCord.push(y);
    });
    let minX = Math.min(...xCord);
    let maxX = Math.max(...xCord);
    let minY = Math.min(...yCord);
    let maxY = Math.max(...yCord);

    corner.topRight = [maxX, maxY];
    corner.bottomLeft = [minX, minY];
    return corner;
  }

  return corner;
};

const printCells = (state) => {
  let {
    topRight,
    bottomLeft
  } = corners(state);
  let [xTop, yTop] = topRight
  let [xBottom, yBottom] = bottomLeft;

  let cells = "";


  for (let i = yTop; i >= yBottom; i--) {
    let row = [];
    for (let j = xBottom; j <= xTop; j++) {
      row.push(printCell([j, i], state));
    }
    cells += row.join(" ") + "\n";
  }

  return cells;
};

const getNeighborsOf = ([x, y]) => {
  let xMax = x + 1;
  let yMax = y + 1;
  let yMin = y - 1;
  let xMin = x - 1;

  let neighborSet = [];

  for (let i = xMin; i <= xMax; i++) {
    for (let j = yMin; j <= yMax; j++) {
      let values = [i, j];
      neighborSet.push(values);
    }
  }

  let cells = neighborSet.filter(element => {
    if (element[0] === x && element[1] === y) {
      return false;
    }
    return true;
  });

  return cells;

};

const getLivingNeighbors = (cell, state) => {
  let neighboursOf = getNeighborsOf(cell);
  let container = contains.bind(state);
  let livingNeighbors = neighboursOf.filter(element => {
    if (container.call(state, element)) {
      return true;
    }
    return false;
  });
  return livingNeighbors;
};

const willBeAlive = (cell, state) => {
  return getLivingNeighbors(cell, state).length === 3 ||
    (contains.call(state, cell) && getLivingNeighbors(cell, state).length === 2) ?
    true :
    false;
};

const calculateNext = (state) => {
  let {
    topRight,
    bottomLeft
  } = corners(state);

  topRight = [topRight[0] + 1, topRight[1] + 1];
  bottomLeft = [bottomLeft[0] - 1, bottomLeft[1] - 1];

  const gameState = [];
  for (let i = bottomLeft[0]; i <= topRight[0]; i++) {
    for (let j = bottomLeft[1]; j <= topRight[1]; j++) {
      if (willBeAlive([i, j], state)) {
        gameState.push([i, j]);
      }
    }
  }
  return gameState;
};

const iterate = (state, iterations) => {
  const gameState = [state];
  for (let i = 0; i < iterations; i++) {
    let newState;
    newState = calculateNext(gameState[gameState.length - 1]);
    gameState.push(newState);
  }
  return gameState;
};

const main = (pattern, iterations) => {
  const gameStates = iterate(startPatterns[pattern], iterations);
  gameStates.forEach((gameState) => console.log(printCells(gameState)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;