
var colour_map = {
  0: "#EBF5FB",
  1: "#D6EAF8",
  2: "#AED6F1",
  3: "#85C1E9",
  4: "#5DADE2",
  5: "#3498DB",
  6: "#2E86C1",
  7: "#2874A6",
  8: "#21618C",
  9: "#1B4F72"
}

var keyboard_neighbours = {
  "q": ["w", "a"],
  "w": ["q", "s", "e"],
  "e": ["w", "d", "r"],
  "r": ["e", "f", "t"],
  "t": ["r", "g", "y"],
  "y": ["t", "h", "u"],
  "u": ["y", "j", "i"],
  "i": ["u", "k", "o"],
  "o": ["i", "l", "p"],
  "p": ["o", "l"],
  "a": ["q", "s", "z"],
  "s": ["a", "w", "d", "x", "z"],
  "d": ["s", "e", "f", "c", "x"],
  "f": ["d", "r", "g", "v", "c"],
  "g": ["f", "t", "h", "b", "v"],
  "h": ["g", "y", "j", "n", "b"],
  "j": ["h", "u", "k", "m", "n"],
  "k": ["j", "i", "l", "m"],
  "l": ["k", "o"],
  "z": ["a", "s", "x"],
  "x": ["z", "s", "d", "c"],
  "c": ["x", "d", "f", "v"],
  "v": ["c", "f", "g", "b"],
  "b": ["v", "g", "h", "n"],
  "n": ["b", "h", "j", "m"],
  "m": ["n", "j", "k"]
}

