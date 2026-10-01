// Transcrypt'ed from Python, 2026-09-30 20:38:55
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, _sort, abs, all, any, assert, bin, bool, bytearray, bytes, callable, chr, delattr, dict, dir, divmod, filter, float, getattr, hasattr, hex, input, int, isinstance, issubclass, len, list, map, max, min, object, oct, ord, pow, print, property, py_TypeError, py_enumerate, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = '__main__';
export var IMAGE_URL = 'images/index_photo.jpg';
export var SYMBOLS = ' .,-+(/*#&%@';
export var CELL_SIZE = 6;
export var ART_SIZE = 56;
export var STEPS_PER_FRAME = 35;
export var DIRECTIONS = [tuple ([-(1), 0]), tuple ([1, 0]), tuple ([0, -(1)]), tuple ([0, 1])];
export var Grid =  __class__ ('Grid', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, canvas, cols, rows) {
		self.canvas = canvas;
		self.cols = cols;
		self.rows = rows;
		self.cells = (function () {
			var __accu0__ = [];
			for (var _ = 0; _ < cols * rows; _++) {
				__accu0__.append (0);
			}
			return __accu0__;
		}) ();
		var width = cols * CELL_SIZE;
		var height = rows * CELL_SIZE;
		var ratio = window.devicePixelRatio || 1;
		canvas.width = Math.round (width * ratio);
		canvas.height = Math.round (height * ratio);
		self.context = canvas.getContext ('2d');
		self.context.scale (canvas.width / width, canvas.height / height);
		self.context.font = str (CELL_SIZE) + "px 'Times New Roman', serif";
		self.context.textAlign = 'center';
		self.context.textBaseline = 'middle';
		self.context.fillStyle = '#000000';
	});},
	get draw () {return __get__ (this, function (self, index) {
		var x = (__mod__ (index, self.cols)) * CELL_SIZE;
		var y = (Math.floor (index / self.cols)) * CELL_SIZE;
		self.context.clearRect (x, y, CELL_SIZE, CELL_SIZE);
		self.context.fillText (SYMBOLS [self.cells [index]], x + CELL_SIZE / 2, y + CELL_SIZE / 2);
	});},
	get darken () {return __get__ (this, function (self, col, row) {
		var index = row * self.cols + col;
		if (self.cells [index] < len (SYMBOLS) - 1) {
			self.cells [index]++;
			self.draw (index);
		}
	});}
});
export var art = Grid (document.getElementById ('art-canvas'), ART_SIZE, ART_SIZE);
export var trail_canvas = document.getElementById ('trail-canvas');
export var trail = null;
export var art_rect = null;
export var walker = [Math.floor (Math.random () * window.innerWidth), Math.floor (Math.random () * window.innerHeight)];
export var resize = function (event) {
	if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
		var event = null;
	};
	var cols = Math.ceil (window.innerWidth / CELL_SIZE);
	var rows = Math.ceil (window.innerHeight / CELL_SIZE);
	trail_canvas.style.width = str (cols * CELL_SIZE) + 'px';
	trail_canvas.style.height = str (rows * CELL_SIZE) + 'px';
	trail = Grid (trail_canvas, cols, rows);
	art_rect = art.canvas.getBoundingClientRect ();
	walker [0] = min (walker [0], window.innerWidth - 1);
	walker [1] = min (walker [1], window.innerHeight - 1);
};
export var walk = function () {
	var __left0__ = DIRECTIONS [Math.floor (Math.random () * len (DIRECTIONS))];
	var dx = __left0__ [0];
	var dy = __left0__ [1];
	var x = walker [0] + dx * CELL_SIZE;
	var y = walker [1] + dy * CELL_SIZE;
	if ((0 <= x && x < window.innerWidth) && (0 <= y && y < window.innerHeight)) {
		walker [0] = x;
		walker [1] = y;
	}
	var x = walker [0] - art_rect.left;
	var y = walker [1] - art_rect.top;
	if ((0 <= x && x < art_rect.width) && (0 <= y && y < art_rect.height)) {
		art.darken (Math.floor ((x / art_rect.width) * ART_SIZE), Math.floor ((y / art_rect.height) * ART_SIZE));
	}
	else {
		trail.darken (Math.floor (walker [0] / CELL_SIZE), Math.floor (walker [1] / CELL_SIZE));
	}
};
export var animate = function (timestamp) {
	for (var _ = 0; _ < STEPS_PER_FRAME; _++) {
		walk ();
	}
	window.requestAnimationFrame (animate);
};
export var start = function (event) {
	if (typeof event == 'undefined' || (event != null && event.hasOwnProperty ("__kwargtrans__"))) {;
		var event = null;
	};
	resize ();
	window.addEventListener ('resize', resize);
	window.requestAnimationFrame (animate);
};
export var load_portrait = function (event) {
	var sample = document.createElement ('canvas');
	sample.width = ART_SIZE;
	sample.height = ART_SIZE;
	var context = sample.getContext ('2d');
	context.drawImage (photo, 0, 0, ART_SIZE, ART_SIZE);
	var pixels = context.getImageData (0, 0, ART_SIZE, ART_SIZE).data;
	for (var index = 0; index < ART_SIZE * ART_SIZE; index++) {
		var offset = index * 4;
		var brightness = ((pixels [offset] + pixels [offset + 1]) + pixels [offset + 2]) / 3;
		art.cells [index] = Math.round ((1 - brightness / 255) * (len (SYMBOLS) - 1));
		art.draw (index);
	}
	start ();
};
export var photo = document.createElement ('img');
photo.onload = load_portrait;
photo.onerror = start;
photo.src = IMAGE_URL;

//# sourceMappingURL=animation.map