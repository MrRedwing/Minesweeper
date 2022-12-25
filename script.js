// script.js

class Game {
  constructor(width, height, mines) {
    // Sets the width and height of the board
    this.width = width;
    this.height = height;

    // Sets the board size and number of mines in the game
    this.BOARD_SIZE = width * height;
    this.NUM_MINES = mines;

    // Shared time for the game. Gets counter element too
    this.time = 0;
    this.is_paused = true;
    this.timer = document.getElementById("timer");

    // Game on or game over
    this.game_state = true;

    // Set up the game board
    this.board = document.getElementById("board");
    this.board.style.width = this.width * 40 + "px";
    for (let i = 0; i < this.BOARD_SIZE; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      board.appendChild(cell);
    }

    // Gets every cell div into an array
    this.cells = board.querySelectorAll(".cell");

    // Game logic for clicking on tiles
    this.cells.forEach((cell, index) => {
      // Logic for left clicking
      cell.addEventListener("click", () => {
        this.clear_tile(index);
        this.game_won();
      });

      // Logic for right clicking
      cell.addEventListener("contextmenu", () => {
        if (this.game_state) {
          if (!cell.classList.contains("revealed")) {
            if (cell.classList.contains("flagged")) {
              cell.textContent = "";
            } else {
              cell.textContent = "🚩";
            }
            cell.classList.toggle("flagged");
          }
        }
      });

      // Logic for middle clicking
      cell.addEventListener("auxclick", () => {
        if (this.game_state) {
          if (cell.classList.contains("revealed")) {
            this.clear_around(index, this.mines_around(index));
          }
          this.game_won();
        }
      });
    });

    // Turns off right clicking on the board
    this.board.addEventListener("contextmenu", (event) =>
      event.preventDefault()
    );

    // Sets the mines and blanks the board
    this.reset_board();
  }

