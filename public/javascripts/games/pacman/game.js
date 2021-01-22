class Game {
  constructor(gameWidth, gameHeight) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.score = 0;
  }

  createLevel() {
    this.level = new Level(this);
    this.player = new Player(this);
    this.ghost = new Ghost(this);
    this.dots = [];

    let dotPositions = this.level.getDotPositions();
    // console.log("dotPositions: " + dotPositions);
    for (var pos of dotPositions) {
      // console.log("in dot: " + pos.x + "  " + pos.y);
      this.dots.push(new Pickup(this, pos));
    }
  }

  start() {
    this.createLevel();

    new InputHandler(this.player);

    this.gameObjects = [this.level, ...this.dots, this.ghost, this.player];
  }

  update(deltaTime) {
    this.gameObjects.forEach(object => object.update(deltaTime));
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.gameWidth, this.gameWidth);
    this.gameObjects.forEach(object => object.draw(ctx));
  }

  addScore(scoreToAdd) {
    this.score += scoreToAdd;
    console.log('Score: ' + this.score);
  }

  getPacmanPos () {
    return this.player.position;
  }

  getNextIntersection (posFrom, posTo) {
    let graph = this.level.constructGraph (posFrom, posTo);
  }
}
