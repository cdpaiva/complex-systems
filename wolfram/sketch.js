function rules(a, b, c, ruleset) {
    const s = "" + a + b + c;
    let i = 7 - parseInt(s, 2);
    if (i > 7 || i < 0) {
        throw RangeError(`Value ${i} is out of valid range (0-7).`)
    }
    return [ruleset[i], i];
}

const ON_COLORS = ["#abcd5e", "#29ac9f", "#b3dce0", "#62b6de", "#2b67af", "#f589a3", "#ef562f", "#f9d531"];
const OFF_COLORS = ["#090c08", "#111312", "#19191c", "#212026", "#28262f", "#302d39", "#383343", "#474056"];

let cells = null;
let ruleset = [0, 1, 0, 1, 1, 0, 1, 1];
let gen = 0;
const cell_w = 5;

function setup() {
    createCanvas(640, 480);
    background(255);
    cells = new Array(floor(height / cell_w));

    for (let i = 0; i < cells.length; i++) {
        cells[i] = [0, 0];
    }

    frameRate(20);
}

function draw() {
    for (let i = 0; i < cells.length; i++) {
        const [alive, color_idx] = cells[i];
        if (alive) {
            fill(ON_COLORS[color_idx]);
        } else {
            fill(OFF_COLORS[color_idx]);
        }
        stroke(0);
        square(i * cell_w, gen * cell_w, cell_w);
    }

    const nextGen = cells.slice();
    for (let i = 1; i < cells.length - 1; i++) {
        const left = cells[i - 1][0];
        const mid = cells[i][0];
        const right = cells[i + 1][0];

        const newState = rules(left, mid, right, ruleset);
        nextGen[i] = newState;
    }

    cells = nextGen;
    gen++;

    if (gen == floor(height / cell_w)) {
        gen = 0;
        ruleset = shuffle(ruleset);
    }
}
