class Level {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    // 0 - empty
    // 1 - wall
    // 2 - empty with dot
    this.grid = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 2, 0, 0, 1, 1, 1, 1, 1],
      [1, 2, 2, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 2, 1, 0, 0, 1, 1, 1, 1],
      [1, 1, 2, 1, 0, 0, 1, 1, 1, 1],
      [1, 1, 2, 1, 1, 0, 0, 2, 1, 1],
      [1, 0, 2, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 2, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    this.levelHeight = this.grid.length;
    this.levelWidth = this.grid[0].length;

    this.cellSizeX = this.gameWidth / this.levelWidth;
    this.cellSizeY = this.gameHeight / this.levelHeight;
    // console.log("level width: " + this.levelWidth);
    // console.log("level height: " + this.levelHeight);

    this.imgWall = document.getElementById('img_wall');
    this.imgEmpty = document.getElementById('img_bg');

    this.game = game;
  }

  draw(ctx) {
    for (var i = 0; i < this.levelHeight; i++) {
      for (var j = 0; j < this.levelWidth; j++) {
        let posX = this.cellSizeX * j;
        let posY = this.cellSizeY * i;
        if (this.grid[i][j] == 1) {
          // ctx.fillStyle = 'blue';
          // ctx.fillRect(this.cellSizeX * j, this.cellSizeY * i, this.cellSizeX, this.cellSizeY);
          // console.log("draw level: " + (cellSizeX * j) + ", " + (cellSizeY * i) + ", " + cellSizeX + ", " + cellSizeY);

          ctx.drawImage(
            this.imgWall,
            posX,
            posY,
            this.cellSizeX,
            this.cellSizeY
          );
        } else {
          ctx.drawImage(
            this.imgEmpty,
            posX,
            posY,
            this.cellSizeX,
            this.cellSizeY
          );
        }
      }
    }
  }

  getDotPositions() {
    var positions = [];
    for (var i = 0; i < this.levelHeight; i++) {
      for (var j = 0; j < this.levelWidth; j++) {
        if (this.grid[i][j] == 2) {
          let pos = {
            x: this.cellSizeX * j + this.cellSizeX / 2,
            y: this.cellSizeY * i + this.cellSizeY / 2,
          };
          positions.push(pos);
        }
      }
    }
    // console.log("in getdotpos: " + positions);
    // for (var p of positions)
    //     console.log("  in p: " + p.x + " " + p.y);
    return positions;
  }

  update(deltaTime) {
    return;
  }

  canMove(position) {
    // needs optimisation
    let minX = position.x - this.game.player.sizeX / 2;
    let minY = position.y - this.game.player.sizeY / 2;
    let maxX = minX + this.game.player.sizeX;
    let maxY = minY + this.game.player.sizeY;

    // let eps = 0.002;

    for (var i = 0; i < this.levelHeight; i++) {
      for (var j = 0; j < this.levelWidth; j++) {
        if (this.grid[i][j] == 1) {
          let cellMinX = this.cellSizeX * j;
          let cellMinY = this.cellSizeY * i;
          let cellMaxX = cellMinX + this.cellSizeX;
          let cellMaxY = cellMinY + this.cellSizeY;

          // // console.log("cellmin: " + cellMinX + " with eps: " + (cellMinX+eps));
          // cellMinX += eps;
          // cellMinY += eps;
          // cellMaxX -= eps;
          // cellMaxY -= eps;

          // console.log("cellminX: " + cellMinX);
          // console.log("cellminY: " + cellMinY);
          // console.log("cellmaxX: " + cellMaxX);
          // console.log("cellmaxY: " + cellMaxY);

          let inX =
            (cellMinX < minX && minX < cellMaxX) ||
            (cellMinX < maxX && maxX < cellMaxX);
          let inY =
            (cellMinY < minY && minY < cellMaxY) ||
            (cellMinY < maxY && maxY < cellMaxY);

          if (inX && inY) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
