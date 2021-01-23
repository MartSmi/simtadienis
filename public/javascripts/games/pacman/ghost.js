class Ghost {
    constructor (game) {
        let smallOfset = 5;
        this.sizeX = game.level.cellSizeX - smallOfset;
        this.sizeY = game.level.cellSizeY - smallOfset;
        this.radius = this.sizeX / 2;

        this.speed = 100;
        this.dir = 0;

        this.position = {
            x: game.gameWidth / 2,
            y: game.gameHeight / 2,
        };

        this.targetPosition = {
            x: game.gameWidth / 2,
            y: game.gameHeight / 2,
        };
        //console.log("target pos: " + this.targetPosition.x + " , " + this.targetPosition.y);

        this.img = document.getElementById('img_ghost');

        this.game = game;
    }

    draw(ctx) {
        let posX = this.position.x - this.sizeX / 2;
        let posY = this.position.y - this.sizeY / 2;
        ctx.drawImage(this.img, posX, posY, this.sizeX, this.sizeY);

        let targetX = this.targetPosition.x - this.sizeX / 2;
        let targetY = this.targetPosition.y - this.sizeY / 2;
        ctx.drawImage(this.img, targetX, targetY, this.sizeX/2, this.sizeY/2);
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
        //let eps = 1e-9;
        //if (Math.abs(this.position.x - this.targetPosition.x) < eps
        //    && Math.abs(this.position.y - this.targetPosition.y) < eps)
        if (this.position.x == this.targetPosition.x && this.position.y == this.targetPosition.y)
            return true;
        else 
            return false;
    }

    getTarget () {
        return this.game.getPacmanPos();
    }

    calculateNewTarget () {
        let newTarget = this.game.getNextIntersection (this.position, this.getTarget());
        this.targetPosition = newTarget;
    }

    update (deltaTime) {
        this.move(deltaTime);

       
        if (this.atPlace()) {
             console.log("at place");
            this.calculateNewTarget ();
            // HERE: update animations/sprite to look to correct direction
        }

        // console.log("ghost pos:")
        // console.log(this.position);
        // console.log(this.targetPosition);

    }
}