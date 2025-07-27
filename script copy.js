const container = document.getElementById('container');
const symbolSize = 10;
const rows = Math.floor(window.innerHeight / symbolSize);
const cols = Math.floor(window.innerWidth / symbolSize);
let ant_i = Math.floor(Math.random() * rows);
let ant_j = Math.floor(Math.random() * cols);

// Fill the container with symbols
for (let i = 0; i < rows * cols; i++) {
    const symbol = document.createElement('div');
    symbol.classList.add('symbol');
    symbol.textContent = ' ';
    container.appendChild(symbol);
}

function changeSymbol(symbol) {
    if (!symbol) return; // Safety check

    if (symbol.textContent === ' ') {
        symbol.textContent = '*';
        // Optional: Make it blink off after a short time
        setTimeout(() => {
            if (symbol) symbol.textContent = ' ';
        }, 100000); // Blinks off after 200ms (adjust as needed)
    } else if (symbol.textContent === '*') {
        symbol.textContent = ' ';
    }
}

function triggerRipple() {
    // Randomly select a point within the grid
    const i = Math.floor(Math.random() * rows);
    const j = Math.floor(Math.random() * cols);

    const maxRadius = 6;
    const delayPerUnit = 100; // milliseconds per unit distance

    // Generate ripple effect
    for (let di = -maxRadius; di <= maxRadius; di++) {
        for (let dj = -maxRadius; dj <= maxRadius; dj++) {
            const distance = Math.sqrt(di ** 2 + dj ** 2);
            if (distance > maxRadius) continue;

            const ii = i + di;
            const jj = j + dj;

            if (ii >= 0 && ii < rows && jj >= 0 && jj < cols) {
                const index = ii * cols + jj;
                const symbol = container.children[index];
                const delay = distance * delayPerUnit;

                setTimeout(() => changeSymbol(symbol), delay);
            }
        }
    }
}

function walkAnt() {
    // make the ant move in a random direction
    const directions = [
        { di: -1, dj: 0 }, // up
        { di: 1, dj: 0 },  // down
        { di: 0, dj: -1 }, // left
        { di: 0, dj: 1 },  // right
    ];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    //const randomDistance = Math.floor(Math.random() * 2);
    const newAnt_i = ant_i + randomDirection.di; // * randomDistance;
    const newAnt_j = ant_j + randomDirection.dj; // * randomDistance;
    // check if the new position is within bounds
    if (newAnt_i >= 0 && newAnt_i < rows && newAnt_j >= 0 && newAnt_j < cols) {
        ant_i = newAnt_i;
        ant_j = newAnt_j;
        const index = ant_i * cols + ant_j;
        const symbol = container.children[index];
        changeSymbol(symbol);
    }
}
// Move the ant every 100 milliseconds
setInterval(walkAnt, 0);

// Trigger a ripple every 0.5 seconds
// setInterval(triggerRipple, 500);