transition_probs = [
[0.0, 0.02, 0.06, 0.05, 0.0, 0.02, 0.02, 0.01, 0.04, 0.0, 0.02, 0.09, 0.04, 0.17, 0.0, 0.04, 0.0, 0.14, 0.09, 0.11, 0.02, 0.03, 0.01, 0.0, 0.03, 0.0] ,
[0.08, 0.06, 0.06, 0.0, 0.26, 0.0, 0.0, 0.0, 0.06, 0.0, 0.0, 0.05, 0.0, 0.0, 0.13, 0.0, 0.0, 0.09, 0.02, 0.0, 0.12, 0.0, 0.0, 0.0, 0.04, 0.0] ,
[0.15, 0.0, 0.02, 0.0, 0.14, 0.0, 0.0, 0.13, 0.05, 0.0, 0.04, 0.03, 0.0, 0.01, 0.18, 0.0, 0.0, 0.04, 0.02, 0.09, 0.04, 0.0, 0.0, 0.0, 0.01, 0.0] ,
[0.11, 0.03, 0.03, 0.02, 0.15, 0.02, 0.02, 0.03, 0.15, 0.0, 0.0, 0.02, 0.02, 0.02, 0.1, 0.02, 0.0, 0.04, 0.06, 0.09, 0.03, 0.01, 0.03, 0.0, 0.01, 0.0] ,
[0.08, 0.03, 0.05, 0.08, 0.04, 0.02, 0.02, 0.02, 0.04, 0.0, 0.0, 0.04, 0.03, 0.1, 0.03, 0.03, 0.0, 0.14, 0.1, 0.06, 0.01, 0.02, 0.03, 0.01, 0.02, 0.0] ,
[0.15, 0.01, 0.01, 0.01, 0.09, 0.06, 0.01, 0.01, 0.1, 0.0, 0.0, 0.03, 0.01, 0.0, 0.22, 0.01, 0.0, 0.1, 0.0, 0.12, 0.04, 0.0, 0.01, 0.0, 0.01, 0.0] ,
[0.1, 0.01, 0.01, 0.01, 0.15, 0.02, 0.02, 0.14, 0.08, 0.0, 0.0, 0.03, 0.02, 0.02, 0.08, 0.01, 0.0, 0.12, 0.05, 0.05, 0.06, 0.0, 0.02, 0.0, 0.01, 0.0] ,
[0.18, 0.01, 0.0, 0.0, 0.4, 0.0, 0.0, 0.01, 0.11, 0.0, 0.0, 0.01, 0.01, 0.0, 0.14, 0.0, 0.0, 0.02, 0.02, 0.04, 0.01, 0.0, 0.01, 0.0, 0.01, 0.0] ,
[0.04, 0.01, 0.06, 0.04, 0.04, 0.02, 0.04, 0.0, 0.0, 0.0, 0.01, 0.05, 0.04, 0.24, 0.07, 0.01, 0.0, 0.03, 0.09, 0.15, 0.0, 0.03, 0.01, 0.0, 0.0, 0.0] ,
[0.07, 0.0, 0.0, 0.03, 0.07, 0.0, 0.0, 0.0, 0.03, 0.0, 0.0, 0.0, 0.0, 0.0, 0.43, 0.0, 0.0, 0.0, 0.02, 0.0, 0.34, 0.0, 0.0, 0.0, 0.0, 0.0] ,
[0.07, 0.03, 0.0, 0.01, 0.31, 0.03, 0.02, 0.01, 0.2, 0.0, 0.0, 0.01, 0.01, 0.02, 0.03, 0.02, 0.0, 0.02, 0.1, 0.08, 0.01, 0.0, 0.02, 0.0, 0.02, 0.0] ,
[0.12, 0.01, 0.01, 0.05, 0.18, 0.01, 0.0, 0.01, 0.14, 0.0, 0.02, 0.13, 0.01, 0.01, 0.08, 0.02, 0.0, 0.01, 0.04, 0.04, 0.02, 0.0, 0.01, 0.0, 0.08, 0.0] ,
[0.18, 0.04, 0.01, 0.0, 0.21, 0.01, 0.01, 0.01, 0.09, 0.0, 0.0, 0.01, 0.06, 0.0, 0.12, 0.05, 0.0, 0.01, 0.03, 0.03, 0.07, 0.0, 0.01, 0.0, 0.04, 0.0] ,
[0.06, 0.01, 0.04, 0.14, 0.11, 0.02, 0.13, 0.02, 0.06, 0.0, 0.02, 0.01, 0.01, 0.02, 0.05, 0.01, 0.0, 0.0, 0.07, 0.15, 0.02, 0.01, 0.02, 0.0, 0.01, 0.0] ,
[0.01, 0.02, 0.03, 0.02, 0.01, 0.07, 0.02, 0.01, 0.01, 0.0, 0.02, 0.05, 0.06, 0.18, 0.05, 0.05, 0.0, 0.13, 0.04, 0.06, 0.12, 0.01, 0.04, 0.0, 0.0, 0.0] ,
[0.11, 0.0, 0.01, 0.01, 0.16, 0.01, 0.0, 0.12, 0.06, 0.0, 0.0, 0.11, 0.0, 0.0, 0.12, 0.06, 0.0, 0.07, 0.03, 0.05, 0.05, 0.0, 0.0, 0.0, 0.02, 0.0] ,
[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.05, 0.0, 0.0, 0.95, 0.0, 0.0, 0.0, 0.0, 0.0] ,
[0.1, 0.01, 0.02, 0.04, 0.24, 0.01, 0.02, 0.01, 0.1, 0.0, 0.02, 0.02, 0.02, 0.01, 0.1, 0.03, 0.0, 0.02, 0.07, 0.09, 0.02, 0.0, 0.01, 0.0, 0.03, 0.0] ,
[0.12, 0.02, 0.04, 0.01, 0.1, 0.02, 0.01, 0.06, 0.1, 0.0, 0.01, 0.02, 0.04, 0.01, 0.08, 0.05, 0.0, 0.01, 0.06, 0.17, 0.02, 0.0, 0.03, 0.0, 0.01, 0.0] ,
[0.05, 0.01, 0.02, 0.01, 0.1, 0.01, 0.01, 0.28, 0.11, 0.0, 0.0, 0.02, 0.01, 0.01, 0.11, 0.01, 0.0, 0.04, 0.05, 0.06, 0.02, 0.01, 0.03, 0.0, 0.02, 0.0] ,
[0.04, 0.03, 0.05, 0.03, 0.03, 0.01, 0.05, 0.0, 0.02, 0.0, 0.01, 0.07, 0.05, 0.14, 0.0, 0.04, 0.0, 0.1, 0.18, 0.14, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0] ,
[0.06, 0.0, 0.01, 0.0, 0.63, 0.0, 0.0, 0.0, 0.24, 0.0, 0.0, 0.0, 0.0, 0.0, 0.05, 0.0, 0.0, 0.01, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0] ,
[0.22, 0.01, 0.01, 0.0, 0.19, 0.0, 0.0, 0.14, 0.17, 0.0, 0.0, 0.01, 0.01, 0.05, 0.07, 0.0, 0.0, 0.02, 0.04, 0.01, 0.01, 0.0, 0.01, 0.0, 0.01, 0.0] ,
[0.07, 0.02, 0.05, 0.0, 0.09, 0.0, 0.0, 0.0, 0.04, 0.0, 0.0, 0.02, 0.02, 0.0, 0.02, 0.36, 0.0, 0.04, 0.04, 0.18, 0.02, 0.0, 0.04, 0.0, 0.0, 0.0] ,
[0.08, 0.03, 0.04, 0.04, 0.07, 0.02, 0.01, 0.03, 0.08, 0.0, 0.0, 0.03, 0.02, 0.02, 0.14, 0.05, 0.0, 0.03, 0.13, 0.1, 0.01, 0.01, 0.04, 0.0, 0.0, 0.0] ,
[0.0, 0.0, 0.0, 0.0, 0.31, 0.0, 0.0, 0.0, 0.12, 0.0, 0.06, 0.06, 0.12, 0.0, 0.06, 0.0, 0.0, 0.06, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.06, 0.12]
]

