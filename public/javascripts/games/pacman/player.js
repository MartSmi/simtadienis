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
    this.targetPos = {
      x: this.position.x,
      y: this.position.y,
    };

    this.img = document.getElementById('img_pacman');

    this.game = game;
  }

  draw(ctx) {
    let posX = this.position.x - this.sizeX / 2;
    let posY = this.position.y - this.sizeY / 2;
    ctx.drawImage(this.img, posX, posY, this.sizeX, this.sizeY);
  }

  getDeltas (direction) {
    var deltas = {
      di: 0,
      dj: 0
    };
    switch (direction) {
      case 0:
        deltas.di = -1;
        break;
      case 1:
        deltas.dj = -1;
        break;
      case 2:
        deltas.di = 1;
        break;
      case 3:
        deltas.dj = 1;
        break;
      default:
        console.log('unknown direction');
        break;
    }

    // console.log("Checked direction: " + direction + " Deltas got:");
    // console.log(deltas);

    return deltas;
  }

  atSomePlace (placePos) {
    let eps = 1e-9;
    if (Math.abs(this.position.x - placePos.x) < eps
       && Math.abs(this.position.y - placePos.y) < eps)
   // if (this.position.x == this.targetPosition.x && this.position.y == this.targetPosition.y)
        return true;
    else 
        return false;
  }

  updateTargetPos () {
    // first try with saved dir
    // try to see if current cell + dir is not wall, and if not - target is there
    // else try dir
    // if not wall, target there, else target is close by one (aka current pos is target)
    let currentId = this.game.level.posToId (this.position);

    var canUseSavedDir = this.atSomePlace (this.game.level.idToPos(currentId));

    if (canUseSavedDir) {
      // trying to go to saved dir
      let savedDirDeltas = this.getDeltas(this.savedDir);
      let idAfterSavedDir = {
        i: currentId.i + savedDirDeltas.di,
        j: currentId.j + savedDirDeltas.dj,
      };

      if (this.game.level.canPacmanGo(idAfterSavedDir.i, idAfterSavedDir.j)) {
        this.targetPos = this.game.level.idToPos (idAfterSavedDir);

        // console.log("Updating pacman target. Cur pos:");
        // console.log(this.position);
        // console.log("Target Pos:");
        // console.log(this.targetPos);
        // console.log("Current index: ");
        // console.log(currentId);
        // console.log("Target ID: ");
        // console.log(idAfterSavedDir);

        this.dir = this.savedDir;

        return;
      }
    }

    // trying to go to dir
    let dirDeltas = this.getDeltas(this.dir);
    let idAfterDir = {
      i: currentId.i + dirDeltas.di,
      j: currentId.j + dirDeltas.dj,
    };

    if (this.game.level.canPacmanGo(idAfterDir.i, idAfterDir.j)) {
      this.targetPos = this.game.level.idToPos (idAfterDir);

      // console.log("Updating pacman target. Cur pos:");
      // console.log(this.position);
      // console.log("Target Pos:");
      // console.log(this.targetPos);
      // console.log("Current index: ");
      // console.log(currentId);
      // console.log("Target ID: ");
      // console.log(idAfterDir);

      return;
    }

    // cannot go anywhere
    this.targetPos = this.game.level.idToPos (currentId);

    // console.log("Updating pacman target. Cur pos:");
    // console.log(this.position);
    // console.log("Target Pos:");
    // console.log(this.targetPos);
    // console.log("Current index: ");
    // console.log(currentId);
    // console.log("Target ID: ");
    // console.log(currentId);
  }

  atPlace () {
    return this.atSomePlace(this.targetPos);
  }

  atFirstPortal () {
    let firstPortalId = this.game.level.setup.firstPortalId;
    let firstPortalPos = this.game.level.idToPos (firstPortalId);
    return (this.atSomePlace(firstPortalPos));
  }

  atSecondPortal () {
    let secondPortalId = this.game.level.setup.secondPortalId;
    let secondPortalPos = this.game.level.idToPos (secondPortalId);
    return (this.atSomePlace(secondPortalPos));
  }

  moveToFirstPortal () {
    let firstPortalId = this.game.level.setup.firstPortalId;
    let firstPortalPos = this.game.level.idToPos (firstPortalId);
    this.position = firstPortalPos;
    this.updateTargetPos();
  }

  moveToSecondPortal () {
    let secondPortalId = this.game.level.setup.secondPortalId;
    let secondPortalPos = this.game.level.idToPos (secondPortalId);
    this.position = secondPortalPos;
    this.updateTargetPos();
  }

  updateDir(newDir) {
    // this.dir = newDir;
    this.savedDir = newDir;
   if ((8 + this.savedDir - this.dir) % 4 == 2)
     this.dir = this.savedDir;

    this.updateTargetPos ();

    console.log("Dir: " + this.dir);
    console.log("Saved dir: " + this.savedDir);
  }

  // moveLeft(deltaTime, isTurn) {
  //   let newPosition = {
  //     x: this.position.x + this.speed * deltaTime,
  //     y: this.position.y,
  //   };
  //   if (this.game.level.canMove(this.position, 0, 1, isTurn)) {
  //     this.position = newPosition;
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // moveRight(deltaTime, isTurn) {
  //   let newPosition = {
  //     x: this.position.x - this.speed * deltaTime,
  //     y: this.position.y,
  //   };
  //   if (this.game.level.canMove(this.position, 0, -1, isTurn)) {
  //     this.position = newPosition;
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // moveUp(deltaTime, isTurn) {
  //   let newPosition = {
  //     x: this.position.x,
  //     y: this.position.y - this.speed * deltaTime,
  //   };
  //   if (this.game.level.canMove(this.position, -1, 0, isTurn)) {
  //     this.position = newPosition;
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // moveDown(deltaTime, isTurn) {
  //   let newPosition = {
  //     x: this.position.x,
  //     y: this.position.y + this.speed * deltaTime,
  //   };
  //   if (this.game.level.canMove(this.position, 1, 0, isTurn)) {
  //     this.position = newPosition;
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // move(direction, deltaTime, isTurn) {
  //   switch (direction) {
  //     case 0:
  //       return this.moveUp(deltaTime, isTurn);
  //     case 1:
  //       return this.moveRight(deltaTime, isTurn);
  //     case 2:
  //       return this.moveDown(deltaTime, isTurn);
  //     case 3:
  //       return this.moveLeft(deltaTime, isTurn);
  //     default:
  //       console.log('unknown direction');
  //       return false;
  //   }
  // }

  // atIntersection () {
  //   return this.game.level.isPosIntersection(this.position);
  // }

  moveToTarget (deltaTime) {
    let deltaMove = this.speed * deltaTime;

    var newPosition = {
      x: this.position.x,
      y: this.position.y,
    };

    
    if (this.position.x < this.targetPos.x)
      newPosition.x = Math.min(this.position.x + deltaMove, this.targetPos.x);
    else 
      newPosition.x = Math.max(this.position.x - deltaMove, this.targetPos.x);

    if (this.position.y < this.targetPos.y)
      newPosition.y = Math.min(this.position.y + deltaMove, this.targetPos.y);
    else 
      newPosition.y = Math.max(this.position.y - deltaMove, this.targetPos.y);
    
    this.position = newPosition;
  }

  update(deltaTime) {

    this.moveToTarget (deltaTime);
    if (this.atPlace()) {
      //console.log("Pacman at place");
      if (this.atFirstPortal())
        this.moveToSecondPortal();
      else if (this.atSecondPortal()) 
        this.moveToFirstPortal();
      else 
        this.updateTargetPos();
    }

    // console.log("pacman pos: " + this.position.x + ", " + this.position.y);
    // let moved;
    
    // if ((8 + this.dir - this.savedDir) % 4 == 2 || this.atIntersection())
    //   moved = this.move(this.savedDir, deltaTime, true);
    // else 
    //   moved = false;


    // if (moved) {
    //   this.dir = this.savedDir;
    // } else {
    //   this.move(this.dir, deltaTime, false);
    // }
    
    /*let eps = 1e-3;
    let id = this.game.level.posToId(this.position);
    let cellPos = this.game.level.idToPos(id);
    if (Math.abs(this.position.x - cellPos.x) < eps && Math.abs(this.position.y - cellPos.y) < eps) {
      this.position = cellPos;
    } */

    // console.log("pacman pos: " + this.position.x + ", " + this.position.y);
  }
}
