class Game {
  constructor(gameWidth, gameHeight) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    //this.gameLog = document.getElementById('log_text');
    this.lost = false;
    this.won = false;
    this.winScore = 500;
  }

  createLevel() {
    this.level = new Level(this);
    this.player = new Player(this);
    let redGhost = new RedGhost(this);
    let pinkGhost = new PinkGhost(this);
    let yellowGhost = new YellowGhost(this);
    let cyanGhost = new CyanGhost(this);
    this.pickups = [];

    this.pickupCount = 0;

    this.ghosts = [];
    this.ghosts.push(redGhost);
    this.ghosts.push(pinkGhost);
    this.ghosts.push(yellowGhost);
    this.ghosts.push(cyanGhost);

    let dotPositions = this.level.getDotPositions();
    //console.log(dotPositions);
    // console.log("dotPositions: " + dotPositions);
    for (var pos of dotPositions) {
      // console.log("in dot: " + pos.x + "  " + pos.y);
      this.pickups.push(new Pickup(this, pos));
      this.pickupCount++;
    }

    let powerPickupPositions = this.level.getPowerPickupPositions();
    for (var pos of powerPickupPositions) {
      this.pickups.push(new PowerPickup(this, pos));
      this.pickupCount++;
    }

    let fruitPickupPositions = this.level.getFruitPickupPositions();
    for (var pos of fruitPickupPositions) {
      this.pickups.push(new FruitPickup(this, pos));
      this.pickupCount++;
    }
  }

  start() {
    this.createLevel();

    this.lost = false;
    this.won = false;

    new InputHandler(this.player);

    this.gameObjects = [this.level, ...this.pickups, ...this.ghosts, this.player];

    this.chaseTime = 20;
    this.scatterTime = 20;
    this.frightenedTime = 10;
    this.leftTime = this.chaseTime;
    this.ghostMode = GhostMode.CHASE;

    this.score = 0;
    this.scoreText = document.getElementById('score_text');
    this.scoreText.innerHTML = 'Score: ' + ("0000" + this.score).slice(-4);
  }

  ghostsToChase () {
    this.ghostMode = GhostMode.CHASE;
    this.leftTime = this.chaseTime;
    this.ghosts.forEach(ghost => ghost.switchToMode(this.ghostMode));
  }

  ghostsToScatter () {
    this.ghostMode = GhostMode.SCATTER;
    this.leftTime = this.scatterTime;
    this.ghosts.forEach(ghost => ghost.switchToMode(this.ghostMode));
  }

  ghostsToFrightened () {
    this.ghostMode = GhostMode.FRIGHTENED;
    this.leftTime = this.frightenedTime;
    this.ghosts.forEach(ghost => ghost.switchToMode(this.ghostMode));
  }

  update(deltaTime, playing) {
    //console.log(deltaTime);

    if (!playing) return;

    if (deltaTime > 0.1) return;

    //this.gameObjects.forEach(object => object.updateFrame(deltaTime));
    this.gameObjects.forEach(object => object.update(deltaTime));

    this.leftTime -= deltaTime;
    if (this.leftTime <= 0) {
      switch (this.ghostMode) {
        case GhostMode.CHASE:
            this.ghostsToScatter();
            break;
        case GhostMode.SCATTER:
            this.ghostsToChase();
            break;
        case GhostMode.FRIGHTENED:
            this.ghostsToChase();
            break;
        default:
            console.log("unknown ghost mode");
            break;
      }
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.gameWidth, this.gameWidth);
    this.gameObjects.forEach(object => object.draw(ctx));

    //let graph = new Graph (this, this.level, this.redGhost.position, this.player.position);
    //graph.drawGraph(ctx);
  }

  addScore(scoreToAdd, isPickup) {
    this.score += scoreToAdd;
    //console.log('Score: ' + this.score);

    if (isPickup) {
      this.pickupCount--;
      console.log(this.pickupCount);
      if (this.pickupCount == 0) {
        this.score += this.winScore;
        this.won = true;
      }
    }

    this.scoreText.innerHTML = 'Score: ' + ("0000" + this.score).slice(-4);
  }

  getPacmanPos () {
    return this.player.position;
  }

  getPacmanTargetPos () {
    let curId = this.level.posToId (this.player.position);
    let dir = this.player.dir;
    let di, dj;
    switch (dir) {
      case 0: // up
        di = -1;
        dj = 0;
        break;
      case 1: // right
        di = 0;
        dj = -1;
        break;
      case 2: // down
        di = 1;
        dj = 0;
        break;
      case 3: // left
        di = 0;
        dj = 1;
        break;
      default:
        console.log("unknown dir");
        break;
    }

    let targetId = this.level.goUntilWall (curId, di, dj);
    let targetPos = this.level.idToPos(targetId);
    return targetPos;
  }

  getRandomPos () {
    let intersection = this.level.getRandomIntersection();
    return this.level.idToPos(intersection);
  }

  convertGraphIdToPos (idLinear) {
    let idInArray = this.level.idToIndices(idLinear);
    let intersectionPos = this.level.idToPos (idInArray);
    return intersectionPos;
  }

  getNextIntersection (posFrom, posTo) {
    let graph = new Graph (this, this.level, posFrom, posTo);
    let idLinear = graph.getNextIntersectionInShortestRoute();
    let intersectionPos = this.convertGraphIdToPos(idLinear);
    
    // console.log("from getnextinter at game.js:");
    // console.log(idLinear);
    // console.log(idInArray);
    // console.log(intersectionPos);
    
    return intersectionPos;
  }

  goCyanToPacman(position) {
    let pacmanPos = this.getPacmanPos();
    let distX = (position.x - pacmanPos.x)*(position.x - pacmanPos.x);
    let distY = (position.y - pacmanPos.y)*(position.y - pacmanPos.y);
    let dist = distX + distY;
    return (dist > (8 * 8 * this.level.cellSizeX * this.level.cellSizeX));
  }
}
