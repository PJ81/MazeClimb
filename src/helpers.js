
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = url;
    });
}

function getData(file, callback) {
    loadFile(file).then(data => callback(data));
}

async function loadFile(file) {
    const r = await fetch(file);
    const data = await r.arrayBuffer();
    return new Uint8Array(data);
}

function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}

function rand(mn, mx) {
    const r = mx - mn;
    return Math.floor(Math.random() * r + mn);
}


function mirror(img, hr = true) {
    const s = document.createElement("canvas");
    s.width = img.width;
    s.height = img.height;
    const c = s.getContext("2d");
    if(hr) {
        c.translate(s.width, 0);
        c.scale(-1, 1);
    } else {
        c.translate(0, s.height);
        c.scale(1, -1);
    }
    c.drawImage(img, 0, 0);
    const i = new Image();
    i.src = s.toDataURL();
    return i;
}

class State {
    constructor() {}
    update(dt) {}
    draw(ctx) {}
    input(i) {}
    start() {}
    stats(ctx) {}
}