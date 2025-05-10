// script.js

// Function for the matrix effect on index.html
function initMatrixEffect() {
    const container = document.getElementById('container');
    if (!container) return; // Only run if the 'container' element for the matrix effect exists

    const symbolSize = 6;
    // Adjust rows and cols calculation to prevent errors if window dimensions are small
    const rows = Math.max(1, Math.floor(window.innerHeight / symbolSize));
    const cols = Math.max(1, Math.floor(window.innerWidth / symbolSize));

    // Clear previous symbols if any (e.g., on resize or re-init)
    container.innerHTML = '';

    // Fill the container with symbols
    for (let i = 0; i < rows * cols; i++) {
        const symbol = document.createElement('div');
        symbol.classList.add('symbol');
        symbol.textContent = ' '; // Start with a blank character
        container.appendChild(symbol);
    }

    function changeSymbol(symbolElement) {
        if (symbolElement.textContent === ' ') {
            symbolElement.textContent = '*'; // Character to show
            setTimeout(() => {
                symbolElement.textContent = ' ';
            }, 100); // How long the character stays visible
        }
    }

    function triggerRipple() {
        // Ensure container still exists and has children
        if (!container || container.children.length === 0) return;

        const i = Math.floor(Math.random() * rows);
        const j = Math.floor(Math.random() * cols);
        const maxRadius = 6;
        const delayPerUnit = 100; // milliseconds per unit distance

        for (let di = -maxRadius; di <= maxRadius; di++) {
            for (let dj = -maxRadius; dj <= maxRadius; dj++) {
                const distance = Math.sqrt(di * di + dj * dj);
                if (distance > maxRadius) continue;

                const ii = i + di;
                const jj = j + dj;

                if (ii >= 0 && ii < rows && jj >= 0 && jj < cols) {
                    const index = ii * cols + jj;
                    if (index < container.children.length) { // Boundary check
                        const symbol = container.children[index];
                        const delay = distance * delayPerUnit;
                        setTimeout(() => changeSymbol(symbol), delay);
                    }
                }
            }
        }
    }

    // Start the ripple effect
    setInterval(triggerRipple, 500); // Trigger a ripple effect periodically
}

// Function to randomize gallery images
function randomizeGalleryImages() {
    const gallery = document.querySelector('.gallery');
    if (!gallery) {
        return; // No gallery on this page, so do nothing
    }

    const images = gallery.querySelectorAll('img');
    if (images.length === 0) {
        return; // No images in the gallery
    }

    const galleryWidth = gallery.offsetWidth;
    const galleryHeight = gallery.offsetHeight;

    // If gallery has no dimensions (e.g. CSS height not set), randomization will be poor.
    if (galleryWidth === 0 || galleryHeight === 0) {
        console.warn("Gallery has no dimensions (width or height is 0). Randomization might not work as expected. Ensure .gallery has a CSS height set.");
        return; // Exit if gallery dimensions are not suitable
    }

    // Define min/max width for the randomized images (adjust these values as you like)
    const minImageWidth = 80;  // pixels
    const maxImageWidth = 220; // pixels

    images.forEach(img => {
        // Set image style for absolute positioning (already in CSS, but good to ensure)
        img.style.position = 'absolute';
        img.style.height = 'auto'; // Maintain aspect ratio

        // Randomize width
        const randomWidth = Math.floor(Math.random() * (maxImageWidth - minImageWidth + 1)) + minImageWidth;
        img.style.width = randomWidth + 'px';

        // To accurately position an image and keep it mostly within bounds,
        // we need its rendered height. This is best obtained after the width is set
        // and the browser has had a chance to calculate the 'auto' height.
        // Using a small timeout helps achieve this.
        setTimeout(() => {
            const imgRenderedHeight = img.offsetHeight; // Actual height after width is set
            const imgRenderedWidth = img.offsetWidth;   // Actual width (should be randomWidth)

            // Calculate maximum possible top and left positions to keep image mostly within gallery
            // Allow for image to be at the very edge.
            const maxTop = galleryHeight - imgRenderedHeight;
            const maxLeft = galleryWidth - imgRenderedWidth;

            // Generate random top and left positions
            // Ensure positions are not negative if image is larger than gallery dimension
            const randomTop = Math.floor(Math.random() * Math.max(0, maxTop));
            const randomLeft = Math.floor(Math.random() * Math.max(0, maxLeft));

            img.style.top = randomTop + 'px';
            img.style.left = randomLeft + 'px';
        }, 0); // Timeout 0ms queues this to run after current JS execution and potential browser repaint/reflow
    });
}

// Run initializations after the HTML document has been fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initMatrixEffect();      // Initialize the matrix effect (will only run if #container exists)
    // randomizeGalleryImages(); // Initialize gallery randomization (will only run if .gallery exists)
});