// --- CONFIGURATION ---
const artWrapper = document.getElementById('art-wrapper');
const symbolSize = 8;
const imageUrl = 'images/index_photo.jpg';
const densitySymbols = [' ', '.', ',', '-', '+', '(', '/', '*', '#', '&', '%', '@'];

// --- GRID SETUP ---
const rows = 56;
const cols = 56;

/**
 * Initializes the grid by converting an image to ASCII characters.
 * @param {string} url - The URL of the image to load.
 */
function initializeGridFromImage(url) {
    if (!artWrapper) return;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = cols;
        canvas.height = rows;
        ctx.drawImage(img, 0, 0, cols, rows);
        const imageData = ctx.getImageData(0, 0, cols, rows).data;

        artWrapper.innerHTML = '';

        for (let i = 0; i < rows * cols; i++) {
            const pixelIndex = i * 4;
            const r = imageData[pixelIndex];
            const g = imageData[pixelIndex + 1];
            const b = imageData[pixelIndex + 2];
            const brightness = (r + g + b) / 3;
            const symbolIndex = Math.round((1 - brightness / 255) * (densitySymbols.length - 1));

            const symbol = document.createElement('div');
            symbol.classList.add('symbol');
            symbol.textContent = densitySymbols[symbolIndex];
            artWrapper.appendChild(symbol);
        }
    };

    img.onerror = () => {
        console.error("Failed to load image. Initializing with a blank grid.");
        initializeBlankGrid();
    };
}

/**
 * Fills the container with the least dense symbol as a fallback.
 */
function initializeBlankGrid() {
    if (!artWrapper) return;
    artWrapper.innerHTML = '';
    for (let i = 0; i < rows * cols; i++) {
        const symbol = document.createElement('div');
        symbol.classList.add('symbol');
        symbol.textContent = densitySymbols[0];
        artWrapper.appendChild(symbol);
    }
}

/**
 * Progressively updates the symbol at the ant's location.
 */
function changeSymbol(symbol) {
    if (!symbol) return;

    const currentSymbol = symbol.textContent;
    const currentIndex = densitySymbols.indexOf(currentSymbol);

    if (currentIndex < densitySymbols.length - 1) {
        symbol.textContent = densitySymbols[currentIndex + 1];
    }
}

// Full-page ASCII trail grid
let trailWrapper = null;
let trailCols = 0;
let trailRows = 0;
let trailRect = null;

function buildTrailGrid() {
    // Create wrapper if needed
    if (!trailWrapper) {
        trailWrapper = document.createElement('div');
        trailWrapper.id = 'trail-wrapper';
        document.body.appendChild(trailWrapper);
    }
    // Size to viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    trailCols = Math.ceil(vw / symbolSize);
    trailRows = Math.ceil(vh / symbolSize);

    // Build cells
    trailWrapper.innerHTML = '';
    trailWrapper.style.position = 'fixed';
    trailWrapper.style.left = '0';
    trailWrapper.style.top = '0';
    trailWrapper.style.width = `${trailCols * symbolSize}px`;
    trailWrapper.style.height = `${trailRows * symbolSize}px`;
    trailWrapper.style.pointerEvents = 'none';
    trailWrapper.style.zIndex = '3';

    for (let i = 0; i < trailRows * trailCols; i++) {
        const symbol = document.createElement('div');
        symbol.classList.add('symbol');
        symbol.textContent = densitySymbols[0];
        trailWrapper.appendChild(symbol);
    }

    trailRect = trailWrapper.getBoundingClientRect();
}

window.addEventListener('resize', buildTrailGrid);

// Ant position and movement using original 4-direction random walk
let antX = Math.floor(Math.random() * window.innerWidth);
let antY = Math.floor(Math.random() * window.innerHeight);
const stepSize = symbolSize; // step by one cell size

function stepAnt() {
    const directions = [
        { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
        { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
    ];
    const { dx, dy } = directions[Math.floor(Math.random() * directions.length)];

    const newX = antX + dx * stepSize;
    const newY = antY + dy * stepSize;

    // Only move if inside viewport (like original bounds check)
    if (newX >= 0 && newX < window.innerWidth && newY >= 0 && newY < window.innerHeight) {
        antX = newX;
        antY = newY;
    }

    // Interact with ASCII image if overlapping
    if (artWrapper) {
        const rect = artWrapper.getBoundingClientRect();
        const withinX = antX >= rect.left && antX < rect.right;
        const withinY = antY >= rect.top && antY < rect.bottom;
        if (withinX && withinY) {
            const localX = antX - rect.left;
            const localY = antY - rect.top;
            const col = Math.floor((localX / rect.width) * cols);
            const row = Math.floor((localY / rect.height) * rows);
            if (row >= 0 && row < rows && col >= 0 && col < cols) {
                const index = row * cols + col;
                const symbol = artWrapper.children[index];
                changeSymbol(symbol);
                return; // do not also draw to trail for this step
            }
        }
    }

    // Otherwise, leave ASCII trail on the full-page grid
    if (trailWrapper && trailRect) {
        const localX = antX - trailRect.left;
        const localY = antY - trailRect.top;
        const col = Math.floor((localX / trailRect.width) * trailCols);
        const row = Math.floor((localY / trailRect.height) * trailRows);
        if (row >= 0 && row < trailRows && col >= 0 && col < trailCols) {
            const index = row * trailCols + col;
            const symbol = trailWrapper.children[index];
            changeSymbol(symbol);
        }
    }
}

// --- INITIALIZATION ---
initializeGridFromImage(imageUrl);

// Build the full-page ASCII trail after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildTrailGrid);
} else {
    buildTrailGrid();
}

// Animation loop for the page-walking ant
function animate() {
    stepAnt();
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);