const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;

(function setup() {
  snake = new Snake();
  fruit = new Fruit();
  fruit.pickLocation();

  document.getElementById("start-button").addEventListener("click", () => {
    document.getElementById("start-overlay").style.display = "none";
    window.gameInterval = window.setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      fruit.draw();
      snake.update();
      snake.draw();

      if (snake.eat(fruit)) {
        fruit.pickLocation();
      }

      snake.checkCollision();
      document.getElementById("score").textContent = snake.total;

    }, 250);
  });

  window.addEventListener("keydown", (evt) => {
    const direction = evt.key.replace("Arrow", "");
    snake.changeDirection(direction);
  });
}());

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];

  this.draw = function() {
    ctx.fillStyle = "#FF6600";
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }
    ctx.fillRect(this.x, this.y, scale, scale);
  };

  this.update = function() {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    if (this.total >= 1) {
      this.tail[this.total - 1] = { x: this.x, y: this.y };
    }

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x >= canvas.width || this.y >= canvas.height || this.x < 0 || this.y < 0) {
      this.gameOver();
    }
  };

  this.changeDirection = function(direction) {
    switch (direction) {
      case "Up":
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = -scale;
        }
        break;
      case "Down":
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = scale;
        }
        break;
      case "Left":
        if (this.xSpeed === 0) {
          this.xSpeed = -scale;
          this.ySpeed = 0;
        }
        break;
      case "Right":
        if (this.xSpeed === 0) {
          this.xSpeed = scale;
          this.ySpeed = 0;
        }
        break;
    }
  };

  this.eat = function(fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.total++;
      return true;
    }
    return false;
  };

  this.checkCollision = function() {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        this.total = 0;
        this.tail = [];
      }
    }
  };

  this.gameOver = function() {
    document.getElementById("game-over").style.display = "flex";
    document.getElementById("restart-button").addEventListener("click", () => {
      window.location.reload();
    });
    clearInterval(window.gameInterval);
  };
}

function Fruit() {
  this.x = 0;
  this.y = 0;

  this.pickLocation = function() {
    this.x = (Math.floor(Math.random() * columns - 1) + 1) * scale;
    this.y = (Math.floor(Math.random() * rows - 1) + 1) * scale;
  };

  this.draw = function() {
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(this.x, this.y, scale, scale);
  };
}
