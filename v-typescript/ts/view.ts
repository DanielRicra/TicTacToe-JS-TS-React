import { GameMove, GameStatus, Player, Stats } from "./types";

class View {
  private elements: Record<string, HTMLElement> = {};
  private elementLists: Record<string, NodeListOf<HTMLElement>> = {};

  constructor() {
    this.elements.menu = this.#findElement("[data-id='menu']");
    this.elements.menuButton = this.#findElement("[data-id='menu-btn']") ;
    this.elements.menuItems = this.#findElement("[data-id='items']") ;
    this.elements.resetButton = this.#findElement("[data-id='reset-btn']") ;
    this.elements.newRoundButton = this.#findElement("[data-id='new-round-btn']") ;
    this.elements.modal = this.#findElement("[data-id='modal']") ;
    this.elements.modalText = this.#findElement("[data-id='modal-text']") ;
    this.elements.modalButton = this.#findElement("[data-id='modal-btn']") ;
    this.elements.turn = this.#findElement("[data-id='turn']") ;
    this.elements.playerOneScore = this.#findElement("[data-id='p1-score']") ;
    this.elements.playerTwoScore = this.#findElement("[data-id='p2-score']") ;
    this.elements.ties = this.#findElement("[data-id='ties']") ;
    this.elements.grid = this.#findElement("[data-id='grid']") ;

    this.elementLists.squares = this.#findElements("[data-id='square']") ;

    this.elements.menu.addEventListener("click", () => {
      this.#toggleMenu();
    });
  }
  
  render(game: GameStatus, stats: Stats) {
    const { playerWithStats, ties } = stats;
    const { moves, currentPlayer, status: { isComplete, winner } } = game;

    this.#hideModal();
    this.#clearBoard();
    this.#updateScoreBoard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties,
    );
    this.#initializeMoves(moves);

    if (isComplete) {
      this.#showModal(winner ? `Player ${winner.name} wins` : "It's a tie");
      return;
    }

    this.#setTurnIndicator(currentPlayer);
  }

  bindGameResetEvent(handler: () => void) {
    this.elements.resetButton.addEventListener("click", handler);
    this.elements.modalButton.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler: () => void) {
    this.elements.newRoundButton.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler: () => void) {
    this.#delegate(this.elements.grid, "[data-id=square]", "click", handler);
  }

  #updateScoreBoard(p1Score: number, p2Score: number, ties: number) {
    this.elements.playerOneScore.textContent = `${p1Score} wins`;
    this.elements.playerTwoScore.textContent = `${p2Score} wins`;
    this.elements.ties.textContent = `${ties} ties`;
  }

  #clearBoard() {
    this.elementLists.squares.forEach((square) => {
      square.replaceChildren();
    })
  }

  #initializeMoves(moves: GameMove[]) {
    this.elementLists.square.forEach((square) => {
      const markedSquare = moves.find((move) => move.squareId === +square.id);
      
      if (markedSquare) {
        this.#handlerPlayerMove(square, markedSquare.player);
      }
    });
  }

  #showModal(message: string) {
    this.elements.modal.classList.remove("hidden");
    this.elements.textModal.textContent = message;
  }

  #hideModal() {
    this.elements.modal.classList.add("hidden");
  }

  #toggleMenu() {
    this.elements.menuItems.classList.toggle("hidden");
    this.elements.menuButton.classList.toggle("border");

    const icon = this.elements.menuButton.querySelector("i");

    icon?.classList.toggle("fa-chevron-down");
    icon?.classList.toggle("fa-chevron-up");
  }

  #handlerPlayerMove(squareElement: HTMLElement, player: Player) {
    const icon = document.createElement("i");
    icon.classList.add(
      "fa-solid",
      player.iconClass,
      player.colorClass,
    );
    squareElement.replaceChildren(icon);
  }

  #setTurnIndicator(player: Player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.colorClass, player.iconClass);

    label.classList.add(player.colorClass);
    label.textContent = `${player.name}, you're up!`;

    this.elements.turn.replaceChildren(icon, label);
  }

  #findElement(selector: string, parent?: HTMLElement): HTMLElement {
    const element = parent ?
      parent.querySelector(selector) :
      document.querySelector(selector);

    if (!element) {
      throw new Error(`No such element: ${selector} in ${parent ? parent.id : "document"}`);
    }

    return element as HTMLElement;
  }

  #findElements(selector: string): NodeListOf<HTMLElement> {
    const elements = document.querySelectorAll(selector);

    if (!elements) {
      throw new Error(`No such elements: ${selector} in document`);
    }

    return elements as NodeListOf<HTMLElement>;
  }

  #delegate(element: HTMLElement, selector: string, eventKey: string, handler: (e: Element) => void) {
    element.addEventListener(eventKey, (event) => {
      const target = event.target;

      if (!target || !(target instanceof Element)) {
        throw new Error("No target element found or target is not an element");
      }

      if (target.matches(selector)) {
        handler(target);
      }
    })
  }
}

export default View;