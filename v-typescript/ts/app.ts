import Store from "./store.js";
import { Player } from "./types.js";
import View from "./view.js";

const players: Player[] = [
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
]

function init() {
  const view = new View();
  const store = new Store("games-played-ttt", players);

  store.addEventListener("state-changed", () => {
    view.render(store.game, store.stats);
  });

  window.addEventListener("storage", () => {
    view.render(store.game, store.stats);
  });

  view.render(store.game, store.stats);

  view.bindGameResetEvent(() => {
    store.reset();
  });

  view.bindNewRoundEvent(() => {
    store.newRound();
  });

  view.bindPlayerMoveEvent((square: HTMLElement) => {
    const markedSquare = store.game.moves.find((move) => move.squareId === +square.id);

    if (markedSquare) {
      return;
    }

    store.playerMove(+square.id);
  });
}


window.addEventListener("DOMContentLoaded", init);