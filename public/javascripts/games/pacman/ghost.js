const GhostMode = {
    CHASE: 'chase',
    SCATTER: 'scatter',
    FRIGHTENED: 'frightened'
 };
 Object.freeze(GhostMode);

class Ghost {
    constructor (game) {
        this.mode = GhostMode.CHASE;

        let smallOfset = 5;
        this.sizeX = game.level.cellSizeX - smallOfset;
        this.sizeY = game.level.cellSizeY - smallOfset;
        this.radius = this.sizeX / 2;

        this.chaseSpeed = 75;
        this.scatterSpeed = 70;
        this.frightenedSpeed = 50;
        this.speed = this.chaseSpeed;
        this.dir = 0;

        this.position = {
            x: game.gameWidth / 2 + 100,
            y: game.gameHeight / 2,
        };

        this.targetPosition = this.position;
        this.ultimateTarget = this.position;
        //console.log("target pos: " + this.targetPosition.x + " , " + this.targetPosition.y);

       // this.img = document.getElementById('img_ghost');

        this.game = game;

        this.frightenedImg = document.getElementById('img_frightened_ghost');

        this.updateEveryIntersection = true;
    }

    draw(ctx) {
        let posX = this.position.x - this.sizeX / 2;
        let posY = this.position.y - this.sizeY / 2;
        if (this.mode == GhostMode.FRIGHTENED) {
            ctx.drawImage(this.frightenedImg, posX, posY, this.sizeX, this.sizeY);
        } else {
            ctx.drawImage(this.img, posX, posY, this.sizeX, this.sizeY);
        }
        

        let targetX = this.targetPosition.x - this.sizeX / 2;
        let targetY = this.targetPosition.y - this.sizeY / 2;
        ctx.drawImage(this.img, targetX, targetY, this.sizeX/2, this.sizeY/2);
        let ttargetX = this.ultimateTarget.x - this.sizeX / 2;
        let ttargetY = this.ultimateTarget.y - this.sizeY / 2;
        ctx.drawImage(this.img, ttargetX, ttargetY, this.sizeX/3, this.sizeY/3);
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

    calculateNewTarget () {
        if (this.atUltimate()) {
            switch (this.mode) {
                case GhostMode.CHASE:
                    this.ultimateTarget = this.getTarget();
                    break;
                case GhostMode.SCATTER:
                    this.ultimateTarget = this.game.getRandomPos();
                    break;
                case GhostMode.FRIGHTENED:
                    this.ultimateTarget = this.game.getRandomPos();
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

    /*updateChase (deltaTime) {
        this.move(deltaTime);

        if (this.atPlace()) {
             //console.log("at place");
            this.calculateNewTarget ();
            // HERE: update animations/sprite to look to correct direction
        }
    }

    updateScatter (deltaTime) {
        this.updateChase(deltaTime);
    }

    updateFrightened (deltaTime) {
        this.updateChase(deltaTime);
    }*/

    update (deltaTime) {

        /*switch (this.mode) {
            case GhostMode.CHASE:
                this.updateChase(deltaTime);
                break;
            case GhostMode.SCATTER:
                this.updateScatter(deltaTime);
                break;
            case GhostMode.FRIGHTENED:
                this.updateFrightened (deltaTime);
                break;
            default:
                console.log("unknown ghost mode");
                break;
        }*/

        this.move(deltaTime);

        if (this.atPlace()) {
             //console.log("at place");
            this.calculateNewTarget ();
            // HERE: update animations/sprite to look to correct direction
        }

    }

    switchToMode (newMode) {
        this.mode = newMode;
        this.updateEveryIntersection = false;
        switch (newMode) {
            case GhostMode.CHASE:
                this.updateEveryIntersection = true;
                this.speed = this.chaseSpeed;
                break;
            case GhostMode.SCATTER:
                this.speed = this.scatterSpeed;
                break;
            case GhostMode.FRIGHTENED:
                this.speed = this.frightenedSpeed;
                break;
            default:
                console.log("unknown ghost mode");
                break;
        }
        this.ultimateTarget = this.position;
        this.calculateNewTarget();
    }
}

class RedGhost extends Ghost {
    constructor (game) {
        super(game);
        this.img = document.getElementById('img_red_ghost');

        this.position = {
            x: game.level.cellSizeX,
            y: game.level.cellSizeY,
        };

        this.targetPosition = this.position;
        this.ultimateTarget = this.position;
    }

    getTarget () {
        return this.game.getPacmanPos();
    }
}

class PinkGhost extends Ghost {
    constructor (game) {
        super(game);
        this.img = document.getElementById('img_pink_ghost');
    
        this.position = {
            x: game.gameWidth - 2*game.level.cellSizeX,
            y: game.level.cellSizeY,
        };

        this.targetPosition = this.position;
        this.ultimateTarget = this.position;
    }

    getTarget () {
        return this.game.getPacmanTargetPos();
    }
}

class YellowGhost extends Ghost {
    constructor (game) {
        super(game);
        this.img = document.getElementById('img_yellow_ghost');
        this.updateEveryIntersection = false;

        this.position = {
            x: game.level.cellSizeX,
            y: game.gameHeight - 2*game.level.cellSizeY,
        };

        this.targetPosition = this.position;
        this.ultimateTarget = this.position;
    }

    getTarget () {
        this.updateEveryIntersection = false;
        return this.game.getRandomPos();
    }
}

class CyanGhost extends Ghost {
    constructor (game) {
        super(game);
        this.img = document.getElementById('img_cyan_ghost');

        this.position = {
            x: game.gameWidth - 2*game.level.cellSizeX,
            y: game.gameHeight - 2*game.level.cellSizeY,
        };

        this.targetPosition = this.position;
        this.ultimateTarget = this.position;
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