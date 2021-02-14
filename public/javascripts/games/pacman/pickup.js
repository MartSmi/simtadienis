class Pickup {
  constructor(game, position) {
    this.game = game;
    this.position = position;
    this.radius = game.level.cellSizeX / 4;
    this.position = position;
    this.picked = false;
    this.points = 10;
    // console.log(" got pos: " + position);

    this.img = document.getElementById('img_dot');
  }

  draw(ctx) {
    if (this.picked) return;
    let posX = this.position.x - this.radius / 2;
    let posY = this.position.y - this.radius / 2;
    ctx.drawImage(this.img, posX, posY, this.radius, this.radius);
    // console.log("pickup: posx: " + posX + " posy: " + posY + " radius: " + this.radius);
  }

  pick() {
    this.picked = true;
    this.game.addScore(this.points, true);
  }

  checkForCollision () {
    let pacmanPos = this.game.getPacmanPos();
    let dx = this.position.x - pacmanPos.x;
    let dy = this.position.y - pacmanPos.y;
    let sqDist = dx * dx + dy * dy;
    let sumRadius = this.radius + this.game.player.radius;
    let doPick = sqDist <= (sumRadius * sumRadius);

    if (doPick) this.pick();
  }

  update(deltaTime) {
    if (this.picked) return;
    this.checkForCollision();
  }
}

class PowerPickup extends Pickup {
  constructor (game, position) {
    super (game, position);
    this.radius = this.radius * 3 / 2;
  }

  pick () {
    super.pick();
    //console.log("supered");
    this.game.ghostsToFrightened();
  }
}

class FruitPickup extends Pickup {
  constructor (game, position) {
    super (game, position);
    this.points = 100;
    this.img = document.getElementById('img_fruit');
    this.radius = this.radius * 2;
  }
}