function fatFinger(input_letter, fat_finger_chance) {
  // transform the input letter into one its keyboard neighbours
  // with probability fat finger chance
  input_letter = input_letter.toLowerCase();
  if (Math.random() < fat_finger_chance) {
      neighbours = keyboard_neighbours[input_letter];
      return neighbours[randInt(neighbours.length)];
  }
  return input_letter;
}

function randInt(n) {
  // return a random int in range(0, n)
  return Math.floor(Math.random()*(n-0.01));
}

function convertProbToColourIndex(prob) {
  return Math.min(Math.floor(prob*10), 9);

}

var Grid = function(cell_size, width, height, cnv, div){
  this.canvas = cnv;
  this.ctx = this.canvas.getContext("2d");
  this.div = div;

  this.cell_size = cell_size;
  this.width = width;
  this.height = height;

  this.cell_colours = [];

  this.min_x = (this.canvas.width - this.width*this.cell_size)/2;
  this.min_y = (this.canvas.height - this.height*this.cell_size)/2;
  this.max_x = this.min_x + this.width*this.cell_size;
  this.max_y = this.min_y + this.height*this.cell_size;
}

Grid.prototype.inGrid = function(x, y) {
  return x < this.width && x >= 0 && y < this.height && y >= 0;
}

Grid.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Grid.prototype.indexToPositionX = function(xIndex) {
  return this.min_x + xIndex*this.cell_size;
}

Grid.prototype.indexToPositionY = function(yIndex) {
  return this.min_y + yIndex*this.cell_size;
}

Grid.prototype.colourCell = function(leftX, topY, colour, overall=true) {
  if (this.inGrid(leftX, topY)){
    this.ctx.beginPath();
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(this.indexToPositionX(leftX), this.indexToPositionY(topY), this.cell_size, this.cell_size);
    this.ctx.closePath();
  }
}

Grid.prototype.colourGrid = function() {
  for (var coords_string in this.cell_colours) {
    coords_string = coords_string.split(',');
    var coords = [parseInt(coords_string[0], 10), parseInt(coords_string[1], 10)];
    this.colourCell(coords[0], coords[1], colour_map[this.cell_colours[coords]]);
  }
}


// ----------------------------------------------------------------------
// MAIN CODE

var hidden_states_div = document.getElementById("hiddenStatesDiv");
var hidden_states_canvas = document.getElementById("hiddenStatesCanvas");
var hidden_states = new Grid(20, 49, 26, hidden_states_canvas, hidden_states_canvas);

for (var i=0; i<50; i++) {
  for (var j=0; j<26; j++) {
    hidden_states.cell_colours[[i, j]] = convertProbToColourIndex(Math.random());
  }
}

hidden_states.colourGrid();
