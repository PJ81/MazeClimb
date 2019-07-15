

class Resources {
    constructor(cb) {
        this.images = new Array(26);
        this.contexts = new Array(8);
        
        Promise.all([
            (loadImage("./img/block.png")).then((i) => {this.images[Grfx.BLOCK] = i;}),

            (loadImage("./img/fire0.png")).then((i) => {this.images[Grfx.FIRE0] = i;}),
            (loadImage("./img/fire1.png")).then((i) => {this.images[Grfx.FIRE1] = i;}),
            (loadImage("./img/fire2.png")).then((i) => {this.images[Grfx.FIRE2] = i;}),

            (loadImage("./img/fireball1.png")).then((i) => {this.images[Grfx.FIREBALL1]= i;}),
            (loadImage("./img/fireball2.png")).then((i) => {this.images[Grfx.FIREBALL2] = i;}),
            (loadImage("./img/lava.png")).then((i) => {this.images[Grfx.LAVA] = i;}),

            (loadImage("./img/ladder.png")).then((i) => {this.images[Grfx.LADDER] = i;}),

            (loadImage("./img/man0.png")).then((i) => {this.images[Grfx.MAN0] = i;}),

            (loadImage("./img/man1.png")).then((i) => {this.images[Grfx.MAN1] = i;}),
            (loadImage("./img/man2.png")).then((i) => {this.images[Grfx.MAN2] = i;}),
            (loadImage("./img/man3.png")).then((i) => {this.images[Grfx.MAN3] = i;}),

            (loadImage("./img/man4.png")).then((i) => {this.images[Grfx.MAN4] = i;}),
            (loadImage("./img/man5.png")).then((i) => {this.images[Grfx.MAN5] = i;}),
            (loadImage("./img/man6.png")).then((i) => {this.images[Grfx.MAN6] = i;}),
            (loadImage("./img/man7.png")).then((i) => {this.images[Grfx.MAN7] = i;}),

            (loadImage("./img/particle.png")).then((i) => {this.images[Grfx.PARTICLE] = i;}),
            (loadImage("./img/skull.png")).then((i) => {this.images[Grfx.SKULL] = i;}),

            (loadImage("./img/wall0.png")).then((i) => {this.images[Grfx.WALL0] = i;}),
            (loadImage("./img/wall1.png")).then((i) => {this.images[Grfx.WALL1] = i;}),
            (loadImage("./img/wall2.png")).then((i) => {this.images[Grfx.WALL2] = i;}),
            (loadImage("./img/wall3.png")).then((i) => {this.images[Grfx.WALL3] = i;}),
            (loadImage("./img/wall4.png")).then((i) => {this.images[Grfx.WALL4] = i;}),
            (loadImage("./img/wall5.png")).then((i) => {this.images[Grfx.WALL5] = i;}),
            (loadImage("./img/wall6.png")).then((i) => {this.images[Grfx.WALL6] = i;}),
            (loadImage("./img/wall7.png")).then((i) => {this.images[Grfx.WALL7] = i;}),
            (loadImage("./img/wall8.png")).then((i) => {this.images[Grfx.WALL8] = i;})

        ]).then(() => {
            this.build();
            cb();
        });
    }

    build() {
        for(let z = 0; z < 8; z++) {
            const cc = document.createElement("canvas");
            const r = Grfx.WALL1 + z;
            cc.width = this.images[r].width;
            cc.height = this.images[r].height;
            const cx = cc.getContext("2d");
            cx.drawImage(this.images[r], 0, 0);
            this.contexts[z] = cx;
        }

        this.images[Grfx.MANL1] = mirror(this.images[Grfx.MAN1]);
        this.images[Grfx.MANL2] = mirror(this.images[Grfx.MAN2]);
        this.images[Grfx.MANL3] = mirror(this.images[Grfx.MAN3]);

        this.images[Grfx.MANL4] = mirror(this.images[Grfx.MAN4]);

        this.images[Grfx.MANL6] = mirror(this.images[Grfx.MAN6]);
        this.images[Grfx.MANL7] = mirror(this.images[Grfx.MAN7]);
    }

    image(index) {
        if(index < this.images.length) {
            return this.images[index];
        }
        return null;
    }
}