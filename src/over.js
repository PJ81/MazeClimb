

class GameOver extends State {
    constructor() {
        super();
        this.img = document.createElement("canvas");
        this.img.width = COLS << 3;
        this.img.height = TILE * 10;

        this.meters = 0;
        this.hi = 0;
        this.timer = 30;
        this.animTime = .5;
        this.ang = 0;
        this.balls = [];
        
        const ctx = this.img.getContext("2d");
        ctx.fillStyle = "red";
        ctx.fillRect(0, TILE, this.img.width, this.img.height);

        for(let x = 0; x < this.img.width; x += TILE) {
            ctx.drawImage(R.image(rand(0, 3) + Grfx.FIRE0), x, 0);
        }
    }

    start() {
        K.clear();
        K.addKey(32, this.backToMenu);
        this.balls = [];
        this.timer = 30;
        this.animTime = .5;

        this.hi = localStorage.getItem('fatfrog_mazeClimb') || 0;
        this.hi = ~~this.hi;

        this.meters = localStorage.getItem('fatfrog_climbM') || 0;
        this.meters = ~~this.meters;
        
    }

    update(dt) {
        this.ang = (this.ang += 2 * dt) > Options.TWO_PI ? 0 : this.ang;

        if((this.animTime -= dt) < 0) {
            this.animTime = .1;
            const r = this.img.getContext("2d");
            r.clearRect(0, 0, this.img.width, TILE);
            for(let x = 0; x < this.img.width; x += TILE) {
                r.drawImage(R.image(rand(0, 3) + Grfx.FIRE0), x, 0);
            }
        }
        
        this.timer -= dt;
        if(this.timer < 0) this.input(0);

        if(Math.random() < .025) {
            this.balls.push({
                    x: rand(10, Options.WIDTH - 10),
                    y: 220,
                    vx: rand(-1.5, 1.5),
                    vy: -rand(90, 110),
                    s: rand(0, 2)
                }
            );
        }

        for(let b = this.balls.length - 1; b > -1; b--) {
            const a = this.balls[b];
            if(a.y > Options.HEIGHT) {
                this.balls.splice(b, 1);
            } else {
                a.x += dt * 30 * a.vx;
                a.y += dt * a.vy;
                a.vy += 200 * dt;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = "#eee";
        ctx.font = "18px 'Press Start 2P'";
        ctx.fillText("GAME", Options.WIDTH >> 1, Options.HEIGHT * .26);
        ctx.fillText("OVER", Options.WIDTH >> 1, Options.HEIGHT * .59);

        ctx.drawImage(R.image(Grfx.SKULL), 43, 78);

        for(let b = 0, l = this.balls.length; b < l; b++) {
            const a = this.balls[b];
            ctx.drawImage(a.s === 1 ? R.image(Grfx.FIREBALL1) : R.image(Grfx.FIREBALL2), a.x, a.y);
        }


        ctx.font = "8px 'Press Start 2P'";
        ctx.fillText(`HISCORE: ${this.hi}`, Options.WIDTH >> 1, Options.HEIGHT * .74);
        ctx.fillText(`SCORE: ${this.meters}`, Options.WIDTH >> 1, Options.HEIGHT * .785);

        ctx.drawImage(this.img, 0, 220 + 5 * Math.cos(this.ang));
    }

    backToMenu() {
        window.dispatchEvent(new CustomEvent("stateChange", {
            detail: {
                state: Options.MENU
            }
        }));
    }
}