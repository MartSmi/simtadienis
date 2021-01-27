class Pickup {
  constructor(game, position) {
    this.game = game;
    this.position = position;
    this.radius = game.level.cellSizeX / 3;
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
    this.game.addScore(this.points);
  }

  update(deltaTime) {
    if (this.picked) return;
    let dx = this.position.x - this.game.player.position.x;
    let dy = this.position.y - this.game.player.position.y;
    let sqDist = dx * dx + dy * dy;
    let sumRadius = this.radius + this.game.player.radius;
    let doPick = sqDist <= sumRadius * sumRadius;

    if (doPick) this.pick();
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