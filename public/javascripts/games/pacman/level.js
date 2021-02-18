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
        'img_bg',
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
      new GridTile (
        'Pickup2',
        4,
        'img_bg',
        true
      ),
      new GridTile (
        'Pickup3',
        5,
        'img_bg',
        true
      ),
    ];

    // 28 x 31

    this.levelGrid = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 4, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 4, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1], 
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
      [1, 4, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 5, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 4, 1],
      [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
      [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
      [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
      [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    this.firstPortalId = {
      i: 14,
      j: -1
    };
    this.secondPortalId = {
      i: 14,
      j: 28
    };

    this.levelHeight = this.levelGrid.length;
    this.levelWidth = this.levelGrid[0].length;
    // console.log(this.levelWidth);
    // console.log(this.levelHeight);

    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.cellSizeX = this.gameWidth / this.levelWidth;
    this.cellSizeY = this.gameHeight / this.levelHeight;
  }

  canWalk (i, j) {
    let id = this.levelGrid[i][j];
    return this.gridTiles[id].canWalk;
  }

  getPositions (idToLook) {
    var positions = [];
    for (var i = 0; i < this.levelHeight; i++) {
      for (var j = 0; j < this.levelWidth; j++) {
        let id = this.levelGrid[i][j];

        if (id == idToLook) {
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

    this.game = game;

    this.intersectionList = [];
    this.markIntersections();

    this.gridImg = document.getElementById('img_grid');
  }
  
  draw(ctx) {
    ctx.drawImage(this.gridImg, 0, 0, this.gameWidth, this.gameHeight);

    for (var i = 0; i < this.levelHeight; i++) {
      for (var j = 0; j < this.levelWidth; j++) {
        let posX = this.cellSizeX * j;
        let posY = this.cellSizeY * i;
        let id = this.setup.levelGrid[i][j];
        if (id == 1) continue;

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
    return this.setup.getPositions(2);
  }

  getPowerPickupPositions() {
    return this.setup.getPositions(4);
  }

  getFruitPickupPositions() {
    return this.setup.getPositions(5);
  }

  update(deltaTime) {
    return;
  }

  getNearIntersections (i, j) {
    var ids = [];

    if (j < 0) {
      ids.push({x: i, j: 0});
      return ids;
    } 
    if (j >= this.levelWidth) {
      ids.push({x: i, j: this.levelWidth-1});
      return ids;
    }

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

  goUntilWall (curId, di, dj) {
    var i = curId.i;
    var j = curId.j;
    while (i < this.levelHeight && j < this.levelWidth && i >= 0 && j >= 0 && this.setup.canWalk(i,j)){
      i += di;
      j += dj;
    }
    i -= di;
    j -= dj;
    let ret = {
      i: i,
      j: j
    };
    return ret;
  }

  canPacmanGo (i, j) {
    //return this.setup.canWalk(i,j);
    if (i == this.setup.firstPortalId.i && j == this.setup.firstPortalId.j)
      return true;
    else if (i == this.setup.secondPortalId.i && j == this.setup.secondPortalId.j)
      return true;
    else if ((j < 0 || j >= this.levelWidth) && i != this.setup.firstPortalId.i)
      return false;
    else if (j < -1 || j > this.levelWidth)
      return false;
    else
      return this.setup.canWalk(i, j);
  }

  isPosIntersection (pos) {
    let id = this.posToId(pos);
    return this.intersections[id.i][id.j];
  }

  getRandomIntersection () {
    let randId = Math.floor(Math.random() * this.intersectionList.length);
    return this.intersectionList[randId];
  }

  canMove(position, di, dj, isTurn) {
    
    let id = this.posToId(position);
    let newPos = {
      x: position.x + dj*this.cellSizeX/1.99,
      y: position.y + di*this.cellSizeY/1.99
    }


    var newId = {
      i: id.i + di,
      j: id.j + dj
    };

    if (isTurn && newId.i >= 0 && newId.j >= 0 && newId.i < this.levelHeight && newId.j < this.levelWidth)
      if (!this.setup.canWalk(newId.i, newId.j))
        return false;

    newId = this.posToId(newPos);

    if (newId.i >= 0 && newId.j >= 0 && newId.i < this.levelHeight && newId.j < this.levelWidth){
      if (!this.setup.canWalk(newId.i, newId.j))
        return false;
      
      let eps = 1e-1;
      if (dj == 0) {
        let lineCoord = this.cellSizeX * id.j + this.cellSizeX / 2;
        if (Math.abs(lineCoord - position.x) > eps)
          return false;
      } else {
        let lineCoord = this.cellSizeY * id.i + this.cellSizeY / 2;
        if (Math.abs(lineCoord - position.y) > eps)
          return false;
      }
    }

    // let minX = position.x - this.game.player.sizeX / 2;
    // let minY = position.y - this.game.player.sizeY / 2;
    // let maxX = minX + this.game.player.sizeX;
    // let maxY = minY + this.game.player.sizeY;

    /*
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
    */

    return true;
  }
}
