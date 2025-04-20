function rules(a, b, c) {
    const s = "" + a + b + c;
    let i = parseInt(s, 2);
    return ruleset[7 - i];
}

let cells = null;
let ruleset = [0, 1, 0, 1, 1, 0, 1, 0];
let gen = 0;
let w = 10;

function setup() {
    createCanvas(640, 480);
    background(255);
    cells = new Array(floor(width / w));

    for (let i = 0; i < cells.length; i++) {
        cells[i] = 0;
    }

    cells[floor(cells.length / 2)] = 1;

    frameRate(10);
}

function draw() {
    for (let i = 0; i < cells.length; i++) {
        if (!cells[i]) {
            fill(255);
        } else {
            fill(0);
        }
        stroke(0);
        square(i * w, gen * w, w);
    }

    const newCells = cells.slice();
    for (let i = 1; i < cells.length - 1; i++) {
        const left = cells[i - 1];
        const mid = cells[i];
        const right = cells[i + 1];

        const newState = rules(left, mid, right);
        newCells[i] = newState;
    }

    cells = newCells;
    gen++;

    if (gen == floor(height / w)) {
        gen = 0;
        ruleset = shuffle(ruleset);
    }

}
