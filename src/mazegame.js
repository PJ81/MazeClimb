

class MazeGame extends State {
	constructor() {
		super();

		this.player = new Player();
		this.lava = new Lava();
		this.buildingBlocks = [
			R.image(Grfx.WALL0),
			R.image(Grfx.BLOCK),
			R.image(Grfx.LADDER)
		];

		this.tops = {t0:0, t1:0};
		this.once = true;
		this.offset = 0;
	}

	start() {
		this.tops = {
			t0: -24,
			t1: -24
		};

		this.once = true;
		this.offset = 0;

		this.lava.reset();
		this.player.reset();

		K.clear();
        K.addKey(37, (ks) => {
            this.player.inputKey(37, ks);
        });
        K.addKey(38, (ks) => {
            this.player.inputKey(38, ks);
        });
		K.addKey(39, (ks) => {
            this.player.inputKey(39, ks);
		});
		
		this.createMaze();
		this.createMaze();
	}

	update(dt) {
		this.player.update(dt);

		if(this.tops.t0 === 304) {
			M.splice(0, 1);
			this.createMaze();
			this.tops.t0 = this.tops.t1;
			this.tops.t1 = this.tops.t0 - Options.IMG_HEIGHT;
			this.player.mazeIndex = 0;
		}

		if(this.player.nextTile) {
			if(this.once && this.tops.t0 === -24) {
				this.tops.t0 -= TILE;
				this.once = false;
			}
			this.tops.t0 += TILE;
			this.lava.y += (TILE >> 1);
			this.tops.t1 = this.tops.t0 - Options.IMG_HEIGHT;
			this.player.nextTile = false;
			this.offset = 0;
		} else {
			this.offset = clamp(120 - this.player.pos.y, 0, 600);
		}

		this.lava.update(dt);
	}

	draw(ctx) {
		ctx.drawImage(M[0].cnv, 0, this.offset + this.tops.t0);
		ctx.drawImage(M[1].cnv, 0, this.tops.t0 - Options.IMG_HEIGHT + this.offset);
		this.player.draw(ctx, this.offset);
		this.lava.draw(ctx, this.offset);

		const m = ~~this.player.meters;

		ctx.fillStyle = "#fff";
        ctx.font = "18px 'Press Start 2P'";
        ctx.fillText(`${m}`, Options.WIDTH >> 1, Options.HEIGHT * .1);

		if(this.lava.y < (this.player.pos.y - (TILE << 1) - (TILE >> 1))) {
			localStorage.setItem('fatfrog_climbM', `${m}`);
			(parseInt(localStorage.getItem('fatfrog_mazeClimb')) || 0) < m && localStorage.setItem('fatfrog_mazeClimb', `${m}`);
			window.dispatchEvent(new CustomEvent("stateChange", {
				detail: {
					state: Options.GAMEOVER
				}
			}));
		}
	}

	index(i, j) {
		if( i < 0 || j < 0 || i >= COLS || j >= ROWS) return null;
		return i + COLS * j;
	}

	getNeighbours(mz, i, j) {
		function addPoint(i, j, r) {
			if(i && j && mz[i].t === WALL && mz[j].t === WALL) {
				r.push({a:i, b:j});
			}
		}

		let r = [];
		addPoint(this.index(i - 1, j), this.index(i - 2, j), r);
		addPoint(this.index(i + 1, j), this.index(i + 2, j), r);
		addPoint(this.index(i, j - 1), this.index(i, j - 2), r);
		addPoint(this.index(i, j + 1), this.index(i, j + 2), r);

		return r;
	}

	createMaze() {
		let mz = [];

		for(let j = 0; j < ROWS; j++) {
			for(let i = 0; i < COLS; i++) {
				mz.push({
					t:WALL,
					c:0,
					z:.5
				});
			}
		}
	
		let stack = [],
			i = ~~(Math.random() * (COLS - 5)),
			j = ~~(Math.random() * (ROWS - 5));
	
		i += !(i & 1);
		j += !(j & 1);
	
		let t, r, g, c;
		while(true) {
			t = this.index(i, j);
			mz[t].t = WAY;
			r = this.getNeighbours(mz, i, j);
	
			if(r.length > 0 ) {
				stack.push(t);
				c = ~~(Math.random() * r.length);
				mz[r[c].a].t = mz[r[c].b].t = WAY;
				g = r[c].b;
				i = g % COLS;
				j = ~~(g / COLS);

			} else {
				if(stack.length < 1) break;
				t = stack.pop();
				i =  t % COLS;
				j = ~~(t / COLS);
			}
		}

		const cl = COLS - 1;
		for(let j = 0; j < ROWS; j++) {
			mz[this.index(0, j)].t = BLOCK;
			mz[this.index(cl, j)].t = BLOCK;
		}

		for(let i = 1; i < cl; i++) {
			for(let j = 2; j < ROWS; j++) {
				const a = mz[this.index(i, j)].t,
					  b = mz[this.index(i, j - 1)].t;
				if(a === WAY && (b === WAY || b === LADDER)) {
					mz[this.index(i, j)].t = LADDER;
				}
			}
		}
		
		mz.splice(0, COLS);
		mz.splice(0, COLS);
		mz.splice(mz.length - COLS, COLS);
		
		const d = document.createElement("canvas");
		d.width = COLS << 3;
		d.height = Options.IMG_HEIGHT;
		const ctx = d.getContext("2d");

		for(let r = 0, l = mz.length, x = 0, y = 0; r < l; r++) {
			const z = mz[r].t;
			z !== WAY && ctx.drawImage(this.buildingBlocks[z], x, y);

			if((x += TILE) >= d.width ) {
				x = 0;
				y += TILE;
			}
		}

		M.push({
			m: mz,
			cnv: d
		});
	}
}