  // Reset board
  reset_board() {
    this.game_state = true;
    this.cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("revealed");
      cell.classList.remove("flagged");
    });

    // Set up the mines into a set. The set ensures that no two mines are in the same location
    this.mines = new Set();
    while (this.mines.size < this.NUM_MINES) {
      const randomIndex = Math.floor(Math.random() * this.BOARD_SIZE);
      this.mines.add(randomIndex);
    }
  }

  // Displays the board at the end of a lost game
  reveal_board() {
    this.cells.forEach((cell, index) => {
      if (cell.classList.contains("flagged")) {
        if (!this.check_mine(index)) {
          this.cells[index].classList.add("flagged");
          this.cells[index].classList.remove("revealed");
          cell.textContent = "❌";
        }
      } else if (this.check_mine(index)) {
        cell.textContent = "💣";
      } else {
        this.clear_tile(index);
      }
    });
  }

  // Logic to congratulate the player on a win
  game_won() {
    if (
      this.BOARD_SIZE - this.NUM_MINES ===
        this.board.querySelectorAll(".cell.revealed").length &&
      this.game_state
    ) {
      this.reveal_board();
      this.pause_timer();
      alert("Congratulations you've won. You're time was " + this.time);
      this.game_state = false;
    }
  }

  // Logic if a game is lost
  game_lost(index) {
    this.reveal_board();
    this.cells[index].classList.remove("flagged");
    this.cells[index].classList.remove("revealed");
    this.cells[index].textContent = "💥";
    this.pause_timer();
    this.game_state = false;
    alert("You lost");
  }

  // Clears the tile of a given index
  clear_tile(index) {
    if (this.game_state) {
      // If the tile is already flagged then unflag
      if (this.cells[index].classList.contains("flagged")) {
        this.cells[index].classList.toggle("flagged");
        this.cells[index].textContent = "";
        // If the tile isn't revealed
      } else if (!this.cells[index].classList.contains("revealed")) {
        // Starts timer when a tile is clicked
        this.start_timer();

        // Check if it's a mine
        if (this.check_mine(index)) {
          this.game_lost(index);
          // Or reveal if it isn't
        } else {
          this.cells[index].classList.add("revealed");
          this.cells[index].classList.remove("flagged");

          // cell.textContent = this.mines_around(index);

          // If a tile has zero mines by it, clear the other tiles around it
          let mines_bordering = this.mines_around(index);
          if (mines_bordering === 0) {
            this.clear_around(index, 0);
            // If it does have mines by it, display the number
          } else {
            this.cells[index].textContent = mines_bordering;
            this.text_color(index, mines_bordering);
          }
        }
      }
    }
  }

  text_color(index, number) {
    let dict = {
      1: "Blue",
      2: "Green",
      3: "Red",
      4: "Purple",
      5: "Maroon",
      6: "Turquoise",
      7: "Black",
      8: "Gray",
    };

    console.log(dict[number]);

    this.cells[index].style.color = dict[number];
  }

  // Checks if a tile is a mine
  check_mine(index) {
    return this.mines.has(index);
  }

  // Returns the indices bordering a given tile
  indices_around(index) {
    let indices = [];
    let column = index % this.width;
    let row = (index - column) / this.width;

    // Finds the indices of tiles around the index point
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (x + column < 0 || x + column == this.width) {
          continue;
        }

        if (y + row < 0 || y + row == this.height) {
          continue;
        }

        let product = (row + y) * this.width + (column + x);

        if (product != index) {
          indices.push(product);
        }
      }
    }

    return indices;
  }

  // Returns how many mines are bordering the given tile
  mines_around(index) {
    let mine_count = 0;
    this.indices_around(index).forEach((index) => {
      if (this.check_mine(index)) {
        mine_count++;
      }
    });

    return mine_count;
  }

  // Returns how many flags are bordering a given tile
  flags_around(index) {
    let flag_count = 0;
    this.indices_around(index).forEach((index) => {
      if (this.cells[index].classList.contains("flagged")) {
        flag_count++;
      }
    });

    return flag_count;
  }

  // Clears the tiles bordering a given tile
  // Number of flags around the tile has to equal the number of mines around it
  clear_around(index, amount) {
    if (this.flags_around(index) != amount) {
      return;
    }
    this.indices_around(index).forEach((index) => {
      if (
        !this.cells[index].classList.contains("revealed") &&
        !this.cells[index].classList.contains("flagged")
      ) {
        this.clear_tile(index);
        let mines_bordering = this.mines_around(index);
        if (mines_bordering === 0) {
          this.clear_around(index, 0);
        }
      }
    });
  }

  flag_count() {
    let flags = 0;
    this.cells.forEach((cell) => {
      if (cell.classList.contains("flagged")) {
        flags++;
      }
    });

    return flags;
  }

  deconstruct() {
    this.cells.forEach((cell) => {
      cell.remove();
    });
    clearInterval(this.interval);
    clearInterval(this.flag_interval);
  }

  // Method to begin the timer. Call only once.
  init_timer() {
    this.interval = setInterval(() => {
      if (!this.is_paused) {
        this.time++;
      }
      this.timer.textContent = this.time;
    }, 1000);
  }

  // Method to start the timer again
  start_timer() {
    this.is_paused = false;
  }

  // Passes the time++ in the interval in start_timer()
  pause_timer() {
    this.is_paused = true;
  }

  reset_timer() {
    this.is_paused = true;
    this.time = 0;
    this.timer.textContent = this.time;
  }

  // Method to being the mine count. Call only once.
  init_flag_count() {
    const box = document.getElementById("flags");
    console.log("ran");
    this.flag_interval = setInterval(() => {
      box.textContent = this.flag_count() + " / " + this.NUM_MINES;
    }, 10);
  }
}

game = new Game(15, 15, 35);

game.init_flag_count();
game.init_timer();

const width_input = document.getElementById("width");
const height_input = document.getElementById("height");
const mines_input = document.getElementById("mines");

const change_button = document.getElementById("change");
change_button.addEventListener("click", () => {
  let width = Math.floor(width_input.value);
  let height = Math.floor(height_input.value);
  let mines = Math.floor(mines_input.value);

  if (width * height <= mines) {
    return;
  }

  game.reset_timer();
  game.deconstruct();

  game = new Game(width, height, mines);

  game.init_flag_count();
  game.init_timer();
});

// When the new game button is pressed to reset timer and board
const new_game = document.getElementById("reset");
new_game.addEventListener("click", () => {
  game.reset_timer();
  game.reset_board();
});

const display = document.getElementById("display");
display.addEventListener("change", () => {
  if (display.value == "left") {
    game.board.style.marginLeft = "40px";
    game.board.style.marginRight = "auto";
  } else if (display.value == "right") {
    game.board.style.marginLeft = "auto";
    game.board.style.marginRight = "40px";
  } else {
    game.board.style.margin = "0 auto";
  }
});
