export default function createGame() {
  const state = {
    players: {},
    fruits: {},
    screen: {
      width: 10,
      height: 10
    }
  };

  const observers = []

  function subscribe(oberverFunction) {
    state.observers.push(oberverFunction)
  }

  function notifyAll(command) {
    for (const oberserverFunction of state.observers) {
      oberserverFunction(command)
    }
  }

  function setState(newState) {
    Object.assign(state, newState);
  }

  function addPlayer(command) {
    const playerId = command.playerId;
    const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width);
    const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height);

    state.players[playerId] = {
      x: playerX,
      y: playerY,
    };

    notifyAll({
      type: 'add-player', 
      playerId, 
      playerX, 
      playerY
    })
  }

  function removePlayer(command) {
    const playerId = command.playerId;

    delete state.players[playerId];
  }

  function addFruit(command) {
    const fruitId = command.fruitId;
    const fruitX = command.fruitX;
    const fruitY = command.fruitY;

    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY,
    };
  }

  function removeFruit(command) {
    const fruitId = command.fruitId;

    delete state.fruits[fruitId];
  }

  function checkForFruitCollision(playerId) {
    const player = state.players[playerId];

    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId];
      if (player.x === fruit.x && player.y === fruit.y) {
        removeFruit({ fruitId: fruitId });
      }
    }
  }

  function movePlayer(command) {
    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) {
          player.y = player.y - 1;
        }
      },
      ArrowRight(player) {
        if (player.x + 1 < state.screen.width) {
          player.x = player.x + 1;
        }
      },
      ArrowDown(player) {
        if (player.y + 1 < state.screen.width) {
          player.y = player.y + 1;
        }
      },
      ArrowLeft(player) {
        if (player.x - 1 >= 0) {
          player.x = player.x - 1;
        }
      },
    };

    const keyPressed = command.keyPressed;
    const playerId = command.playerId;
    const player = state.players[playerId];
    const moveFunction = acceptedMoves[keyPressed];

    if (moveFunction && player) {
      moveFunction(player);
      checkForFruitCollision(playerId);
    }
  }

  return {
    addPlayer,
    removePlayer,
    addFruit,
    removeFruit,
    movePlayer,
    state,
    setState,
    subscribe
  };
}
