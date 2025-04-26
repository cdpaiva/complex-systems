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
let grid = null;
let ruleset = [0, 1, 0, 0, 1, 1, 1, 1];
let gen = 0;
const cell_w = 5;
let num_cols, num_rows;

function setup() {
    createCanvas(480, 480);
    background(255);
    stroke(0);

    num_cols = floor(width / cell_w);
    num_rows = floor(height / cell_w);

    grid = new Array(num_rows).fill(null).map(() => new Array(num_cols).fill(0));

    cells = new Array(floor(height / cell_w));
    for (let i = 0; i < cells.length; i++) {
        cells[i] = [0, 0];
    }

    frameRate(20);
}

function updateGrid(cells, grid) {
    for (let i = 0; i < cells.length; i++) {
        const [alive, color_idx] = cells[i];
        const factor = alive ? 1 : -1;
        const next_value = factor * color_idx + grid[gen][i];
        grid[gen][i] = constrain(next_value, -7, 7);
    }
}

function getNewCells(cells, ruleset) {
    const nextGen = cells.slice();
    for (let i = 1; i < cells.length - 1; i++) {
        const left = cells[i - 1][0];
        const mid = cells[i][0];
        const right = cells[i + 1][0];

        const newState = rules(left, mid, right, ruleset);
        nextGen[i] = newState;
    }
    return nextGen;
}

function draw() {
    updateGrid(cells, grid);

    for (let c = 0; c < num_cols; c++) {
        const color_index = grid[gen][c];
        if (color_index > 0) {
            fill(ON_COLORS[color_index]);
        } else {
            fill(OFF_COLORS[-color_index]);
        }
        square(gen * cell_w, c * cell_w, cell_w);
    }

    cells = getNewCells(cells, ruleset);

    gen++;

    if (gen == floor(height / cell_w)) {
        gen = 0;
        ruleset = shuffle(ruleset);
    }
}
