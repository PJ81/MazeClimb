

class Menu extends State {
    constructor() {
        super();
        this.x = TILE;
        this.animFrame = 0;
        this.animFrameTime = .12;
        this.dir = 1;
        this.meters = 0;
    }

    start() {
        K.clear();
        K.addKey(13, this.startGame);
        this.meters = localStorage.getItem('fatfrog_mazeClimb') || 0;
        this.meters = ~~this.meters;
    }

    draw(ctx) {
        ctx.fillStyle = "#ddd";
		ctx.textAlign = "center";
		ctx.font = "10px 'Press Start 2P'"; 
		ctx.fillText("PRESS RETURN", Options.WIDTH >> 1, Options.HEIGHT * .26);
        ctx.fillText("TO PLAY", Options.WIDTH >> 1, Options.HEIGHT * .32);
		ctx.font = "8px 'Press Start 2P'"; 
        ctx.fillText("HISCORE: " + this.meters, Options.WIDTH >> 1, Options.HEIGHT * .1);

        for(let a = 0; a < Options.WIDTH; a += TILE) {
            for(let b = 171; b < Options.HEIGHT; b += TILE) {
                ctx.drawImage(R.image(Grfx.WALL0), a, b);
            }
        }

        ctx.drawImage(this.dir > 0 ? R.image(Grfx.MAN1 + this.animFrame):
                                     R.image(Grfx.MANL1 + this.animFrame), this.x, 163);
    }

    update(dt) {
        if(0 > (this.animFrameTime -= dt)) {
            this.animFrame = (this.animFrame + 1) % 3;
            this.animFrameTime = .12;
        }
        let sp = SPEED * dt;
        this.x += this.dir * sp;

        if(this.x < 0) {
            this.x = 0;
            this.dir = 1;
        } else if(this.x > Options.WIDTH - TILE) {
            this.x = Options.WIDTH - TILE;
            this.dir = -1;
        }
    }

    startGame() {
        window.dispatchEvent(new CustomEvent("stateChange", {
            detail: {
                state: Options.GAME
            }
        }));
    }
}