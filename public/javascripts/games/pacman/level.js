class Level {
  
  isIntersection (i, j) {
    if (this.grid[i][j] == 1)
      return false;
    if (i > 0 && i < this.levelHeight - 1 && j > 0 && j < this.levelWidth - 1) {
      if (this.grid[i-1][j] == 1 && this.grid[i+1][j] == 1 && this.grid[i][j-1] != 1 && this.grid[i][j+1] != 1)
        return false;
      if (this.grid[i-1][j] != 1 && this.grid[i+1][j] != 1 && this.grid[i][j-1] == 1 && this.grid[i][j+1] == 1)
        return false;
    }
    return true;
  }

  markIntersections() {
    this.intersections = [...Array(this.levelHeight)].map(e => Array(this.levelWidth).fill(0));
    for (var i = 0; i < this.levelHeight; i++) {
      for (var j = 0; j < this.levelWidth; j++) {
        this.intersections[i][j] = this.isIntersection(i, j);
      }
    }

    //for (var i = 0; i < this.levelHeight; i++) {
    //  console.log("Intersections at i = " + i + "  : " + this.intersections[i]);
    //}
  }
  
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

    this.markIntersections();
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

  getNearIntersections (i, j) {
    var ids = [];

    for (var ni = i-1; ni >= 0; ni--) {
      if (this.intersections[ni][j]) {
        ids.push({x: ni, y: j});
        break;
      } else if (this.grid[ni][j] == 1)
        break;
    }

    for (var ni = i+1; ni < this.levelHeight; ni++) {
      if (this.intersections[ni][j]) {
        ids.push({x: ni, y: j});
        break;
      } else if (this.grid[ni][j] == 1)
      break;
    }

    for (var nj = j-1; nj >= 0; nj--) {
      if (this.intersections[i][nj]) {
        ids.push({x: i, y: nj});
        break;
      } else if (this.grid[i][nj] == 1)
        break;
    }

    for (var nj = j+1; nj < this.levelWidth; nj++) {
      if (this.intersections[i][nj]) {
        ids.push({x: i, y: nj});
        break;
      } else if (this.grid[i][nj] == 1)
      break;
    }

    //console.log(ids);

    return ids;
  }

  getId (i, j) {
    let id = i * this.levelWidth + j;
    //console.log("i: " + i + " j: " + j + " id: " + id);
    return id;
  }

  idToIndices (id) {
    let calcI = Math.floor(id / this.levelWidth);
    let calcJ = id - calcI * this.levelWidth;
    let ret = {
      i: calcI,
      j: calcJ
    };
    return ret;
  }

  posToId (pos) {
    let calcedI = Math.floor (pos.y / this.cellSizeY);
    let calcedJ = Math.floor (pos.x / this.cellSizeX);
    let id = {
      i: calcedI,
      j: calcedJ
    };
    return id;
  }

  idToPos (id) {
    let posX = id.j * this.cellSizeX + this.cellSizeX/2;
    let posY = id.i * this.cellSizeY + this.cellSizeY/2;
    let pos = {
      x: posX,
      y: posY
    };
    return pos;
  }
}
