const container = document.getElementById('container');
const symbolSize = 6;
const rows = Math.floor(window.innerHeight / symbolSize);
const cols = Math.floor(window.innerWidth / symbolSize);

// Fill the container with symbols
for (let i = 0; i < rows * cols; i++) {
    const symbol = document.createElement('div');
    symbol.classList.add('symbol');
    symbol.textContent = ' ';
    container.appendChild(symbol);
}

function changeSymbol(symbol) {
    if (symbol.textContent === ' ') {
        symbol.textContent = '*';
        setTimeout(() => {
            symbol.textContent = ' ';
        }, 5);
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

// Trigger a ripple every 2 seconds
setInterval(triggerRipple, 500);