class View {
  elements = {};

  constructor() {
    this.elements.menu = this.#findElement("[data-id='menu']");
    this.elements.menuButton = this.#findElement("[data-id='menu-btn']");
    this.elements.menuItems = this.#findElement("[data-id='items']");
    this.elements.resetButton = this.#findElement("[data-id='reset-btn']");
    this.elements.newRoundButton = this.#findElement("[data-id='new-round-btn']");
    this.elements.modal = this.#findElement("[data-id='modal']");
    this.elements.modalText = this.#findElement("[data-id='modal-text']");
    this.elements.modalButton = this.#findElement("[data-id='modal-btn']");
    this.elements.turn = this.#findElement("[data-id='turn']");
    this.elements.playerOneScore = this.#findElement("[data-id='p1-score']");
    this.elements.playerTwoScore = this.#findElement("[data-id='p2-score']");
    this.elements.ties = this.#findElement("[data-id='ties']");
    
    this.elements.squares = this.#findElements("[data-id='square']");

    // UI-only event listeners
    this.elements.menu.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }
  
  /**
   * Register all the event listeners 
   */

  bindGameResetEvent(handler) {
    this.elements.resetButton.addEventListener("click", handler);
    this.elements.modalButton.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.elements.newRoundButton.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.elements.squares.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }

  /**
   * DOM helper methods
   */
  updateScoreBoard(p1Score, p2Score, ties) {
    this.elements.playerOneScore.textContent = `${p1Score} wins`;
    this.elements.playerTwoScore.textContent = `${p2Score} wins`;
    this.elements.ties.textContent = `${ties} ties`;
  }

  clearBoard() {
    this.elements.squares.forEach((square) => {
      square.replaceChildren();
    });
  }

  showModal(message) {
    this.elements.modal.classList.remove("hidden");
    this.elements.modalText.textContent = message;
  }

  #hideModal() {
    this.elements.modal.classList.add("hidden");
  }

  closeAll() {
    this.#hideModal();
    // this.#closeMenu();
  }

  #closeMenu() {
    this.elements.menuItems.classList.add("hidden");
    this.elements.menuButton.classList.remove("border");

    const icon = this.elements.menuButton.querySelector("i");

    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
  }

  #toggleMenu() {
    this.elements.menuItems.classList.toggle("hidden");
    this.elements.menuButton.classList.toggle("border");

    const icon = this.elements.menuButton.querySelector("i");

    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  #findElement(selector, parent) {
    const element = parent ? parent.querySelector(selector) : document.querySelector(selector);

    if(!element) {
      throw new Error(`No such element: ${selector}`);
    }
    return element;
  }

  handlerPlayerMove(squareElement, player) {
      const icon = document.createElement("i");
      icon.classList.add(
        "fa-solid",
        player.iconClass,
        player.colorClass,
      );
      squareElement.replaceChildren(icon);
  }

  // player 1 | 2
  setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label  = document.createElement("p");
    
    icon.classList.add("fa-solid", player.colorClass, player.iconClass);
    
    label.classList.add(player.colorClass);
    label.innerText = player.name + ", you're up!";

    this.elements.turn.replaceChildren(icon, label);
  }

  #findElements(selector) {
    const elements = document.querySelectorAll(selector);

    if(!elements) {
      throw new Error(`No such elements: ${selector}`);
    }
    return elements;
  }
} 

export default View;