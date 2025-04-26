function rules(a, b, c, ruleset) {
    const s = "" + a + b + c;
    let i = 7 - parseInt(s, 2);
    if (i > 7 || i < 0) {
        throw RangeError(`Value ${i} is out of valid range (0-7).`)
    }
    return [ruleset[i], i];
}

function updateGrid(cells, grid) {
    for (let i = 0; i < cells.length; i++) {
        const [alive, color_idx] = cells[i];
        const factor = alive ? 1 : -1;
        const next_value = factor * color_idx + grid[gen][i];
        grid[gen][i] = constrain(next_value, -7, 7);
    }
}

function updateCells(cells, ruleset) {
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

function renderGrid() {
    for (let c = 0; c < num_cols; c++) {
        const color_left = grid[gen][c];
        if (color_left > 0) {
            fill(ON_COLORS[color_left]);
        } else {
            fill(OFF_COLORS[-color_left]);
        }
        square(gen * cell_w, c * cell_w, cell_w);
        const color_right = grid[num_rows - gen - 1][c];
        if (color_right > 0) {
            fill(ON_COLORS[color_right]);
        } else {
            fill(OFF_COLORS[-color_right]);
        }
        square((num_rows - gen) * cell_w, c * cell_w, cell_w);
    }

}

const ON_COLORS = ["#abcd5e", "#29ac9f", "#b3dce0", "#62b6de", "#2b67af", "#f589a3", "#ef562f", "#f9d531"];
const OFF_COLORS = ["#090c08", "#111312", "#19191c", "#212026", "#28262f", "#302d39", "#383343", "#474056"];

const R = 480
const C = 480
const cell_w = 5;
const num_cols = C / cell_w
const num_rows = R / cell_w

let ruleset_left = [1, 1, 0, 1, 1, 0, 1, 1];
let ruleset_right = [1, 0, 1, 0, 0, 1, 0, 0];
let cells_left = null;
let cells_right = null;
let grid = null;
let gen = 0;

function setup() {
    createCanvas(R, C);
    background(255);
    stroke(0);

    grid = new Array(num_rows).fill(null).map(() => new Array(num_cols).fill(0));

    cells_left = new Array(floor(height / cell_w));
    for (let i = 0; i < cells_left.length; i++) {
        cells_left[i] = [0, 0];
    }

    cells_right = new Array(floor(height / cell_w));
    for (let i = 0; i < cells_right.length; i++) {
        cells_right[i] = [0, 0];
    }

    frameRate(30);
}

function draw() {
    updateGrid(cells_left, grid);
    updateGrid(cells_right, grid);

    renderGrid();

    cells_left = updateCells(cells_left, ruleset_left);
    cells_right = updateCells(cells_right, ruleset_right);

    gen++;

    if (gen >= num_rows) {
        gen = 0;
        ruleset_right = shuffle(ruleset_right);
        ruleset_left = shuffle(ruleset_left);
    }
}
