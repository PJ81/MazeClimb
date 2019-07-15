
class Lava {
    constructor() {
        this.img = document.createElement("canvas");
        this.img.width = COLS << 3;
        this.img.height = Options.IMG_HEIGHT;
        
        const ctx = this.img.getContext("2d");
        ctx.fillStyle = "red";
        ctx.fillRect(0, TILE, this.img.width, this.img.height);

        for(let x = 0; x < this.img.width; x += TILE) {
            ctx.drawImage(R.image(rand(0, 3) + Grfx.FIRE0), x, 0);
        }

        this.y = 300;
        this.ang = 0;
        this.animTime = .5;
        this.newY = 0;
        this.upSpeed = 2;
        this.balls = [];
    }

    reset() {
        this.y = 300;
        this.upSpeed = 2;
        this.balls = [];
    }
    
    draw(ctx, os) {
        for(let b = 0, l = this.balls.length; b < l; b++) {
            const a = this.balls[b];
            ctx.drawImage(a.s === 1 ? R.image(Grfx.FIREBALL1) : R.image(Grfx.FIREBALL2), a.x, a.y);
        }
        ctx.drawImage(this.img, 0, this.y + os / 2 + 5 * Math.cos(this.ang));
    }

    update(dt) {
        if((this.animTime -= dt) < 0) {
            this.animTime = .1;
            const r = this.img.getContext("2d");
            r.clearRect(0, 0, this.img.width, TILE);
            for(let x = 0; x < this.img.width; x += TILE) {
                r.drawImage(R.image(rand(0, 3) + Grfx.FIRE0), x, 0);
            }
        }

        this.ang = (this.ang += 2 * dt) > Options.TWO_PI ? 0 : this.ang;
        this.y -= this.upSpeed * dt;
        if(this.y < TILE + TILE) this.y = TILE + TILE;

        this.upSpeed += (dt *.035);

        if(Math.random() < .025) {
            this.balls.push({
                    x: rand(10, Options.WIDTH - 10),
                    y: this.y,
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
}