"""Homepage ASCII portrait and random walk. Compile with Transcrypt; see README."""

from org.transcrypt.stubs.browser import document, window, Math


IMAGE_URL = "images/index_photo.jpg"
SYMBOLS = " .,-+(/*#&%@"
CELL_SIZE = 6
ART_SIZE = 56
STEPS_PER_FRAME = 35
DIRECTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]


class Grid:
    def __init__(self, canvas, cols, rows):
        self.canvas = canvas
        self.cols = cols
        self.rows = rows
        self.cells = [0 for _ in range(cols * rows)]
        width = cols * CELL_SIZE
        height = rows * CELL_SIZE
        ratio = window.devicePixelRatio or 1
        canvas.width = Math.round(width * ratio)
        canvas.height = Math.round(height * ratio)
        self.context = canvas.getContext("2d")
        self.context.scale(canvas.width / width, canvas.height / height)
        self.context.font = str(CELL_SIZE) + "px 'Times New Roman', serif"
        self.context.textAlign = "center"
        self.context.textBaseline = "middle"
        self.context.fillStyle = "#000000"

    def draw(self, index):
        x = (index % self.cols) * CELL_SIZE
        y = (index // self.cols) * CELL_SIZE
        self.context.clearRect(x, y, CELL_SIZE, CELL_SIZE)
        self.context.fillText(SYMBOLS[self.cells[index]],
                              x + CELL_SIZE / 2, y + CELL_SIZE / 2)

    def darken(self, col, row):
        index = row * self.cols + col
        if self.cells[index] < len(SYMBOLS) - 1:
            self.cells[index] += 1
            self.draw(index)


art = Grid(document.getElementById("art-canvas"), ART_SIZE, ART_SIZE)
trail_canvas = document.getElementById("trail-canvas")
trail = None
art_rect = None
walker = [Math.floor(Math.random() * window.innerWidth),
          Math.floor(Math.random() * window.innerHeight)]


def resize(event=None):
    """Reset the background trail, retaining the portrait's accumulated changes."""
    global trail, art_rect
    cols = Math.ceil(window.innerWidth / CELL_SIZE)
    rows = Math.ceil(window.innerHeight / CELL_SIZE)
    trail_canvas.style.width = str(cols * CELL_SIZE) + "px"
    trail_canvas.style.height = str(rows * CELL_SIZE) + "px"
    trail = Grid(trail_canvas, cols, rows)
    art_rect = art.canvas.getBoundingClientRect()
    # Keep the walker inside the viewport after shrinking the window.
    walker[0] = min(walker[0], window.innerWidth - 1)
    walker[1] = min(walker[1], window.innerHeight - 1)


def walk():
    dx, dy = DIRECTIONS[Math.floor(Math.random() * len(DIRECTIONS))]
    x = walker[0] + dx * CELL_SIZE
    y = walker[1] + dy * CELL_SIZE
    if 0 <= x < window.innerWidth and 0 <= y < window.innerHeight:
        walker[0] = x
        walker[1] = y

    x = walker[0] - art_rect.left
    y = walker[1] - art_rect.top
    if 0 <= x < art_rect.width and 0 <= y < art_rect.height:
        art.darken(Math.floor(x / art_rect.width * ART_SIZE),
                   Math.floor(y / art_rect.height * ART_SIZE))
    else:
        trail.darken(Math.floor(walker[0] / CELL_SIZE),
                     Math.floor(walker[1] / CELL_SIZE))


def animate(timestamp):
    for _ in range(STEPS_PER_FRAME):
        walk()
    window.requestAnimationFrame(animate)


def start(event=None):
    resize()
    window.addEventListener("resize", resize)
    window.requestAnimationFrame(animate)


def load_portrait(event):
    # Read the photograph at grid resolution using the browser's image decoder.
    sample = document.createElement("canvas")
    sample.width = ART_SIZE
    sample.height = ART_SIZE
    context = sample.getContext("2d")
    context.drawImage(photo, 0, 0, ART_SIZE, ART_SIZE)
    pixels = context.getImageData(0, 0, ART_SIZE, ART_SIZE).data
    for index in range(ART_SIZE * ART_SIZE):
        offset = index * 4
        brightness = (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3
        art.cells[index] = Math.round((1 - brightness / 255) * (len(SYMBOLS) - 1))
        art.draw(index)
    start()


photo = document.createElement("img")
photo.onload = load_portrait
photo.onerror = start  # A missing photograph still leaves a working random walk.
photo.src = IMAGE_URL
