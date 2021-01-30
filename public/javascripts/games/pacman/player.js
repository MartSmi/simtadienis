class Player {
  constructor(game) {
    let smallOfset = 0;
    this.sizeX = game.level.cellSizeX - smallOfset;
    this.sizeY = game.level.cellSizeY - smallOfset;
    this.radius = this.sizeX / 2;

    this.speed = 75;
    this.dir = 0;
    this.savedDir = 0;

    this.position = {
      x: game.gameWidth / 2 - 100,
      y: game.gameHeight / 2,
    };

    this.img = document.getElementById('img_pacman');

    this.game = game;
  }

  updateDir(newDir) {
    // this.dir = newDir;
    this.savedDir = newDir;
  }

  draw(ctx) {
    let posX = this.position.x - this.sizeX / 2;
    let posY = this.position.y - this.sizeY / 2;
    ctx.drawImage(this.img, posX, posY, this.sizeX, this.sizeY);
  }

  moveLeft(deltaTime) {
    let newPosition = {
      x: this.position.x + this.speed * deltaTime,
      y: this.position.y,
    };
    if (this.game.level.canMove(this.position, 0, 1)) {
      this.position = newPosition;
      return true;
    } else {
      return false;
    }
  }

  moveRight(deltaTime) {
    let newPosition = {
      x: this.position.x - this.speed * deltaTime,
      y: this.position.y,
    };
    if (this.game.level.canMove(this.position, 0, -1)) {
      this.position = newPosition;
      return true;
    } else {
      return false;
    }
  }

  moveUp(deltaTime) {
    let newPosition = {
      x: this.position.x,
      y: this.position.y - this.speed * deltaTime,
    };
    if (this.game.level.canMove(this.position, -1, 0)) {
      this.position = newPosition;
      return true;
    } else {
      return false;
    }
  }

  moveDown(deltaTime) {
    let newPosition = {
      x: this.position.x,
      y: this.position.y + this.speed * deltaTime,
    };
    if (this.game.level.canMove(this.position, 1, 0)) {
      this.position = newPosition;
      return true;
    } else {
      return false;
    }
  }

  move(direction, deltaTime) {
    switch (direction) {
      case 0:
        return this.moveUp(deltaTime);
      case 1:
        return this.moveRight(deltaTime);
      case 2:
        return this.moveDown(deltaTime);
      case 3:
        return this.moveLeft(deltaTime);
      default:
        console.log('unknown direction');
        return false;
    }
  }

  update(deltaTime) {
    // console.log("pacman pos: " + this.position.x + ", " + this.position.y);
    let moved = this.move(this.savedDir, deltaTime);

    if (moved) {
      this.dir = this.savedDir;
    } else {
      this.move(this.dir, deltaTime);
    }
    
    /*let eps = 1e-3;
    let id = this.game.level.posToId(this.position);
    let cellPos = this.game.level.idToPos(id);
    if (Math.abs(this.position.x - cellPos.x) < eps && Math.abs(this.position.y - cellPos.y) < eps) {
      this.position = cellPos;
    } */

    // console.log("pacman pos: " + this.position.x + ", " + this.position.y);
  }
}
