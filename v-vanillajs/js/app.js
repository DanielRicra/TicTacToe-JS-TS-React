

const App = {
  $: {
    menu: document.querySelector("[data-id='menu']"),
    menuItems: document.querySelector("[data-id='items']"),
    resetButton: document.querySelector("[data-id='reset-btn']"),
    newRoundButton: document.querySelector("[data-id='new-round-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
    modal: document.querySelector("[data-id='modal']"),
    modalText: document.querySelector("[data-id='modal-text']"),
    modalButton: document.querySelector("[data-id='modal-btn']"),
    turn: document.querySelector("[data-id='turn']"),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1SquareIdMoves = moves.filter((move) => move.playerId === 1).map((move) => move.squareId);
    const p2SquareIdMoves = moves.filter((move) => move.playerId === 2).map((move) => move.squareId);
    
    const winningPatterns = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [7, 5, 3],
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((squareId) => p1SquareIdMoves.includes(squareId));
      const p2Wins = pattern.every((squareId) => p2SquareIdMoves.includes(squareId));
      
      if(p1Wins) {
        winner = 1;
      } else if(p2Wins) {
        winner = 2;
      }
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress",
      winner
    }
  },
  
  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden")
    });

    // TODO
    App.$.resetButton.addEventListener("click", (event) => {
    });

    // TODO
    App.$.newRoundButton.addEventListener("click", (event) => {

    });
    
    // TODO
    App.$.squares.forEach((square) => {
      square.addEventListener('click', (event) => {
        const hasMove = (squareId) => {
          const existingMove = App.state.moves.find((move) => move.squareId === squareId)
          return existingMove !== undefined;
        }

        if (hasMove(parseInt(square.id))) {
          return;
        }

        const moves = App.state.moves;
        const getOppositePlayer = (playerId) => playerId === 1 ? 2 : 1;
        const currentPlayer = moves.length === 0 ? 1 : getOppositePlayer(moves.at(-1).playerId);
        const nextPlayer = getOppositePlayer(currentPlayer);
        
        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.textContent = `Player ${nextPlayer}, you're Up!`

        if(currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-o", "yellow");
          turnLabel.className = "yellow";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "yellow");
          turnIcon.classList.add("fa-solid", "fa-x", "turquoise");
          turnLabel.className = "turquoise";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({ 
          squareId: parseInt(square.id),
          playerId: currentPlayer
        });

        square.replaceChildren(squareIcon);

        const game = App.getGameStatus(App.state.moves);
        
        if(game.status === "complete") {
          App.$.modal.classList.remove('hidden');
          
          let message = "";
          if(game.winner) {
            message = `Player ${game.winner} wins!`
          } else {
            message = "It is a tie!";
          }
          App.$.modalText.textContent = message;
        }
      });
    });

    App.$.modalButton.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => {
        square.replaceChildren()
      })
      App.$.modal.classList.add("hidden");
      
    });
  }
}

window.addEventListener('load', App.init);


