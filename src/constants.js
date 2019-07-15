

const ROWS = 41, COLS = 19, SPEED = 22, TILE = 8, PRESSED = 1,
      RELEASED = 0, WALL = 0, BLOCK = 1, LADDER = 2, WAY = 3,
      M = [];

const Options = {
    WIDTH: COLS << 3, 
    HEIGHT: ((ROWS - 6) << 3) - 2,
    SCALE: 3,
    TWO_PI: Math.PI * 2,
    IMG_HEIGHT: (ROWS - 3) << 3,

    GAME: 101, 
    MENU: 102,
    GAMEOVER: 103
};

const Dir = {
    NONE: 0,
    RIGHT: 1,
    LEFT: 2,
    UP: 3, 
    DIGR: 4,
    DIGL: 5
}

const Grfx = {
    BLOCK: 0,
    FIRE0: 1,
    FIRE1: 2,
    FIRE2: 3,
    FIREBALL1: 4,
    FIREBALL2: 5,
    LAVA: 6,
    LADDER: 7,
    MAN0: 8,
    MAN1: 9,
    MAN2: 10,
    MAN3: 11,
    MAN4: 12,
    MAN5: 13,
    MAN6: 14,
    MAN7: 15,
    PARTICLE: 16,
    SKULL: 17,
    WALL0: 18,
    WALL1: 19,
    WALL2: 20,
    WALL3: 21,
    WALL4: 22,
    WALL5: 23,
    WALL6: 24,
    WALL7: 25,
    WALL8: 26,

    MANL1: 19,
    MANL2: 20,
    MANL3: 21,
    MANL4: 22,
    MANL6: 23,
    MANL7: 24
};    