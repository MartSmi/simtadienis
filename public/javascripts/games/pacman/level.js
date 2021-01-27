class GridTile {
  constructor (name, id, elementId, canWalk) {
    this.name = name;
    this.id = id;
    this.img = document.getElementById(elementId);
    this.canWalk = canWalk;
  }
}

class GridSetup {
  constructor (game) {
    this.gridTiles = [
      new GridTile (
        'Empty',
        0,
        'img_bg',
        true
      ),
      new GridTile (
        'FullWall',
        1,
        'img_wall',
        false
      ),
      new GridTile (
        'Pickup1',
        2,
        'img_bg',
        true
      ),
      new GridTile (
        'EmptyNotWalkable',
        3,
        'img_bg',
        false
      ),
    ];

    this.levelGrid = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],//
      [1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1],//
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],//
      [1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],//
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1], //
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1], //
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], //
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1], //
      [3, 3, 3, 3, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 3, 3, 3, 3], //
      [3, 3, 3, 3, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 3, 3, 3, 3], //
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 3, 3, 3, 1, 0, 1, 0, 1, 1, 1, 1, 1],//
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0],///
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 3, 3, 3, 1, 0, 1, 0, 1, 1, 1, 1, 1],
      [3, 3, 3, 3, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 3, 3, 3, 3], 
      [3, 3, 3, 3, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 3, 3, 3, 3], 
      [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1], 
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], 
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1], 
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1], 
      [1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
      [1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    this.levelHeight = this.levelGrid.length;
    this.levelWidth = this.levelGrid[0].length;

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.cellSizeX = this.gameWidth / this.levelWidth;
    this.cellSizeY = this.gameHeight / this.levelHeight;
  }

  canWalk (i, j) {
    let id = this.levelGrid[i][j];
    return this.gridTiles[id].canWalk;
  }

  getDotPositions () {
    var positions = [];
    for (var i = 0; i < this.levelHeight; i++) {
      for (var j = 0; j < this.levelWidth; j++) {
        let id = this.levelGrid[i][j];

        if (id > 0 && this.gridTiles[id].canWalk) {
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
}

class Level {
  
  isIntersection (i, j) {
    if (!this.setup.canWalk(i,j))
      return false;
    if (i > 0 && i < this.levelHeight - 1 && j > 0 && j < this.levelWidth - 1) {
      if (this.setup.canWalk(i-1, j) && this.setup.canWalk(i+1, j) && !this.setup.canWalk(i, j-1) && !this.setup.canWalk(i, j+1))
        return false;
      if (!this.setup.canWalk(i-1, j) && !this.setup.canWalk(i+1, j) && this.setup.canWalk(i, j-1) && this.setup.canWalk(i, j+1))
        return false;
    }
    return true;
  }

  markIntersections() {
    this.intersections = [...Array(this.levelHeight)].map(e => Array(this.levelWidth).fill(0));
    for (var i = 0; i < this.levelHeight; i++) {
      for (var j = 0; j < this.levelWidth; j++) {
        this.intersections[i][j] = this.isIntersection(i, j);
        if (this.intersections[i][j]) {
          this.intersectionList.push({i: i, j: j});
        }
      }
    }

    //for (var i = 0; i < this.levelHeight; i++) {
    //  console.log("Intersections at i = " + i + "  : " + this.intersections[i]);
    //}
  }
  
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.setup = new GridSetup (game);


    this.levelHeight = this.setup.levelGrid.length;
    this.levelWidth = this.setup.levelGrid[0].length;

    this.cellSizeX = this.gameWidth / this.levelWidth;
    this.cellSizeY = this.gameHeight / this.levelHeight;
    // console.log("level width: " + this.levelWidth);
    // console.log("level height: " + this.levelHeight);

    //this.imgWall = document.getElementById('img_wall');
    //this.imgEmpty = document.getElementById('img_bg');

    this.game = game;

    this.intersectionList = [];
    this.markIntersections();
  }

  draw(ctx) {
    for (var i = 0; i < this.levelHeight; i++) {
      for (var j = 0; j < this.levelWidth; j++) {
        let posX = this.cellSizeX * j;
        let posY = this.cellSizeY * i;
        let id = this.setup.levelGrid[i][j];

        ctx.drawImage(
          this.setup.gridTiles[id].img,
          posX,
          posY,
          this.cellSizeX,
          this.cellSizeY
        );
      }
    }
  }

  getDotPositions() {
    return this.setup.getDotPositions();
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
        if (!this.setup.canWalk(i, j)) {
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
      } else if (!this.setup.canWalk(ni, j))
        break;
    }

    for (var ni = i+1; ni < this.levelHeight; ni++) {
      if (this.intersections[ni][j]) {
        ids.push({x: ni, y: j});
        break;
      } else if (!this.setup.canWalk(ni, j))
      break;
    }

    for (var nj = j-1; nj >= 0; nj--) {
      if (this.intersections[i][nj]) {
        ids.push({x: i, y: nj});
        break;
      } else if (!this.setup.canWalk(i, nj))
        break;
    }

    for (var nj = j+1; nj < this.levelWidth; nj++) {
      if (this.intersections[i][nj]) {
        ids.push({x: i, y: nj});
        break;
      } else if (!this.setup.canWalk(i, nj))
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

  goUntilIntersection (curId, di, dj) {
    var i = curId.i;
    var j = curId.j;
    while (!this.intersections[i][j]){
      i += di;
      j += dj;
      if (!this.setup.canWalk(i, j)) {
        i = curId.i;
        j = curId.j;
        break;
      }
    }
    let ret = {
      i: i,
      j: j
    };
    return ret;
  }

  getRandomIntersection () {
    let randId = Math.floor(Math.random() * this.intersectionList.length);
    return this.intersectionList[randId];
  }
}
