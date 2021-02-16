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

    this.imgList = [document.getElementById('img_pacman1'),
                    document.getElementById('img_pacman2'),
                    document.getElementById('img_pacman3')];
    this.currentSpriteId = 0;
    this.spriteAnimationTime = 0.05;
    this.timeLeftUntilNextSprite = this.spriteAnimationTime;

    this.game = game;
  }

  getRotation () {  
    var angle = 0;
    switch (this.dir) {
      case 0:
        angle = 3 * Math.PI / 2;
        break;
      case 1:
        angle = Math.PI;
        break;
      case 2:
        angle = Math.PI / 2;
        break;
      case 3:
        angle = 2 * Math.PI;
        break;
      default:
        console.log('unknown direction');
        break;
    }
    return angle;
  }

  draw(ctx) {
    if (this.timeLeftUntilNextSprite <= 0) {
      this.timeLeftUntilNextSprite = this.spriteAnimationTime;
      this.currentSpriteId++;
      this.currentSpriteId %= this.imgList.length;
    }

    let currentImg = this.imgList[this.currentSpriteId];
    var x = this.position.x;
    var y = this.position.y;
    var width = this.sizeX;
    var height = this.sizeY;

    var rotation = this.getRotation();

    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.drawImage(currentImg, -width / 2, -height / 2, width, height);
    ctx.rotate(-rotation);
    ctx.translate(-x, -y);
    // let posX = this.position.x - this.sizeX / 2;
    // let posY = this.position.y - this.sizeY / 2;
    
    // ctx.drawImage(currentImg, posX, posY, this.sizeX, this.sizeY);
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

    return deltas;
  }

  atSomePlace (placePos) {
    let eps = 1e-9;
    if (Math.abs(this.position.x - placePos.x) < eps
       && Math.abs(this.position.y - placePos.y) < eps)
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

      return;
    }

    // cannot go anywhere
    this.targetPos = this.game.level.idToPos (currentId);
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

    this.timeLeftUntilNextSprite -= deltaTime;
  }
}
