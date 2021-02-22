const GhostMode = {
    CHASE: 'chase',
    SCATTER: 'scatter',
    FRIGHTENED: 'frightened',
    EATEN: 'eaten'
 };
 Object.freeze(GhostMode);

class Ghost {
    constructor (game, initPosId) {
        this.savedInitPos = initPosId;
        this.mode = GhostMode.SCATTER;

        this.sizeX = 3 * game.level.cellSizeX / 2;
        this.sizeY = 3 * game.level.cellSizeY / 2;
        this.radius = this.sizeX / 2;

        this.chaseSpeed = 75;
        this.scatterSpeed = 70;
        this.frightenedSpeed = 50;
        this.eatenSpeed = 150;
        this.speed = this.chaseSpeed;
        this.dir = 0;

        this.position = game.level.idToPos (initPosId);

        this.targetPosition = this.position;
        this.ultimateTarget = this.position;
        //console.log("target pos: " + this.targetPosition.x + " , " + this.targetPosition.y);

       // this.img = document.getElementById('img_ghost');

        this.game = game;

        this.frightenedImg = document.getElementById('img_frightened_ghost');
        this.frightenedBlinkImg = document.getElementById('img_frightened_blink_ghost');
        this.eatenImg = document.getElementById('img_eaten_ghost');

        this.updateEveryIntersection = true;

        this.currentImage = this.frightenedImg;

        this.frightenedBlinkingInterval = 0.75;
        this.frightenedUntilBlinking = 6;
        
        this.timeForNextFrame = 0.0;
        this.curFrameId = 0;

        this.eatenTime = 10;
        this.leftBeingEaten = 10;

        this.ghostEatingScore = 50;

        this.currentMoveBodySpriteId = 0;
        this.moveBodyAnimTime = 0.3;
        this.timeLeftUntilNextMoveBodySprite = this.moveBodyAnimTime;

        this.eyesSpriteList = [document.getElementById('img_ghost_eyes0'),
                               document.getElementById('img_ghost_eyes1'),
                               document.getElementById('img_ghost_eyes2'),
                               document.getElementById('img_ghost_eyes3')];
        this.eyesSpriteDelta = {
            x: 3 * this.sizeX / 8,
            y: this.sizeY / 3
        };
        this.eyesSize = {
            x: this.sizeX / 4,
            y: this.sizeY / 4
        };

        this.moveDir = 0;

        this.curStartPosCnt = 0;
    }

    updateFrame (deltaTime) {
        if (this.mode == GhostMode.FRIGHTENED) {
            //this.currentImage = this.frightenedImg;

            this.timeForNextFrame -= deltaTime;
            if (this.timeForNextFrame <= 0) {
                this.timeForNextFrame = this.frightenedBlinkingInterval;
                
                this.curFrameId++;
                this.curFrameId %= 2;
            }
            if (this.curFrameId == 0)
                this.currentImage = this.frightenedImg;
            else
                this.currentImage = this.frightenedBlinkImg;

        } else if (this.mode == GhostMode.EATEN) {
            this.currentImage = this.eyesSpriteList[this.dir];
        } else {
            // this.currentImage = this.img;
            this.timeLeftUntilNextMoveBodySprite -= deltaTime;
            if (this.timeLeftUntilNextMoveBodySprite <= 0) {
                this.timeLeftUntilNextMoveBodySprite = this.moveBodyAnimTime;
                this.currentMoveBodySpriteId++;
                this.currentMoveBodySpriteId %= this.bodyAnimList.length;
            }
            this.currentImage = this.bodyAnimList[this.currentMoveBodySpriteId];
        }
    }

    draw(ctx) {
        if (this.game.lost && this.game.player.currentDeathSpriteId >= this.game.player.deathAnimList.length-1) return;
        // console.log("drawing");
        let posX = this.position.x - this.sizeX / 2;
        let posY = this.position.y - this.sizeY / 2;

        ctx.drawImage(this.currentImage, posX, posY, this.sizeX, this.sizeY);
        
        if (this.mode == GhostMode.CHASE || this.mode == GhostMode.SCATTER) {
            // drawing eyes also
            let eyesPosX = posX + this.eyesSpriteDelta.x;
            let eyesPosY = posY + this.eyesSpriteDelta.y;
            ctx.drawImage(this.eyesSpriteList[this.dir], posX, posY, this.sizeX, this.sizeY);
        }

        // let targetX = this.targetPosition.x - this.sizeX / 2;
        // let targetY = this.targetPosition.y - this.sizeY / 2;
        // ctx.drawImage(this.currentImage, targetX, targetY, this.sizeX/2, this.sizeY/2);
        // let ttargetX = this.ultimateTarget.x - this.sizeX / 2;
        // let ttargetY = this.ultimateTarget.y - this.sizeY / 2;
        // ctx.drawImage(this.currentImage, ttargetX, ttargetY, this.sizeX/3, this.sizeY/3);
    }

