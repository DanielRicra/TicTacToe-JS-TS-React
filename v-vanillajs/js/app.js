import Store from "./store.js";
import View from "./view.js";

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  }
];

function init() {
  const view = new View();
  const store = new Store(players);

  view.bindGameResetEvent((event) => {
    view.closeAll();

    store.reset();

    view.clearBoard();
    view.setTurnIndicator(store.game.currentPlayer);
    view.updateScoreBoard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
  });

  view.bindNewRoundEvent((event) => {
    store.newRound();
    
    view.closeAll();
    view.clearBoard();
    view.setTurnIndicator(store.game.currentPlayer);
    view.updateScoreBoard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
  });

  view.bindPlayerMoveEvent((square) => {
    const existingMove = store.game.moves.find((move) => move.squareId === +square.id);
    if (existingMove) {
      return;
    }

    view.handlerPlayerMove(square, store.game.currentPlayer);
    
    store.playerMove(+square.id);

    if (store.game.status.isComplete) {
      view.showModal(store.game.status.winner ? `${store.game.status.winner.name} wins!` : "It is a tie!");
      return;
    }
    
    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener('load', init);