// --- CONFIGURATION ---
// FIXED: Get both the container and the new art-wrapper element
const container = document.getElementById('container');
const artWrapper = document.getElementById('art-wrapper');
const symbolSize = 6;
const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg';
const densitySymbols = [' ', '.', ',', '-', '+', '(', '/', '*', '#', '&', '%', '@'];

// --- GRID & ANT SETUP ---
// Using fixed rows and columns for consistent art size
const rows = 65;
const cols = 50;

let ant_i = Math.floor(Math.random() * rows);
let ant_j = Math.floor(Math.random() * cols);

/**
 * Initializes the grid by converting an image to ASCII characters.
 * @param {string} url - The URL of the image to load.
 */
function initializeGridFromImage(url) {
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
            // FIXED: Re-added the missing pixel processing logic
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

    // FIXED: Moved img.onerror to be inside the correct function scope
    img.onerror = () => {
        console.error("Failed to load image. Initializing with a blank grid.");
        initializeBlankGrid();
    };
}

/**
 * Fills the container with the least dense symbol as a fallback.
 */
function initializeBlankGrid() {
    // FIXED: Changed to modify artWrapper to be consistent
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
 * @param {HTMLElement} symbol - The symbol element to change.
 */
function changeSymbol(symbol) {
    if (!symbol) return;

    const currentSymbol = symbol.textContent;
    const currentIndex = densitySymbols.indexOf(currentSymbol);

    if (currentIndex < densitySymbols.length - 1) {
        symbol.textContent = densitySymbols[currentIndex + 1];
    }
}

/**
 * Moves the ant one step in a random direction and updates the symbol.
 */
function walkAnt() {
    const directions = [
        { di: -1, dj: 0 }, { di: 1, dj: 0 },
        { di: 0, dj: -1 }, { di: 0, dj: 1 },
    ];

    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const newAnt_i = ant_i + randomDirection.di;
    const newAnt_j = ant_j + randomDirection.dj;

    if (newAnt_i >= 0 && newAnt_i < rows && newAnt_j >= 0 && newAnt_j < cols) {
        ant_i = newAnt_i;
        ant_j = newAnt_j;
        const index = ant_i * cols + ant_j;
        const symbol = artWrapper.children[index];
        changeSymbol(symbol);
    }
}

// --- INITIALIZATION ---
initializeGridFromImage(imageUrl);
setInterval(walkAnt, 0);