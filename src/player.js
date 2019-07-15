
class Player {
    constructor() {
        this.climbAnim = [
            Grfx.MAN4,
            Grfx.MAN5,
            Grfx.MANL4,
            Grfx.MAN5            
        ];

        this.tile = {x:0, y:0};
        this.pos = {x:0, y:0};
        this.dir = {x:0, y:0};
        this.mazeIndex = 0;
        this.animFrame = 0;
        this.meters = 0;
        this.animFrameTime = .12;
        this.disp = TILE;
        this.key = this.direction = Dir.NONE;
        this.nextTile = this.stop = false;
        this.particles = [];

        this.reset();
    }

    reset() {
        this.tile = {x:9, y:19};
        this.pos = {x:9 << 3, y:19 << 3};
        this.dir = {x:0, y:0};
        this.mazeIndex = 0;
        this.animFrame = 0;
        this.meters = 0;
        this.animFrameTime = .12;
        this.disp = TILE;
        this.key = this.direction = Dir.NONE;
        this.nextTile = this.stop = false;
        this.particles = [];
    }

    inputKey(key, ks) {
        switch(key) {
            case 37: this.key = ks === PRESSED ? Dir.LEFT : Dir.NONE; break;
            case 38: this.key = ks === PRESSED ? Dir.UP : Dir.NONE; break;
            case 39: this.key = ks === PRESSED ? Dir.RIGHT : Dir.NONE; break;
        }
    }

    update(dt) {
        if(this.key === Dir.NONE) {
            this.move(Dir.NONE);
        } else {
            if(this.tile.y < 0) {
                this.mazeIndex = 1;
                this.tile.y = 37;
            }
            let index, cell;
            switch(this.key) {
                case Dir.UP:
                    index = this.tile.x + this.tile.y * COLS;
                    cell = M[this.mazeIndex].m[index];
                    this.move(cell.t === LADDER ? Dir.UP : Dir.NONE);
                break;
                case Dir.LEFT:
                case Dir.RIGHT:
                    index = this.tile.x + (this.key === Dir.RIGHT ? 1 : -1) + this.tile.y * COLS;
                    cell = M[this.mazeIndex].m[index];
                    if(cell.t === WALL && this.disp === TILE) {
                        this.direction = Dir.NONE;
                        this.animFrame = 0;
                        this.move(this.key === Dir.RIGHT ? Dir.DIGR : Dir.DIGL);
                        const d = this.key === Dir.RIGHT ? 1 : -1;
                        this.addParticle(d);
                        if((cell.z -= dt) < 0) {
                            cell.z = .2;
                            if(++cell.c > 7) {
                                M[this.mazeIndex].m[index].t = WAY;
                                this.direction = Dir.NONE;
                                this.move(this.key);
                            }
                            
                            const x = (this.tile.x + d) << 3, y = this.tile.y << 3,
                                  ctx = M[this.mazeIndex].cnv.getContext("2d");
                            ctx.putImageData(R.contexts[cell.c - 1].getImageData(0, 0, TILE, TILE), x, y);
                        }
                    } else {
                        this.move((cell.t === WAY || cell.t === LADDER) ? this.key : Dir.NONE);
                    }
                break;
            }
        }

        if(this.direction !== Dir.NONE) {
            if(this.direction !== Dir.DIGL && this.direction !== Dir.DIGR) {
                let sp = SPEED * dt;
                this.disp -= sp;
                if(this.disp < 0) {
                    sp += this.disp;
                    this.disp = TILE;

                    this.pos.x += this.dir.x * sp;
                    this.pos.y = Math.max(~~this.pos.y, 120);
                    this.nextTile = this.direction === Dir.UP && this.pos.y === 120;

                    this.tile.y += this.dir.y;
                    this.tile.x += this.dir.x;
 
                    if(this.stop) {
                        this.direction = Dir.NONE;
                        this.stop = false;
                        this.animFrame = this.dir.x = this.dir.y = 0;
                    }

                } else {
                    this.pos.x += this.dir.x * sp;
                    this.pos.y += this.dir.y * sp;
                }
                if(this.direction === Dir.UP) {
                    this.meters += sp * .26
                }
            }
            if(0 > (this.animFrameTime -= dt)) {
                this.animFrame = (this.animFrame + 1) % (this.direction === Dir.UP ? 4 : 
                                                        (this.direction === Dir.DIGL || 
                                                         this.direction === Dir.DIGR) ? 2 : 3);
                this.animFrameTime = .12;
            }
        }

        for(let b = this.particles.length - 1; b > -1; b--) {
            const a = this.particles[b];
            if(a.y > Options.HEIGHT) {
                this.particles.splice(b, 1);
            } else {
                a.x += dt * 10 * a.vx;
                a.y += dt * a.vy;
                a.vy += 400 * dt;
            }
        }
    }

    addParticle(d) {
        this.particles.push({
            x: ((this.pos.x + d)) + (d > 0 ? TILE : 0),
            y: this.pos.y - (TILE << 1) - rand(4, 12),
            vx: -d * rand(2, 5),
            vy: -rand(50, 90)
        });
    }

    move(k) {
        switch(k) {
            case Dir.LEFT:
                if(this.direction !== Dir.NONE && this.direction !== Dir.LEFT) return;
                this.dir.x = -1;
                this.dir.y = 0;
                this.direction = Dir.LEFT;
            break;
            case Dir.DIGR:
            case Dir.DIGL:
                if(this.direction === Dir.NONE || this.direction === k){
                    this.dir.x = this.dir.y = 0;
                    this.direction = k;
                }
            break;
            case Dir.UP:
                if(this.direction !== Dir.NONE && this.direction !== Dir.UP) return;
                this.dir.y = -1;
                this.dir.x = 0;
                this.direction = Dir.UP;
            break;
            case Dir.RIGHT:
                if(this.direction !== Dir.NONE && this.direction !== Dir.RIGHT) return;
                this.dir.x = 1;
                this.dir.y = 0;
                this.direction = Dir.RIGHT;
            break;
            default:
                if(this.disp < 8) {
                    this.stop = true;
                } else {
                    this.animFrame = this.dir.x = this.dir.y = 0;
                    this.direction = Dir.NONE;
                }
            break;
        }
    }

    draw(ctx, os) {
        switch(this.direction) {
            case Dir.UP:
                ctx.drawImage(R.image(this.climbAnim[this.animFrame]), this.pos.x, this.pos.y + os - 24);
            break;
            case Dir.DIGR:
                ctx.drawImage(R.image(Grfx.MAN6 + this.animFrame), this.pos.x, this.pos.y + os - 24);
            break;
            case Dir.DIGL:
                ctx.drawImage(R.image(Grfx.MANL6 + this.animFrame), this.pos.x, this.pos.y + os - 24);
            break;
            case Dir.NONE:
                ctx.drawImage(R.image(Grfx.MAN0), this.pos.x, this.pos.y + os - 24);
            break;
            case Dir.LEFT:
                ctx.drawImage(R.image(Grfx.MANL1 + this.animFrame), this.pos.x, this.pos.y + os - 24);
            break;
            case Dir.RIGHT:
                ctx.drawImage(R.image(Grfx.MAN1 + this.animFrame), this.pos.x, this.pos.y + os - 24);
            break;
        }

        for(let b = 0, l = this.particles.length; b < l; b++) {
            const a = this.particles[b];
            ctx.drawImage(R.image(Grfx.PARTICLE), a.x, a.y);
        }
    }
}