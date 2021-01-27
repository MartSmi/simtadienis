class Game {
  constructor(gameWidth, gameHeight) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.score = 0;
  }

  createLevel() {
    this.level = new Level(this);
    this.player = new Player(this);
    this.redGhost = new RedGhost(this);
    this.pinkGhost = new PinkGhost(this);
    this.yellowGhost = new YellowGhost(this);
    this.cyanGhost = new CyanGhost(this);
    this.dots = [];

    this.ghosts = [];
    this.ghosts.push(this.redGhost);
    this.ghosts.push(this.pinkGhost);
    this.ghosts.push(this.yellowGhost);
    this.ghosts.push(this.cyanGhost);

    let dotPositions = this.level.getDotPositions();
    //console.log(dotPositions);
    // console.log("dotPositions: " + dotPositions);
    for (var pos of dotPositions) {
      // console.log("in dot: " + pos.x + "  " + pos.y);
      this.dots.push(new Pickup(this, pos));
    }
  }

  start() {
    this.createLevel();

    new InputHandler(this.player);

    this.gameObjects = [this.level, ...this.dots, ...this.ghosts, this.player];
  }

  update(deltaTime) {
    this.gameObjects.forEach(object => object.update(deltaTime));
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.gameWidth, this.gameWidth);
    this.gameObjects.forEach(object => object.draw(ctx));

    //let graph = new Graph (this, this.level, this.redGhost.position, this.player.position);
    //graph.drawGraph(ctx);
  }

  addScore(scoreToAdd) {
    this.score += scoreToAdd;
    console.log('Score: ' + this.score);
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
        dj = 1;
        break;
      case 2: // down
        di = 1;
        dj = 0;
        break;
      case 3: // left
        di = 0;
        dj = -1;
        break;
      default:
        console.log("unknown dir");
        break;
    }

    let targetId = this.level.goUntilIntersection (curId, di, dj);
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
