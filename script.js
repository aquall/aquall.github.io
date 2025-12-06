/**
 * Configuration
 */
const CONFIG = {
    artWrapperId: 'art-wrapper',
    trailWrapperId: 'trail-wrapper',
    imageUrl: 'images/index_photo.jpg',
    symbolSize: 6,
    rows: 56,
    cols: 56,
    speed: 35, // Number of steps per frame
    densitySymbols: [' ', '.', ',', '-', '+', '(', '/', '*', '#', '&', '%', '@']
};

/**
 * State Management
 */
const state = {
    ant: { x: 0, y: 0 },
    grids: [], // Stores grid objects: { element, rect, cols, rows, type: 'art'|'trail' }
    initPromise: null
};

/**
 * Utilities
 */
function getSymbolIndex(brightness) {
    return Math.round((1 - brightness / 255) * (CONFIG.densitySymbols.length - 1));
}

function createSymbol(char) {
    const div = document.createElement('div');
    div.classList.add('symbol');
    div.textContent = char;
    return div;
}

function updateSymbol(element) {
    if (!element) return;
    const currentIndex = CONFIG.densitySymbols.indexOf(element.textContent);
    if (currentIndex < CONFIG.densitySymbols.length - 1) {
        element.textContent = CONFIG.densitySymbols[currentIndex + 1];
    }
}

/**
 * Grid Initialization
 */
function initArtGrid() {
    return new Promise((resolve) => {
        const wrapper = document.getElementById(CONFIG.artWrapperId);
        if (!wrapper) return resolve(null);

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = CONFIG.imageUrl;

        img.onload = () => {
            // Create canvas to read pixel data
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            canvas.width = CONFIG.cols;
            canvas.height = CONFIG.rows;
            ctx.drawImage(img, 0, 0, CONFIG.cols, CONFIG.rows);
            const data = ctx.getImageData(0, 0, CONFIG.cols, CONFIG.rows).data;

            wrapper.innerHTML = '';

            // Populate grid
            for (let i = 0; i < CONFIG.rows * CONFIG.cols; i++) {
                const r = data[i * 4];
                const g = data[i * 4 + 1];
                const b = data[i * 4 + 2];
                const val = (r + g + b) / 3; // brightness
                const char = CONFIG.densitySymbols[getSymbolIndex(val)];
                wrapper.appendChild(createSymbol(char));
            }

            resolve({
                element: wrapper,
                cols: CONFIG.cols,
                rows: CONFIG.rows,
                rect: wrapper.getBoundingClientRect(),
                type: 'art'
            });
        };

        img.onerror = () => {
            // Fallback to blank grid if image fails
            wrapper.innerHTML = '';
            for (let i = 0; i < CONFIG.rows * CONFIG.cols; i++) {
                wrapper.appendChild(createSymbol(CONFIG.densitySymbols[0]));
            }
            resolve({
                element: wrapper,
                cols: CONFIG.cols,
                rows: CONFIG.rows,
                rect: wrapper.getBoundingClientRect(),
                type: 'art'
            });
        };
    });
}

function initTrailGrid() {
    let wrapper = document.getElementById(CONFIG.trailWrapperId);
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = CONFIG.trailWrapperId;
        // Style setup for full screen
        Object.assign(wrapper.style, {
            position: 'fixed', left: '0', top: '0', pointerEvents: 'none', zIndex: '3'
        });
        document.body.appendChild(wrapper);
    }

    const cols = Math.ceil(window.innerWidth / CONFIG.symbolSize);
    const rows = Math.ceil(window.innerHeight / CONFIG.symbolSize);

    wrapper.style.width = `${cols * CONFIG.symbolSize}px`;
    wrapper.style.height = `${rows * CONFIG.symbolSize}px`;
    wrapper.innerHTML = '';

    for (let i = 0; i < rows * cols; i++) {
        wrapper.appendChild(createSymbol(CONFIG.densitySymbols[0]));
    }

    return {
        element: wrapper,
        cols,
        rows,
        rect: wrapper.getBoundingClientRect(),
        type: 'trail'
    };
}

/**
 * Animation Logic
 */
function walk() {
    // Random direction: Left, Right, Up, Down
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];

    const nextX = state.ant.x + dx * CONFIG.symbolSize;
    const nextY = state.ant.y + dy * CONFIG.symbolSize;

    // Check boundary
    if (nextX >= 0 && nextX < window.innerWidth && nextY >= 0 && nextY < window.innerHeight) {
        state.ant.x = nextX;
        state.ant.y = nextY;
    }

    // Determine which grid updates
    let handled = false;

    // Check art grid first (higher priority if overlapping)
    const artGrid = state.grids.find(g => g.type === 'art');
    if (artGrid) {
        const relativeX = state.ant.x - artGrid.rect.left;
        const relativeY = state.ant.y - artGrid.rect.top;

        if (relativeX >= 0 && relativeX < artGrid.rect.width &&
            relativeY >= 0 && relativeY < artGrid.rect.height) {

            const col = Math.floor((relativeX / artGrid.rect.width) * artGrid.cols);
            const row = Math.floor((relativeY / artGrid.rect.height) * artGrid.rows);

            if (col >= 0 && col < artGrid.cols && row >= 0 && row < artGrid.rows) {
                const index = row * artGrid.cols + col;
                updateSymbol(artGrid.element.children[index]);
                return; // Don't draw trail if we drew on art
            }
        }
    }

    // Otherwise update trail grid
    const trailGrid = state.grids.find(g => g.type === 'trail');
    if (trailGrid) {
        // Trail is always at 0,0 so local == global
        const col = Math.floor(state.ant.x / CONFIG.symbolSize);
        const row = Math.floor(state.ant.y / CONFIG.symbolSize);

        if (col >= 0 && col < trailGrid.cols && row >= 0 && row < trailGrid.rows) {
            const index = row * trailGrid.cols + col;
            updateSymbol(trailGrid.element.children[index]);
        }
    }
}

function loop() {
    // Run multiple simulation steps per frame for speed
    for (let i = 0; i < CONFIG.speed; i++) {
        walk();
    }
    requestAnimationFrame(loop);
}

async function init() {
    // Initialize Ant Position
    state.ant.x = Math.floor(Math.random() * window.innerWidth);
    state.ant.y = Math.floor(Math.random() * window.innerHeight);

    // Initialize Grids
    const artGrid = await initArtGrid();
    const trailGrid = initTrailGrid();

    state.grids = [trailGrid];
    if (artGrid) state.grids.push(artGrid);

    // Re-calculate layout on resize
    window.addEventListener('resize', async () => {
        state.grids = []; // Clear current grids to avoid conflicts during rebuild
        const newTrail = initTrailGrid();
        // We re-use the existing art grid element but need to update its check rect
        if (artGrid) {
            // Update rect in case layout shifted
            artGrid.rect = artGrid.element.getBoundingClientRect();
            state.grids.push(artGrid);
        }
        state.grids.push(newTrail);
    });

    loop();
}

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}