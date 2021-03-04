class Game {
  constructor(gameWidth, gameHeight) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    //this.gameLog = document.getElementById('log_text');
    this.lost = false;
    this.won = false;
    this.winScore = 500;

    this.graphGenerated = false;

    this.waitTimeAtStart = 3;
    this.timeLeftUntilStart = this.waitTimeAtStart;

    this.chaseTime = 20;
    this.scatterTime = 20;
    this.frightenedTime = 10;

    this.maxHealth = 5;
    this.curHealth = 0;
    this.curLevel = 1;

    this.scoreText = document.getElementById('score_text');
    this.levelText = document.getElementById('level_text');
    this.lifeText = document.getElementById('life_text');

    this.scoreCount = document.getElementById('score_count');
    this.levelCount = document.getElementById('level_count');
    this.lifeCount = document.getElementById('life_count');

    this.imgNumber1 = document.getElementById('img_num1');
    this.imgNumber2 = document.getElementById('img_num2');
    this.imgNumber3 = document.getElementById('img_num3');

    // this.tmpCnt = 0;
  }

  updateScoreText() {
    this.scoreText.innerHTML = 'Taškai: ';
    this.scoreCount.innerHTML = ('0000' + this.score).slice(-4);
    this.lifeText.innerHTML = '\nGyvybių liko: ';
    this.lifeCount.innerHTML = '<img src=/images/games/pacman/gyvybe.svg height="30px" width="30px">'.repeat(
      Math.max(this.curHealth - 1, 0)
    );
    this.levelText.innerHTML = '\nLygis: ';
    this.levelCount.innerHTML = this.curLevel;
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

  start(doResetPoints = true, doResetLevel = false) {
    if (doResetPoints) this.curHealth = this.maxHealth;

    this.createLevel();

    this.lost = false;
    this.won = false;

    new InputHandler(this.player);

    if (doResetLevel) this.curLevel = 1;

    this.gameObjects = [
      this.level,
      ...this.pickups,
      ...this.ghosts,
      this.player,
    ];

    this.leftTime = this.chaseTime;
    this.ghostMode = GhostMode.SCATTER;

    if (doResetPoints) this.score = 0;
    this.updateScoreText();

    this.player.playLose = false;
    this.player.timeLeftUntilNextDeathSprite = this.player.deathAnimTime;
    this.player.currentDeathSpriteId = 0;

    if (!this.graphGenerated) {
      this.graphGenerated = true;
      this.graph = new Graph(this, this.level);
      //graph.getNextIntersectionInShortestRoute(this.level.posToId(this.ghosts[0].position), this.level.posToId(this.player.position));
    }

    this.timeLeftUntilStart = this.waitTimeAtStart;
  }

  fLost() {
    this.lost = true;
    // this.curLevel = 1;
    //this.start();
  }

  restart() {
    if (this.curHealth == 0) {
      this.fLost();
      return;
    }
    //this.createLevel();

    this.lost = false;
    this.won = false;
    this.playLose = false;
    // this.curLevel = 1;

    this.player = new Player(this);
    let redGhost = new RedGhost(this);
    let pinkGhost = new PinkGhost(this);
    let yellowGhost = new YellowGhost(this);
    let cyanGhost = new CyanGhost(this);

    new InputHandler(this.player);

    this.ghosts = [];
    this.ghosts.push(redGhost);
    this.ghosts.push(pinkGhost);
    this.ghosts.push(yellowGhost);
    this.ghosts.push(cyanGhost);

    this.gameObjects = [
      this.level,
      ...this.pickups,
      ...this.ghosts,
      this.player,
    ];

    this.leftTime = this.chaseTime;
    this.ghostMode = GhostMode.SCATTER;

    this.player.playLose = false;
    this.player.timeLeftUntilNextDeathSprite = this.player.deathAnimTime;
    this.player.currentDeathSpriteId = 0;

    if (!this.graphGenerated) {
      this.graphGenerated = true;
      this.graph = new Graph(this, this.level);
      //graph.getNextIntersectionInShortestRoute(this.level.posToId(this.ghosts[0].position), this.level.posToId(this.player.position));
    }

    this.timeLeftUntilStart = this.waitTimeAtStart;
  }

  fWon() {
    log.levelHistory.push(log.pickupHistory.length);
    this.won = true;
    this.curLevel++;
    this.start(false);
  }

  minusHealth() {
    log.deathHistory.push(log.pickupHistory.length);
    this.player.playLose = true;
    this.curHealth--;
    // if (this.curHealth == 0) {
    // this.fLost();
    // }

    this.updateScoreText();
  }

  ghostsToChase() {
    this.ghostMode = GhostMode.CHASE;
    this.leftTime = this.chaseTime;
    this.ghosts.forEach(ghost => ghost.switchToMode(this.ghostMode));
  }

  ghostsToScatter() {
    this.ghostMode = GhostMode.SCATTER;
    this.leftTime = this.scatterTime;
    this.ghosts.forEach(ghost => ghost.switchToMode(this.ghostMode));
  }

  ghostsToFrightened() {
    this.ghostMode = GhostMode.FRIGHTENED;
    this.leftTime = this.frightenedTime;
    this.ghosts.forEach(ghost => ghost.switchToMode(this.ghostMode));
  }

  update(deltaTime, playing) {
    //console.log(deltaTime);

    if (!playing || this.player.playLose) {
      this.player.updateLoseAnim(deltaTime);
      return;
    }

    if (deltaTime > 0.5) return;

    if (this.timeLeftUntilStart > 0) {
      this.timeLeftUntilStart -= deltaTime;
      return;
    }

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
          console.log('unknown ghost mode');
          break;
      }
    }
  }

  draw(ctx) {
    //ctx.clearRect(0, 0, this.gameWidth, this.gameWidth);
    this.gameObjects.forEach(object => object.draw(ctx));

    //let graph = new Graph (this, this.level, this.redGhost.position, this.player.position);
    //graph.drawGraph(ctx);

    if (
      this.timeLeftUntilStart < this.waitTimeAtStart &&
      this.timeLeftUntilStart > 0
    ) {
      var curImg;
      if (this.timeLeftUntilStart < this.waitTimeAtStart / 3)
        curImg = this.imgNumber1;
      else if (this.timeLeftUntilStart < (2 * this.waitTimeAtStart) / 3)
        curImg = this.imgNumber2;
      else curImg = this.imgNumber3;

      let lenX = this.gameHeight / 3;
      let lenY = this.gameHeight / 3;
      let posX = this.gameWidth / 2 - lenX / 2;
      let posY = this.gameHeight / 2 - lenY / 2;
      ctx.drawImage(curImg, posX, posY, lenX, lenY);
    }
  }

  addScore(scoreToAdd, isPickup) {
    this.score += scoreToAdd;
    //console.log('Score: ' + this.score);

    if (isPickup) {
      this.pickupCount--;

      // this.tmpCnt++;

      if (this.pickupCount == 0) {
        this.score += this.winScore;
        this.fWon();
      }
    }

    this.updateScoreText();
  }

  getPacmanPos() {
    return this.player.position;
  }

  getPacmanTargetPos() {
    let curId = this.level.posToId(this.player.position);
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
        console.log('unknown dir');
        break;
    }

    let targetId = this.level.goUntilWall(curId, di, dj);
    let targetPos = this.level.idToPos(targetId);
    return targetPos;
  }

  getRandomPos() {
    let intersection = this.level.getRandomIntersection();
    return this.level.idToPos(intersection);
  }

  convertGraphIdToPos(idLinear) {
    let idInArray = this.level.idToIndices(idLinear);
    let intersectionPos = this.level.idToPos(idInArray);
    return intersectionPos;
  }

  getNextIntersection(posFrom, posTo) {
    // let graph = new Graph (this, this.level);
    let id = this.graph.getNextIntersectionInShortestRoute(
      this.level.posToId(posFrom),
      this.level.posToId(posTo)
    );
    let intersectionPos = this.level.idToPos(id);

    // console.log("from getnextinter at game.js:");
    // console.log(idLinear);
    // console.log(idInArray);
    // console.log(intersectionPos);

    return intersectionPos;
  }

  goCyanToPacman(position) {
    let pacmanPos = this.getPacmanPos();
    let distX = (position.x - pacmanPos.x) * (position.x - pacmanPos.x);
    let distY = (position.y - pacmanPos.y) * (position.y - pacmanPos.y);
    let dist = distX + distY;
    return dist > 8 * 8 * this.level.cellSizeX * this.level.cellSizeX;
  }
}