    move (deltaTime) {
        let distX = Math.abs(this.position.x - this.targetPosition.x);
        let distY = Math.abs(this.position.y - this.targetPosition.y);
        let deltaMove = this.speed * deltaTime;

        var newPosition = {
            x: this.position.x,
            y: this.position.y,
        };

        
        if (this.position.x < this.targetPosition.x)
            newPosition.x = Math.min(this.position.x + deltaMove, this.targetPosition.x);
        else 
            newPosition.x = Math.max(this.position.x - deltaMove, this.targetPosition.x);

        if (this.position.y < this.targetPosition.y)
            newPosition.y = Math.min(this.position.y + deltaMove, this.targetPosition.y);
        else 
            newPosition.y = Math.max(this.position.y - deltaMove, this.targetPosition.y);
        
        this.position = newPosition;
    }

    atPlace () {
        let eps = 1e-9;
        if (Math.abs(this.position.x - this.targetPosition.x) < eps
           && Math.abs(this.position.y - this.targetPosition.y) < eps)
       // if (this.position.x == this.targetPosition.x && this.position.y == this.targetPosition.y)
            return true;
        else 
            return false;
    }

    atUltimate () {
        let eps = 1e-9;
        if (Math.abs(this.position.x - this.ultimateTarget.x) < eps
           && Math.abs(this.position.y - this.ultimateTarget.y) < eps)
        //if (this.position.x == this.ultimateTarget.x && this.position.y == this.ultimateTarget.y)
            return true;
        else 
            return false;
    }

    getTarget () {
        return this.game.getPacmanPos();
    }

    getEatenTarget () {
        //this.updateEveryIntersection = true;
        var pos = this.game.getRandomPos();
        while (!this.game.goCyanToPacman(pos)) {
            pos = this.game.getRandomPos();
        }
        return pos;
    }

    calculateNewTarget () {
        if (this.curStartPosCnt < this.startMovementIds.length) {
            let newPosId = this.startMovementIds[this.curStartPosCnt];
            this.targetPosition = this.game.level.idToPos(newPosId);
            this.curStartPosCnt++;
            return;
        }

        if (this.atUltimate()) {
            switch (this.mode) {
                case GhostMode.CHASE:
                    this.ultimateTarget = this.getTarget();
                    break;
                case GhostMode.SCATTER:
                    this.ultimateTarget = this.game.getRandomPos();
                    break;
                case GhostMode.FRIGHTENED:
                    this.ultimateTarget = this.getEatenTarget();
                    break;
                case GhostMode.EATEN:
                    this.ultimateTarget = this.game.level.idToPos (this.savedInitPos);
                    break;
                default:
                    console.log("unknown ghost mode");
                    break;
            }
            
        }
        let newTarget = this.game.getNextIntersection (this.position, this.ultimateTarget);
        this.targetPosition = newTarget;
       // console.log("update : " + this.updateEveryIntersection);
        if (this.updateEveryIntersection)
            this.ultimateTarget = newTarget;
    }
      

    switchToMode (newMode) {
        if (this.mode == GhostMode.EATEN) {
           // this.modeAfterEaten = newMode;
            return;
        }
        this.curFrameId = 0;
        this.mode = newMode;
        this.updateEveryIntersection = false;
        switch (newMode) {
            case GhostMode.CHASE:
                this.updateEveryIntersection = true;
                this.speed = this.chaseSpeed;
                break;
            case GhostMode.SCATTER:
                this.updateEveryIntersection = false;
                this.speed = this.scatterSpeed;
                break;
            case GhostMode.FRIGHTENED:
                this.speed = this.frightenedSpeed;
                this.timeForNextFrame = this.frightenedUntilBlinking;
                break;
            case GhostMode.EATEN:
                this.speed = this.eatenSpeed;
                this.leftBeingEaten = this.eatenTime;
                break;
            default:
                console.log("unknown ghost mode");
                break;
        }
        this.ultimateTarget = this.position;
        this.calculateNewTarget();
    }


    collisionWithPacman () {
        if (this.mode == GhostMode.FRIGHTENED) {
            //this.modeAfterEaten = GhostMode.SCATTER;
            this.switchToMode(GhostMode.EATEN);
            this.game.addScore(this.ghostEatingScore, false);
        } else {
            this.game.minusHealth();
            //console.log("the pacman was eaten tiu tiu tiu");
        }
    }

