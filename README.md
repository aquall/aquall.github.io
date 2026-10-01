# aquall.github.io
An experiment in bare-bones web development and a homepage for all my projects.

## Homepage animation

Edit `animation.py` to change the ASCII portrait and random walk. Transcrypt
compiles this Python source to browser JavaScript; no Python server or browser
Python interpreter is needed. HTML keeps the navigation links and CSS controls
the layout. The decorative canvases ignore pointer events and sit below the links.

### Build

Create a virtual environment with Python (tested with Python 3.12) and install
the pinned compiler. On Windows:

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements-dev.txt
.venv\Scripts\python -m transcrypt -b -n -od assets animation.py
```

On macOS/Linux, use `python3` to create the environment and
`.venv/bin/python` for the remaining commands. `-n` disables minification so
Java is not required. The compiler generates `assets/animation.js` and its
runtime modules. Keep all generated `assets/*.js` files with the website and
rebuild them whenever `animation.py` changes; do not edit generated JavaScript.
The `assets` directory deliberately avoids Transcrypt's default `__target__`
name so GitHub Pages' default Jekyll build can publish it.

### Preview

```powershell
.venv\Scripts\python -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. Use an HTTP server rather than opening `index.html`
directly, because the compiled code uses JavaScript modules.

The constants at the top of `animation.py` set the photograph, density symbols,
grid size, cell size, and simulation speed. The portrait is sampled into a
56-by-56 grid in the browser. Each animation frame takes 35 random-walk steps,
darkening the portrait when the walker crosses it and drawing a trail elsewhere.
Resizing clears the background trail and preserves the portrait. If changing
the portrait's grid or cell size, update its dimensions in `style.css` as well.