    checkForCollision () {
        let pacmanPos = this.game.getPacmanPos();
        let dx = this.position.x - pacmanPos.x;
        let dy = this.position.y - pacmanPos.y;

        let eps = 1e-9;
        if (Math.abs(dx) > eps && Math.abs(dy) > eps)
            return false;

        let sqDist = dx * dx + dy * dy;
        let sumRadius = this.radius + this.game.player.radius;
        let doCollide = sqDist <= (sumRadius * sumRadius);

        if (doCollide) 
            this.collisionWithPacman();
    }

    updateDir () {
        if (this.targetPosition.y < this.position.y) this.dir = 0;
        else if (this.targetPosition.x < this.position.x) this.dir = 1;
        else if (this.targetPosition.y > this.position.y) this.dir = 2;
        else if (this.targetPosition.x > this.position.x) this.dir = 3;
    }

    update (deltaTime) {
        if (this.mode == GhostMode.EATEN) {
            this.leftBeingEaten -= deltaTime;
            if (this.leftBeingEaten <= 0) {
                this.mode = GhostMode.SCATTER;
                this.switchToMode(GhostMode.SCATTER);
            }
        } 


        this.updateFrame (deltaTime);

        this.move(deltaTime);

        if (this.atPlace()) {
             //console.log("at place");
            this.calculateNewTarget ();
            this.updateDir();
            // HERE: update animations/sprite to look to correct direction
        }

        if (this.mode != GhostMode.EATEN)
            this.checkForCollision();

    }


}

class RedGhost extends Ghost {
    constructor (game) {
        let initPosId = {
            i: 12,
            j: 11
        };

        super(game, initPosId);

        this.bodyAnimList = [document.getElementById('img_red_ghost_body1'),
                             document.getElementById('img_red_ghost_body2')];
                             
        this.startMovementIds = [{i: 9, j: 11},
                                 {i: 9, j: 8}];
    }

    getTarget () {
        return this.game.getPacmanPos();
    }
}

class PinkGhost extends Ghost {
    constructor (game) {
        let initPosId = {
            i: 13,
            j: 13
        };

        super(game, initPosId);
        this.bodyAnimList = [document.getElementById('img_pink_ghost_body1'),
                             document.getElementById('img_pink_ghost_body2')];
        
        this.startMovementIds = [{i: 13, j: 10},
                                 {i: 13, j: 13},
                                 {i: 13, j: 10},
                                 {i: 13, j: 13},
                                 {i: 13, j: 12},
                                 {i: 9, j: 12},
                                 {i: 9, j: 15}];
    }

    getTarget () {
        return this.game.getPacmanTargetPos();
    }
}

class YellowGhost extends Ghost {
    constructor (game) {
        let initPosId = {
            i: 15,
            j: 10
        };

        super(game, initPosId);
        this.bodyAnimList = [document.getElementById('img_orange_ghost_body1'),
                             document.getElementById('img_orange_ghost_body2')];
        this.updateEveryIntersection = false;

        this.startMovementIds = [{i: 15, j: 13},
                                 {i: 15, j: 10},
                                 {i: 15, j: 13},
                                 {i: 15, j: 10},
                                 {i: 15, j: 13},
                                 {i: 15, j: 10},
                                 {i: 15, j: 13},
                                 {i: 15, j: 10},  
                                 {i: 15, j: 11},    
                                 {i: 9, j: 11},
                                 {i: 9, j: 8}];
    }

    getTarget () {
        this.updateEveryIntersection = false;
        return this.game.getRandomPos();
    }
}

class CyanGhost extends Ghost {
    constructor (game) {
        let initPosId = {
            i: 17,
            j: 11
        };

        super(game, initPosId);
        this.bodyAnimList = [document.getElementById('img_cyan_ghost_body1'),
                             document.getElementById('img_cyan_ghost_body2')];

        this.startMovementIds = [{i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 11},
                                 {i: 17, j: 12},
                                 {i: 17, j: 12},
                                 {i: 9, j: 12},
                                 {i: 9, j: 15}];
    }

    getTarget () {
        if (this.game.goCyanToPacman(this.position)) {
            //console.log("goes to pacman");
            this.updateEveryIntersection = true;
            return this.game.getPacmanPos();
        } else {
            this.updateEveryIntersection = false;
            var pos = this.game.getRandomPos();
            //console.log("gocyan to pac");
           // console.log(this.game.goCyanToPacman(pos));
            while (!this.game.goCyanToPacman(pos)) {
                //console.log(this.game.goCyanToPacman(pos));
                pos = this.game.getRandomPos();
            }
            //console.log(this.game.goCyanToPacman(pos));
            return pos;
        }
    }
}